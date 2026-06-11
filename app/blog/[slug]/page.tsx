import Link from "next/link";
import { notFound } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/supabase/blogs";
import type { PublicBlogRecord } from "@/types";

function mapEditorialCategory(category: string) {
  if (["Design", "Technology", "OEM", "Retail", "Applications"].includes(category)) {
    return category;
  }

  if (category.toLowerCase().includes("oem")) {
    return "OEM";
  }

  if (category.toLowerCase().includes("industry") || category.toLowerCase().includes("manufacturing")) {
    return "Applications";
  }

  return "Technology";
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const fallbackBody = [
  "Magnetic levitation changes the relationship between objects and space. Instead of simply sitting on a surface, a product becomes part of the environment.",
  "For retail, hospitality, gifting, and brand installations, this shift creates attention without visual noise.",
];

export const dynamic = "force-dynamic";

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

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post = null as PublicBlogRecord | null;

  try {
    post = await getPublishedBlogBySlug(slug);
  } catch {
    const fallback = getBlogPostBySlug(slug);
    post = fallback
      ? {
          id: `fallback-${fallback.slug}`,
          slug: fallback.slug,
          title: fallback.title,
          category: fallback.category,
          excerpt: fallback.excerpt,
          publishedAt: fallback.publishedAt,
          author: fallback.author,
          readTime: fallback.readTime,
          sections: fallback.sections,
          coverImage: "",
          seoTitle: fallback.title,
          seoDescription: fallback.excerpt,
        }
      : null;
  }

  if (!post) {
    return buildMetadata({
      title: "Blog",
      description: "AMO Journal article.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [post.category, "magnetic levitation", "AMO Journal"],
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post: PublicBlogRecord | null = null;
  let relatedArticles: PublicBlogRecord[] = [];

  try {
    post = await getPublishedBlogBySlug(slug);
  } catch {
    const fallbackPost = getBlogPostBySlug(slug);

    post = fallbackPost
      ? {
          id: `fallback-${fallbackPost.slug}`,
          slug: fallbackPost.slug,
          title: fallbackPost.title,
          category: fallbackPost.category,
          excerpt: fallbackPost.excerpt,
          publishedAt: fallbackPost.publishedAt,
          author: fallbackPost.author,
          readTime: fallbackPost.readTime,
          sections: fallbackPost.sections,
          coverImage: "",
          seoTitle: fallbackPost.title,
          seoDescription: fallbackPost.excerpt,
        }
      : null;
  }

  if (post) {
    try {
      const publishedBlogs = await getPublishedBlogs();
      relatedArticles = publishedBlogs.filter((entry) => entry.slug !== slug).slice(0, 3);
    } catch {
      relatedArticles = fallbackBlogs().filter((entry) => entry.slug !== slug).slice(0, 3);
    }
  }

  if (!post) {
    notFound();
  }

  const articleSections = post.sections.length > 0 ? post.sections : [{ heading: "Article", body: fallbackBody.join(" ") }];

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <InnerPageShell showHeader>
        <section className="bg-black text-white">
          <SectionContainer className="py-20 md:py-28">
            <div className="grid gap-10 border-b border-white/12 pb-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <PageHeader
                eyebrow={mapEditorialCategory(post.category)}
                title={post.title}
                description={post.excerpt}
                tone="dark"
              />

              <div className="space-y-4 border-t border-white/12 pt-6 text-sm lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Published</p>
                  <p className="mt-3 text-white/72">{formatDate(post.publishedAt)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Read Time</p>
                  <p className="mt-3 text-white/72">{post.readTime}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Author</p>
                  <p className="mt-3 text-white/72">{post.author}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/12">
              <div className="aspect-[16/7] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),linear-gradient(140deg,#161616,#090909_72%)]">
                <div className="flex h-full items-end justify-between gap-4 p-8">
                  <span className="rounded-full border border-white/14 bg-black/34 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/56">
                    AMO Journal
                  </span>
                  <span className="rounded-full border border-white/14 bg-black/34 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/40">
                    Editorial Archive
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <article className="max-w-[860px]">
                <div className="space-y-8 text-lg leading-relaxed text-white/74">
                  {articleSections.map((section, index) => (
                    <section key={`${section.heading}-${index}`} className="space-y-5 border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
                      {section.heading ? (
                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{section.heading}</h2>
                      ) : null}
                      <p>{section.body}</p>
                      {index === 0 && post.sections.length === 0
                        ? fallbackBody.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                        : null}
                    </section>
                  ))}
                </div>
              </article>

              <aside className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Article Focus</p>
                  <p className="mt-4 text-base leading-relaxed text-white/68">
                    Product positioning, OEM evaluation, and applied levitation use cases for commercial and industrial teams.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Next Step</p>
                  <p className="mt-4 text-base leading-relaxed text-white/68">
                    Move from reading to specification with a quote request or direct product shortlist.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/request-quote" className={buttonStyles({ size: "sm" })}>
                      Request Quote
                    </Link>
                    <Link href="/favorites" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      View Favorites
                    </Link>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back To Journal
              </Link>
            </div>

            <div className="mt-24">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Related Articles</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Continue reading</h2>
                </div>
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {(relatedArticles.length > 0
                  ? relatedArticles
                  : [
                      {
                        slug: post.slug,
                        title: "Future Objects: Why Floating Products Capture Attention",
                        category: "Design",
                        excerpt: "Magnetic levitation turns ordinary products into moments of attention.",
                        publishedAt: "2026-01-10",
                        readTime: "4 min read",
                      },
                      {
                        slug: post.slug,
                        title: "How Levitation Displays Change Retail Spaces",
                        category: "Retail",
                        excerpt: "Floating objects create visual focus in premium commercial environments.",
                        publishedAt: "2026-01-18",
                        readTime: "5 min read",
                      },
                      {
                        slug: post.slug,
                        title: "Engineering Stability In Floating Objects",
                        category: "Technology",
                        excerpt: "A look at balance, rotation, silence, and long-term reliability.",
                        publishedAt: "2026-02-02",
                        readTime: "5 min read",
                      },
                    ]
                ).map((article, index) => (
                  <ArticleCard
                    key={`${article.slug}-${index}`}
                    href={`/blog/${article.slug}`}
                    category={mapEditorialCategory(article.category)}
                    title={article.title}
                    excerpt={article.excerpt}
                    meta={`${formatDate(article.publishedAt)} · ${article.readTime}`}
                    tone="dark"
                  />
                ))}
              </div>
            </div>
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    </>
  );
}
