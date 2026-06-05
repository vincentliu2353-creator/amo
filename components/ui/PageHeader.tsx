import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <p className="text-xs uppercase tracking-[0.24em] text-black/45">{eyebrow}</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-black md:text-7xl">{title}</h1>
      {description ? (
        <p className={cn("mt-6 text-base leading-relaxed text-black/68 md:text-lg", align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl")}>
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
