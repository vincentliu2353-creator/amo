import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type NexusPanelTone = "default" | "hero" | "subtle";
type NexusPanelPadding = "none" | "sm" | "md" | "lg";

const toneStyles: Record<NexusPanelTone, string> = {
  hero: "bg-[#171717]/92 shadow-[0_30px_90px_rgba(0,0,0,0.42)]",
  default: "bg-[#171717]/88 shadow-[0_24px_72px_rgba(0,0,0,0.36)]",
  subtle: "bg-[#171717]/82 shadow-[0_18px_48px_rgba(0,0,0,0.28)]",
};

const paddingStyles: Record<NexusPanelPadding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10 xl:p-12",
};

export function nexusPanelInnerStyles({
  tone = "default",
  padding = "md",
  className,
}: {
  tone?: NexusPanelTone;
  padding?: NexusPanelPadding;
  className?: string;
}) {
  return cn(
    "relative overflow-hidden rounded-[23px] border border-[#262626] text-white backdrop-blur-[24px]",
    "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%)] before:content-['']",
    toneStyles[tone],
    paddingStyles[padding],
    className,
  );
}

interface NexusPanelProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "aside" | "form";
  children?: ReactNode;
  outerClassName?: string;
  tone?: NexusPanelTone;
  padding?: NexusPanelPadding;
}

export function NexusPanel({
  as = "div",
  children,
  className,
  outerClassName,
  tone = "default",
  padding = "md",
  ...props
}: NexusPanelProps) {
  return (
    <div className={cn("rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px", outerClassName)}>
      {createElement(
        as,
        {
          ...props,
          className: nexusPanelInnerStyles({ tone, padding, className }),
        },
        children,
      )}
    </div>
  );
}
