import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { BlogIndex } from "@/components/blog/blog-index";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPosts } from "@/data/blog";
import { BLOG_SEO_KEYWORDS, buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getPublishedBlogs } from "@/lib/supabase/blogs";
import type { PublicBlogRecord } from "@/types";

export const metadata = buildMetadata({
  title: "Magnetic Levitation Blog & OEM Insights | AMO",
  description:
    "Read AMO articles on magnetic levitation manufacturing, OEM development, floating display systems, and custom levitation product design.",
  path: "/blog",
  keywords: BLOG_SEO_KEYWORDS,
});

export const dynamic = "force-dynamic";

const placeholderArticles = [
  {
    slug: "future-objects-why-floating-products-capture-attention",
    title: "Future Objects: Why Floating Products Capture Attention",
    category: "Design",
    excerpt: "Magnetic levitation turns ordinary products into moments of attention.",
    publishedAt: "2026-01-10",
    readTime: "4 min read",
    coverImage: "",
  },
  {
    slug: "how-levitation-displays-change-retail-spaces",
    title: "How Levitation Displays Change Retail Spaces",
    category: "Retail",
    excerpt: "Floating objects create visual focus in premium commercial environments.",
    publishedAt: "2026-01-18",
    readTime: "5 min read",
    coverImage: "",
  },
  {
    slug: "oem-magnetic-levitation-from-concept-to-product",
    title: "OEM Magnetic Levitation: From Concept To Product",
    category: "OEM",
    excerpt: "How brands can develop customized floating products with AMO.",
    publishedAt: "2026-01-26",
    readTime: "6 min read",
    coverImage: "",
  },
  {
    slug: "engineering-stability-in-floating-objects",
    title: "Engineering Stability In Floating Objects",
    category: "Technology",
    excerpt: "A look at balance, rotation, silence, and long-term reliability.",
    publishedAt: "2026-02-02",
    readTime: "5 min read",
    coverImage: "",
  },
];

function fallbackBlogs(): PublicBlogRecord[] {
  return blogPosts.map((post, index) => ({
    id: `fallback-${index}`,
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    author: post.author,
    readTime: post.readTime,
    sections: post.sections,
    coverImage: "",
    seoTitle: post.title,
    seoDescription: post.excerpt,
  }));
}

export default async function BlogPage() {
  let blogs: PublicBlogRecord[] = [];

  try {
    blogs = await getPublishedBlogs();
  } catch {
    blogs = fallbackBlogs();
  }

  const articles =
    blogs.length > 0
      ? blogs.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          coverImage: post.coverImage,
        }))
      : placeholderArticles;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <InnerPageShell showHeader>
        <BlogIndex articles={articles} />
        <ApprovedHomeFooter />
      </InnerPageShell>
    </>
  );
}
