import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border p-8 text-center",
        tone === "dark"
          ? "border-white/12 bg-white/[0.03] text-white"
          : "border-black/10 bg-[#f5f5f2] text-black",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("text-xs uppercase tracking-[0.24em]", tone === "dark" ? "text-white/40" : "text-black/40")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("mt-4 text-3xl font-semibold tracking-tight md:text-4xl", tone === "dark" ? "text-white" : "text-black")}>
        {title}
      </h2>
      <p
        className={cn(
          "mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg",
          tone === "dark" ? "text-white/62" : "text-black/62",
        )}
      >
        {description}
      </p>
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  );
}
