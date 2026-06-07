"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import { ProductShowcase } from "@/components/products/product-showcase";
import { ProductsPageStorySections } from "@/components/products/products-page-story-sections";
import { ProductsIntro } from "@/components/products/products-intro";
import type { ProductShowcaseProduct } from "@/types";

interface ProductsPageExperienceProps {
  catalogProducts: ProductShowcaseProduct[];
  showcaseProducts: ProductShowcaseProduct[];
}

export function ProductsPageExperience({ showcaseProducts, catalogProducts }: ProductsPageExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const introRef = useRef<HTMLElement | null>(null);

  const syncIntroProgress = useCallback(() => {
    if (!introRef.current) {
      return;
    }

    const rect = introRef.current.getBoundingClientRect();
    const fadeDistance = Math.max(1, introRef.current.offsetHeight * 0.7);
    const nextProgress = Math.min(1, Math.max(0, -rect.top / fadeDistance));

    setIntroProgress((current) => (Math.abs(current - nextProgress) > 0.01 ? nextProgress : current));
  }, []);

  useEffect(() => {
    let frame = 0;

    const requestSync = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncIntroProgress();
      });
    };

    syncIntroProgress();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, [syncIntroProgress]);

  return (
    <div className="bg-black pt-24 sm:pt-28">
      <section ref={introRef} data-header-theme="dark" className="relative h-[20rem] bg-black sm:h-[24rem] lg:h-[26rem]">
        <div className="h-full">
          <ProductsIntro progress={introProgress} />
        </div>
      </section>

      <ProductShowcase
        products={showcaseProducts}
        activeIndex={activeIndex}
        onSelect={(index) =>
          startTransition(() => {
            setActiveIndex(index);
          })
        }
      />

      <ProductsPageStorySections products={catalogProducts} activeProduct={showcaseProducts[activeIndex] ?? showcaseProducts[0]} />
    </div>
  );
}
