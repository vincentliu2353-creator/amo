import Link from "next/link";

import { ScrollReveal } from "@/components/home/home-scroll";
import { Container } from "@/components/ui/container";

function AboutPreviewBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#020303_0%,#070809_52%,#020303_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(125,225,255,0.15),transparent_26%),radial-gradient(circle_at_18%_74%,rgba(255,255,255,0.08),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="animate-home-drift absolute left-[14%] top-[22%] h-44 w-44 rounded-full bg-cyan-200/10 blur-3xl" />
      <div className="animate-home-pulse absolute right-[18%] bottom-[22%] h-64 w-64 rounded-full bg-white/[0.055] blur-3xl" />
      <div className="absolute inset-x-[18%] top-[42%] h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="absolute inset-x-[24%] top-[61%] h-px bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
    </div>
  );
}

export function HomeAboutPreview() {
  return (
    <section
      data-header-theme="dark"
      className="relative flex min-h-screen items-center overflow-hidden bg-black text-white"
      aria-labelledby="home-about-preview-title"
    >
      <AboutPreviewBackground />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.68))]" />

      <Container className="relative z-10 py-24">
        <ScrollReveal
          className="mx-auto max-w-[900px] text-center"
          hiddenClassName="translate-y-8 opacity-0 blur-[18px]"
          visibleClassName="translate-y-0 opacity-100 blur-0"
          threshold={0.24}
        >
          <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-cyan-50/54">About AMO</p>
          <h2 id="home-about-preview-title" className="sr-only">
            We Don&apos;t Design Products. We Design Suspended Moments.
          </h2>
          <div
            aria-hidden
            className="mt-8 font-sans text-[38px] font-medium uppercase leading-[42px] tracking-normal text-white sm:text-[64px] sm:leading-[66px] lg:text-[84px] lg:leading-[84px]"
          >
            <ScrollReveal
              className="block"
              delayMs={120}
              hiddenClassName="translate-y-5 opacity-0 blur-[12px]"
              visibleClassName="translate-y-0 opacity-100 blur-0"
              threshold={0.2}
            >
              We Don&apos;t Design Products.
            </ScrollReveal>
            <ScrollReveal
              className="mt-3 block"
              delayMs={260}
              hiddenClassName="translate-y-5 opacity-0 blur-[12px]"
              visibleClassName="translate-y-0 opacity-100 blur-0"
              threshold={0.2}
            >
              We Design Suspended Moments.
            </ScrollReveal>
          </div>

          <ScrollReveal
            className="mx-auto mt-9 max-w-[740px] font-sans text-[17px] leading-[28px] text-white/62 sm:text-[20px] sm:leading-[32px]"
            delayMs={420}
            hiddenClassName="translate-y-6 opacity-0 blur-[10px]"
            visibleClassName="translate-y-0 opacity-100 blur-0"
            threshold={0.2}
          >
            <p>We believe the future of product presentation is not static.</p>
            <p className="mt-6">
              It moves.
              <span className="block">It floats.</span>
              <span className="block">It creates curiosity.</span>
            </p>
            <p className="mt-6">
              Through magnetic levitation, engineering precision, and industrial design, AMO transforms ordinary objects into
              unforgettable visual experiences.
            </p>
          </ScrollReveal>

          <ScrollReveal
            className="mt-10"
            delayMs={640}
            hiddenClassName="translate-y-5 opacity-0 blur-[8px]"
            visibleClassName="translate-y-0 opacity-100 blur-0"
            threshold={0.2}
          >
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white text-black px-6 py-3 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal transition hover:bg-cyan-50"
            >
              Read Our Story
            </Link>
          </ScrollReveal>
        </ScrollReveal>
      </Container>
    </section>
  );
}
