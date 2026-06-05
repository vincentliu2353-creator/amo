"use client";

import Link from "next/link";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { cn } from "@/lib/utils";

function CounterIcon({ type }: { type: "favorites" | "quote" }) {
  if (type === "favorites") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-4.35-9.4-8.32C.7 9.45 2.14 5.5 6.06 5.1c2.05-.2 3.61.84 4.5 2.22.89-1.38 2.46-2.42 4.51-2.22 3.91.4 5.35 4.35 3.45 7.58C19 16.65 12 21 12 21Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6h15l-1.7 8.5H8L6.3 4H3" />
      <circle cx="10" cy="18.5" r="1.25" />
      <circle cx="17" cy="18.5" r="1.25" />
    </svg>
  );
}

export function HeaderStatus() {
  const { favoriteCount, quoteCount } = useSiteStore();

  const items = [
    { href: "/favorites", label: "Favorites", count: favoriteCount, type: "favorites" as const },
    { href: "/rfq", label: "Quote List", count: quoteCount, type: "quote" as const },
  ];

  return (
    <div className="hidden items-center gap-2 lg:flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition",
            "hover:border-cyan-100/18 hover:bg-white/[0.06] hover:text-white",
          )}
        >
          <CounterIcon type={item.type} />
          <span>{item.label}</span>
          <span className="rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[10px] text-slate-100">
            {item.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
