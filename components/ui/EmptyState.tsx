import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ eyebrow, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-[2rem] border border-black/10 bg-[#f5f5f2] p-8 text-center", className)}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-black/40">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">{description}</p>
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  );
}
