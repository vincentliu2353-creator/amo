"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

import {
  applicationCaseImages,
  comparisonCaseImages,
  featuredCaseImage,
  spaceCaseImages,
  type CaseImageAsset,
} from "@/components/cases/case-image-assets";
import { CaseStageVisual } from "@/components/cases/case-stage-visual";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface FeaturedCaseDetail {
  label: string;
  value: string;
}

interface ApplicationCase {
  blurb: string;
  details: string;
  image: CaseImageAsset;
  label: string;
  title: string;
}

interface SpaceScenario {
  copy: string;
  image: CaseImageAsset;
  title: string;
}

const featuredCase = {
  description:
    "Instead of placing the product on a standard shelf, the object is suspended above a minimal magnetic base, creating a visual pause point that attracts attention from across the space.",
  details: [
    { label: "Application", value: "Retail Flagship Store" },
    { label: "Use Case", value: "Hero Product Display" },
    { label: "Product Type", value: "Custom Maglev Display Base" },
    { label: "Effect", value: "Increased dwell time and product focus" },
  ] satisfies FeaturedCaseDetail[],
  image: featuredCaseImage,
  title: "LUXURY RETAIL DISPLAY",
};

const selectedApplications = [
  {
    label: "Case 01",
    title: "RETAIL FLAGSHIP",
    blurb: "Floating product display for premium shelves, launch areas, and window installations.",
    details: "Best for: luxury retail, electronics, jewelry, fragrance, design objects",
    image: applicationCaseImages.retail,
  },
  {
    label: "Case 02",
    title: "MUSEUM INSTALLATION",
    blurb: "Suspended artifacts and symbolic objects presented as quiet, weightless focal points.",
    details: "Best for: museums, galleries, cultural exhibitions, science centers",
    image: applicationCaseImages.museum,
  },
  {
    label: "Case 03",
    title: "HOTEL LOBBY",
    blurb: "Floating sculptural objects used as ambient centerpieces for high-end hospitality spaces.",
    details: "Best for: hotels, resorts, clubs, reception areas",
    image: applicationCaseImages.hotel,
  },
  {
    label: "Case 04",
    title: "EXHIBITION BOOTH",
    blurb: "Magnetic levitation creates strong visual attraction in crowded trade show environments.",
    details: "Best for: exhibitions, product launches, brand events, showrooms",
    image: applicationCaseImages.exhibition,
  },
  {
    label: "Case 05",
    title: "OFFICE & MEETING SPACE",
    blurb: "Floating clocks, lamps, or art objects bring a futuristic atmosphere into executive interiors.",
    details: "Best for: headquarters, meeting rooms, VIP lounges, design studios",
    image: applicationCaseImages.office,
  },
  {
    label: "Case 06",
    title: "PREMIUM GIFTS",
    blurb: "Customized floating products for corporate gifts, limited editions, and brand campaigns.",
    details: "Best for: corporate gifting, distributor programs, brand collaborations",
    image: applicationCaseImages.gifting,
  },
] satisfies ApplicationCase[];

const spaceScenarios = [
  {
    title: "Retail Stores",
    copy: "Create a premium focus point for hero products and limited-edition displays.",
    image: spaceCaseImages.retail,
  },
  {
    title: "Museums",
    copy: "Present objects with a sense of silence, distance, and importance.",
    image: spaceCaseImages.museum,
  },
  {
    title: "Hotels",
    copy: "Introduce futuristic atmosphere into lobbies, lounges, and premium suites.",
    image: spaceCaseImages.hotel,
  },
  {
    title: "Offices",
    copy: "Add a calm technological identity to executive and creative environments.",
    image: spaceCaseImages.office,
  },
  {
    title: "Exhibitions",
    copy: "Help visitors stop, look, and remember your product in a crowded environment.",
    image: spaceCaseImages.exhibition,
  },
  {
    title: "Premium Gifts",
    copy: "Turn branded gifts into collectible objects with visual impact.",
    image: spaceCaseImages.gifting,
  },
] satisfies SpaceScenario[];

const timelineSteps = [
  {
    title: "Strategy",
    description: "Define the object, space, audience, and commercial objective.",
  },
  {
    title: "Product Matching",
    description: "Select the correct levitation system, load capacity, rotation behavior, and base form.",
  },
  {
    title: "Visual Design",
    description: "Develop the product appearance, materials, lighting, and brand details.",
  },
  {
    title: "Prototype",
    description: "Build and test the first working sample for levitation stability and visual effect.",
  },
  {
    title: "Production",
    description: "Prepare tooling, packaging, QC standards, and production schedule.",
  },
  {
    title: "Delivery",
    description: "Support bulk delivery for retail, exhibitions, gifting, or installation projects.",
  },
] as const;

const impactStats = [
  { value: "30+", label: "Application Scenarios" },
  { value: "100+", label: "Custom Project Concepts" },
  { value: "360° / 720°", label: "Rotation Options" },
  { value: "B2B", label: "OEM & ODM Support" },
] as const;

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/oem-odm", label: "OEM & ODM" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

function ArrowButton({
  dark = false,
  direction,
  onClick,
}: {
  dark?: boolean;
  direction: "previous" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous" : "Next"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300",
        dark
          ? "border-white/12 bg-white/[0.06] text-white hover:border-white/24 hover:bg-white/[0.1]"
          : "border-black/10 bg-white text-black hover:border-black/18 hover:bg-black/[0.04]",
      )}
    >
      <svg
        viewBox="0 0 20 20"
        className={cn("h-4 w-4", direction === "next" ? "rotate-180" : "")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
      </svg>
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4.5 10h10" />
      <path d="m10 4.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

function ProgressDots({
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
                : "bg-black/18 hover:bg-black/30",
          )}
        />
      ))}
    </div>
  );
}

function MetaRow({ label, value }: FeaturedCaseDetail) {
  return (
    <div className="flex items-start justify-between gap-5 border-t border-black/8 py-3 text-[14px] leading-6">
      <span className="text-black/42">{label}</span>
      <span className="max-w-[15rem] text-right text-black">{value}</span>
    </div>
  );
}

function TimelineCard({
  description,
  index,
  title,
}: {
  description: string;
  index: number;
  title: string;
}) {
  return (
    <article className="relative rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <h3 className="mt-5 font-sans text-[24px] font-medium leading-[1.02] tracking-[-0.04em] text-white">{title}</h3>
      <p className="mt-4 text-[14px] leading-6 text-white/62">{description}</p>
    </article>
  );
}

export function CasesPageExperience() {
  const [heroProgress, setHeroProgress] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioDirection, setScenarioDirection] = useState<-1 | 0 | 1>(0);
  const [timelineIndex, setTimelineIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const syncHero = () => {
      frame = 0;
      const nextProgress = Math.min(1, Math.max(0, window.scrollY / 280));
      setHeroProgress((current) => (Math.abs(current - nextProgress) > 0.01 ? nextProgress : current));
    };

    const requestSync = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(syncHero);
    };

    syncHero();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  const heroOpacity = Math.max(0.48, 1 - heroProgress * 0.42);
  const heroBlur = heroProgress * 8;
  const heroTranslate = heroProgress * -28;
  const activeCase = selectedApplications[caseIndex];
  const activeScenario = spaceScenarios[scenarioIndex];
  const mobileTimeline = timelineSteps[timelineIndex];

  function goToCase(index: number) {
    startTransition(() => {
      setCaseIndex(index);
    });
  }

  function goToScenario(index: number) {
    if (index === scenarioIndex) {
      return;
    }

    const previousIndex = (scenarioIndex - 1 + spaceScenarios.length) % spaceScenarios.length;
    const nextIndex = (scenarioIndex + 1) % spaceScenarios.length;
    const direction = index === previousIndex ? -1 : index === nextIndex ? 1 : index > scenarioIndex ? 1 : -1;

    startTransition(() => {
      setScenarioDirection(direction);
      setScenarioIndex(index);
    });
  }

  function goToTimeline(index: number) {
    startTransition(() => {
      setTimelineIndex(index);
    });
  }

  return (
    <div className="overflow-x-hidden bg-white text-black">
      <section data-header-theme="light" className="relative min-h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(223,229,234,0.72),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7f7f3_100%)]" />
        <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          <div
            className="max-w-5xl"
            style={{
              opacity: heroOpacity,
              filter: `blur(${heroBlur}px)`,
              transform: `translate3d(0, ${heroTranslate}px, 0) scale(${1 - heroProgress * 0.016})`,
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-black/42 sm:text-[12px]">CASES</p>
            <h1 className="mt-6 font-sans text-[clamp(3.2rem,8.2vw,7.2rem)] font-medium leading-[0.9] tracking-[-0.08em] text-black">
              <span className="block">FLOATING EXPERIENCES.</span>
              <span className="mt-2 block">BUILT FOR REAL SPACES.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[16px] leading-7 text-black/62 sm:text-[18px]">
              Magnetic levitation transforms products, objects, and brand moments into spatial experiences for retail,
              hospitality, exhibitions, offices, and premium gifting.
            </p>
          </div>

          <p
            className="absolute bottom-12 text-[10px] font-medium uppercase tracking-[0.28em] text-black/40 sm:text-[11px]"
            style={{ opacity: Math.max(0.26, 1 - heroProgress * 0.62) }}
          >
            SCROLL TO EXPLORE
          </p>
        </Container>
      </section>

      <section data-header-theme="light" className="flex min-h-screen items-center bg-white py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-14">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">01 / FEATURED CASE</p>
            <h2 className="mt-6 font-sans text-[clamp(2.6rem,5.2vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.07em] text-black">
              {featuredCase.title}
            </h2>
            <p className="mt-6 text-[15px] leading-7 text-black/58 sm:text-[16px]">{featuredCase.description}</p>

            <div className="mt-8 rounded-[28px] border border-black/8 bg-[#fafaf7] px-5 py-3 sm:px-6">
              {featuredCase.details.map((item) => (
                <MetaRow key={item.label} {...item} />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/rfq"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black bg-black px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition duration-300 hover:bg-black/88 sm:text-[11px]"
              >
                <span>Request Similar Solution</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <CaseStageVisual
            className="min-h-[24rem] sm:min-h-[30rem] lg:min-h-[42rem]"
            captionMode="plain"
            detail="Placeholder media for a silent floating hero product inside a luxury retail setting."
            image={featuredCase.image}
            imageFit="cover"
            label="Application Placeholder"
            priority
            quality={92}
            sizes="(max-width: 1024px) 100vw, 54vw"
            theme="dark"
            title="Premium retail centerpiece"
          />
        </Container>
      </section>

      <section data-header-theme="light" className="flex min-h-screen items-center overflow-hidden bg-white py-16 sm:py-20">
        <Container className="w-full">
          <div className="flex min-h-[calc(100svh-9rem)] flex-col justify-center">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">SELECTED APPLICATIONS</p>
                <h2 className="mt-5 font-sans text-[clamp(2.4rem,4.8vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-black">
                  One environment at a time.
                </h2>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <ArrowButton direction="previous" onClick={() => goToCase((caseIndex - 1 + selectedApplications.length) % selectedApplications.length)} />
                <ArrowButton direction="next" onClick={() => goToCase((caseIndex + 1) % selectedApplications.length)} />
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[34px] border border-black/8 bg-[#f8f8f4] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <article
                key={activeCase.title}
                className="grid min-h-[34rem] items-center gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:p-10"
              >
                <div className="max-w-2xl">
                  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-black/38">{activeCase.label}</p>
                  <h3 className="mt-5 font-sans text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.06em] text-black">
                    {activeCase.title}
                  </h3>
                  <p className="mt-5 text-[15px] leading-7 text-black/60">{activeCase.blurb}</p>

                  <div className="mt-7 rounded-[26px] border border-black/8 bg-white/84 px-5 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/38">Details</p>
                    <p className="mt-3 text-[14px] leading-6 text-black/60">{activeCase.details}</p>
                  </div>
                </div>

                <CaseStageVisual
                  key={activeCase.image.src}
                  className="min-h-[20rem] sm:min-h-[24rem] lg:min-h-[31rem]"
                  captionMode="plain"
                  detail="Placeholder media for the current application environment."
                  image={activeCase.image}
                  imageFit="cover"
                  label="Case Environment"
                  loading="eager"
                  priority
                  quality={88}
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  theme="dark"
                  title={activeCase.title}
                  unoptimized
                />
              </article>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <ArrowButton direction="previous" onClick={() => goToCase((caseIndex - 1 + selectedApplications.length) % selectedApplications.length)} />
                <ArrowButton direction="next" onClick={() => goToCase((caseIndex + 1) % selectedApplications.length)} />
              </div>

              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/40">
                {String(caseIndex + 1).padStart(2, "0")} / {String(selectedApplications.length).padStart(2, "0")}
              </p>

              <ProgressDots activeIndex={caseIndex} count={selectedApplications.length} onSelect={goToCase} />
            </div>
          </div>
        </Container>
      </section>

      <section data-header-theme="light" className="flex min-h-screen items-center bg-[#f5f5f1] py-16 sm:py-20">
        <Container className="w-full">
          <div className="flex min-h-[calc(100svh-9rem)] flex-col justify-center">
            <div className="max-w-3xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">BEFORE / AFTER</p>
              <h2 className="mt-5 font-sans text-[clamp(2.5rem,4.8vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-black">
                OBJECTS BECOME EXPERIENCES.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/58">
                Magnetic levitation changes how people notice, approach, and remember a product. It creates a moment of
                curiosity before the message is even explained.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <CaseStageVisual
                captionMode="plain"
                className="min-h-[24rem] sm:min-h-[30rem] lg:min-h-[38rem]"
                detail="Static. Familiar. Easy to ignore."
                image={comparisonCaseImages.before}
                imageFit="cover"
                label="BEFORE"
                loading="lazy"
                quality={92}
                sizes="(max-width: 1024px) 100vw, 50vw"
                theme="dark"
                title="A product placed on a normal surface."
              />

              <CaseStageVisual
                captionMode="plain"
                className="min-h-[24rem] sm:min-h-[30rem] lg:min-h-[38rem]"
                detail="Unexpected. Memorable. Spatial."
                image={comparisonCaseImages.after}
                imageFit="cover"
                label="AFTER"
                loading="lazy"
                quality={92}
                sizes="(max-width: 1024px) 100vw, 50vw"
                theme="dark"
                title="A product floating silently above its base."
              />
            </div>
          </div>
        </Container>
      </section>

      <section data-header-theme="dark" className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div
            key={`${activeScenario.image.src}-${scenarioIndex}-${scenarioDirection}`}
            className="absolute inset-[-8%] will-change-transform"
            style={{
              animation:
                scenarioDirection === 0
                  ? undefined
                  : `${scenarioDirection > 0 ? "cases-scenario-slide-next" : "cases-scenario-slide-previous"} 650ms cubic-bezier(0.22,1,0.36,1) both`,
            }}
          >
            <Image
              src={activeScenario.image.src}
              alt={activeScenario.image.alt}
              fill
              quality={90}
              sizes="100vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={activeScenario.image.blurDataURL}
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.44)_38%,rgba(0,0,0,0.2)_100%)]" />

        <Container className="relative z-10">
          <div className="flex min-h-screen items-center">
            <div className="w-full">
              <div className="max-w-[38rem]">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white">
                  DESIGNED FOR SPACES THAT NEED ATTENTION.
                </p>
                <h2 className="mt-6 max-w-[12ch] font-sans text-[clamp(2.8rem,5.4vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
                  {`0${scenarioIndex + 1} ${activeScenario.title}`}
                </h2>
                <p className="mt-6 max-w-[28rem] text-[16px] leading-7 text-white sm:text-[18px] sm:leading-8">{activeScenario.copy}</p>

                <div className="mt-10 max-w-[28rem] border-t border-white/12 pt-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white">Space Note</p>
                  <p className="mt-3 text-[14px] leading-6 text-white">
                    Magnetic levitation creates a visual pause point that makes the object feel more deliberate than a
                    normal display surface can.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <ArrowButton dark direction="previous" onClick={() => goToScenario((scenarioIndex - 1 + spaceScenarios.length) % spaceScenarios.length)} />
                  <ArrowButton dark direction="next" onClick={() => goToScenario((scenarioIndex + 1) % spaceScenarios.length)} />
                </div>
              </div>
            </div>
          </div>
        </Container>

        <style jsx>{`
          @keyframes cases-scenario-slide-next {
            0% {
              opacity: 0.55;
              transform: translate3d(5%, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes cases-scenario-slide-previous {
            0% {
              opacity: 0.55;
              transform: translate3d(-5%, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
        `}</style>
      </section>

      <section data-header-theme="dark" className="flex min-h-screen items-center bg-black py-16 text-white sm:py-20">
        <Container className="w-full">
          <div className="flex min-h-[calc(100svh-9rem)] flex-col justify-center">
            <div className="max-w-3xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">OEM PROJECT TIMELINE</p>
              <h2 className="mt-5 font-sans text-[clamp(2.4rem,4.8vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-white">
                FROM CASE IDEA TO FLOATING INSTALLATION.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/62">
                AMO supports brands, distributors, and design studios from early concept to commercial delivery.
              </p>
            </div>

            <div className="relative mt-10 hidden md:block">
              <div aria-hidden className="absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
              <div className="grid gap-4 lg:grid-cols-6">
                {timelineSteps.map((step, index) => (
                  <TimelineCard key={step.title} description={step.description} index={index} title={step.title} />
                ))}
              </div>
            </div>

            <div className="mt-10 md:hidden">
              <TimelineCard description={mobileTimeline.description} index={timelineIndex} title={mobileTimeline.title} />
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ArrowButton dark direction="previous" onClick={() => goToTimeline((timelineIndex - 1 + timelineSteps.length) % timelineSteps.length)} />
                  <ArrowButton dark direction="next" onClick={() => goToTimeline((timelineIndex + 1) % timelineSteps.length)} />
                </div>
                <ProgressDots activeIndex={timelineIndex} count={timelineSteps.length} dark onSelect={goToTimeline} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section data-header-theme="light" className="flex min-h-screen items-center bg-white py-16 sm:py-20">
        <Container className="w-full">
          <div className="flex min-h-[calc(100svh-9rem)] flex-col justify-center">
            <div className="max-w-3xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">GLOBAL IMPACT</p>
              <h2 className="mt-5 font-sans text-[clamp(2.5rem,4.8vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-black">
                BUILT FOR COMMERCIAL USE.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/58">
                From single hero displays to full product development programs, AMO helps businesses create memorable
                floating experiences.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {impactStats.map((stat) => (
                <article key={stat.label} className="rounded-[34px] border border-black/8 bg-[#fafaf7] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
                  <p className="font-sans text-[clamp(2.8rem,6vw,5.2rem)] font-medium leading-none tracking-[-0.08em] text-black">
                    {stat.value}
                  </p>
                  <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.26em] text-black/40">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section data-header-theme="dark" className="flex min-h-screen items-center bg-black py-16 text-white sm:py-20">
        <Container className="w-full">
          <div className="flex min-h-[calc(100svh-9rem)] flex-col items-center justify-center text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/42">FINAL CTA</p>
            <h2 className="mt-6 font-sans text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.07em] text-white">
              LET YOUR PRODUCT FLOAT.
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-7 text-white/64 sm:text-[16px]">
              Create a magnetic levitation experience for your next retail space, exhibition, hotel project, or custom
              product launch.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/rfq"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white bg-white px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black transition duration-300 hover:bg-white/88 sm:text-[11px]"
              >
                <span>Request Quote</span>
                <ArrowIcon />
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition duration-300 hover:border-white/24 hover:bg-white/[0.08] sm:text-[11px]"
              >
                <span>View Products</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
