"use client";

import Link from "next/link";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { buttonStyles } from "@/components/ui/button";

export function QuoteDock() {
  const { quoteCount, quoteItems } = useSiteStore();

  if (quoteCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[2rem] border border-cyan-300/20 bg-slate-950/92 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/80">Quote List Active</p>
          <p className="mt-1 text-sm text-slate-300">
            {quoteCount} product{quoteCount > 1 ? "s" : ""} ready for RFQ:{" "}
            <span className="text-white">{quoteItems.slice(0, 3).map((item) => item.product_name).join(", ")}</span>
            {quoteCount > 3 ? "..." : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Add More
          </Link>
          <Link href="/rfq" className={buttonStyles({ size: "sm" })}>
            Continue to RFQ
          </Link>
        </div>
      </div>
    </div>
  );
}
