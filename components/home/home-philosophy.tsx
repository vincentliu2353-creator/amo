"use client";

import { ScrollReveal } from "@/components/home/home-scroll";
import { Container } from "@/components/ui/container";

export function HomePhilosophy() {
  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-screen items-center overflow-hidden bg-white text-black"
      aria-labelledby="home-philosophy-title"
    >
      <Container className="relative z-10 py-24 sm:py-28 lg:py-32">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <ScrollReveal
            hiddenClassName="translate-y-8 opacity-0 blur-[18px]"
            visibleClassName="translate-y-0 opacity-100 blur-0"
            threshold={0.32}
          >
            <h2
              id="home-philosophy-title"
              className="font-sans font-medium uppercase tracking-normal text-black"
            >
              <span className="block whitespace-nowrap text-[clamp(28px,7.4vw,104px)] leading-none">Gravity Is A Law.</span>
              <span className="mt-4 block whitespace-nowrap text-[clamp(14px,3.3vw,36px)] leading-tight sm:mt-6">
                It Is Not A Design Limitation.
              </span>
            </h2>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
