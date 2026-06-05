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

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("h-4 w-4 transition", active ? "fill-current" : "fill-none")}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M10 16.6s-5.8-3.4-7.8-6.8C.7 7.2 1.9 4 5.2 3.7c1.7-.2 3 .7 3.8 1.9.7-1.2 2.1-2.1 3.8-1.9 3.2.3 4.5 3.5 3 6.1C15.8 13.2 10 16.6 10 16.6Z" />
    </svg>
  );
}

interface ProductShowcaseActionsProps {
  product: Pick<Product, "id" | "slug" | "name" | "productImage">;
}

export function ProductShowcaseActions({ product }: ProductShowcaseActionsProps) {
  const { addToQuote, inQuote, isFavorite, toggleFavorite } = useSiteStore();
  const quoted = inQuote(product.slug);
  const favorite = isFavorite(product.slug);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Link
        href={`/products/${product.slug}`}
        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-black px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-black/88"
      >
        <span>View Details</span>
        <ArrowIcon />
      </Link>

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
          "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition",
          quoted ? "bg-black text-white" : "border border-black/10 bg-white/72 text-black hover:border-black/18 hover:bg-white",
        )}
      >
        <QuoteIcon />
        <span>{quoted ? "Added To Quote" : "Add To Quote"}</span>
      </button>

      <button
        type="button"
        onClick={() => toggleFavorite(product.slug)}
        aria-pressed={favorite}
        aria-label={favorite ? "Remove product from favorites" : "Add product to favorites"}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full transition",
          favorite ? "bg-black text-white" : "border border-black/10 bg-white/72 text-black hover:border-black/18 hover:bg-white",
        )}
      >
        <HeartIcon active={favorite} />
      </button>
    </div>
  );
}
