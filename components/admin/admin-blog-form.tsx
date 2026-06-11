"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminBlogRecord, ContentStatus } from "@/types";

const adminTextareaClassName =
  "w-full rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

type FieldErrors = Record<string, string>;

interface SubmitResponse {
  blog?: AdminBlogRecord;
  fieldErrors?: FieldErrors;
  message?: string;
}

interface AdminBlogFormProps {
  mode: "create" | "edit";
  blog: AdminBlogRecord | null;
  notice?: {
    message: string;
    tone: "success" | "error";
  } | null;
}

interface BlogFormState {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: ContentStatus;
  seoTitle: string;
  seoDescription: string;
  coverImageFile: File | null;
}

function buildFormState(blog: AdminBlogRecord | null): BlogFormState {
  if (!blog) {
    return {
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      content: "",
      coverImage: "",
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      coverImageFile: null,
    };
  }

  return {
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage,
    status: blog.status,
    seoTitle: blog.seoTitle,
    seoDescription: blog.seoDescription,
    coverImageFile: null,
  };
}

function slugifyValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function NoticeBanner({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "success" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
        tone === "success"
          ? "border-white/16 bg-white/[0.08] text-white"
          : "border-red-400/24 bg-red-500/10 text-red-200",
      )}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs uppercase tracking-[0.24em] text-slate-400">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs leading-6 text-red-200">{message}</p>;
}

export function AdminBlogForm({ mode, blog, notice }: AdminBlogFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState(buildFormState(blog));
  const [slugAutoMode, setSlugAutoMode] = useState(mode === "create");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestTone, setRequestTone] = useState<"success" | "error">("success");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function updateField<K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) {
    setFormState((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "title" && slugAutoMode) {
        next.slug = slugifyValue(String(value));
      }

      return next;
    });

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestMessage(null);
    setFieldErrors({});

    try {
      const body = new FormData();
      body.set("title", formState.title);
      body.set("slug", formState.slug);
      body.set("category", formState.category);
      body.set("excerpt", formState.excerpt);
      body.set("content", formState.content);
      body.set("coverImage", formState.coverImage);
      body.set("status", formState.status);
      body.set("seoTitle", formState.seoTitle);
      body.set("seoDescription", formState.seoDescription);

      if (formState.coverImageFile) {
        body.set("coverImageFile", formState.coverImageFile);
      }

      const endpoint = mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${blog?.id ?? ""}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        body,
      });
      const result = (await response.json()) as SubmitResponse;

      if (!response.ok || !result.blog) {
        setFieldErrors(result.fieldErrors ?? {});
        throw new Error(result.message ?? "Unable to save the blog post.");
      }

      router.push(
        mode === "create"
          ? `/admin/blog/${result.blog.id}/edit?created=1`
          : `/admin/blog/${result.blog.id}/edit?updated=1`,
      );
      router.refresh();
    } catch (error) {
      setRequestTone("error");
      setRequestMessage(error instanceof Error ? error.message : "Unable to save the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!blog || isDeleting) {
      return;
    }

    const confirmed = window.confirm(`Delete "${blog.title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setRequestMessage(null);

    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to delete the blog post.");
      }

      router.push("/admin/blog?deleted=1");
      router.refresh();
    } catch (error) {
      setRequestTone("error");
      setRequestMessage(error instanceof Error ? error.message : "Unable to delete the blog post.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner tone={notice.tone}>{notice.message}</NoticeBanner> : null}
      {requestMessage ? <NoticeBanner tone={requestTone}>{requestMessage}</NoticeBanner> : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Editorial</p>
            <h2 className="font-display text-[1.9rem] font-semibold leading-[1.08] text-white">
              Blog Post
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/62">
              Use Markdown-style `## Heading` blocks in the content area to create structured article sections for the public `/blog/[slug]` page.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="blog-title">Title</FieldLabel>
              <Input
                id="blog-title"
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="mt-3"
              />
              <FieldError message={fieldErrors.title} />
            </div>

            <div>
              <FieldLabel htmlFor="blog-slug">Slug</FieldLabel>
              <Input
                id="blog-slug"
                value={formState.slug}
                onChange={(event) => {
                  setSlugAutoMode(false);
                  updateField("slug", slugifyValue(event.target.value));
                }}
                className="mt-3"
              />
              <FieldError message={fieldErrors.slug} />
            </div>

            <div>
              <FieldLabel htmlFor="blog-category">Category</FieldLabel>
              <Input
                id="blog-category"
                value={formState.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="mt-3"
              />
              <FieldError message={fieldErrors.category} />
            </div>

            <div>
              <FieldLabel htmlFor="blog-status">Status</FieldLabel>
              <Select
                id="blog-status"
                value={formState.status}
                onChange={(event) => updateField("status", event.target.value as ContentStatus)}
                className="mt-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              <FieldError message={fieldErrors.status} />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="blog-excerpt">Excerpt</FieldLabel>
              <textarea
                id="blog-excerpt"
                value={formState.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                className={`${adminTextareaClassName} mt-3 min-h-[120px]`}
              />
              <FieldError message={fieldErrors.excerpt} />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="blog-content">Content</FieldLabel>
              <textarea
                id="blog-content"
                value={formState.content}
                onChange={(event) => updateField("content", event.target.value)}
                className={`${adminTextareaClassName} mt-3 min-h-[360px]`}
                placeholder={"## Heading\nParagraph text.\n\n## Second Heading\nMore content."}
              />
              <FieldError message={fieldErrors.content} />
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Media + SEO</p>
            <h2 className="font-display text-[1.9rem] font-semibold leading-[1.08] text-white">
              Cover Image
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="blog-cover-image">Cover Image URL</FieldLabel>
              <Input
                id="blog-cover-image"
                value={formState.coverImage}
                onChange={(event) => updateField("coverImage", event.target.value)}
                className="mt-3"
                placeholder="https://..."
              />
              <FieldError message={fieldErrors.coverImage} />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="blog-cover-image-file">Upload Cover Image</FieldLabel>
              <input
                id="blog-cover-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="mt-3 block w-full text-sm text-white/72 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    coverImageFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
              <FieldError message={fieldErrors.coverImageFile} />
            </div>

            <div>
              <FieldLabel htmlFor="blog-seo-title">SEO Title</FieldLabel>
              <Input
                id="blog-seo-title"
                value={formState.seoTitle}
                onChange={(event) => updateField("seoTitle", event.target.value)}
                className="mt-3"
              />
              <FieldError message={fieldErrors.seoTitle} />
            </div>

            <div>
              <FieldLabel htmlFor="blog-seo-description">SEO Description</FieldLabel>
              <textarea
                id="blog-seo-description"
                value={formState.seoDescription}
                onChange={(event) => updateField("seoDescription", event.target.value)}
                className={`${adminTextareaClassName} mt-3 min-h-[120px]`}
              />
              <FieldError message={fieldErrors.seoDescription} />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonStyles({ size: "sm" })}
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Blog Post" : "Save Changes"}
          </button>

          <Link href="/admin/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Back to Blog
          </Link>

          {mode === "edit" && blog ? (
            <>
              {blog.status === "published" ? (
                <Link href={`/blog/${blog.slug}`} className={buttonStyles({ variant: "ghost", size: "sm" })}>
                  View Published Page
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className={buttonStyles({ variant: "secondary", size: "sm", className: "border-red-400/24 text-red-200 hover:border-red-300/32 hover:text-red-100" })}
              >
                {isDeleting ? "Deleting..." : "Delete Post"}
              </button>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
}
