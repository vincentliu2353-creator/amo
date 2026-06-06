import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  tone = "light",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <p
        className={cn(
          "text-xs uppercase tracking-[0.24em]",
          tone === "dark" ? "text-white/46" : "text-black/45",
        )}
      >
        {eyebrow}
      </p>
      <h1
        className={cn(
          "mt-4 text-5xl font-semibold tracking-tight md:text-7xl",
          tone === "dark" ? "text-white" : "text-black",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed md:text-lg",
            tone === "dark" ? "text-white/68" : "text-black/68",
            align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
