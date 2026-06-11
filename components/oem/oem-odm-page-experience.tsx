"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useState } from "react";

import { ScrollReveal } from "@/components/home/home-scroll";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

const whyStats = [
  {
    value: "50+",
    label: "OEM Projects",
    description: "Programs spanning display systems, premium gifting, and branded floating objects.",
  },
  {
    value: "20+",
    label: "Countries",
    description: "Cross-border delivery for distributors, design studios, and international brand teams.",
  },
  {
    value: "360° / 720°",
    label: "Levitation Systems",
    description: "Rotation architectures configured around presentation rhythm, object balance, and viewing intent.",
  },
  {
    value: "Full",
    label: "Customization",
    description: "Visual, structural, technical, and packaging development inside one controlled program path.",
  },
] as const;

const developmentLabels = [
  "Levitation System",
  "Control Electronics",
  "Mechanical Structure",
  "Industrial Design",
] as const;

const processSteps = [
  {
    accent: "145 214 255",
    number: "01",
    title: "Brief",
    description: "Understand your product idea, target market, quantity, and customization needs.",
    detail: "Commercial context and product ambition are aligned before the levitation architecture is defined.",
  },
  {
    accent: "255 204 166",
    number: "02",
    title: "Concept Design",
    description: "Create product direction, form language, material references, and visual concept.",
    detail: "The object language and spatial rhythm are framed so the concept already feels levitation-first.",
  },
  {
    accent: "188 255 230",
    number: "03",
    title: "Engineering",
    description: "Develop levitation structure, magnetic module, electronics, and production feasibility.",
    detail: "Field behavior, electronics, structure, and feasibility are resolved as one integrated program.",
  },
  {
    accent: "196 202 255",
    number: "04",
    title: "Prototype",
    description: "Build working samples for testing, adjustment, and client confirmation.",
    detail: "Working samples validate stability, rotation quality, finish, and installation constraints before refinement.",
  },
  {
    accent: "227 251 172",
    number: "05",
    title: "Sampling",
    description: "Prepare refined samples with finish, packaging, and production details.",
    detail: "Pre-production samples lock cosmetic quality and the customer-facing details buyers actually evaluate.",
  },
  {
    accent: "255 190 223",
    number: "06",
    title: "Mass Production",
    description: "Manufacture with quality control, consistency checks, and commercial packaging.",
    detail: "Production starts only after the system and assembly tolerances are stable enough for repeatable commercial use.",
  },
  {
    accent: "204 232 255",
    number: "07",
    title: "Global Delivery",
    description: "Support export, logistics, documentation, and delivery coordination.",
    detail: "Export documentation and rollout logistics stay connected to the original brief through final delivery.",
  },
] as const;

const customizationOptions = [
  {
    accent: "145 214 255",
    indexLabel: "01 / PRODUCT SHAPE",
    title: "Product Shape",
    description: "Adapt the floating object and base geometry to your category, proportions, and visual tension.",
    details: ["Silhouette direction", "Balance tuning", "Object-to-base relationship"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-product-shape.webp",
    visual: "shape",
  },
  {
    accent: "255 206 173",
    indexLabel: "02 / MATERIAL",
    title: "Material",
    description: "Balance premium touch, production feasibility, and magnetic performance across shell and structural parts.",
    details: ["Plastic or metal shells", "Mixed-material construction", "Retail-safe durability"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-material.webp",
    visual: "material",
  },
  {
    accent: "196 255 232",
    indexLabel: "03 / SURFACE FINISH",
    title: "Surface Finish",
    description: "Define the final visual language through texture, gloss, matte treatment, and coating precision.",
    details: ["Matte and soft-touch", "Metallic detailing", "Color depth control"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-surface-finish.webp",
    visual: "finish",
  },
  {
    accent: "201 204 255",
    indexLabel: "04 / BRANDING",
    title: "Branding",
    description: "Integrate logos, marks, and signature cues without making the product feel over-designed.",
    details: ["Logo placement", "Subtle marks", "Premium identity integration"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-branding.webp",
    visual: "branding",
  },
  {
    accent: "230 252 170",
    indexLabel: "05 / PACKAGING",
    title: "Packaging",
    description: "Extend the product story into the unboxing system, protection strategy, and presentation layer.",
    details: ["Protective insert design", "Gift-ready packaging", "Export-aware presentation"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-packaging.webp",
    visual: "packaging",
  },
  {
    accent: "255 196 228",
    indexLabel: "06 / MAGNETIC MODULE",
    title: "Magnetic Module",
    description: "Tune lift architecture, power behavior, and load handling around the real object and installation context.",
    details: ["Different weight classes", "Stable lift behavior", "Power and safety planning"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-magnetic-module.webp",
    visual: "module",
  },
  {
    accent: "204 232 255",
    indexLabel: "07 / LIGHTING",
    title: "Lighting",
    description: "Use glow, edge light, or quiet illumination to support the floating effect without distracting from it.",
    details: ["Halo lighting", "Object emphasis", "Ambient presentation"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-lighting.webp",
    visual: "lighting",
  },
  {
    accent: "175 246 224",
    indexLabel: "08 / MOTION EFFECT",
    title: "Motion Effect",
    description: "Define how the object rotates, pauses, and presents itself to match the intended brand mood.",
    details: ["360° or 720° rotation", "Speed calibration", "Calm presentation rhythm"],
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/custom-motion-effect.webp",
    visual: "motion",
  },
] as const;

const engineeringCapabilities = [
  {
    number: "01",
    title: "Stable Levitation",
    description: "Reliable magnetic balance designed for long-duration display use in real commercial environments.",
  },
  {
    number: "02",
    title: "360° / 720° Rotation",
    description: "Smooth rotation modes tuned for different product concepts, viewing distance, and presentation rhythm.",
  },
  {
    number: "03",
    title: "Low Noise Operation",
    description: "Quiet enough for retail, hospitality, office, and exhibition spaces where acoustic calm matters.",
  },
  {
    number: "04",
    title: "Custom Load Capacity",
    description: "Magnetic modules can be adjusted around object size, weight, center of gravity, and safety margin.",
  },
  {
    number: "05",
    title: "Long-Term Stability",
    description: "Commercial-grade components and tuning strategy support repeatable lift behavior over extended run time.",
  },
] as const;

const industryScenarios = [
  {
    accent: "145 214 255",
    caption: "Retail",
    imagePosition: "center right",
    imageSrc: "/images/oem/optimized/industry-retail.webp",
    title: "Merchandising Focus",
    description: "Create a premium pause point for hero products, limited releases, and elevated counter displays.",
  },
  {
    accent: "209 231 255",
    caption: "Hospitality",
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/industry-hospitality.webp",
    title: "Spatial Atmosphere",
    description: "Use floating light objects and sculptural display systems to give lounges, suites, and lobbies a calmer technological signature.",
  },
  {
    accent: "255 206 173",
    caption: "Museums",
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/industry-museums.webp",
    title: "Curated Distance",
    description: "Present artifacts, replicas, or symbolic objects with a sense of silence, precision, and protected separation.",
  },
  {
    accent: "196 255 232",
    caption: "Corporate Gifts",
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/industry-corporate-gifts.webp",
    title: "Collector Presence",
    description: "Turn limited editions, executive gifts, and commemorative launches into products that feel engineered rather than promotional.",
  },
  {
    accent: "201 204 255",
    caption: "Brand Activations",
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/industry-brand-activations.webp",
    title: "Launch Drama",
    description: "Give campaigns and showroom moments a controlled kinetic focal point that supports product storytelling.",
  },
  {
    accent: "255 196 228",
    caption: "Exhibitions",
    imagePosition: "center center",
    imageSrc: "/images/oem/optimized/industry-exhibitions.webp",
    title: "Booth Signature",
    description: "Draw attention in crowded halls with floating presentation that feels precise, spatial, and intentionally quiet.",
  },
] as const;

const developmentCapabilityImage = "/images/oem/optimized/development-capability.webp" as const;
const heroImage = "/images/oem/optimized/oem-hero.webp" as const;

function useLoopingIndex(length: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    startTransition(() => {
      setActiveIndex(((index % length) + length) % length);
    });
  };

  const goNext = () => {
    startTransition(() => {
      setActiveIndex((current) => (current + 1) % length);
    });
  };

  const goPrevious = () => {
    startTransition(() => {
      setActiveIndex((current) => (current - 1 + length) % length);
    });
  };

  return { activeIndex, goNext, goPrevious, goTo };
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4.5 10h10" />
      <path d="m10 4.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

function ChevronIcon({
  direction,
}: {
  direction: "next" | "previous";
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("h-4 w-4", direction === "next" ? "rotate-180" : "")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
    </svg>
  );
}

function CarouselButton({
  dark = false,
  direction,
  onClick,
}: {
  dark?: boolean;
  direction: "next" | "previous";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous item" : "Next item"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300",
        dark
          ? "border-white/14 bg-white/[0.06] text-white hover:border-white/24 hover:bg-white/[0.1]"
          : "border-black/10 bg-white text-black hover:border-black/18 hover:bg-black/[0.04]",
      )}
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

function CarouselDots({
  activeIndex,
  count,
  dark = false,
  onSelect,
}: {
  activeIndex: number;
  count: number;
  dark?: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Go to item ${index + 1}`}
          aria-pressed={index === activeIndex}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === activeIndex ? "w-8" : "w-2",
            dark
              ? index === activeIndex
                ? "bg-white"
                : "bg-white/28 hover:bg-white/44"
              : index === activeIndex
                ? "bg-black"
                : "bg-black/18 hover:bg-black/32",
          )}
        />
      ))}
    </div>
  );
}

function StepCounter({
  activeIndex,
  count,
  dark = false,
}: {
  activeIndex: number;
  count: number;
  dark?: boolean;
}) {
  return (
    <p className={cn("text-[11px] uppercase tracking-[0.28em]", dark ? "text-white/42" : "text-black/34")}>
      {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
    </p>
  );
}

function CinematicBackgroundImage({
  alt,
  objectPosition = "center center",
  priority = false,
  src,
}: {
  alt: string;
  objectPosition?: string;
  priority?: boolean;
  src: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      unoptimized
      className="h-full w-full object-cover"
      style={{ objectPosition }}
    />
  );
}

function DevelopmentCapabilityScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CinematicBackgroundImage alt="Exploded magnetic levitation system" src={developmentCapabilityImage} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,4,0.48)_0%,rgba(2,3,4,0.18)_34%,rgba(2,3,4,0.72)_100%)]" />
    </div>
  );
}

function DevelopmentCapabilityGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      {index === 0 ? (
        <>
          <circle cx="12" cy="12" r="6.5" />
          <path d="M4 12h4" />
          <path d="M16 12h4" />
        </>
      ) : null}
      {index === 1 ? (
        <>
          <rect x="6.5" y="6.5" width="11" height="11" rx="1.8" />
          <path d="M12 3.5v3" />
          <path d="M12 17.5v3" />
          <path d="M3.5 12h3" />
          <path d="M17.5 12h3" />
        </>
      ) : null}
      {index === 2 ? (
        <>
          <path d="M6 8h12" />
          <path d="M8 16h8" />
          <path d="M9 8v8" />
          <path d="M15 8v8" />
        </>
      ) : null}
      {index === 3 ? (
        <>
          <path d="m7 17 8-8" />
          <path d="m13 7 4 4" />
          <path d="M6 18h4" />
        </>
      ) : null}
    </svg>
  );
}

function DevelopmentCapabilityLegend() {
  return (
    <div className="relative mx-auto mt-10 max-w-5xl pt-8">
      <div className="absolute left-[10%] right-[10%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {developmentLabels.map((label, index) => (
          <div
            key={label}
            className="relative flex flex-col items-center gap-3 text-center before:absolute before:-top-8 before:left-1/2 before:h-8 before:w-px before:-translate-x-1/2 before:bg-gradient-to-b before:from-cyan-100/26 before:to-transparent"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72">
              <DevelopmentCapabilityGlyph index={index} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-white/56">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessStepIcon({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 transition duration-300", active ? "text-black" : "text-black/46")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {index === 0 ? (
        <>
          <path d="M7 6.5h10" />
          <path d="M7 11.5h7" />
          <path d="M7 16.5h6" />
          <path d="M5.5 4.5h13v15h-13z" />
        </>
      ) : null}
      {index === 1 ? (
        <>
          <path d="M6 6h12v6H6z" />
          <path d="M9 15h9v3H9z" />
          <path d="M6 12v6" />
        </>
      ) : null}
      {index === 2 ? (
        <>
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="12" cy="16" r="2" />
          <path d="M10 9.5 11 14" />
          <path d="M14 9.5 13 14" />
          <path d="M10 8h4" />
        </>
      ) : null}
      {index === 3 ? (
        <>
          <path d="m12 5 6 3.5v7L12 19l-6-3.5v-7z" />
          <path d="m12 5 6 3.5" />
          <path d="M12 12v7" />
          <path d="m6 8.5 6 3.5 6-3.5" />
        </>
      ) : null}
      {index === 4 ? (
        <>
          <path d="M6 18h12" />
          <path d="M8 15h8" />
          <path d="M10 11h4" />
          <path d="M12 6v5" />
        </>
      ) : null}
      {index === 5 ? (
        <>
          <path d="M5 8h14" />
          <path d="M5 12h14" />
          <path d="M7 16h10" />
          <path d="M7 6v10" />
          <path d="M17 6v10" />
        </>
      ) : null}
      {index === 6 ? (
        <>
          <path d="M4 12h12" />
          <path d="m12 8 4 4-4 4" />
          <path d="M18.5 6.5v11" />
        </>
      ) : null}
    </svg>
  );
}

function CustomizationScene({
  option,
}: {
  option: (typeof customizationOptions)[number];
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CinematicBackgroundImage alt={`${option.title} customization preview`} objectPosition={option.imagePosition} src={option.imageSrc} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.18)_30%,rgba(0,0,0,0.14)_64%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.08)_28%,rgba(0,0,0,0.08)_72%,rgba(0,0,0,0.3)_100%)]" />
    </div>
  );
}

function EngineeringSelector({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      {engineeringCapabilities.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={item.number}
            type="button"
            onClick={() => onSelect(index)}
            className="group flex w-full items-center gap-4 text-left"
          >
            <span className={cn("text-[11px] uppercase tracking-[0.26em] transition duration-300", isActive ? "text-black" : "text-black/28")}>
              {item.number}
            </span>
            <span className={cn("h-px flex-1 transition-all duration-300", isActive ? "bg-black" : "bg-black/14 group-hover:bg-black/26")} />
            <span className={cn("max-w-[14rem] text-[15px] transition duration-300", isActive ? "text-black" : "text-black/44 group-hover:text-black/72")}>
              {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function IndustryScene({ scenario }: { scenario: (typeof industryScenarios)[number] }) {
  return (
    <div className="absolute inset-0 overflow-hidden text-white">
      <CinematicBackgroundImage alt={`${scenario.caption} application scene`} objectPosition={scenario.imagePosition} src={scenario.imageSrc} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.44)_32%,rgba(0,0,0,0.08)_70%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  );
}

function DevelopmentCapabilitySection() {
  return (
    <section
      id="development-capability"
      data-header-theme="dark"
      className="relative overflow-hidden bg-black py-20 text-white sm:py-24 lg:h-screen lg:py-0"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-26" />
      <div className="pointer-events-none absolute inset-0">
        <DevelopmentCapabilityScene />
      </div>
      <Container className="relative z-10 lg:flex lg:h-full lg:items-center">
        <div className="mx-auto w-full max-w-5xl text-center">
          <ScrollReveal className="mx-auto max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">Development Capability</p>
            <h2 className="mt-6 text-[clamp(3rem,5vw,5.2rem)] font-medium leading-[0.94] tracking-[-0.05em] text-white">
              <span className="block">ENGINEERED</span>
              <span className="block">FOR FLOATING OBJECTS.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-7 text-white/62">
              From magnetic field control to exterior design, AMO develops complete levitation systems for real commercial applications.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={120} className="mt-12 overflow-hidden">
            <DevelopmentCapabilityLegend />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function OemProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="process" data-header-theme="light" className="relative overflow-hidden bg-white py-20 text-black sm:py-24 lg:h-screen lg:py-0">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.04]" />
      <Container className="relative z-10 lg:flex lg:h-full lg:items-center">
        <div className="w-full">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/38">OEM Process</p>
            <h2 className="mt-4 text-[clamp(3rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-black">
              <span className="block">FROM CONCEPT</span>
              <span className="block">TO PRODUCTION.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-7 text-black/62">
              The entire program path stays readable at once, while a subtle active state keeps the sequence feeling guided instead of static.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={120} className="relative mt-12 overflow-hidden">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
              {processSteps.map((step, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="relative min-w-0 text-center focus-visible:outline-none"
                    aria-pressed={isActive}
                  >
                    <div className="relative grid h-full grid-rows-[1rem_3rem_1.55rem_1fr] content-start justify-items-center gap-y-3">
                      <p className={cn("text-[10px] uppercase tracking-[0.26em] transition duration-300", isActive ? "text-black" : "text-black/38")}>
                        {step.number}
                      </p>
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-full border transition duration-300",
                          isActive ? "border-black/14 bg-black/[0.04]" : "border-black/8 bg-white",
                        )}
                      >
                        <ProcessStepIcon index={index} active={isActive} />
                      </span>
                      <h3
                        className={cn(
                          "flex h-full items-center justify-center whitespace-nowrap text-[0.92rem] font-medium leading-none tracking-[-0.03em] transition duration-300 xl:text-[0.98rem]",
                          isActive ? "text-black" : "text-black/72",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "mx-auto max-w-[15ch] text-[11.5px] leading-5 transition duration-300",
                          isActive ? "text-black/64" : "text-black/44",
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function CustomizationOptionsSection() {
  const { activeIndex, goNext, goPrevious, goTo } = useLoopingIndex(customizationOptions.length);
  const activeOption = customizationOptions[activeIndex] ?? customizationOptions[0];
  const isProductShape = activeOption.visual === "shape";

  return (
    <section
      id="customization-options"
      data-header-theme="dark"
      className="relative overflow-hidden bg-black py-20 text-white sm:py-24 lg:h-screen lg:py-0"
    >
      <CustomizationScene option={activeOption} />
      <Container className="relative z-10 lg:flex lg:h-full lg:flex-col lg:justify-center">
        <ScrollReveal className="relative min-h-[34rem] w-full overflow-hidden lg:h-full">
          <div className="absolute inset-x-6 top-8 z-10 text-center sm:inset-x-10 sm:top-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">Customization Options</p>
            <h2 className="mx-auto mt-4 max-w-[22ch] text-[clamp(2.5rem,4.6vw,4.6rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white">
              EVERY ELEMENT CAN BE CUSTOMIZED.
            </h2>
            <div className="mt-5 flex items-center justify-center gap-3">
              <CarouselButton dark direction="previous" onClick={goPrevious} />
              <CarouselButton dark direction="next" onClick={goNext} />
            </div>
          </div>

          <div className="absolute inset-x-6 bottom-20 z-10 text-center sm:inset-x-10 sm:bottom-24">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{activeOption.indexLabel}</p>
            <h3
              className={cn(
                "mx-auto mt-4 font-medium leading-[0.98] tracking-[-0.05em] text-white",
                isProductShape ? "max-w-[14ch] text-[clamp(1.6rem,2.7vw,2.5rem)]" : "max-w-[15ch] text-[clamp(2.1rem,3.5vw,3.35rem)]",
              )}
            >
              {activeOption.title}
            </h3>
            <p
              className={cn(
                "mx-auto mt-3 max-w-[24rem] text-white/62",
                isProductShape ? "text-[12px] leading-5" : "max-w-[26rem] text-[13px] leading-6 sm:text-[14px]",
              )}
            >
              {activeOption.description}
            </p>
          </div>

          <div className="absolute inset-x-6 bottom-7 z-10 flex justify-center sm:inset-x-10">
            <CarouselDots dark activeIndex={activeIndex} count={customizationOptions.length} onSelect={goTo} />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function EngineeringCapabilitySection() {
  const { activeIndex, goNext, goPrevious, goTo } = useLoopingIndex(engineeringCapabilities.length);
  const activeCapability = engineeringCapabilities[activeIndex] ?? engineeringCapabilities[0];

  return (
    <section id="engineering-capability" data-header-theme="light" className="relative overflow-hidden bg-[#f7f6f2] py-20 text-black sm:py-24 lg:h-screen lg:py-0">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-28" />
      <div className="absolute inset-x-[12%] top-[18%] h-px bg-gradient-to-r from-transparent via-black/18 to-transparent" />
      <div className="absolute inset-x-[18%] bottom-[22%] h-px bg-gradient-to-r from-transparent via-black/16 to-transparent" />
      <Container className="relative z-10 lg:flex lg:h-full lg:items-center">
        <div className="grid w-full gap-12 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <ScrollReveal className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/38">Engineering Capability</p>
            <p className="mt-8 text-[4.8rem] font-medium leading-none tracking-[-0.08em] text-black/12">{activeCapability.number}</p>
            <h2 className="mt-4 text-[clamp(3rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-black">
              <span className="block">BUILT FOR</span>
              <span className="block">COMMERCIAL USE.</span>
            </h2>
            <h3 className="mt-8 max-w-[14ch] text-[clamp(2rem,3.8vw,4rem)] font-medium leading-[0.96] tracking-[-0.05em] text-black">
              {activeCapability.title}
            </h3>
            <p className="mt-6 max-w-xl text-[16px] leading-8 text-black/64">{activeCapability.description}</p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CarouselButton direction="previous" onClick={goPrevious} />
              <CarouselButton direction="next" onClick={goNext} />
              <StepCounter activeIndex={activeIndex} count={engineeringCapabilities.length} />
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120} className="w-full">
            <EngineeringSelector activeIndex={activeIndex} onSelect={goTo} />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function IndustriesApplicationsSection() {
  const { activeIndex, goNext, goPrevious, goTo } = useLoopingIndex(industryScenarios.length);
  const activeScenario = industryScenarios[activeIndex] ?? industryScenarios[0];

  return (
    <section id="industries" data-header-theme="dark" className="relative min-h-[42rem] overflow-hidden bg-black text-white lg:h-screen">
      <IndustryScene scenario={activeScenario} />
      <Container className="relative z-10 min-h-[42rem] py-8 sm:py-10 lg:h-full lg:py-12">
        <ScrollReveal className="absolute left-4 top-8 max-w-sm sm:left-6 lg:left-8 lg:top-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">Industries & Applications</p>
        </ScrollReveal>

        <div className="flex min-h-[42rem] items-center lg:h-full">
          <ScrollReveal delayMs={120} className="max-w-sm lg:-translate-y-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/52">{activeScenario.title}</p>
            <h2 className="mt-4 text-[clamp(2.9rem,5.8vw,6.2rem)] font-medium leading-[0.9] tracking-[-0.06em] text-white">
              {activeScenario.caption}
            </h2>
            <p className="mt-5 max-w-[20rem] text-[13px] leading-6 text-white/64 sm:text-[14px]">{activeScenario.description}</p>

            <div className="mt-8 flex items-center gap-3">
              <CarouselButton dark direction="previous" onClick={goPrevious} />
              <CarouselButton dark direction="next" onClick={goNext} />
            </div>
            <div className="mt-5">
              <CarouselDots dark activeIndex={activeIndex} count={industryScenarios.length} onSelect={goTo} />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" data-header-theme="light" className="relative bg-white py-20 text-black sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-22" />
      <Container className="relative z-10">
        <ScrollReveal className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-black/38">FAQ</p>
          <h2 className="mt-6 text-[clamp(2.8rem,4.8vw,4.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-black">
            Questions before the project brief becomes real.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-black/62">
            The commercial conversation usually starts with engineering risk, branding flexibility, and how early the system should be defined.
          </p>
        </ScrollReveal>

        <div className="mt-12 divide-y divide-black/8 rounded-[2.2rem] border border-black/8 bg-[#fafaf8] px-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:px-8">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="py-6 sm:py-7">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-start justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-5">
                    <span className="mt-1 text-[11px] uppercase tracking-[0.26em] text-black/34">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-3xl text-[1.55rem] font-medium leading-[1.15] tracking-[-0.04em] text-black sm:text-[1.9rem]">
                      {item.question}
                    </span>
                  </div>
                  <span className="relative mt-1 block h-6 w-6 shrink-0">
                    <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-black transition" />
                    <span
                      className={cn(
                        "absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-black transition",
                        isOpen ? "opacity-0" : "opacity-100",
                      )}
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden pl-[2.3rem]">
                    <p className="max-w-3xl text-[15px] leading-7 text-black/62">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function OemOdmPageExperience({ faqs }: { faqs: FaqItem[] }) {
  return (
    <>
      <section
        data-header-theme="dark"
        className="relative flex min-h-screen items-center overflow-hidden bg-black text-white"
        aria-labelledby="oem-hero-title"
      >
        <div className="absolute inset-0 overflow-hidden">
          <CinematicBackgroundImage alt="Dark levitation hero product" objectPosition="center right" priority src={heroImage} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.62)_34%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0.36)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.52)_100%)]" />
        </div>

        <Container className="relative z-10 flex min-h-screen items-center py-28 sm:py-32">
          <div className="w-full">
            <ScrollReveal className="max-w-3xl">
              <p className="text-[12px] uppercase tracking-[0.32em] text-white/44">OEM & ODM</p>
              <h1
                id="oem-hero-title"
                className="mt-7 text-[clamp(3.6rem,10vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em] text-white text-shadow-premium"
              >
                <span className="block">FROM IDEA</span>
                <span className="block">TO LEVITATION.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] leading-[1.7] text-white/68 sm:text-[20px]">
                OEM & ODM solutions for magnetic levitation products, custom displays, and branded floating experiences.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/rfq" className={buttonStyles({ size: "lg" })}>
                  Start Your Project
                  <ArrowIcon />
                </Link>
                <Link href="#development-capability" className={buttonStyles({ size: "lg", variant: "secondary" })}>
                  View Capabilities
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section data-header-theme="light" className="relative flex min-h-screen items-center overflow-hidden bg-white text-black">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.04]" />
        <Container className="relative z-10 py-20 sm:py-24">
          <ScrollReveal
            className="mx-auto max-w-5xl text-center"
            hiddenClassName="translate-y-6 opacity-0"
            visibleClassName="translate-y-0 opacity-100"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/38">Why OEM With AMO</p>
            <h2 className="mt-6 text-[clamp(3rem,6vw,5.7rem)] font-medium leading-[0.94] tracking-[-0.05em] text-black">
              <span className="block">NOT JUST MANUFACTURING.</span>
              <span className="block">PRODUCT DEVELOPMENT.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-[16px] leading-8 text-black/62 sm:text-[18px]">
              AMO works with brands, distributors, and design studios to transform magnetic levitation technology into commercially ready products.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyStats.map((item, index) => (
              <ScrollReveal
                key={item.label}
                delayMs={index * 80}
                className="rounded-[2rem] border border-black/8 bg-[#fafaf8] px-6 py-7 shadow-[0_20px_70px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[10px] uppercase tracking-[0.26em] text-black/38">{item.label}</p>
                <p className="mt-6 text-[3rem] font-medium leading-none tracking-[-0.06em] text-black">{item.value}</p>
                <p className="mt-5 text-[14px] leading-6 text-black/58">{item.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <DevelopmentCapabilitySection />
      <OemProcessSection />
      <CustomizationOptionsSection />
      <EngineeringCapabilitySection />
      <IndustriesApplicationsSection />
      <FaqAccordion items={faqs} />
      <ApprovedHomeFooter />
    </>
  );
}
