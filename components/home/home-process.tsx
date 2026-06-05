"use client";

import { useState } from "react";

import { ScrollReveal } from "@/components/home/home-scroll";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface ProcessStep {
  accent: string;
  description: string;
  label: string;
  number: string;
}

const stepDetails: Record<string, { summary: string; includes: string[] }> = {
  "01": {
    summary: "We transform initial ideas into feasible magnetic levitation product concepts.",
    includes: ["Product positioning", "Industrial design direction", "Application analysis", "Feasibility review"],
  },
  "02": {
    summary: "We convert the concept into an engineered levitation architecture ready for validation.",
    includes: ["Magnetic system planning", "Mechanical structure review", "Electronics strategy", "Control logic definition"],
  },
  "03": {
    summary: "We build working prototypes to validate floating behavior, balance, rotation, and presentation quality.",
    includes: ["Prototype assembly", "Levitation tuning", "Material integration", "Performance testing"],
  },
  "04": {
    summary: "We refine pre-production samples around visual finish, stability, packaging, and user experience.",
    includes: ["Sample finishing", "Packaging direction", "Reliability checks", "Client review support"],
  },
  "05": {
    summary: "We prepare controlled production workflows for consistent commercial delivery.",
    includes: ["Component sourcing", "Assembly process control", "Quality inspection", "Production scheduling"],
  },
  "06": {
    summary: "We coordinate export-ready delivery for global programs, distributors, and brand launches.",
    includes: ["Export coordination", "Branded packing", "Documentation support", "Rollout planning"],
  },
};

function ProcessIcon({ label }: { label: string }) {
  if (label.includes("Concept")) {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
        <path d="M12 34 24 10l12 24H12Z" />
        <path d="M18 30h12" />
      </svg>
    );
  }

  if (label.includes("Engineering")) {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
        <circle cx="16" cy="24" r="5.5" />
        <circle cx="32" cy="24" r="5.5" />
        <path d="M21.5 24h5M16 18.5v-4M16 33.5v-4M32 18.5v-4M32 33.5v-4" />
      </svg>
    );
  }

  if (label.includes("Prototype")) {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
        <rect x="12" y="13" width="24" height="21" rx="4" />
        <path d="M17 20h14M17 25h14M17 30h9" />
      </svg>
    );
  }

  if (label.includes("Sampling")) {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
        <path d="M14 14h20v20H14z" />
        <path d="m18 24 4 4 8-8" />
      </svg>
    );
  }

  if (label.includes("Mass")) {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
        <rect x="9" y="15" width="12" height="18" rx="2.5" />
        <rect x="27" y="11" width="12" height="22" rx="2.5" />
        <path d="M15 19v10M33 17v10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.35">
      <path d="M10 31h10l4 7 4-28 4 14h6" />
      <path d="M34 14h6v6" />
    </svg>
  );
}

function ProcessBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/[0.04] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute left-1/2 top-[54%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.045]" />
      <div className="absolute left-1/2 top-[54%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.035]" />
      <div className="animate-home-pulse absolute left-1/2 top-[45%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300/30 shadow-[0_0_32px_rgba(103,232,249,0.5)]" />
      <div className="absolute bottom-10 left-10 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/18 lg:block">
        OEM Development // Sampling // Manufacturing Control
      </div>
      <div className="absolute right-10 top-28 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/18 lg:block">
        Process Continuity
      </div>
    </div>
  );
}

export function HomeProcess({ steps }: { steps: ProcessStep[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const goToStep = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + steps.length) % steps.length);
  };

  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-screen items-center overflow-x-hidden bg-white text-black"
      aria-labelledby="home-process-title"
    >
      <ProcessBackground />

      <Container className="relative z-10 py-16 sm:py-20">
        <ScrollReveal
          className="mx-auto flex max-w-6xl flex-col items-center text-center"
          hiddenClassName="translate-y-6 opacity-0"
          visibleClassName="translate-y-0 opacity-100"
          threshold={0.28}
        >
          <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/42">OEM &amp; ODM</p>
          <h2
            id="home-process-title"
            className="mt-6 font-sans text-[34px] font-medium uppercase leading-[38px] tracking-normal sm:text-[56px] sm:leading-[58px] lg:text-[72px] lg:leading-[72px]"
          >
            <span className="block">From Concept To</span>
            <span className="block">Floating Product.</span>
          </h2>
          <p className="mt-6 max-w-[800px] font-sans text-[14px] leading-[22.75px] text-black/62 sm:text-[16px] sm:leading-[25px]">
            We support global brands, distributors, and design studios with full OEM &amp; ODM development.
          </p>

          <div className="relative mt-10 w-full max-w-full overflow-x-auto pb-5 [scrollbar-width:none] sm:mt-12 [&::-webkit-scrollbar]:hidden">
            <div className="absolute left-[8%] right-[8%] top-[2.25rem] hidden h-px bg-black/12 lg:block" />
            <div
              className="absolute left-[8%] top-[2.25rem] hidden h-px bg-black/55 transition-all duration-700 lg:block"
              style={{ width: `${(activeIndex / Math.max(1, steps.length - 1)) * 84}%` }}
            />

            <div className="grid min-w-[820px] grid-cols-6 gap-4 px-1 lg:min-w-0 lg:gap-6">
              {steps.map((step, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    className={cn(
                      "group relative flex flex-col items-center gap-4 text-center transition duration-500",
                      isActive ? "text-black" : "text-black/42 hover:text-black/72",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border bg-white transition duration-500",
                        isActive
                          ? "border-cyan-300/55 text-black shadow-[0_0_44px_rgba(103,232,249,0.28)]"
                          : "border-black/10 group-hover:border-black/24",
                      )}
                    >
                      <ProcessIcon label={step.label} />
                    </span>
                    <span className="max-w-[8rem] font-sans text-[12px] font-medium uppercase leading-4 tracking-normal">
                      {step.number} {step.label}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "h-px w-10 transition duration-500",
                        isActive ? "bg-black/54 shadow-[0_0_18px_rgba(103,232,249,0.55)]" : "bg-black/12 group-hover:bg-black/24",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-0 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={() => goToStep(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-black/[0.03] text-black transition hover:border-black/24 hover:bg-black/[0.06]"
                aria-label="Previous OEM process step"
              >
                <span aria-hidden>&larr;</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-black/[0.03] text-black transition hover:border-black/24 hover:bg-black/[0.06]"
                aria-label="Next OEM process step"
              >
                <span aria-hidden>&rarr;</span>
              </button>
            </div>
            <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/42">
              {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </p>
          </div>

          <div className="relative mt-2 w-full max-w-[720px] sm:mt-4 lg:mt-5">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const detail = stepDetails[step.number] ?? { summary: step.description, includes: [] };

              return (
                <article
                  key={step.number}
                  className={cn(
                    "transition-all duration-500 ease-out",
                    isActive ? "relative translate-y-0 opacity-100" : "pointer-events-none absolute inset-0 translate-y-4 opacity-0",
                  )}
                  aria-hidden={!isActive}
                >
                  <div className="relative px-2 py-6 text-center sm:py-8">
                    <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-black/18 to-transparent" />
                    <div aria-hidden className="absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                    <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/36">Step {step.number}</p>
                    <h3 className="mt-4 font-sans text-[34px] font-medium uppercase leading-[38px] tracking-normal text-black sm:text-[48px] sm:leading-[50px]">
                      {step.label}
                    </h3>
                    <p className="mx-auto mt-5 max-w-[600px] font-sans text-[17px] font-medium leading-[26px] text-black/82 sm:text-[19px] sm:leading-[29px]">
                      {detail.summary}
                    </p>
                    <p className="mx-auto mt-5 max-w-[640px] font-sans text-[13px] leading-[21px] text-black/56 sm:text-[15px] sm:leading-[24px]">
                      {step.description}
                    </p>
                    <div className="mx-auto mt-8 max-w-[560px]">
                      <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black/34">Capabilities</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3">
                        {detail.includes.map((item) => (
                          <div key={item} className="flex items-center gap-3 font-sans text-[13px] leading-[21px] text-black/54">
                            <span className="h-px w-5 bg-black/22" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
