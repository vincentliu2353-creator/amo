/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { ProductActions } from "@/components/products/product-actions";
import { AmoCard } from "@/components/ui/amo-card";
import { buttonStyles } from "@/components/ui/button";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <AmoCard as="article" padding="none" interactive className="group h-full">
      <div className="relative overflow-hidden border-b border-white/8 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_68%)]" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full border border-white/12 bg-black/28 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                {product.category}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">{product.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{product.series}</p>
            </div>

            <span className="max-w-[7rem] text-right text-[10px] uppercase tracking-[0.24em] text-cyan-50/76">
              {product.heroMetric}
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white p-4">
            <div className="rounded-[1.2rem] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] p-4">
              <div className="flex min-h-[14rem] items-center justify-center">
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="max-h-[13rem] w-auto max-w-full object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.16)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-sm leading-7 text-slate-300">{product.summary}</p>

        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/8 pt-5 text-sm text-slate-300">
          <div className="flex items-center justify-between gap-4">
            <span>Lead time</span>
            <span className="text-white">{product.leadTime}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>MOQ</span>
            <span className="text-white">{product.minOrderQty}</span>
          </div>
        </div>

        <ProductActions product={product} />

        <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-5">
          <p className="max-w-[70%] text-sm text-slate-400">{product.highlight}</p>
          <Link href={`/products/${product.slug}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            View Detail
          </Link>
        </div>
      </div>
    </AmoCard>
  );
}
