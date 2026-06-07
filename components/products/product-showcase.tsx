/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ProductDotsTrigger } from "@/components/products/product-dots-trigger";
import { ProductThumbRail } from "@/components/products/product-thumb-rail";
import type { ProductShowcaseProduct } from "@/types";
import { cn } from "@/lib/utils";

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Show previous product" : "Show next product"}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)] transition hover:scale-[1.03] hover:bg-black/90"
    >
      <svg
        viewBox="0 0 20 20"
        className={cn("h-4 w-4", direction === "previous" ? "" : "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
      </svg>
    </button>
  );
}

function buildProductCopy(product: ProductShowcaseProduct) {
  const leadCopy = [product.summary, product.description, product.highlight]
    .map((entry) => entry.trim())
    .find((entry) => entry.length > 0);

  if (!leadCopy) {
    return "Configured magnetic levitation performance for premium interiors and modern branded spaces.";
  }

  const firstSentence = leadCopy.match(/.+?[.!?](?:\s|$)/)?.[0]?.trim() ?? leadCopy;
  const normalizedSentence = firstSentence.replace(/\s+/g, " ").trim();

  if (normalizedSentence.length <= 128) {
    return normalizedSentence;
  }

  const clippedSentence = normalizedSentence.slice(0, 125).replace(/[,:;\s]+$/, "");
  return `${clippedSentence}...`;
}

function buildMonogram(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0))
    .join("")
    .toUpperCase();
}

function formatMetaValue(value: string | null | undefined) {
  if (typeof value !== "string") {
    return "—";
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized || "—";
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4.5 10h10" />
      <path d="m10 4.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

interface ProductShowcaseProps {
  products: ProductShowcaseProduct[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ProductShowcase({ products, activeIndex, onSelect }: ProductShowcaseProps) {
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [contentVisible, setContentVisible] = useState(true);
  const [imageVisible, setImageVisible] = useState(true);
  const [expanded, setExpanded] = useState(products.length <= 5);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"previous" | "next">("next");
  const exitTimerRef = useRef<number | null>(null);
  const imageTimerRef = useRef<number | null>(null);

  function clearTransitionTimers() {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (imageTimerRef.current !== null) {
      window.clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }
  }

  useEffect(() => {
    if (products.length <= 5) {
      setExpanded(true);
    }
  }, [products.length]);

  useEffect(() => {
    return () => {
      clearTransitionTimers();
    };
  }, []);

  useEffect(() => {
    if (activeIndex === displayIndex) {
      return;
    }

    clearTransitionTimers();

    const total = products.length;
    const forwardDistance = (activeIndex - displayIndex + total) % total;
    const backwardDistance = (displayIndex - activeIndex + total) % total;

    setTransitionDirection(forwardDistance <= backwardDistance ? "next" : "previous");
    setContentVisible(false);
    setImageVisible(false);

    exitTimerRef.current = window.setTimeout(() => {
      setDisplayIndex(activeIndex);
      setContentVisible(true);
      imageTimerRef.current = window.setTimeout(() => {
        setImageVisible(true);
      }, 180);
    }, 160);
  }, [activeIndex, displayIndex, products.length]);

  const product = products[displayIndex];
  const activeImage = product.galleryImages[0]?.url ?? product.productImage;
  const activeAlt = product.galleryImages[0]?.alt ?? product.name;
  const copy = buildProductCopy(product);
  const contentHiddenClass = transitionDirection === "next" ? "-translate-x-6 opacity-0" : "translate-x-6 opacity-0";
  const imageHiddenClass = transitionDirection === "next" ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0";

  return (
    <section className="relative min-h-screen bg-white" data-header-theme="light" aria-label="AMO product showcase">
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 hidden lg:block">
        <div className="relative h-full">
          <div className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 xl:left-8">
            <ArrowButton
              direction="previous"
              onClick={() => onSelect((activeIndex - 1 + products.length) % products.length)}
            />
          </div>
          <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 xl:right-8">
            <ArrowButton direction="next" onClick={() => onSelect((activeIndex + 1) % products.length)} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-screen">
          <article className="grid min-h-screen content-start gap-4 px-2 pb-14 pt-5 sm:gap-5 sm:px-4 sm:pb-16 sm:pt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-8 lg:px-10 lg:pb-32 lg:pt-8">
            <div
              className={cn(
                "relative z-30 max-w-[58rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:max-w-[64rem]",
                contentVisible ? "translate-x-0 opacity-100" : contentHiddenClass,
              )}
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.26em] text-black/42">
                {String(displayIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
              </p>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.3em] text-black/42">{product.category}</p>
              <h2 className="mt-3 font-sans text-[clamp(2.75rem,5.8vw,6rem)] font-medium uppercase leading-[0.92] tracking-[-0.07em] text-black whitespace-normal">
                {product.name}
              </h2>
              <p className="mt-4 max-w-[30rem] text-[15px] leading-[1.6] text-black/64 sm:text-[16px]">{copy}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black bg-black px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition duration-300 hover:bg-black/88 sm:text-[11px]"
                >
                  <span>View Product</span>
                  <ArrowIcon />
                </Link>

                <Link
                  href="/rfq"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black transition duration-300 hover:border-black/20 hover:bg-black/[0.07] sm:text-[11px]"
                >
                  <span>Request Quote</span>
                  <ArrowIcon />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Series", value: formatMetaValue(product.series) },
                  { label: "Lead Time", value: formatMetaValue(product.leadTime) },
                  { label: "MOQ", value: formatMetaValue(product.minOrderQty) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-black/8 bg-black/[0.02] px-4 py-4 backdrop-blur"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-black/38">{item.label}</p>
                    <p className="mt-3 text-[13px] leading-6 text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "relative z-0 flex min-h-[14rem] items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[18rem] lg:min-h-[82svh] lg:justify-center xl:min-h-[90svh]",
                imageVisible ? "translate-x-0 opacity-100" : imageHiddenClass,
              )}
            >
              <div className="relative z-0 flex h-full w-full items-center justify-center">
                <div className="relative z-0 flex h-[40svh] w-full items-center justify-center sm:h-[48svh] md:h-[56svh] lg:h-[88svh] xl:h-[94svh]">
                  <div className="pointer-events-none absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 justify-between lg:hidden">
                    <div className="pointer-events-auto">
                      <ArrowButton
                        direction="previous"
                        onClick={() => onSelect((activeIndex - 1 + products.length) % products.length)}
                      />
                    </div>
                    <div className="pointer-events-auto">
                      <ArrowButton direction="next" onClick={() => onSelect((activeIndex + 1) % products.length)} />
                    </div>
                  </div>

                  {activeImage ? (
                    <div className="relative z-0 flex h-full w-full items-center justify-center">
                      <img
                        src={activeImage}
                        alt={activeAlt}
                        className="relative z-0 h-full w-auto max-w-[118%] object-contain sm:max-w-[124%] lg:max-w-[136%] xl:max-w-[142%]"
                        loading="eager"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          const fallback = event.currentTarget.nextElementSibling;

                          if (fallback instanceof HTMLElement) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                      <div className="hidden h-full w-full items-center justify-center text-[clamp(2rem,6vw,4.5rem)] font-medium uppercase tracking-[0.18em] text-black/48">
                        {buildMonogram(product.name)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[clamp(2rem,6vw,4.5rem)] font-medium uppercase tracking-[0.18em] text-black/48">
                      {buildMonogram(product.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          <div
            className="absolute bottom-0 left-0 right-0 z-20 hidden h-32 lg:block lg:h-40"
            onMouseEnter={() => setShowThumbnails(true)}
            onMouseLeave={() => {
              setShowThumbnails(false);
              setExpanded(products.length <= 5);
            }}
          >
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
              <div className="min-w-0">
                <ProductThumbRail
                  products={products}
                  activeIndex={activeIndex}
                  expanded={expanded}
                  desktopVisible={showThumbnails}
                  onSelect={onSelect}
                />
              </div>

              {products.length > 5 ? (
                <ProductDotsTrigger
                  expanded={expanded}
                  onClick={() => {
                    setShowThumbnails(true);
                    setExpanded((current) => !current);
                  }}
                  onMouseEnter={() => {
                    setShowThumbnails(true);
                    setExpanded(true);
                  }}
                  className="shrink-0"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
