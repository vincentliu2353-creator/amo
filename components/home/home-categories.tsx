"use client";

import { useState } from "react";

interface ProductCategorySlide {
  accent: string;
  description: string;
  details: string[];
  idLabel: string;
  title: string;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {direction === "left" ? <path d="M15 5 8 12l7 7" /> : <path d="m9 5 7 7-7 7" />}
    </svg>
  );
}

function CategoryProductVisual({ accent, title }: { accent: string; title: string }) {
  const glow = `rgb(${accent} / 0.28)`;
  const softGlow = `rgb(${accent} / 0.14)`;

  return (
    <div className="relative h-[52vh] min-h-[320px] w-[84vw] max-w-[980px]" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: `rgb(${accent} / 0.24)`, boxShadow: `0 0 120px ${softGlow}` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: `rgb(${accent} / 0.12)` }}
      />
      <div className="absolute inset-x-[7%] top-1/2 h-px bg-gradient-to-r from-transparent via-black/16 to-transparent" />
      <div className="absolute inset-x-[14%] top-[58%] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div
        className="animate-home-float absolute left-1/2 top-[42%] h-[42vh] min-h-[260px] w-[42vh] min-w-[260px] -translate-x-1/2 rounded-[24px] border border-black/10 bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.96),rgba(255,255,255,0.18)_26%,rgba(0,0,0,0.04)_68%,rgba(0,0,0,0.1)_100%)]"
        style={{ boxShadow: `0 44px 160px rgba(0,0,0,0.18), 0 0 110px ${glow}` }}
      />
      <div
        className="absolute left-1/2 top-[76%] h-8 w-[34vh] min-w-[230px] -translate-x-1/2 rounded-full blur-xl"
        style={{ background: glow }}
      />
      <p className="absolute bottom-0 left-1/2 -translate-x-1/2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/30">
        {title}
      </p>
    </div>
  );
}

export function HomeCategories({ categories }: { categories: ProductCategorySlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideProgress = activeIndex;

  function goToSlide(index: number) {
    setActiveIndex(Math.min(categories.length - 1, Math.max(0, index)));
  }

  return (
    <section
      data-header-theme="light"
      className="relative min-h-screen bg-white text-black"
      aria-label="Core Product Categories"
    >
      <div className="relative min-h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/[0.06] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute inset-x-6 top-[12vh] z-20 mx-auto max-w-5xl text-center sm:top-[11vh]">
          {categories.map((category, index) => {
            const distance = index - slideProgress;
            const visibility = clamp(1 - Math.abs(distance) * 1.1);

            return (
              <article
                key={category.idLabel}
                className="absolute inset-x-0 top-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: visibility,
                  transform: `translate3d(${distance * 42}vw, 0, 0)`,
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
                aria-hidden={activeIndex !== index}
              >
                <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/45">{category.idLabel}</p>
                <h2 className="mx-auto mt-5 max-w-[14ch] font-sans text-[42px] font-medium uppercase leading-[44px] tracking-normal text-black sm:text-[64px] sm:leading-[66px] lg:text-[92px] lg:leading-[92px]">
                  {category.title}
                </h2>
                <p className="mx-auto mt-5 max-w-[42rem] font-sans text-[14px] leading-[22.75px] text-black/62 sm:text-[16px] sm:leading-[25px]">
                  {category.description}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {category.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-black/10 bg-white/70 px-3 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/45 backdrop-blur"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="absolute inset-x-0 top-[43vh] z-10 flex h-[52vh] items-center justify-center">
          {categories.map((category, index) => {
            const distance = index - slideProgress;
            const visibility = clamp(1 - Math.abs(distance) * 0.9);

            return (
              <div
                key={category.idLabel}
                className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: visibility,
                  transform: `translate3d(${distance * 20}vw, 0, 0) scale(${1 - Math.min(Math.abs(distance), 1) * 0.08})`,
                }}
              >
                <CategoryProductVisual accent={category.accent} title={category.title} />
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-4 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between sm:inset-x-8">
          <button
            type="button"
            onClick={() => goToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur transition hover:bg-white disabled:opacity-30"
            aria-label="Previous product category"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(activeIndex + 1)}
            disabled={activeIndex === categories.length - 1}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur transition hover:bg-white disabled:opacity-30"
            aria-label="Next product category"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {categories.map((category, index) => (
            <button
              key={category.idLabel}
              type="button"
              onClick={() => goToSlide(index)}
              className="h-2.5 rounded-full bg-black/20 transition-all duration-500"
              style={{ width: activeIndex === index ? 34 : 10, opacity: activeIndex === index ? 1 : 0.35 }}
              aria-label={`Go to ${category.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
