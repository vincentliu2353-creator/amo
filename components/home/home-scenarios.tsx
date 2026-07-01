"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface ScenarioItem {
  accent: string;
  blurb: string;
  caption: string;
  imageAlt: string;
  imageSrc: StaticImageData;
  title: string;
}

function ScenarioIcon({ title }: { title: string }) {
  if (title.includes("Retail")) {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 19h24l-2 18H14L12 19Z" />
        <path d="M17 19c0-5 3-8 7-8s7 3 7 8" />
        <path d="M18 27h12" opacity="0.55" />
      </svg>
    );
  }

  if (title.includes("Museum")) {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M10 19h28L24 10 10 19Z" />
        <path d="M14 22v14M22 22v14M30 22v14M10 38h28" />
      </svg>
    );
  }

  if (title.includes("Hotel")) {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M13 37V13h22v24" />
        <path d="M18 20h4M26 20h4M18 27h4M26 27h4" />
        <path d="M21 37v-6h6v6" />
      </svg>
    );
  }

  if (title.includes("Office")) {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 36V15h24v21" />
        <path d="M16 36V22h16v14" />
        <path d="M18 18h12M20 27h8" opacity="0.58" />
      </svg>
    );
  }

  if (title.includes("Exhibition")) {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 15h24v17H12z" />
        <path d="M18 38h12M24 32v6" />
        <path d="M18 23h12" opacity="0.58" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M14 21h20v17H14z" />
      <path d="M12 21h24l-4-8H16l-4 8Z" />
      <path d="M24 13v25M16 28h16" opacity="0.58" />
    </svg>
  );
}

function ScenarioBackground({ scenario }: { scenario: ScenarioItem }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={scenario.imageSrc}
        alt={scenario.imageAlt}
        fill
        loading="lazy"
        placeholder="blur"
        quality={90}
        sizes="100vw"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export function HomeScenarios({ scenarios }: { scenarios: ScenarioItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScenario = scenarios[activeIndex] ?? scenarios[0];

  return (
    <section
      data-header-theme="dark"
      className="relative min-h-screen overflow-x-hidden bg-[#050506] text-white"
      aria-labelledby="home-scenarios-title"
    >
      <div className="absolute inset-0">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.title}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <ScenarioBackground scenario={scenario} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.52)_38%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.3)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.68)_100%)]" />

      <Container className="relative z-10 flex min-h-screen flex-col justify-end pb-10 pt-28 sm:pb-14 sm:pt-32 lg:justify-center lg:py-24">
        <div className="max-w-3xl">
          <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/50">Application Scenarios</p>
          <p className="mt-6 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-cyan-50/58">{activeScenario.caption}</p>
          <h2
            id="home-scenarios-title"
            className="mt-4 max-w-[11ch] font-sans text-[44px] font-medium uppercase leading-[46px] tracking-normal text-white sm:text-[72px] sm:leading-[72px] lg:text-[96px] lg:leading-[94px]"
          >
            {activeScenario.title}
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-[15px] leading-[24px] text-white/68 sm:text-[18px] sm:leading-[29px]">{activeScenario.blurb}</p>

          <div className="mt-8 hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current - 1 + scenarios.length) % scenarios.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 text-white transition hover:border-cyan-100/38 hover:text-cyan-50"
              aria-label="Previous scenario"
            >
              <span aria-hidden>&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % scenarios.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 text-white transition hover:border-cyan-100/38 hover:text-cyan-50"
              aria-label="Next scenario"
            >
              <span aria-hidden>&rarr;</span>
            </button>
            <p className="ml-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/44">
              {String(activeIndex + 1).padStart(2, "0")} / {String(scenarios.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="relative mt-10 w-full max-w-full overflow-x-auto pb-4 [scrollbar-width:none] lg:mt-14 [&::-webkit-scrollbar]:hidden">
          <div aria-hidden className="absolute left-0 right-0 top-[2rem] hidden h-px bg-gradient-to-r from-transparent via-white/12 to-transparent lg:block" />
          <div className="flex w-max min-w-full snap-x items-start gap-8 px-1 sm:gap-10 lg:w-full lg:justify-center lg:gap-12">
            {scenarios.map((scenario, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={scenario.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative flex min-w-[6.75rem] snap-center flex-col items-center gap-3 px-1 py-2 text-center transition duration-500 sm:min-w-[7.75rem] lg:min-w-0",
                    isActive ? "text-white" : "text-white/45 hover:text-white/76",
                  )}
                >
                  <span className="relative flex h-9 w-9 items-center justify-center">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full border transition duration-500",
                        isActive
                          ? "border-cyan-100/55 shadow-[0_0_26px_rgba(165,243,252,0.3)]"
                          : "border-white/20 group-hover:border-white/44",
                      )}
                    />
                    <span className={cn("relative transition duration-500 group-hover:scale-105", isActive ? "text-cyan-50" : "text-white/48 group-hover:text-white/74")}>
                      <ScenarioIcon title={scenario.title} />
                    </span>
                  </span>
                  <span className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal">
                    {scenario.title.replace("Retail Stores", "Retail")}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-10 transition duration-500",
                      isActive ? "bg-cyan-50/64 shadow-[0_0_18px_rgba(165,243,252,0.42)]" : "bg-transparent group-hover:bg-white/22",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 lg:hidden">
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current - 1 + scenarios.length) % scenarios.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] text-white transition hover:border-cyan-100/38 hover:bg-white/[0.08]"
              aria-label="Previous scenario"
            >
              <span aria-hidden>&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % scenarios.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] text-white transition hover:border-cyan-100/38 hover:bg-white/[0.08]"
              aria-label="Next scenario"
            >
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
          <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/44">
            {String(activeIndex + 1).padStart(2, "0")} / {String(scenarios.length).padStart(2, "0")}
          </p>
        </div>
      </Container>
    </section>
  );
}
