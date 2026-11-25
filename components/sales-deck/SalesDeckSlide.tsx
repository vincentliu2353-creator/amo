import type { ReactNode } from "react";

import Image from "@/components/ui/responsive-image";

import { cn } from "@/lib/utils";

interface SalesDeckSlideProps {
  backgroundAlt?: string;
  backgroundPosition?: string;
  backgroundSrc?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  footerLabel?: string;
  pageNumber: number;
  priority?: boolean;
  totalPages: number;
}

export function SalesDeckSlide({
  backgroundAlt = "",
  backgroundPosition = "center center",
  backgroundSrc,
  children,
  className,
  contentClassName,
  footerLabel = "amolevitation.com",
  pageNumber,
  priority = false,
  totalPages,
}: SalesDeckSlideProps) {
  return (
    <section className="sales-deck-slide-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <article
        className={cn(
          "sales-deck-slide relative aspect-[16/9] w-full max-w-[1600px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050608] text-white shadow-[0_36px_120px_rgba(0,0,0,0.58)]",
          className,
        )}
      >
        {backgroundSrc ? (
          <div className="absolute inset-0">
            <Image
              alt={backgroundAlt}
              className="object-cover"
              fill
              priority={priority}
              quality={80}
              sizes="100vw"
              src={backgroundSrc}
              style={{ objectPosition: backgroundPosition }}
            />
          </div>
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(166,232,255,0.12),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,rgba(4,6,9,0.2)_0%,rgba(4,6,9,0.78)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black/36 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black/24 to-transparent" />

        <div className="absolute left-8 top-7 z-20 flex items-center gap-3 sm:left-10 lg:left-12">
          <div className="relative h-7 w-20">
            <Image alt="AMO logo" className="object-contain object-left" fill priority={priority} sizes="80px" src="/amo-logo-white.png" />
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.34em] text-white/46 sm:inline">B2B Sales Deck</span>
        </div>

        <div className="absolute bottom-7 left-8 right-8 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/42 sm:left-10 sm:right-10 lg:left-12 lg:right-12">
          <span>
            {String(pageNumber).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <span>{footerLabel}</span>
        </div>

        <div className={cn("relative z-10 flex h-full flex-col px-8 pb-16 pt-20 sm:px-10 lg:px-12 xl:px-14", contentClassName)}>
          {children}
        </div>
      </article>
    </section>
  );
}
