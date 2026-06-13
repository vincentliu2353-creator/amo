import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { caseStudies } from "@/data/cases";
import { products } from "@/data/products";
import { getPublishedBlogs } from "@/lib/supabase/blogs";
import { getPublishedProductCatalog } from "@/lib/supabase/products";

const siteUrl = "https://amolevitation.com";

function buildSitemapUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/products", changeFrequency: "weekly" as const, priority: 0.95 },
    { path: "/cases", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/oem-odm", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/rfq", changeFrequency: "weekly" as const, priority: 0.85 },
  ];
  const blogEntries = new Map(
    blogPosts.map((post) => [
      post.slug,
      {
        url: buildSitemapUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]),
  );

  const productEntries = new Map(
    products.map((product) => [
      product.slug,
      {
        url: buildSitemapUrl(`/products/${product.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
    ]),
  );

  try {
    const publishedProducts = await getPublishedProductCatalog();

    for (const product of publishedProducts.products) {
      productEntries.set(product.slug, {
        url: buildSitemapUrl(`/products/${product.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch {
    // Keep fallback product URLs when the database is unavailable.
  }

  try {
    const publishedBlogs = await getPublishedBlogs();

    for (const post of publishedBlogs) {
      blogEntries.set(post.slug, {
        url: buildSitemapUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Keep fallback article URLs when the database is unavailable.
  }

  return [
    ...staticRoutes.map((route) => ({
      url: buildSitemapUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...Array.from(productEntries.values()),
    ...caseStudies.map((entry) => ({
      url: buildSitemapUrl(`/cases/${entry.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...Array.from(blogEntries.values()),
  ];
}
