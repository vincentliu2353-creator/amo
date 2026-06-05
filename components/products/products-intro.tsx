interface ProductsIntroProps {
  progress: number;
}

export function ProductsIntro({ progress }: ProductsIntroProps) {
  const opacity = Math.max(0, 1 - progress * 0.9);
  const blur = progress * 8;
  const translateY = progress * -34;
  const scale = 1 - progress * 0.018;

  return (
    <div
      className="mx-auto flex h-full max-w-[72rem] items-center justify-center bg-black px-4 text-center sm:px-6 lg:px-8"
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      }}
    >
      <div className="max-w-5xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white sm:text-[12px]">Products</p>
        <h1 className="mt-5 font-sans text-[36px] font-medium uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-[54px] lg:text-[68px]">
          <span className="block">Designed To Float.</span>
          <span className="mt-2 block">Built To Inspire.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-[1.55] text-white sm:text-[18px]">
          Magnetic levitation products for modern spaces, premium brands, and unique experiences.
        </p>
      </div>
    </div>
  );
}
