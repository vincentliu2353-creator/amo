import { calculateBlogReadTimeFromSections, parseBlogBody } from "@/lib/blogs";
import { applyBlogArticleRefresh } from "@/lib/blog-article-refresh";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PublicBlogRecord } from "@/types";

const LEGACY_BLOG_IMAGE_FALLBACKS: Record<string, string> = {
  "how-to-spec-a-levitation-platform-for-oem-equipment":
    "/images/blog/heroes/oem-magnetic-levitation-products-from-concept-to-production.webp",
  "why-contactless-motion-matters-in-clean-manufacturing":
    "/images/blog/heroes/how-to-choose-a-magnetic-levitation-manufacturer.webp",
};

const DEFAULT_BLOG_IMAGE_FALLBACK =
  "/images/blog/heroes/the-future-of-floating-objects-why-magnetic-levitation-is-changing-product-presentation.webp";

function isPlaceholderBlogImageUrl(url: string | null | undefined) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  const normalizedUrl = url.trim().toLowerCase();

  return normalizedUrl.includes("amo.example.com") || /https?:\/\/[^/]*example\.com\//.test(normalizedUrl);
}

function resolveBlogCoverImage(slug: string, url: unknown) {
  if (typeof url !== "string") {
    return "";
  }

  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    return "";
  }

  if (!isPlaceholderBlogImageUrl(normalizedUrl)) {
    return normalizedUrl;
  }

  return LEGACY_BLOG_IMAGE_FALLBACKS[slug] ?? DEFAULT_BLOG_IMAGE_FALLBACK;
}

function mapBlogRow(row: Record<string, unknown>): PublicBlogRecord {
  const sections = parseBlogBody(row.body);
  const publishedAt =
    typeof row.published_at === "string"
      ? row.published_at
      : typeof row.created_at === "string"
        ? row.created_at
        : new Date().toISOString();

  return applyBlogArticleRefresh({
    id: typeof row.id === "string" ? row.id : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "AMO Journal",
    category: typeof row.category_label === "string" ? row.category_label : "Technology",
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    publishedAt,
    author: "AMO Editorial",
    readTime: calculateBlogReadTimeFromSections(sections),
    sections,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : "",
    coverImage: resolveBlogCoverImage(
      typeof row.slug === "string" ? row.slug : "",
      row.og_image_url,
    ),
    seoTitle: typeof row.seo_title === "string" ? row.seo_title : "",
    seoDescription: typeof row.seo_description === "string" ? row.seo_description : "",
  });
}

function getSupabase() {
  try {
    return createServerSupabaseClient();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Supabase is not configured for blog fetching.",
    );
  }
}

export async function getPublishedBlogs() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, slug, title, excerpt, body, category_label, seo_title, seo_description, og_image_url, published_at, created_at, updated_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load published blogs: ${error.message}`);
  }

  return (data ?? []).map((row) => mapBlogRow(row as Record<string, unknown>));
}

export async function getPublishedBlogBySlug(slug: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, slug, title, excerpt, body, category_label, seo_title, seo_description, og_image_url, published_at, created_at, updated_at",
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load blog detail: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapBlogRow(data as Record<string, unknown>);
}
