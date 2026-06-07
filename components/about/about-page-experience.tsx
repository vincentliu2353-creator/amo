"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useRef, useState } from "react";

import { AboutReveal, useVisibilityRatio } from "@/components/about/about-reveal";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const realityLines = ["Everything around us", "sits still.", "We asked:", "What if it didn't?"] as const;

const timelineItems = [
  {
    year: "2010",
    body: "The first magnetic levitation experiments began as a search for visual weightlessness.",
  },
  {
    year: "2014",
    body: "Early prototypes explored how objects could remain stable, silent, and visually balanced.",
  },
  {
    year: "2018",
    body: "AMO developed its first product-ready levitation structure for display objects.",
  },
  {
    year: "2020",
    body: "Custom commercial projects introduced levitation into retail, gifting, and branded spaces.",
  },
  {
    year: "2022",
    body: "The platform expanded into clocks, lamps, display art, and OEM magnetic modules.",
  },
  {
    year: "NOW",
    body: "AMO works with global brands, studios, and distributors to create floating product experiences.",
  },
  {
    year: "FUTURE",
    body: "We imagine objects that no longer simply occupy space, but interact with it.",
  },
] as const;

const macroPanels = [
  {
    title: "Metal Surface",
    src: "/images/about/about-ch04-metal-surface.webp",
    alt: "Macro view of a refined metal surface with a dark industrial finish",
  },
  {
    title: "Precision Edge",
    src: "/images/about/about-ch04-precision-edge.webp",
    alt: "Close-up of a precise industrial edge with crisp machining detail",
  },
  {
    title: "Magnetic Pattern",
    src: "/images/about/about-ch04-magnetic-pattern.webp",
    alt: "Detailed magnetic pattern texture captured in a dark macro composition",
  },
  {
    title: "Light Reflection",
    src: "/images/about/about-ch04-light-reflection.webp",
    alt: "Light reflecting across a dark engineered surface",
  },
] as const;

const technicalVisuals = [
  {
    title: "Magnetic Field",
    src: "/images/about/about-ch05-magnetic-field.webp",
    alt: "Diagrammatic magnetic field study used in levitation development",
  },
  {
    title: "Levitation Ring",
    src: "/images/about/about-ch05-levitation-ring.webp",
    alt: "Levitation ring component photographed against a clean technical backdrop",
  },
  {
    title: "Motion Path",
    src: "/images/about/about-ch05-motion-path.webp",
    alt: "Motion path study showing the controlled trajectory of a floating object",
  },
  {
    title: "Balance System",
    src: "/images/about/about-ch05-balance-system.webp",
    alt: "Balance system reference image for stabilizing magnetic levitation",
  },
] as const;

const futureWords = ["Object", "Display", "Experience", "Emotion"] as const;

const worldScenes = [
  {
    title: "Museum",
    copy: "Objects presented with silence, distance, and intention.",
    src: "/images/about/about-ch07-museum.webp",
    alt: "Floating display installation inside a museum-like environment",
  },
  {
    title: "Architecture",
    copy: "Floating forms embedded into spatial language.",
    src: "/images/about/about-ch07-architecture.webp",
    alt: "Architectural interior featuring a floating object presentation",
  },
  {
    title: "Retail",
    copy: "Hero presentation without shouting for attention.",
    src: "/images/about/about-ch07-retail.webp",
    alt: "Retail display scene using magnetic levitation as a focal point",
  },
  {
    title: "Hospitality",
    copy: "Atmosphere that feels expensive before it feels obvious.",
    src: "/images/about/about-ch07-hospitality.webp",
    alt: "Hospitality setting with a calm floating display experience",
  },
  {
    title: "Future Workspace",
    copy: "Calm rooms with a technological pulse.",
    src: "/images/about/about-ch07-future-workspace.webp",
    alt: "Future workspace interior with a suspended object display",
  },
] as const;

const eyebrowClass = "font-sans text-[11px] font-medium uppercase tracking-[0.3em]";
const heroHeadingClass =
  "font-sans text-[clamp(3.4rem,11vw,8.8rem)] font-medium uppercase leading-[0.9] tracking-[-0.08em]";
const sectionHeadingClass =
  "font-sans text-[clamp(2.8rem,5vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.05em]";
const lineHeadingClass =
  "font-sans text-[clamp(2rem,4vw,4.2rem)] font-medium leading-[0.95] tracking-[-0.05em]";
const bodyClass = "font-sans text-[15px] leading-7 sm:text-[16px] sm:leading-[25px]";
const bodyLargeClass = "font-sans text-[16px] leading-[26px] sm:text-[18px] sm:leading-[29px]";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function ChapterMark({ chapter, dark = false }: { chapter: string; dark?: boolean }) {
  return (
    <p className={cn(eyebrowClass, dark ? "text-white/38" : "text-black/34")}>
      Chapter {chapter}
    </p>
  );
}

function ArrowButton({
  direction,
  onClick,
  dark = false,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous" : "Next"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300",
        dark ? "border-white/14 bg-white/[0.05] text-white hover:bg-white/[0.1]" : "border-black/10 bg-white text-black hover:bg-black/[0.03]",
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

function QuestionEverythingSection() {
  const { ref, ratio } = useVisibilityRatio<HTMLElement>({ initialRatio: 1, steps: 24 });
  const visibility = clamp((ratio - 0.08) / 0.72);

  return (
    <section ref={ref} data-header-theme="light" className="relative min-h-screen bg-white py-32 text-black" aria-labelledby="about-question-title">
      <Container className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
        <div
          className="w-full text-center transition-[transform,filter,opacity] duration-300"
          style={{
            opacity: Math.max(visibility, 0.08),
            filter: `blur(${mix(0, 20, 1 - visibility)}px)`,
            transform: `translate3d(0, ${mix(0, -26, 1 - visibility)}px, 0)`,
          }}
        >
          <h1
            id="about-question-title"
            className={cn(heroHeadingClass, "text-black")}
          >
            <span className="block">WHY</span>
            <span className="block">DO THINGS</span>
            <span className="block">NEED TO FLOAT?</span>
          </h1>
        </div>
      </Container>
    </section>
  );
}

function QuestionRealitySection() {
  return (
    <section data-header-theme="dark" className="relative min-h-screen bg-black py-28 text-white sm:py-32" aria-labelledby="about-reality-title">
      <div className="absolute inset-0">
        <Image
          src="/images/about/original/about-ch02-question-reality.jpg"
          alt="Abstract floating form in a dark cinematic space"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_76%_74%,rgba(255,255,255,0.08),transparent_18%)]" />
      <Container className="relative z-10 flex min-h-[calc(100vh-14rem)] flex-col justify-center gap-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[34rem]">
          <ChapterMark chapter="02" dark />
          <h2 id="about-reality-title" className="sr-only">
            Question Reality
          </h2>
          <div className="mt-8 space-y-4">
            {realityLines.map((line, index) => (
              <AboutReveal key={line} delayMs={index * 120}>
                <p className={cn(lineHeadingClass, "text-white")}>
                  {line}
                </p>
              </AboutReveal>
            ))}
          </div>
        </div>

        <div aria-hidden className="hidden lg:block lg:h-[36rem] lg:w-[36rem]" />
      </Container>
    </section>
  );
}

function BeginningSection() {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollRail = (direction: "previous" | "next") => {
    const element = railRef.current;

    if (!element) {
      return;
    }

    const distance = element.clientWidth * 0.72;
    element.scrollBy({ left: direction === "next" ? distance : -distance, behavior: "smooth" });
  };

  return (
    <section data-header-theme="light" className="relative min-h-screen bg-white py-28 text-black sm:py-32" aria-labelledby="about-beginning-title">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <AboutReveal className="max-w-[34rem]" visibleClassName="translate-y-0 opacity-100 blur-0">
            <ChapterMark chapter="03" />
            <h2 id="about-beginning-title" className={cn(sectionHeadingClass, "mt-6 text-black")}>
              THE BEGINNING
            </h2>
            <div className={cn(bodyLargeClass, "mt-8 space-y-4 text-black/62")}>
              <p>AMO began with a simple question:</p>
              <p>Can magnetic levitation become part of everyday life?</p>
            </div>
          </AboutReveal>

          <AboutReveal className="flex items-center gap-3 self-start lg:self-auto" delayMs={120}>
            <ArrowButton direction="previous" onClick={() => scrollRail("previous")} />
            <ArrowButton direction="next" onClick={() => scrollRail("next")} />
          </AboutReveal>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-[5.35rem] hidden h-px bg-black/10 md:block" />
          <div
            ref={railRef}
            className="flex gap-8 overflow-x-auto pb-6 pr-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {timelineItems.map((item, index) => (
              <AboutReveal key={item.year} delayMs={index * 70} className="shrink-0" hiddenClassName="translate-y-10 opacity-0 blur-[14px]">
                <article className="w-[20rem] min-w-[20rem] md:w-[28rem] md:min-w-[28rem]">
                  <p className="font-sans text-[3rem] font-medium uppercase leading-none tracking-[-0.08em] text-black sm:text-[4rem] lg:text-[5rem]">
                    {item.year}
                  </p>
                  <div className="mt-3 hidden h-4 w-4 rounded-full border border-black bg-white md:block" />
                  <p className={cn(bodyClass, "mt-6 max-w-[25rem] text-black/62 sm:text-[17px]")}>{item.body}</p>
                </article>
              </AboutReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ObsessionSection() {
  return (
    <section data-header-theme="dark" className="relative min-h-screen bg-black py-28 text-white sm:py-32" aria-labelledby="about-obsession-title">
      <Container>
        <AboutReveal className="max-w-[36rem]">
          <ChapterMark chapter="04" dark />
          <h2 id="about-obsession-title" className={cn(sectionHeadingClass, "mt-6 text-white")}>
            OBSESSED
            <br />
            WITH THE DETAILS.
          </h2>
          <div className="mt-8 space-y-2 font-sans text-[1.2rem] font-medium uppercase leading-none tracking-[-0.04em] text-white/72 sm:text-[1.8rem] lg:text-[2.2rem]">
            <p>Every edge.</p>
            <p>Every reflection.</p>
            <p>Every movement.</p>
            <p>Every millimeter.</p>
            <p>Nothing is accidental.</p>
          </div>
        </AboutReveal>

        <div className="mt-14 flex flex-col gap-4 lg:flex-row">
          {macroPanels.map((panel, index) => (
            <AboutReveal key={panel.title} delayMs={index * 90} className="flex-1">
              <article className="overflow-hidden border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={panel.src}
                    alt={panel.alt}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-white/10 px-5 py-5">
                  <p className={cn(eyebrowClass, "text-white/44")}>{panel.title}</p>
                </div>
              </article>
            </AboutReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function InvisibleEngineeringSection() {
  return (
    <section data-header-theme="light" className="relative min-h-screen bg-white py-28 text-black sm:py-32" aria-labelledby="about-engineering-title">
      <Container>
        <AboutReveal className="max-w-[38rem]">
          <ChapterMark chapter="05" />
          <h2 id="about-engineering-title" className={cn(sectionHeadingClass, "mt-6 text-black")}>
            THE BEST TECHNOLOGY
            <br />
            SHOULD FEEL INVISIBLE.
          </h2>
          <div className={cn(bodyLargeClass, "mt-8 space-y-4 text-black/62")}>
            <p>The goal is not to show technology.</p>
            <p>The goal is to make people forget it exists.</p>
            <p>And simply experience the impossible.</p>
          </div>
        </AboutReveal>

        <div className="mt-14 flex flex-col gap-4 lg:flex-row">
          {technicalVisuals.map((visual, index) => (
            <AboutReveal key={visual.title} delayMs={index * 90} className="flex-1">
              <article className="overflow-hidden border border-black/8 bg-[#f7f7f4]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-black/8 px-5 py-5">
                  <p className={cn(eyebrowClass, "text-black/38")}>{visual.title}</p>
                </div>
              </article>
            </AboutReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FutureObjectsSection() {
  return (
    <section data-header-theme="dark" className="relative min-h-screen bg-black py-28 text-white sm:py-32" aria-labelledby="about-future-title">
      <Container className="flex min-h-[calc(100vh-14rem)] flex-col justify-center">
        <AboutReveal className="max-w-[34rem]">
          <ChapterMark chapter="06" dark />
          <h2 id="about-future-title" className={cn(sectionHeadingClass, "mt-6 text-white")}>
            WE DON&apos;T THINK
            <br />
            THESE ARE PRODUCTS.
          </h2>
        </AboutReveal>

        <div className="mt-14 space-y-3">
          {futureWords.map((word, index) => (
            <AboutReveal key={word} delayMs={index * 100}>
              <p className="font-sans text-[3.2rem] font-medium uppercase leading-none tracking-[-0.08em] text-white sm:text-[5rem] lg:text-[7rem]">
                {word}
              </p>
            </AboutReveal>
          ))}
        </div>

        <AboutReveal className="mt-12 max-w-[28rem]" delayMs={320}>
          <p className={cn(bodyLargeClass, "text-white/62")}>
            When an object floats,
            <br />
            it becomes something more.
          </p>
        </AboutReveal>
      </Container>
    </section>
  );
}

function WorldSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScene = worldScenes[activeIndex];

  const goTo = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const goNext = () => {
    startTransition(() => {
      setActiveIndex((current) => (current + 1) % worldScenes.length);
    });
  };

  const goPrevious = () => {
    startTransition(() => {
      setActiveIndex((current) => (current - 1 + worldScenes.length) % worldScenes.length);
    });
  };

  return (
    <section data-header-theme="light" className="relative min-h-screen bg-white py-28 text-black sm:py-32" aria-labelledby="about-world-title">
      <Container className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
        <AboutReveal className="max-w-[30rem]">
          <ChapterMark chapter="07" />
          <h2 id="about-world-title" className={cn(sectionHeadingClass, "mt-6 text-black")}>
            OUR WORLD
          </h2>
          <div className={cn(bodyLargeClass, "mt-8 space-y-4 text-black/62")}>
            <p>The future is not one place.</p>
            <p>It is many spaces connected by imagination.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {worldScenes.map((scene, index) => (
              <button
                key={scene.title}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.28em] transition duration-300 sm:text-[11px]",
                  index === activeIndex ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/58 hover:text-black",
                )}
              >
                {scene.title}
              </button>
            ))}
          </div>
        </AboutReveal>

        <div className="w-full max-w-[48rem]">
          <AboutReveal className="flex justify-end gap-3" delayMs={120}>
            <ArrowButton direction="previous" onClick={goPrevious} />
            <ArrowButton direction="next" onClick={goNext} />
          </AboutReveal>

          <AboutReveal key={activeScene.title} className="mt-6" once={false}>
            <div className="relative aspect-video overflow-hidden border border-black/8">
              <Image
                src={activeScene.src}
                alt={activeScene.alt}
                fill
                quality={80}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent" />
              <div className="absolute bottom-8 left-8 max-w-[19rem] sm:bottom-10 sm:left-10">
                <p className={cn(eyebrowClass, "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]")}>{activeScene.title}</p>
                <p className={cn(bodyClass, "mt-3 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]")}>{activeScene.copy}</p>
              </div>
            </div>
          </AboutReveal>
        </div>
      </Container>
    </section>
  );
}

function EndingSection() {
  return (
    <section data-header-theme="dark" className="relative min-h-screen bg-black py-28 text-white sm:py-32" aria-labelledby="about-ending-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.1),transparent_16%),linear-gradient(180deg,#020202_0%,#070708_100%)]" />
      <Container className="relative z-10 flex min-h-[calc(100vh-14rem)] items-center justify-center text-center">
        <AboutReveal className="w-full max-w-[38rem]">
          <ChapterMark chapter="08" dark />
          <h2 id="about-ending-title" className={cn(sectionHeadingClass, "mt-8 text-white lg:text-[6.6rem]")}>
            THE FUTURE
            <br />
            DOESN&apos;T SIT STILL.
          </h2>
          <p className={cn(bodyLargeClass, "mx-auto mt-8 max-w-[24rem] text-white/62")}>
            Let&apos;s build something that floats.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/products" className={buttonStyles({ variant: "primary", size: "lg" })}>
              View Products
            </Link>
            <Link href="/rfq" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              Request Quote
            </Link>
          </div>
        </AboutReveal>
      </Container>
    </section>
  );
}

export function AboutPageExperience() {
  return (
    <>
      <QuestionEverythingSection />
      <QuestionRealitySection />
      <BeginningSection />
      <ObsessionSection />
      <InvisibleEngineeringSection />
      <FutureObjectsSection />
      <WorldSection />
      <EndingSection />
    </>
  );
}
