import type { MetadataRoute } from "next";

import { PRODUCTION_SITE_URL } from "@/lib/site-config";
import { getPublishedBlogs } from "@/lib/supabase/blogs";
import { getPublishedProductCatalog } from "@/lib/supabase/products";

const siteUrl = PRODUCTION_SITE_URL;
const now = new Date();

type SitemapEntry = MetadataRoute.Sitemap[number];
type StaticSitemapRoute = {
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
};

const staticRoutes: StaticSitemapRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "weekly", priority: 0.95 },
  { path: "/cases", changeFrequency: "monthly", priority: 0.8 },
  { path: "/oem-odm", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/rfq", changeFrequency: "weekly", priority: 0.85 },
];

function buildSitemapUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

function hasValidSlug(slug: string | null | undefined) {
  return typeof slug === "string" && slug.trim().length > 0;
}

function resolveLastModified(value: string | undefined, fallback: Date) {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function createSitemapEntry({
  path,
  lastModified = now,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified?: Date;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
}): SitemapEntry {
  return {
    url: buildSitemapUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticRoutes.map((route) =>
    createSitemapEntry({
      path: route.path,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );
  const blogEntries = new Map<string, SitemapEntry>();
  const productEntries = new Map<string, SitemapEntry>();

  // Legacy case-detail pages remain noindex and off-direction, so they stay out of the XML sitemap.
  const caseDetailEntries: SitemapEntry[] = [];

  try {
    const publishedProducts = await getPublishedProductCatalog();

    for (const product of publishedProducts.products) {
      if (!hasValidSlug(product.slug)) {
        continue;
      }

      productEntries.set(product.slug, {
        ...createSitemapEntry({
          path: `/products/${product.slug}`,
          changeFrequency: "weekly",
          priority: 0.9,
        }),
      });
    }
  } catch {
    // Keep the sitemap limited to stable static routes when live product data is unavailable.
  }

  try {
    const publishedBlogs = await getPublishedBlogs();

    for (const post of publishedBlogs) {
      if (!hasValidSlug(post.slug)) {
        continue;
      }

      blogEntries.set(post.slug, {
        ...createSitemapEntry({
          path: `/blog/${post.slug}`,
          lastModified: resolveLastModified(post.updatedAt || post.publishedAt, now),
          changeFrequency: "monthly",
          priority: 0.7,
        }),
      });
    }
  } catch {
    // Keep the sitemap limited to stable static routes when live blog data is unavailable.
  }

  return [
    ...staticEntries,
    ...caseDetailEntries,
    ...Array.from(productEntries.values()),
    ...Array.from(blogEntries.values()),
  ].filter((entry) => entry.url.startsWith(siteUrl));
}
