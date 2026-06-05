"use client";

import { useState } from "react";

import { ScrollReveal } from "@/components/home/home-scroll";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface TechnicalFeature {
  description: string;
  icon: string;
  label: string;
  navLabel: string;
  statement: string;
}

const features: TechnicalFeature[] = [
  {
    label: "Stable Levitation",
    icon: "levitation",
    navLabel: "Stable Levitation",
    statement: "Engineered for precise and reliable magnetic suspension.",
    description:
      "Designed for continuous operation with low drift, smooth balance control, and long-term commercial reliability.",
  },
  {
    label: "360~720° Rotation",
    icon: "rotation",
    navLabel: "360~720° Rotation",
    statement: "Calibrated motion for product presentation without visual noise.",
    description:
      "Rotation behavior can be configured for brand displays, lighting objects, and OEM modules where movement must feel slow, precise, and intentional.",
  },
  {
    label: "Silent Operation",
    icon: "noise",
    navLabel: "Silent Operation",
    statement: "Quiet electromagnetic behavior for premium spatial environments.",
    description:
      "AMO systems are designed to keep the levitation experience visually present without creating distracting mechanical or electrical noise.",
  },
  {
    label: "Custom Load Capacity",
    icon: "load",
    navLabel: "Custom Load Capacity",
    statement: "Magnetic lift architecture matched to object weight, form, and balance.",
    description:
      "Load capacity can be planned around the object, shell material, center of gravity, rotation target, and installation environment for OEM development.",
  },
  {
    label: "Commercial Components",
    icon: "components",
    navLabel: "Commercial Components",
    statement: "Specified for repeatable production and long-term use.",
    description:
      "Component selection and assembly planning support long-term commercial deployment, distributor programs, and branded product lines.",
  },
];

function FeatureMark({ icon }: { icon: string }) {
  if (icon === "rotation") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M7 8.5A7 7 0 0 1 18.5 10" />
        <path d="M18.5 10V6.5H15" />
        <path d="M17 15.5A7 7 0 0 1 5.5 14" />
        <path d="M5.5 14v3.5H9" />
      </svg>
    );
  }

  if (icon === "noise") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M5 13h4l5 4V7L9 11H5v2Z" />
        <path d="M17 10.5c.8 1 .8 2 0 3" opacity="0.55" />
      </svg>
    );
  }

  if (icon === "load") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 16h12" />
        <path d="M8.5 16V9.5L12 7l3.5 2.5V16" />
        <path d="M8.5 12h7" opacity="0.55" />
      </svg>
    );
  }

  if (icon === "components") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="7" y="7" width="10" height="10" rx="1.8" />
        <path d="M9 5v2M12 5v2M15 5v2M9 17v2M12 17v2M15 17v2M5 9h2M5 12h2M5 15h2M17 9h2M17 12h2M17 15h2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="5.5" opacity="0.72" />
      <path d="M12 5v14" opacity="0.55" />
      <path d="M8 9.5c2-1.5 6-1.5 8 0" />
      <path d="M7 14.5c2.6 1.5 7.4 1.5 10 0" opacity="0.55" />
    </svg>
  );
}

function TechnologyBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030405_0%,#050608_48%,#020303_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,222,255,0.13),transparent_27%),radial-gradient(circle_at_50%_82%,rgba(255,255,255,0.08),transparent_22%)]" />

      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-70">
        <defs>
          <linearGradient id="tech-field" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(135,229,255,0.34)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="tech-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="72%" stopColor="rgba(112,222,255,0.08)" />
            <stop offset="100%" stopColor="rgba(112,222,255,0.34)" />
          </radialGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, index) => (
          <path
            key={index}
            d={`M90 ${260 + index * 42} C 360 ${190 + index * 20}, 1050 ${332 - index * 8}, 1350 ${230 + index * 43}`}
            fill="none"
            stroke="url(#tech-field)"
            strokeWidth="1"
            opacity={0.22 + index * 0.025}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 18; 0 0"
              dur={`${18 + index * 1.5}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
        <ellipse cx="720" cy="610" rx="280" ry="72" fill="none" stroke="url(#tech-ring)" strokeWidth="2" opacity="0.72">
          <animateTransform attributeName="transform" type="rotate" from="0 720 610" to="360 720 610" dur="42s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="720" cy="610" rx="190" ry="44" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="12 18" />
        <line x1="1010" y1="285" x2="1010" y2="540" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="6 10" />
        <line x1="1030" y1="285" x2="1030" y2="540" stroke="rgba(112,222,255,0.22)" strokeWidth="1" />
      </svg>

      <div className="absolute left-1/2 top-[55%] h-24 w-24 -translate-x-1/2 rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))] shadow-[0_0_110px_rgba(112,222,255,0.2)] sm:h-28 sm:w-28" />
      <div className="absolute left-1/2 top-[71%] h-7 w-64 -translate-x-1/2 rounded-full bg-cyan-200/25 blur-2xl" />
      <div className="animate-home-drift absolute left-[12%] top-[22%] h-1 w-1 rounded-full bg-cyan-100/45 shadow-[0_0_28px_rgba(165,243,252,0.7)]" />
      <div className="animate-home-drift absolute right-[18%] top-[34%] h-1 w-1 rounded-full bg-white/45 shadow-[0_0_22px_rgba(255,255,255,0.55)]" />
      <div className="animate-home-pulse absolute right-[24%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-cyan-100/35 shadow-[0_0_24px_rgba(165,243,252,0.55)]" />
      <div className="absolute bottom-10 left-10 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/18 lg:block">
        Field Stability // Rotation Control // Load Calibration
      </div>
      <div className="absolute right-10 top-28 hidden font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/18 lg:block">
        Levitation Height 18 MM
      </div>
    </div>
  );
}

export function HomeTechnical() {
  const [activeIndex, setActiveIndex] = useState(0);
  const goToFeature = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + features.length) % features.length);
  };

  return (
    <section
      data-header-theme="dark"
      className="relative flex min-h-screen items-center overflow-x-hidden bg-[#050608] text-white"
      aria-labelledby="home-technical-title"
    >
      <TechnologyBackground />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.62))]" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center py-20 sm:py-24">
        <ScrollReveal
          className="mx-auto flex w-full max-w-[940px] flex-col items-center text-center"
          hiddenClassName="translate-y-6 opacity-0"
          visibleClassName="translate-y-0 opacity-100"
          threshold={0.26}
        >
          <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-cyan-50/54">Technology Capability</p>
          <h2
            id="home-technical-title"
            className="mt-5 font-sans text-[34px] font-medium uppercase leading-[38px] tracking-normal text-white sm:text-[56px] sm:leading-[58px] lg:text-[72px] lg:leading-[72px]"
          >
            Stable. Silent. Precise.
          </h2>
          <p className="mx-auto mt-5 max-w-[800px] font-sans text-[14px] leading-[22.75px] text-[#A3A3A3] sm:text-[16px] sm:leading-[25px]">
            Engineered for reliable levitation, smooth rotation, and long-term commercial use.
          </p>

          <div className="relative mt-10 w-full max-w-full overflow-x-auto pb-5 [scrollbar-width:none] sm:mt-12 [&::-webkit-scrollbar]:hidden">
            <div aria-hidden className="absolute left-0 right-0 top-[2.05rem] hidden h-px bg-gradient-to-r from-transparent via-white/12 to-transparent lg:block" />
            <div className="flex w-max min-w-full snap-x items-start gap-8 px-1 sm:gap-10 lg:w-full lg:justify-center lg:gap-11">
              {features.map((feature, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={feature.label}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    className={cn(
                      "group relative flex min-w-[8.5rem] snap-center flex-col items-center gap-3 px-1 py-2 text-center transition duration-500 sm:min-w-[9.25rem] lg:min-w-0",
                      isActive ? "text-white" : "text-white/45 hover:text-white/75",
                    )}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-0 rounded-full border transition duration-500",
                          isActive
                            ? "border-cyan-100/60 shadow-[0_0_24px_rgba(165,243,252,0.32)]"
                            : "border-white/24 group-hover:border-white/48",
                        )}
                      />
                      <span
                        className={cn(
                          "relative transition duration-500 group-hover:scale-105",
                          isActive ? "text-cyan-50" : "text-white/45 group-hover:text-white/72",
                        )}
                      >
                        <FeatureMark icon={feature.icon} />
                      </span>
                    </span>
                    <span className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal">
                      {feature.navLabel}
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

          <div className="mt-1 flex flex-col items-center gap-3 lg:hidden">
            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={() => goToFeature(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] text-white transition hover:border-cyan-100/38 hover:bg-white/[0.08]"
                aria-label="Previous technical capability"
              >
                <span aria-hidden>&larr;</span>
              </button>
              <button
                type="button"
                onClick={() => goToFeature(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] text-white transition hover:border-cyan-100/38 hover:bg-white/[0.08]"
                aria-label="Next technical capability"
              >
                <span aria-hidden>&rarr;</span>
              </button>
            </div>
            <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/44">
              {String(activeIndex + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
            </p>
          </div>

          <div className="relative mt-5 w-full max-w-[700px] overflow-hidden px-2 py-8 text-center sm:mt-8 sm:py-10">
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-50/24 to-transparent" />
            <div aria-hidden className="absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div aria-hidden className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-50/30 to-transparent" />

            <div className="relative min-h-[12rem] sm:min-h-[11rem]">
              {features.map((feature, index) => {
                const isActive = index === activeIndex;

                return (
                  <article
                    key={feature.label}
                    className={cn(
                      "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive ? "relative translate-y-0 opacity-100" : "pointer-events-none absolute inset-0 translate-y-3 opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    <p className="font-sans text-[11px] font-medium uppercase leading-4 tracking-normal text-cyan-50/42">
                      Technical Point 0{index + 1}
                    </p>
                    <h3 className="mt-4 font-sans text-[24px] font-medium uppercase leading-[29px] tracking-normal text-white sm:text-[32px] sm:leading-[36px]">
                      {feature.label}
                    </h3>
                    <p className="mx-auto mt-4 max-w-[560px] font-sans text-[16px] font-medium leading-[24px] text-white/84 sm:text-[18px] sm:leading-[27px]">
                      {feature.statement}
                    </p>
                    <p className="mx-auto mt-4 max-w-[640px] font-sans text-[14px] leading-[22.75px] text-white/52 sm:text-[15px] sm:leading-[24px]">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
