import "server-only";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { parseBlogContentInput, serializeBlogBody } from "@/lib/blogs";
import { absoluteUrl } from "@/lib/seo";
import type { AdminBlogRecord, ContentStatus } from "@/types";

const BLOG_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET ?? "blog-media";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ADMIN_BLOG_SELECT = `
  id,
  slug,
  title,
  excerpt,
  body,
  category_label,
  status,
  seo_title,
  seo_description,
  og_image_url,
  published_at,
  created_at,
  updated_at
`;

type FieldErrors = Record<string, string>;

interface AdminBlogMutationResult {
  message: string;
  blog: AdminBlogRecord;
}

interface ParsedAdminBlogPayload {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageFile: File | null;
  status: ContentStatus;
  seoTitle: string;
  seoDescription: string;
}

export class AdminBlogMutationError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status = 400, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "AdminBlogMutationError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: string): ContentStatus | null {
  if (value === "draft" || value === "published") {
    return value;
  }

  return null;
}

function slugifyValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sanitizeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return cleaned || "cover-image";
}

function mapConstraintError(error: unknown) {
  const record = error as Record<string, unknown> | null;
  const message = typeof record?.message === "string" ? record.message : "";
  const code = typeof record?.code === "string" ? record.code : "";

  if (code !== "23505") {
    return null;
  }

  if (message.includes("blogs_slug_key")) {
    return new AdminBlogMutationError("This slug already exists.", 409, {
      slug: "This slug already exists.",
    });
  }

  return new AdminBlogMutationError("This blog post conflicts with an existing record.", 409);
}

function mapAdminBlogRow(row: Record<string, unknown>): AdminBlogRecord {
  return {
    id: typeof row.id === "string" ? row.id : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "",
    category: typeof row.category_label === "string" ? row.category_label : "",
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    content: serializeBlogBody(row.body),
    coverImage: typeof row.og_image_url === "string" ? row.og_image_url : "",
    status: row.status === "published" ? "published" : "draft",
    seoTitle: typeof row.seo_title === "string" ? row.seo_title : "",
    seoDescription: typeof row.seo_description === "string" ? row.seo_description : "",
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : "",
  };
}

async function ensureUniqueSlug(
  supabase: SupabaseClient,
  requestedSlug: string,
  currentBlogId?: string,
) {
  const slug = slugifyValue(requestedSlug);
  const { data, error } = await supabase
    .from("blogs")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new AdminBlogMutationError(`Unable to validate slug uniqueness: ${error.message}`, 503);
  }

  if (data && data.id !== currentBlogId) {
    throw new AdminBlogMutationError("This slug already exists.", 409, {
      slug: "This slug already exists.",
    });
  }

  return slug;
}

function parseAdminBlogFormData(formData: FormData): ParsedAdminBlogPayload {
  const fieldErrors: FieldErrors = {};
  const title = normalizeString(formData.get("title"));
  const slug = slugifyValue(normalizeString(formData.get("slug")) || title);
  const category = normalizeString(formData.get("category"));
  const excerpt = normalizeString(formData.get("excerpt"));
  const content = normalizeString(formData.get("content"));
  const coverImageUrl = normalizeString(formData.get("coverImage"));
  const status = normalizeStatus(normalizeString(formData.get("status"))) ?? "draft";
  const seoTitle = normalizeString(formData.get("seoTitle"));
  const seoDescription = normalizeString(formData.get("seoDescription"));
  const coverImageCandidate = formData.get("coverImageFile");
  const coverImageFile =
    coverImageCandidate instanceof File && coverImageCandidate.size > 0
      ? coverImageCandidate
      : null;

  if (!title) fieldErrors.title = "Title is required.";
  if (!slug) fieldErrors.slug = "Slug is required.";
  if (!category) fieldErrors.category = "Category is required.";
  if (!excerpt) fieldErrors.excerpt = "Excerpt is required.";
  if (!content) fieldErrors.content = "Content is required.";
  if (!seoTitle) fieldErrors.seoTitle = "SEO title is required.";
  if (!seoDescription) fieldErrors.seoDescription = "SEO description is required.";

  if (coverImageFile && !ALLOWED_IMAGE_TYPES.has(coverImageFile.type)) {
    fieldErrors.coverImageFile = "Upload JPEG, PNG, or WebP images only.";
  }

  if (parseBlogContentInput(content).length === 0) {
    fieldErrors.content = "Add at least one paragraph of blog content.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminBlogMutationError("Fix the highlighted fields before saving.", 400, fieldErrors);
  }

  return {
    title,
    slug,
    category,
    excerpt,
    content,
    coverImageUrl,
    coverImageFile,
    status,
    seoTitle,
    seoDescription,
  };
}

async function ensureBlogStorageBucket(supabase: SupabaseClient) {
  const { data, error } = await supabase.storage.getBucket(BLOG_STORAGE_BUCKET);

  if (error) {
    const isMissingBucket =
      error.message.toLowerCase().includes("not found") ||
      error.message.toLowerCase().includes("does not exist");

    if (!isMissingBucket) {
      throw new AdminBlogMutationError(`Unable to access blog media bucket: ${error.message}`, 503);
    }

    const { error: createError } = await supabase.storage.createBucket(BLOG_STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
    });

    if (createError) {
      throw new AdminBlogMutationError(`Unable to create blog media bucket: ${createError.message}`, 503);
    }

    return;
  }

  if (data?.public) {
    return;
  }

  const { error: updateError } = await supabase.storage.updateBucket(BLOG_STORAGE_BUCKET, {
    public: true,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
  });

  if (updateError) {
    throw new AdminBlogMutationError(`Unable to update blog media bucket: ${updateError.message}`, 503);
  }
}

async function uploadBlogCoverImage(
  supabase: SupabaseClient,
  slug: string,
  file: File,
) {
  await ensureBlogStorageBucket(supabase);

  const storagePath = `blogs/${slug}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .upload(storagePath, fileBytes, {
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    throw new AdminBlogMutationError(`Unable to upload the cover image: ${uploadError.message}`, 503);
  }

  return supabase.storage.from(BLOG_STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

async function getAdminBlogById(supabase: SupabaseClient, blogId: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select(ADMIN_BLOG_SELECT)
    .eq("id", blogId)
    .maybeSingle();

  if (error) {
    throw new AdminBlogMutationError(`Unable to load the saved blog post: ${error.message}`, 503);
  }

  if (!data) {
    return null;
  }

  return mapAdminBlogRow(data as Record<string, unknown>);
}

async function resolveAuthorUserId(
  supabase: SupabaseClient,
  authUserId: string | undefined,
  mode: "env" | "supabase",
) {
  if (!authUserId || mode !== "supabase") {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw new AdminBlogMutationError(`Unable to resolve the admin author profile: ${error.message}`, 503);
  }

  return data?.id ?? null;
}

function revalidateAdminBlogPaths(options: { slug?: string; previousSlug?: string }) {
  const paths = new Set<string>([
    "/admin",
    "/admin/blog",
    "/admin/blog/new",
    "/blog",
  ]);

  if (options.slug) {
    paths.add(`/blog/${options.slug}`);
  }

  if (options.previousSlug) {
    paths.add(`/blog/${options.previousSlug}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function getAdminBlogDashboardData() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(ADMIN_BLOG_SELECT)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load admin blog data: ${error.message}`);
  }

  return (data ?? []).map((row) => mapAdminBlogRow(row as Record<string, unknown>));
}

export async function getAdminBlogEditorData(blogId?: string) {
  const supabase = createAdminSupabaseClient();

  if (!blogId) {
    return null;
  }

  return getAdminBlogById(supabase, blogId);
}

export async function createAdminBlog(
  formData: FormData,
  session: { authUserId?: string; mode: "env" | "supabase" },
): Promise<AdminBlogMutationResult> {
  const supabase = createAdminSupabaseClient();
  const parsed = parseAdminBlogFormData(formData);
  const slug = await ensureUniqueSlug(supabase, parsed.slug);
  const publishedAt = parsed.status === "published" ? new Date().toISOString() : null;
  const authorUserId = await resolveAuthorUserId(supabase, session.authUserId, session.mode);
  const coverImage =
    parsed.coverImageFile
      ? await uploadBlogCoverImage(supabase, slug, parsed.coverImageFile)
      : parsed.coverImageUrl || null;

  try {
    const { data: createdRow, error: createError } = await supabase
      .from("blogs")
      .insert({
        author_user_id: authorUserId,
        slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        body: parseBlogContentInput(parsed.content),
        category_label: parsed.category,
        tags: [],
        status: parsed.status,
        featured: false,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        seo_keywords: [],
        canonical_url: absoluteUrl(`/blog/${slug}`),
        og_image_url: coverImage,
        published_at: publishedAt,
      })
      .select("id")
      .single();

    if (createError || !createdRow) {
      throw mapConstraintError(createError) ?? createError ?? new Error("Blog creation failed.");
    }

    const blog = await getAdminBlogById(supabase, createdRow.id);

    if (!blog) {
      throw new AdminBlogMutationError("The created blog post could not be reloaded.", 503);
    }

    revalidateAdminBlogPaths({ slug: blog.slug });

    return {
      message: "Blog post created successfully.",
      blog,
    };
  } catch (error) {
    throw mapConstraintError(error) ?? error;
  }
}

export async function updateAdminBlog(
  blogId: string,
  formData: FormData,
  session: { authUserId?: string; mode: "env" | "supabase" },
): Promise<AdminBlogMutationResult> {
  const supabase = createAdminSupabaseClient();
  const existingBlog = await getAdminBlogById(supabase, blogId);

  if (!existingBlog) {
    throw new AdminBlogMutationError("This blog post does not exist.", 404);
  }

  const parsed = parseAdminBlogFormData(formData);
  const slug = await ensureUniqueSlug(supabase, parsed.slug, blogId);
  const authorUserId =
    (await resolveAuthorUserId(supabase, session.authUserId, session.mode)) ?? null;
  const coverImage =
    parsed.coverImageFile
      ? await uploadBlogCoverImage(supabase, slug, parsed.coverImageFile)
      : parsed.coverImageUrl || existingBlog.coverImage || null;
  const publishedAt =
    parsed.status === "published"
      ? existingBlog.publishedAt ?? new Date().toISOString()
      : null;

  try {
    const { error: updateError } = await supabase
      .from("blogs")
      .update({
        author_user_id: authorUserId,
        slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        body: parseBlogContentInput(parsed.content),
        category_label: parsed.category,
        status: parsed.status,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        canonical_url: absoluteUrl(`/blog/${slug}`),
        og_image_url: coverImage,
        published_at: publishedAt,
      })
      .eq("id", blogId);

    if (updateError) {
      throw mapConstraintError(updateError) ?? updateError;
    }

    const blog = await getAdminBlogById(supabase, blogId);

    if (!blog) {
      throw new AdminBlogMutationError("The updated blog post could not be reloaded.", 503);
    }

    revalidateAdminBlogPaths({
      slug: blog.slug,
      previousSlug: existingBlog.slug,
    });

    return {
      message: "Blog post updated successfully.",
      blog,
    };
  } catch (error) {
    throw mapConstraintError(error) ?? error;
  }
}

export async function deleteAdminBlog(blogId: string) {
  const supabase = createAdminSupabaseClient();
  const existingBlog = await getAdminBlogById(supabase, blogId);

  if (!existingBlog) {
    throw new AdminBlogMutationError("This blog post does not exist.", 404);
  }

  const { error } = await supabase.from("blogs").delete().eq("id", blogId);

  if (error) {
    throw new AdminBlogMutationError(`Unable to delete the blog post: ${error.message}`, 503);
  }

  revalidateAdminBlogPaths({ previousSlug: existingBlog.slug });

  return {
    message: "Blog post deleted successfully.",
  };
}
