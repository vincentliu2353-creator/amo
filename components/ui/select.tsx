import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-[1.35rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-cyan-100/22 focus:bg-black/55 focus:shadow-[0_0_0_1px_rgba(166,232,255,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
