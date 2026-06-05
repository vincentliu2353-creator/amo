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

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

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
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedArticles = blogPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);
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
        <section className="bg-white text-black">
          <SectionContainer className="py-20 md:py-28">
            <PageHeader
              eyebrow={mapEditorialCategory(post.category)}
              title={post.title}
              description={post.excerpt}
              align="center"
            >
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-black/48">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </PageHeader>

            <div className="mt-12 overflow-hidden rounded-[2rem] border border-black/10">
              <div className="aspect-[16/7] bg-[#ecebe6]">
                <div className="flex h-full items-end p-8">
                  <span className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black/54">
                    AMO Journal
                  </span>
                </div>
              </div>
            </div>

            <article className="mx-auto mt-16 max-w-[860px]">
              <div className="space-y-8 text-lg leading-relaxed text-black/74">
                {articleSections.map((section, index) => (
                  <section key={`${section.heading}-${index}`} className="space-y-5">
                    <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">{section.heading}</h2>
                    <p>{section.body}</p>
                    {index === 0 && post.sections.length === 0
                      ? fallbackBody.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                      : null}
                  </section>
                ))}
              </div>
            </article>

            <div className="mt-16 flex justify-center">
              <Link href="/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back To Journal
              </Link>
            </div>

            <div className="mt-24">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-black/42">Related Articles</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Continue reading</h2>
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
