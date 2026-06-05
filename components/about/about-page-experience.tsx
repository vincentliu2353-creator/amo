"use client";

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
    frame:
      "bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.32),transparent_18%),linear-gradient(145deg,#111216_0%,#323642_40%,#07080c_100%)]",
    overlay:
      "bg-[repeating-linear-gradient(100deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_1px,transparent_1px,transparent_15px)]",
  },
  {
    title: "Precision Edge",
    frame:
      "bg-[radial-gradient(circle_at_74%_18%,rgba(255,255,255,0.22),transparent_16%),linear-gradient(135deg,#0d0f13_0%,#1d2128_44%,#050608_100%)]",
    overlay:
      "bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_14%,transparent_14%,transparent_28%,rgba(255,255,255,0.08)_28%,transparent_29%,transparent_100%)]",
  },
  {
    title: "Magnetic Pattern",
    frame:
      "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_26%),linear-gradient(145deg,#08090c_0%,#161a21_44%,#050608_100%)]",
    overlay: "bg-[repeating-radial-gradient(circle_at_center,transparent_0_18px,rgba(255,255,255,0.12)_18px_19px)]",
  },
  {
    title: "Light Reflection",
    frame:
      "bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.28),transparent_18%),radial-gradient(circle_at_74%_56%,rgba(255,255,255,0.14),transparent_20%),linear-gradient(135deg,#0d1013_0%,#20252d_45%,#050608_100%)]",
    overlay:
      "bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.34),transparent_12%),radial-gradient(circle_at_74%_56%,rgba(255,255,255,0.12),transparent_18%)]",
  },
] as const;

const technicalVisuals = [
  {
    title: "Magnetic Field",
    frame:
      "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.07),transparent_28%),linear-gradient(180deg,#fbfbf8_0%,#f2f3f1_100%)]",
    overlay: "bg-[repeating-radial-gradient(circle_at_center,transparent_0_16px,rgba(0,0,0,0.11)_16px_17px)]",
  },
  {
    title: "Levitation Ring",
    frame:
      "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_22%),linear-gradient(145deg,#ffffff_0%,#f0f1ef_100%)]",
    overlay:
      "bg-[radial-gradient(circle_at_center,transparent_0_32%,rgba(0,0,0,0.12)_32%_33%,transparent_33%_48%,rgba(0,0,0,0.08)_48%_49%,transparent_49%)]",
  },
  {
    title: "Motion Path",
    frame:
      "bg-[linear-gradient(145deg,#ffffff_0%,#f0f2f3_100%)]",
    overlay:
      "bg-[radial-gradient(circle_at_32%_68%,rgba(0,0,0,0.12),transparent_8%),radial-gradient(circle_at_68%_32%,rgba(0,0,0,0.12),transparent_8%),linear-gradient(135deg,transparent_0_35%,rgba(0,0,0,0.1)_35%_36%,transparent_36%_64%,rgba(0,0,0,0.1)_64%_65%,transparent_65%)]",
  },
  {
    title: "Balance System",
    frame:
      "bg-[linear-gradient(145deg,#fcfcfb_0%,#eef1f2_100%)]",
    overlay:
      "bg-[linear-gradient(90deg,transparent_0_22%,rgba(0,0,0,0.08)_22%_23%,transparent_23%_49%,rgba(0,0,0,0.1)_49%_50%,transparent_50%_77%,rgba(0,0,0,0.08)_77%_78%,transparent_78%)]",
  },
] as const;

const futureWords = ["Object", "Display", "Experience", "Emotion"] as const;

const worldScenes = [
  {
    title: "Museum",
    copy: "Objects presented with silence, distance, and intention.",
    backdrop: "bg-[linear-gradient(135deg,#f7f5ef_0%,#ece6db_44%,#ffffff_100%)]",
    accent: "bg-black/9",
  },
  {
    title: "Architecture",
    copy: "Floating forms embedded into spatial language.",
    backdrop: "bg-[linear-gradient(135deg,#f2f3f4_0%,#e7e8eb_42%,#fbfbfc_100%)]",
    accent: "bg-black/7",
  },
  {
    title: "Retail",
    copy: "Hero presentation without shouting for attention.",
    backdrop: "bg-[linear-gradient(135deg,#f8f8f8_0%,#efefef_42%,#fdfdfd_100%)]",
    accent: "bg-black/10",
  },
  {
    title: "Hospitality",
    copy: "Atmosphere that feels expensive before it feels obvious.",
    backdrop: "bg-[linear-gradient(135deg,#f5f0e7_0%,#ebe2d4_44%,#faf6ef_100%)]",
    accent: "bg-black/8",
  },
  {
    title: "Future Workspace",
    copy: "Calm rooms with a technological pulse.",
    backdrop: "bg-[linear-gradient(135deg,#edf2f5_0%,#e0e7ec_44%,#f8fbfd_100%)]",
    accent: "bg-black/7",
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_76%_74%,rgba(255,255,255,0.08),transparent_18%)]" />
      <Container className="relative flex min-h-[calc(100vh-14rem)] flex-col justify-center gap-16 lg:flex-row lg:items-center lg:justify-between">
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

        <AboutReveal className="mx-auto lg:mx-0" delayMs={200}>
          <div aria-hidden className="relative h-[22rem] w-[22rem] sm:h-[30rem] sm:w-[30rem] lg:h-[36rem] lg:w-[36rem]">
            <div className="absolute inset-[8%] rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full border border-white/8 animate-about-rotate-slow" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_48%)] blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[32%] border border-white/18 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_18%),linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_44%,rgba(255,255,255,0.14)_100%)]">
              <div className="absolute inset-[16%] rounded-[32%] border border-white/12" />
              <div className="absolute inset-[30%] rounded-full border border-white/10" />
            </div>
            <div className="absolute left-1/2 top-[80%] h-12 w-44 -translate-x-1/2 rounded-[999px] bg-white/10 blur-3xl" />
          </div>
        </AboutReveal>
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
                <div className={cn("relative aspect-[4/5] min-h-[22rem]", panel.frame)}>
                  <div className={cn("absolute inset-0 opacity-50", panel.overlay)} />
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
                <div className={cn("relative aspect-[4/5] min-h-[20rem]", visual.frame)}>
                  <div className={cn("absolute inset-0 opacity-55", visual.overlay)} />
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
            <div className={cn("relative overflow-hidden border border-black/8", activeScene.backdrop)}>
              <div className={cn("absolute left-[7%] top-[16%] h-[48%] w-[18%]", activeScene.accent)} />
              <div className="absolute right-[8%] top-[18%] h-[52%] w-[34%] bg-white/52" />
              <div className="absolute bottom-[16%] left-[18%] h-[26%] w-[42%] bg-white/46" />
              <div className="absolute left-1/2 top-[44%] h-20 w-20 -translate-x-1/2 rounded-full bg-white/75 shadow-[0_18px_50px_rgba(15,23,42,0.12)] animate-home-float" />
              <div className="absolute left-1/2 top-[67%] h-8 w-28 -translate-x-1/2 rounded-[999px] bg-black/8 blur-2xl" />
              <div className="relative aspect-[5/4] min-h-[24rem] px-8 py-8 sm:px-10 sm:py-10">
                <div className="absolute bottom-8 left-8 max-w-[19rem] sm:bottom-10 sm:left-10">
                  <p className={cn(eyebrowClass, "text-black/34")}>{activeScene.title}</p>
                  <p className={cn(bodyClass, "mt-3 text-black/58")}>{activeScene.copy}</p>
                </div>
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
