"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSiteStore } from "@/components/providers/site-store-provider";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 transition", active ? "fill-current" : "fill-none")}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s-7-4.35-9.4-8.32C.7 9.45 2.14 5.5 6.06 5.1c2.05-.2 3.61.84 4.5 2.22.89-1.38 2.46-2.42 4.51-2.22 3.91.4 5.35 4.35 3.45 7.58C19 16.65 12 21 12 21Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6h15l-1.7 8.5H8L6.3 4H3" />
      <circle cx="10" cy="18.5" r="1.25" />
      <circle cx="17" cy="18.5" r="1.25" />
    </svg>
  );
}

interface ProductActionsProps {
  product: Pick<Product, "id" | "slug" | "name" | "productImage">;
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToQuote, inQuote, isFavorite, toggleFavorite } = useSiteStore();

  const favorite = isFavorite(product.slug);
  const quoted = inQuote(product.slug);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={quoted ? "primary" : "secondary"}
        size="sm"
        aria-pressed={quoted}
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
      >
        <QuoteIcon />
        <span className="ml-2">{quoted ? "Added to Quote" : "Add to Quote"}</span>
      </Button>
      {quoted ? (
        <Link
          href="/rfq"
          className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/12"
        >
          Open RFQ
        </Link>
      ) : null}
      <Button
        variant={favorite ? "primary" : "ghost"}
        size="sm"
        aria-pressed={favorite}
        onClick={() => toggleFavorite(product.slug)}
      >
        <HeartIcon active={favorite} />
        <span className="ml-2">{favorite ? "Remove Favorite" : "Favorite"}</span>
      </Button>
    </div>
  );
}
