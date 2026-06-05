/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { ProductActions } from "@/components/products/product-actions";
import { buttonStyles } from "@/components/ui/button";
import type { Product } from "@/types";

export function NexusProductCard({ product }: { product: Product }) {
  const leadApplication = product.applications[0] ?? product.category;

  return (
    <article className="group h-full rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[23px] border border-[#262626] bg-[#171717]/92 text-white backdrop-blur-[24px] transition duration-500 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%)]"
        />

        <div className="relative border-b border-white/8 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">{product.category}</p>
              <h3 className="mt-4 font-sans text-[28px] font-medium leading-[32px] tracking-[-0.025em] text-white">
                {product.name}
              </h3>
              <p className="mt-3 text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-500">{product.series}</p>
            </div>

            <div className="min-w-[7rem] text-right">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Hero Metric</p>
              <p className="mt-3 text-[14px] leading-[22.75px] text-cyan-100">{product.heroMetric}</p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/44 p-4">
            <div className="relative overflow-hidden rounded-[23px] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] p-4">
              <div className="flex items-start justify-between gap-4 text-black/64">
                <div>
                  <p className="text-[12px] font-medium uppercase leading-4 tracking-normal">Primary Application</p>
                  <p className="mt-2 text-[14px] leading-[22.75px] text-black/78">{leadApplication}</p>
                </div>

                <div className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[12px] font-medium uppercase leading-4 tracking-normal text-black/60">
                  {product.tags.length} tags
                </div>
              </div>

              <div className="mt-5 flex min-h-[188px] items-center justify-center">
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="max-h-[12rem] w-auto max-w-full object-contain drop-shadow-[0_28px_56px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6 sm:p-8">
          <p className="text-[14px] leading-[22.75px] text-[#A3A3A3]">{product.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-black/28 p-4">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Lead Time</p>
              <p className="mt-3 text-[14px] leading-[22.75px] text-white">{product.leadTime}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/28 p-4">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">MOQ</p>
              <p className="mt-3 text-[14px] leading-[22.75px] text-white">{product.minOrderQty}</p>
            </div>
          </div>

          <div className="mt-6">
            <ProductActions product={product} />
          </div>

          <div className="mt-6 flex items-start justify-between gap-4 border-t border-white/8 pt-6">
            <p className="max-w-[16rem] text-[12px] leading-5 text-slate-400">{product.highlight}</p>
            <Link href={`/products/${product.slug}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              View Detail
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
