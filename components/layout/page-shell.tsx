import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type PageShellWidth = "wide" | "page" | "content";
type PageShellGlow = "top" | "center" | "low" | "none";

const widthStyles: Record<PageShellWidth, string> = {
  wide: "w-full",
  page: "mx-auto w-full max-w-[74rem]",
  content: "mx-auto w-full max-w-4xl",
};

const glowStyles: Record<Exclude<PageShellGlow, "none">, string> = {
  top: "bg-[radial-gradient(circle_at_top,rgba(166,232,255,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%,transparent_100%)]",
  center:
    "bg-[radial-gradient(circle_at_center,rgba(166,232,255,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,transparent_100%)]",
  low: "bg-[radial-gradient(circle_at_50%_80%,rgba(166,232,255,0.09),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_22%,transparent_100%)]",
};

interface PageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  width?: PageShellWidth;
  glow?: PageShellGlow;
}

export function PageShell({
  children,
  className,
  contentClassName,
  width = "page",
  glow = "top",
}: PageShellProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      {glow === "none" ? null : <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", glowStyles[glow])} />}

      <Container className="relative z-10">
        <div className={cn("pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24", widthStyles[width], contentClassName)}>
          {children}
        </div>
      </Container>
    </section>
  );
}
