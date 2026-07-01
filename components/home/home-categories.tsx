"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

interface ProductCategorySlide {
  accent: string;
  description: string;
  details: string[];
  idLabel: string;
  imageAlt: string;
  imageSrc: StaticImageData;
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

function CategoryProductVisual({ imageAlt, imageSrc }: Pick<ProductCategorySlide, "imageAlt" | "imageSrc">) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        loading="lazy"
        placeholder="blur"
        quality={90}
        className="object-cover"
        sizes="100vw"
      />
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
      data-header-theme="dark"
      className="relative min-h-screen bg-black text-white"
      aria-label="Core Product Categories"
    >
      <div className="relative min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {categories.map((category, index) => {
            const distance = index - slideProgress;
            const visibility = clamp(1 - Math.abs(distance));

            return (
              <div
                key={category.idLabel}
                className="absolute inset-0 transition-[opacity,transform,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: visibility,
                  transform: `translate3d(${distance * 7}vw, 0, 0) scale(1.035)`,
                  filter: `blur(${Math.min(Math.abs(distance), 1) * 6}px)`,
                }}
              >
                <CategoryProductVisual imageSrc={category.imageSrc} imageAlt={category.imageAlt} />
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.34)_32%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0.5)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,transparent_32%,rgba(0,0,0,0.28)_100%)]" />

        <div className="pointer-events-none absolute inset-0 z-20">
          {categories.map((category, index) => {
            const distance = index - slideProgress;
            const visibility = clamp(1 - Math.abs(distance) * 1.1);

            return (
              <article
                key={category.idLabel}
                className="absolute inset-x-6 top-1/2 mx-auto max-w-5xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: visibility,
                  transform: `translate3d(${distance * 42}vw, -50%, 0)`,
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
                aria-hidden={activeIndex !== index}
              >
                <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/55">{category.idLabel}</p>
                <h2 className="mx-auto mt-5 max-w-[14ch] font-sans text-[42px] font-medium uppercase leading-[44px] tracking-normal text-white sm:text-[64px] sm:leading-[66px] lg:text-[92px] lg:leading-[92px]">
                  {category.title}
                </h2>
                <p className="mx-auto mt-5 max-w-[42rem] font-sans text-[14px] leading-[22.75px] text-white/68 sm:text-[16px] sm:leading-[25px]">
                  {category.description}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {category.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-white/15 bg-black/20 px-3 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/60 backdrop-blur"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-4 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between sm:inset-x-8">
          <button
            type="button"
            onClick={() => goToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-black/35 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-white hover:text-black disabled:opacity-30"
            aria-label="Previous product category"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(activeIndex + 1)}
            disabled={activeIndex === categories.length - 1}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-black/35 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-white hover:text-black disabled:opacity-30"
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
              className="h-2.5 rounded-full bg-white transition-all duration-500"
              style={{ width: activeIndex === index ? 34 : 10, opacity: activeIndex === index ? 1 : 0.35 }}
              aria-label={`Go to ${category.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
