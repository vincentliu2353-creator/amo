import Link from "next/link";

import { AmoCard } from "@/components/ui/amo-card";
import { buttonStyles } from "@/components/ui/button";

interface ProductsErrorStateProps {
  title: string;
  message: string;
  backHref?: string;
  backLabel?: string;
}

export function ProductsErrorState({
  title,
  message,
  backHref = "/products",
  backLabel = "Back to Catalog",
}: ProductsErrorStateProps) {
  return (
    <AmoCard tone="hero" padding="lg" className="border-rose-400/20 after:bg-rose-300/15">
      <p className="text-xs uppercase tracking-[0.26em] text-rose-200/80">Data Load Error</p>
      <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{message}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href={backHref} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          {backLabel}
        </Link>
        <Link href="/contact" className={buttonStyles({ size: "sm" })}>
          Contact AMO
        </Link>
      </div>
    </AmoCard>
  );
}
