import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AmoCardTone = "hero" | "default" | "subtle";
export type AmoCardPadding = "none" | "sm" | "md" | "lg";

const toneStyles: Record<AmoCardTone, string> = {
  hero:
    "bg-[radial-gradient(circle_at_top_left,rgba(166,232,255,0.14),transparent_30%),linear-gradient(155deg,rgba(255,255,255,0.06),rgba(7,10,16,0.94)_72%)]",
  default:
    "bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(7,10,16,0.9))]",
  subtle: "bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(7,10,16,0.84))]",
};

const paddingStyles: Record<AmoCardPadding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8 sm:p-10",
};

export function amoCardStyles({
  tone = "default",
  padding = "md",
  interactive = false,
  className,
}: {
  tone?: AmoCardTone;
  padding?: AmoCardPadding;
  interactive?: boolean;
  className?: string;
}) {
  return cn(
    "relative overflow-hidden rounded-[2rem] border border-white/10 text-white backdrop-blur-[18px]",
    "before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/18 before:to-transparent before:content-['']",
    "after:pointer-events-none after:absolute after:right-4 after:top-4 after:h-24 after:w-24 after:rounded-full after:bg-cyan-100/8 after:blur-3xl after:content-['']",
    "shadow-[0_24px_90px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]",
    toneStyles[tone],
    paddingStyles[padding],
    interactive &&
      "transition duration-500 hover:-translate-y-1 hover:border-cyan-100/18 hover:shadow-[0_32px_110px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
    className,
  );
}

interface AmoCardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section";
  children?: ReactNode;
  tone?: AmoCardTone;
  padding?: AmoCardPadding;
  interactive?: boolean;
}

export function AmoCard({
  as = "div",
  children,
  className,
  tone = "default",
  padding = "md",
  interactive = false,
  ...props
}: AmoCardProps) {
  return createElement(
    as,
    {
      ...props,
      className: amoCardStyles({ tone, padding, interactive, className }),
    },
    children,
  );
}
