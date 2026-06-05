import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { caseStudies } from "@/data/cases";
import { products } from "@/data/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/products",
    "/cases",
    "/oem-odm",
    "/about",
    "/blog",
    "/contact",
    "/rfq",
    "/favorites",
    "/admin/products",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(),
    })),
    ...caseStudies.map((entry) => ({
      url: absoluteUrl(`/cases/${entry.slug}`),
      lastModified: new Date(),
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
    })),
  ];
}
