"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";

interface BlogIndexArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
}

const filters = ["All", "Design", "Technology", "OEM", "Retail", "Applications"] as const;

function formatMeta(publishedAt: string, readTime: string) {
  try {
    const date = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(publishedAt));

    return `${date} · ${readTime}`;
  } catch {
    return readTime;
  }
}

export function BlogIndex({ articles }: { articles: BlogIndexArticle[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const visibleArticles = useMemo(() => {
    if (activeFilter === "All") {
      return articles;
    }

    return articles.filter((article) => article.category === activeFilter);
  }, [activeFilter, articles]);

  const featuredArticle = visibleArticles[0];
  const gridArticles = featuredArticle ? visibleArticles.slice(1) : visibleArticles;

  return (
    <section className="bg-white text-black">
      <SectionContainer className="py-20 md:py-28">
        <div className="min-h-[420px] md:min-h-[480px]">
          <PageHeader
            eyebrow="AMO Journal"
            title={"Insights on magnetic levitation,\nindustrial design,\nengineering,\nand future spaces."}
            description="A clean editorial index for product thinking, technical decisions, OEM collaboration, and commercial applications."
            className="whitespace-pre-line"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-y border-black/10 py-5">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${
                activeFilter === filter
                  ? "border-black bg-black text-white"
                  : "border-black/10 text-black/54 hover:border-black/18 hover:text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {featuredArticle ? (
            <div className="space-y-8">
              <ArticleCard
                href={`/blog/${featuredArticle.slug}`}
                category={featuredArticle.category}
                title={featuredArticle.title}
                excerpt={featuredArticle.excerpt}
                meta={formatMeta(featuredArticle.publishedAt, featuredArticle.readTime)}
                imageLabel="Featured"
                featured
              />

              {gridArticles.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {gridArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      category={article.category}
                      title={article.title}
                      excerpt={article.excerpt}
                      meta={formatMeta(article.publishedAt, article.readTime)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              eyebrow="Journal"
              title="No articles published yet."
              description="The AMO Journal is being prepared. Check back for product launches, engineering notes, and application insights."
            />
          )}

          {featuredArticle && gridArticles.length === 0 && activeFilter !== "All" ? (
            <p className="mt-6 text-sm text-black/48">Only one article is currently available in this category.</p>
          ) : null}

          {!featuredArticle && articles.length > 0 ? (
            <div className="mt-8">
              <EmptyState
                title={`No ${activeFilter} articles yet`}
                description="Switch filters or return to All to browse the current AMO Journal archive."
                action={
                  <button type="button" onClick={() => setActiveFilter("All")} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    View All Articles
                  </button>
                }
              />
            </div>
          ) : null}
        </div>

        <div className="mt-20 rounded-[2.25rem] border border-black/10 bg-[#f4f3ee] px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/42">Stay Updated</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                New articles, product launches,
                <br />
                and industry insights from AMO.
              </h2>
            </div>

            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="min-h-14 flex-1 rounded-full border border-black/12 bg-white px-5 text-base text-black outline-none transition placeholder:text-black/38 focus:border-black/28"
              />
              <button type="button" className={buttonStyles({ size: "lg" })}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
