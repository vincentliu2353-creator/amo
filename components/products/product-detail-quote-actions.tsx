"use client";

import Link from "next/link";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4.5 10h10" />
      <path d="m10 4.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3.8 5.2h12.4l-1.3 6.5H6.4L5 3.8H2.8" />
      <circle cx="8.3" cy="14.8" r="1" />
      <circle cx="13.8" cy="14.8" r="1" />
    </svg>
  );
}

interface ProductDetailQuoteActionsProps {
  product: Pick<Product, "id" | "slug" | "name" | "productImage">;
  className?: string;
  theme?: "dark" | "light";
}

const themeStyles = {
  dark: {
    primary: "border-white bg-white text-black hover:bg-white/90",
    secondary: "border-white/16 bg-white/[0.04] text-white hover:border-white/28 hover:bg-white/[0.08]",
  },
  light: {
    primary: "border-black bg-black text-white hover:bg-black/88",
    secondary: "border-black/10 bg-black/[0.04] text-black hover:border-black/20 hover:bg-black/[0.07]",
  },
} as const;

export function ProductDetailQuoteActions({
  product,
  className,
  theme = "dark",
}: ProductDetailQuoteActionsProps) {
  const { addToQuote, inQuote } = useSiteStore();
  const quoted = inQuote(product.slug);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        type="button"
        onClick={() =>
          addToQuote({
            product_id: product.id,
            product_name: product.name,
            product_slug: product.slug,
            product_image: product.productImage,
            quantity: 1,
            notes: "",
          })
        }
        aria-pressed={quoted}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] transition duration-300 sm:text-[11px]",
          themeStyles[theme].primary,
        )}
      >
        <QuoteIcon />
        <span>{quoted ? "Added To Quote" : "Add To Quote"}</span>
      </button>

      <Link
        href="/rfq"
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] transition duration-300 sm:text-[11px]",
          themeStyles[theme].secondary,
        )}
      >
        <span>Request Quote</span>
        <ArrowIcon />
      </Link>
    </div>
  );
}
