"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { Container } from "@/components/ui/container";

interface HomeBlogItem {
  coverImage?: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  slug: string;
  title: string;
}

const categories = ["Engineering", "Brand Spaces", "OEM Insight", "Retail Futures", "Design Systems", "Levitation Culture"];

const fallbackPost: HomeBlogItem = {
  slug: "future-display-storytelling",
  title: "How Floating Displays Change Brand Storytelling",
  excerpt: "Why levitation works as a spatial communication tool for premium launches, hospitality, and curated merchandising.",
  publishedAt: "2026-01-16",
  readTime: "4 min read",
  coverImage: "",
};

function BlogCardPlaceholder({ index }: { index: number }) {
  const accents = [
    "rgba(162, 213, 255, 0.24)",
    "rgba(255, 255, 255, 0.16)",
    "rgba(155, 255, 219, 0.2)",
    "rgba(255, 213, 179, 0.18)",
  ];

  return (
    <div className="relative h-[18rem] overflow-hidden rounded-[2rem] border border-black/10 bg-black sm:h-[21rem]">
      <div
        className="absolute inset-0 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        style={{
          backgroundImage: `radial-gradient(circle at 24% 18%, ${accents[index % accents.length]}, transparent 22%), radial-gradient(circle at 70% 52%, rgba(255,255,255,0.1), transparent 24%), linear-gradient(180deg, #070707 0%, #111111 100%)`,
        }}
      />
      <div className="absolute inset-6 rounded-[1.5rem] border border-white/10" />
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[28%] border border-white/16 bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.26),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_48%,rgba(255,255,255,0)_100%)] shadow-[0_0_80px_rgba(255,255,255,0.08)]" />
      <div className="absolute inset-x-12 top-[28%] h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="absolute inset-x-12 top-[60%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="absolute bottom-6 left-6 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/42">
        AMO Journal
      </div>
    </div>
  );
}

function BlogCardVisual({ imageUrl, index, title }: { imageUrl?: string; index: number; title: string }) {
  if (!imageUrl) {
    return <BlogCardPlaceholder index={index} />;
  }

  return (
    <div className="relative h-[18rem] overflow-hidden rounded-[2rem] border border-black/10 bg-black sm:h-[21rem]">
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(min-width: 1024px) 34rem, (min-width: 640px) 30rem, 86vw"
        className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5))]" />
      <div className="absolute inset-6 rounded-[1.5rem] border border-white/10" />
      <div className="absolute bottom-6 left-6 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/42">
        AMO Journal
      </div>
    </div>
  );
}

export function HomeBlog({ posts }: { posts: HomeBlogItem[] }) {
  const displayPosts = posts.length > 0 ? posts : [fallbackPost];
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + displayPosts.length) % displayPosts.length;

    setActiveIndex(nextIndex);
    window.requestAnimationFrame(() => {
      carouselRef.current
        ?.querySelector<HTMLElement>(`[data-blog-card="${nextIndex}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    });
  };

  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-screen items-center overflow-x-hidden bg-white text-black"
      aria-labelledby="home-blog-title"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(0,0,0,0.045),transparent_22%),linear-gradient(180deg,#fff_0%,#f5f4ef_100%)]" />
      <Container className="relative z-10 py-16 sm:py-20">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/42">Journal</p>
            <h2
              id="home-blog-title"
              className="mt-6 max-w-3xl font-sans text-[34px] font-medium uppercase leading-[38px] tracking-normal sm:text-[56px] sm:leading-[58px] lg:text-[72px] lg:leading-[72px]"
            >
              Technical Stories, Brand Ideas, And Product Perspective.
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="font-sans text-[14px] leading-[22.75px] text-black/62 sm:text-[16px] sm:leading-[25px]">
              Browse AMO perspectives on applications, engineering detail, and buyer confidence through a premium editorial lens.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => moveCarousel(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-white text-black transition hover:border-black/30 hover:bg-black hover:text-white"
                aria-label="Previous article"
              >
                <span aria-hidden>&larr;</span>
              </button>
              <button
                type="button"
                onClick={() => moveCarousel(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-white text-black transition hover:border-black/30 hover:bg-black hover:text-white"
                aria-label="Next article"
              >
                <span aria-hidden>&rarr;</span>
              </button>
              <p className="ml-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/42">
                {String(activeIndex + 1).padStart(2, "0")} / {String(displayPosts.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div ref={carouselRef} className="mt-10 flex snap-x gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] sm:mt-12 [&::-webkit-scrollbar]:hidden">
          {displayPosts.map((post, index) => (
            <article
              key={post.slug}
              data-blog-card={index}
              className="group min-w-[86vw] snap-start border-y border-black/12 py-5 transition duration-500 hover:border-black/28 sm:min-w-[30rem] lg:min-w-[34rem]"
            >
              <BlogCardVisual imageUrl={post.coverImage} index={index} title={post.title} />
              <div className="mt-6 flex items-center justify-between gap-4 font-sans text-[11px] font-medium uppercase leading-4 tracking-normal text-black/42">
                <span>{categories[index % categories.length]}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-4 font-sans text-[26px] font-medium uppercase leading-[31px] tracking-normal text-black sm:text-[34px] sm:leading-[38px]">
                {post.title}
              </h3>
              <p className="mt-4 font-sans text-[14px] leading-[22.75px] text-black/62 sm:text-[16px] sm:leading-[25px]">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/10 pt-5">
                <p className="font-sans text-[11px] font-medium uppercase leading-4 tracking-normal text-black/38">{post.publishedAt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black underline-offset-4 transition hover:underline"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
