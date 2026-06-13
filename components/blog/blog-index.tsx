"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  coverImage?: string;
}

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
  const filters = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles],
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("Receive new journal entries, product launches, and industrial updates.");

  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [activeFilter, filters]);

  const visibleArticles = useMemo(() => {
    if (activeFilter === "All") {
      return articles;
    }

    return articles.filter((article) => article.category === activeFilter);
  }, [activeFilter, articles]);

  const featuredArticle = visibleArticles[0];
  const gridArticles = featuredArticle ? visibleArticles.slice(1) : visibleArticles;

  async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = newsletterEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setNewsletterState("error");
      setNewsletterMessage("Enter a valid email address.");
      return;
    }

    setNewsletterState("loading");
    setNewsletterMessage("Submitting...");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: "blog",
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to subscribe right now.");
      }

      setNewsletterState("success");
      setNewsletterMessage(result.message ?? "Subscribed. We'll send the next AMO journal update to your inbox.");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  }

  return (
    <section className="bg-black text-white">
      <SectionContainer className="py-20 md:py-28">
        <div className="min-h-[420px] border-b border-white/12 pb-14 md:min-h-[480px] md:pb-20">
          <PageHeader
            eyebrow="AMO Journal"
            title={"Insights on magnetic levitation,\nindustrial design,\nengineering,\nand future spaces."}
            description="A clean editorial index for product thinking, technical decisions, OEM collaboration, and commercial applications."
            tone="dark"
            className="whitespace-pre-line"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-y border-white/12 py-5">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${
                activeFilter === filter
                  ? "border-white bg-white text-black"
                  : "border-white/12 text-white/54 hover:border-white/24 hover:text-white"
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
                imageUrl={featuredArticle.coverImage}
                featured
                tone="dark"
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
                      imageUrl={article.coverImage}
                      tone="dark"
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
              tone="dark"
            />
          )}

          {featuredArticle && gridArticles.length === 0 && activeFilter !== "All" ? (
            <p className="mt-6 text-sm text-white/48">Only one article is currently available in this category.</p>
          ) : null}

          {!featuredArticle && articles.length > 0 ? (
            <div className="mt-8">
              <EmptyState
                title={`No ${activeFilter} articles yet`}
                description="Switch filters or return to All to browse the current AMO Journal archive."
                tone="dark"
                action={
                  <button type="button" onClick={() => setActiveFilter("All")} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    View All Articles
                  </button>
                }
              />
            </div>
          ) : null}
        </div>

        <div className="mt-20 rounded-[2.25rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Stay Updated</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                New articles, product launches,
                <br />
                and industry insights from AMO.
              </h2>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Email address"
                className="min-h-14 flex-1 rounded-full border border-white/12 bg-white/[0.04] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-white/28"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" className={buttonStyles({ size: "lg" })} disabled={newsletterState === "loading"}>
                  {newsletterState === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
                <p
                  className={`flex min-h-14 items-center rounded-full border px-5 text-sm ${
                    newsletterState === "success"
                      ? "border-white/16 bg-white/[0.08] text-white"
                      : newsletterState === "error"
                        ? "border-red-400/24 bg-red-500/10 text-red-200"
                        : "border-white/12 bg-transparent text-white/54"
                  }`}
                  aria-live="polite"
                >
                  {newsletterMessage}
                </p>
              </div>
            </form>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
