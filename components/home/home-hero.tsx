import Image from "next/image";

import { Container } from "@/components/ui/container";
import heroBackground from "@/public/images/home/hero/hero-bg.webp";

export function HomeHero() {
  return (
    <section
      data-header-theme="dark"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      aria-labelledby="home-hero-title"
    >
      <Image
        src={heroBackground}
        alt="AMO magnetic levitation future space"
        fill
        priority
        quality={92}
        sizes="100vw"
        placeholder="blur"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />

      <Container className="relative z-10 flex min-h-screen items-center py-28 sm:py-32">
        <div className="mx-auto max-w-[58rem] text-center">
          <p className="font-sans text-[16px] font-medium uppercase leading-[22px] text-white/72 sm:text-[18px] sm:leading-[24px]">
            AMO Magnetic Levitation
          </p>
          <h1
            id="home-hero-title"
            className="mx-auto mt-8 font-sans text-[31px] font-medium uppercase leading-[34px] tracking-normal text-white text-shadow-premium min-[380px]:text-[35px] min-[380px]:leading-[38px] sm:text-[64px] sm:leading-[64px] lg:text-[84px] lg:leading-[82px]"
          >
            <span className="block whitespace-nowrap">Beyond Gravity.</span>
            <span className="mt-2 block whitespace-nowrap lg:mt-3">Beyond Expectation.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-[54rem] font-sans text-[19px] leading-[30px] text-[#A3A3A3] sm:text-[22px] sm:leading-[34px]">
            We create magnetic levitation experiences that transform ordinary objects into moments of curiosity, movement, and
            wonder.
          </p>
        </div>
      </Container>
    </section>
  );
}
