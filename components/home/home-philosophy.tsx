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
        <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <h2 id="home-philosophy-title" className="sr-only">
            Gravity Exists. Design Is Free.
          </h2>

          <ScrollReveal
            hiddenClassName="translate-y-10 opacity-0 blur-[22px]"
            visibleClassName="translate-y-0 opacity-100 blur-0"
            threshold={0.32}
          >
            <p
              aria-hidden
              className="whitespace-nowrap font-sans text-[clamp(44px,10vw,136px)] font-medium uppercase leading-none tracking-normal text-black"
            >
              Gravity Exists.
            </p>
          </ScrollReveal>

          <ScrollReveal
            className="mt-5 sm:mt-7"
            delayMs={180}
            hiddenClassName="translate-y-8 opacity-0 blur-[18px]"
            visibleClassName="translate-y-0 opacity-100 blur-0"
            threshold={0.28}
          >
            <p
              aria-hidden
              className="whitespace-nowrap font-sans text-[clamp(34px,7vw,88px)] font-medium uppercase leading-none tracking-normal text-black"
            >
              Design Is Free.
            </p>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
