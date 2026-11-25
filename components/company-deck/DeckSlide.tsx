import type { ReactNode } from "react";

import Image from "@/components/ui/responsive-image";

import { cn } from "@/lib/utils";

interface DeckSlideProps {
  backgroundAlt?: string;
  backgroundPosition?: string;
  backgroundSrc?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  footerLabel?: string;
  pageNumber: number;
  priority?: boolean;
  showBrandBar?: boolean;
  tone?: "dark" | "light";
  totalPages: number;
}

export function DeckSlide({
  backgroundAlt = "",
  backgroundPosition = "center center",
  backgroundSrc,
  children,
  className,
  contentClassName,
  footerLabel = "amolevitation.com",
  pageNumber,
  priority = false,
  showBrandBar = true,
  tone = "dark",
  totalPages,
}: DeckSlideProps) {
  const isDark = tone === "dark";

  return (
    <section className="company-deck-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <article
        data-company-slide={pageNumber}
        className={cn(
          "company-deck-slide relative aspect-[16/9] w-full max-w-[1600px] overflow-hidden border text-white",
          isDark ? "border-white/10 bg-[#050505]" : "border-black/10 bg-[#f5f2eb] text-black",
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

        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(200,169,106,0.12),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_16%),linear-gradient(180deg,rgba(5,5,5,0.02)_0%,rgba(5,5,5,0.16)_32%,rgba(5,5,5,0.76)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black/38 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-black/24 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(200,169,106,0.16),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(245,242,235,0.58)_50%,rgba(233,228,218,0.82)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/24 to-transparent" />
          </>
        )}

        {showBrandBar ? (
          <div
            className={cn(
              "absolute left-10 top-8 z-20 flex items-center gap-3 px-4 py-3",
              isDark ? "bg-black/32" : "bg-black text-white",
            )}
          >
            <div className="relative h-6 w-20">
              <Image alt="AMO logo" className="object-contain object-left" fill priority={priority} sizes="80px" src="/amo-logo-white.png" />
            </div>
            <span className={cn("text-[10px] uppercase tracking-[0.34em]", isDark ? "text-white/48" : "text-white/68")}>AMO Company Profile Deck</span>
          </div>
        ) : null}

        <div
          className={cn(
            "absolute bottom-8 left-10 right-10 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.32em]",
            isDark ? "text-white/42" : "text-black/48",
          )}
        >
          <span>
            {String(pageNumber).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <span>{footerLabel}</span>
        </div>

        <div className={cn("relative z-10 flex h-full flex-col px-10 pb-16 pt-24 lg:px-14", contentClassName)}>{children}</div>
      </article>
    </section>
  );
}
