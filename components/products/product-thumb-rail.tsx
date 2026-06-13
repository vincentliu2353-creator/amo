"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductShowcaseProduct } from "@/types";

import { pickShowcaseThumbImage } from "@/lib/products/product-image-selection";
import { cn } from "@/lib/utils";

function buildCompactIndices(activeIndex: number, total: number) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const indices = new Set<number>([activeIndex]);
  let offset = 1;

  while (indices.size < 5) {
    if (activeIndex - offset >= 0) {
      indices.add(activeIndex - offset);
    }

    if (indices.size < 5 && activeIndex + offset < total) {
      indices.add(activeIndex + offset);
    }

    offset += 1;
  }

  return Array.from(indices).sort((left, right) => left - right);
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

interface ProductThumbRailProps {
  products: ProductShowcaseProduct[];
  activeIndex: number;
  expanded: boolean;
  desktopVisible: boolean;
  onSelect: (index: number) => void;
}

export function ProductThumbRail({ products, activeIndex, expanded, desktopVisible, onSelect }: ProductThumbRailProps) {
  const compactIndices = buildCompactIndices(activeIndex, products.length);
  const compactSet = new Set(compactIndices);
  const [desktopFocusIndex, setDesktopFocusIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto pb-1 md:hidden">
        {products.map((product, index) => {
          const active = index === activeIndex;
          const image = pickShowcaseThumbImage(product.galleryImages[0], product.productImage);

          return (
            <button
              key={product.slug}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={active}
              aria-label={`Show ${product.name}`}
              className={cn(
                "shrink-0 transition duration-300",
                active ? "scale-[1.03] opacity-100 shadow-[0_12px_26px_rgba(15,23,42,0.12)]" : "opacity-[0.62]",
              )}
            >
              <span className="relative flex h-12 w-20 items-center justify-center overflow-hidden rounded-[0.85rem] bg-[#f7f7f7]">
                {image ? (
                  <>
                    <Image
                      src={image}
                      alt={product.galleryImages[0]?.alt ?? product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <span className="hidden items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black/58">
                      {buildMonogram(product.name)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/58">{buildMonogram(product.name)}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "hidden items-center justify-center overflow-x-auto pb-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex",
          desktopVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
        onMouseLeave={() => setDesktopFocusIndex(null)}
        onMouseMove={(event) => {
          const visibleIndices = expanded ? products.map((_, index) => index) : compactIndices;
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
          const normalizedRatio = Math.min(1, Math.max(0, ratio));
          const focusSlot = Math.round(normalizedRatio * Math.max(visibleIndices.length - 1, 0));
          setDesktopFocusIndex(visibleIndices[focusSlot] ?? activeIndex);
        }}
      >
        {products.map((product, index) => {
          const visible = expanded || compactSet.has(index);
          const active = index === activeIndex;
          const focusDistance = desktopFocusIndex === null ? Math.abs(index - activeIndex) : Math.abs(index - desktopFocusIndex);
          const scale = visible
            ? active
              ? 1.04 + Math.max(0, 0.04 - focusDistance * 0.015)
              : 0.94 + Math.max(0, 0.12 - focusDistance * 0.04)
            : 0.72;
          const opacity = visible ? (active ? 1 : Math.max(0.42, 0.72 - focusDistance * 0.12)) : 0;
          const image = pickShowcaseThumbImage(product.galleryImages[0], product.productImage);

          return (
            <button
              key={product.slug}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={active}
              aria-label={`Show ${product.name}`}
              className={cn("overflow-hidden transition-[width,margin,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", visible ? "pointer-events-auto" : "pointer-events-none")}
              style={{
                width: visible ? 78 : 0,
                marginRight: visible ? 6 : 0,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <span
                className={cn(
                  "relative flex h-12 w-[4.875rem] items-center justify-center overflow-hidden rounded-[0.9rem] bg-[#f7f7f7] transition duration-300",
                  active ? "shadow-[0_12px_26px_rgba(15,23,42,0.12)]" : "",
                )}
              >
                {image ? (
                  <>
                    <Image
                      src={image}
                      alt={product.galleryImages[0]?.alt ?? product.name}
                      fill
                      sizes="78px"
                      className="object-cover"
                    />
                    <span className="hidden items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black/58">
                      {buildMonogram(product.name)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/58">{buildMonogram(product.name)}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
