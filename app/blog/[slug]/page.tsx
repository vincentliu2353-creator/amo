import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import {
  buildBlogArticleMetadata,
  buildNoIndexMetadata,
  extractVisibleBlogFaqs,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from "@/lib/seo";
import { getPublishedBlogBySlug } from "@/lib/supabase/blogs";

export const dynamic = "force-dynamic";

type ArticleSectionBlock =
  | { type: "heading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
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

function parseSectionBlocks(body: string): ArticleSectionBlock[] {
  return body
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .flatMap<ArticleSectionBlock>((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);

      if (lines.length === 0) {
        return [];
      }

      if (lines.every((line) => line.startsWith("- "))) {
        return [
          {
            type: "list",
            items: lines.map((line) => line.slice(2).trim()).filter(Boolean),
          },
        ];
      }

      const firstLine = lines[0] ?? "";
      const subheadingMatch = firstLine.match(/^###\s+(.+)$/);

      if (subheadingMatch) {
        const blocks: ArticleSectionBlock[] = [
          {
            type: "heading",
            content: subheadingMatch[1]?.trim() ?? "",
          },
        ];
        const paragraph = lines.slice(1).join(" ").trim();

        if (paragraph) {
          blocks.push({ type: "paragraph", content: paragraph });
        }

        return blocks;
      }

      return [
        {
          type: "paragraph",
          content: lines.join(" "),
        },
      ];
    });
}

function isCallToActionSection(heading: string) {
  const normalized = heading.trim().toLowerCase();
  return normalized === "call to action" || normalized === "cta";
}

function renderTextWithLinks(content: string, keyPrefix: string): ReactNode {
  const matches = Array.from(content.matchAll(/\[([^\]]+)\]\((\/[^)\s]+)\)/g));

  if (matches.length === 0) {
    return content;
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    const fullMatch = match[0];
    const label = match[1];
    const href = match[2];
    const start = match.index ?? 0;

    if (start > cursor) {
      nodes.push(content.slice(cursor, start));
    }

    nodes.push(
      <Link
        key={`${keyPrefix}-link-${index}`}
        href={href}
        className="text-white underline decoration-white/34 underline-offset-4 transition hover:decoration-white"
      >
        {label}
      </Link>,
    );

    cursor = start + fullMatch.length;
  });

  if (cursor < content.length) {
    nodes.push(content.slice(cursor));
  }

  return nodes;
}

async function loadPublishedBlog(slug: string) {
  try {
    return await getPublishedBlogBySlug(slug);
  } catch {
    return null;
  }
}

function MissingArticleState() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-black text-white">
        <SectionContainer className="py-20 md:py-28">
          <EmptyState
            eyebrow="AMO Journal"
            title="Article not found"
            description="This blog article is unavailable, unpublished, or the link is no longer valid."
            tone="dark"
            action={
              <Link href="/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back To Journal
              </Link>
            }
          />
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await loadPublishedBlog(slug);

  return post
    ? buildBlogArticleMetadata(post)
    : buildNoIndexMetadata({
        title: "Article Not Found | AMO Journal",
        description: "The requested AMO Journal article is unavailable or not published.",
        path: `/blog/${slug}`,
      });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await loadPublishedBlog(slug);

  if (!post) {
    return <MissingArticleState />;
  }

  const articleSections =
    post.sections.length > 0
      ? post.sections
      : [
          {
            heading: "Overview",
            body: post.excerpt,
          },
        ];
  const visibleFaqs = extractVisibleBlogFaqs(post);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={generateArticleJsonLd(post)} />
      {visibleFaqs.length > 0 ? <JsonLd data={generateFaqJsonLd(visibleFaqs)} /> : null}

      <InnerPageShell showHeader>
        <section className="bg-black text-white">
          <SectionContainer className="py-20 md:py-28">
            <div className="grid gap-10 border-b border-white/12 pb-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <PageHeader eyebrow={post.category} title={post.title} description={post.excerpt} tone="dark" />

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
              <div className="relative aspect-[16/9] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),linear-gradient(140deg,#161616,#090909_72%)]">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.42))]" />
                <div className="absolute inset-0 flex h-full items-end justify-between gap-4 p-8">
                  <span className="rounded-full border border-white/14 bg-black/34 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/56">
                    AMO Journal
                  </span>
                  <span className="rounded-full border border-white/14 bg-black/34 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/40">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <article className="max-w-[860px]">
                <div className="space-y-8 text-lg leading-relaxed text-white/74">
                  {articleSections.map((section, index) => (
                    <section
                      key={`${section.heading}-${index}`}
                      className={
                        isCallToActionSection(section.heading)
                          ? "rounded-[1.75rem] border border-white/14 bg-white/[0.04] p-8"
                          : "space-y-5 border-b border-white/10 pb-8 last:border-b-0 last:pb-0"
                      }
                    >
                      {section.heading ? (
                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{section.heading}</h2>
                      ) : null}
                      <div className="space-y-5">
                        {parseSectionBlocks(section.body).map((block, blockIndex) => {
                          if (block.type === "heading") {
                            return (
                              <h3
                                key={`${section.heading}-${block.content}-${blockIndex}`}
                                className="text-2xl font-semibold tracking-tight text-white/92"
                              >
                                {block.content}
                              </h3>
                            );
                          }

                          if (block.type === "list") {
                            return (
                              <ul
                                key={`${section.heading}-list-${blockIndex}`}
                                className="space-y-3 pl-6 text-base text-white/72 marker:text-white/48"
                              >
                                {block.items.map((item) => (
                                  <li key={item}>{renderTextWithLinks(item, `${section.heading}-list-${blockIndex}`)}</li>
                                ))}
                              </ul>
                            );
                          }

                          return (
                            <p key={`${section.heading}-${block.content.slice(0, 32)}-${blockIndex}`}>
                              {renderTextWithLinks(block.content, `${section.heading}-${blockIndex}`)}
                            </p>
                          );
                        })}
                      </div>
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
                    Continue through the AMO Journal or move into a specification conversation with the team.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      Browse Journal
                    </Link>
                    <Link href="/rfq" className={buttonStyles({ size: "sm" })}>
                      Request Quote
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    </>
  );
}
