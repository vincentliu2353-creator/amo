import { calculateBlogReadTimeFromSections, parseBlogBody } from "@/lib/blogs";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PublicBlogRecord } from "@/types";

function mapBlogRow(row: Record<string, unknown>): PublicBlogRecord {
  const sections = parseBlogBody(row.body);
  const publishedAt =
    typeof row.published_at === "string"
      ? row.published_at
      : typeof row.created_at === "string"
        ? row.created_at
        : new Date().toISOString();

  return {
    id: typeof row.id === "string" ? row.id : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "AMO Journal",
    category: typeof row.category_label === "string" ? row.category_label : "Technology",
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    publishedAt,
    author: "AMO Editorial",
    readTime: calculateBlogReadTimeFromSections(sections),
    sections,
    coverImage: typeof row.og_image_url === "string" ? row.og_image_url : "",
    seoTitle: typeof row.seo_title === "string" ? row.seo_title : "",
    seoDescription: typeof row.seo_description === "string" ? row.seo_description : "",
  };
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
      "id, slug, title, excerpt, body, category_label, seo_title, seo_description, og_image_url, published_at, created_at",
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
      "id, slug, title, excerpt, body, category_label, seo_title, seo_description, og_image_url, published_at, created_at",
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
