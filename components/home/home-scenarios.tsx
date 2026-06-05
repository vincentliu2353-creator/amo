"use client";

import { useState, type CSSProperties } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface ScenarioItem {
  accent: string;
  blurb: string;
  caption: string;
  title: string;
}

function accentColor(accent: string, alpha: number) {
  return `rgb(${accent} / ${alpha})`;
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

function ScenarioImagePlaceholder({ scenario }: { scenario: ScenarioItem }) {
  const style: CSSProperties = {
    backgroundImage: `radial-gradient(circle at 20% 24%, ${accentColor(scenario.accent, 0.24)}, transparent 24%), radial-gradient(circle at 72% 42%, ${accentColor(
      scenario.accent,
      0.12,
    )}, transparent 26%), linear-gradient(125deg, #030304 0%, #101114 52%, #050506 100%)`,
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_38%,rgba(0,0,0,0.18)_70%,rgba(0,0,0,0.64)_100%)]" />
      <div className="absolute bottom-0 left-[8%] h-[58vh] w-[26vw] min-w-[180px] rounded-t-[2.5rem] border border-white/10 bg-white/[0.045]" />
      <div className="absolute bottom-0 left-[32%] h-[72vh] w-[22vw] min-w-[160px] rounded-t-[2rem] border border-white/8 bg-white/[0.035]" />
      <div className="absolute bottom-0 right-[13%] h-[64vh] w-[30vw] min-w-[220px] rounded-t-[3rem] border border-white/10 bg-white/[0.04]" />
      <div className="absolute left-1/2 top-[47%] h-36 w-36 -translate-x-1/2 rounded-[30%] border border-white/16 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.24),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_60%,rgba(255,255,255,0)_100%)] shadow-[0_0_110px_rgba(255,255,255,0.1)]" />
      <div
        className="absolute left-1/2 top-[65%] h-7 w-48 -translate-x-1/2 rounded-full blur-xl"
        style={{ backgroundColor: accentColor(scenario.accent, 0.28) }}
      />
      <div className="absolute inset-x-[14%] top-[38%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-x-[20%] top-[58%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="absolute right-10 top-28 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/20 lg:block">
        Spatial Placeholder // Future Image Layer
      </div>
      <div className="absolute bottom-10 right-10 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/18 lg:block">
        {scenario.caption}
      </div>
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
            <ScenarioImagePlaceholder scenario={scenario} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24),rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.74)_100%)]" />

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
