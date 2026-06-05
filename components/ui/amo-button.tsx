import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AmoButtonVariant = "primary" | "secondary" | "ghost";
export type AmoButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<AmoButtonVariant, string> = {
  primary:
    "border-white/18 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(208,216,226,0.9))] text-slate-950 shadow-[0_18px_54px_rgba(190,201,218,0.18),0_0_0_1px_rgba(255,255,255,0.08)] hover:-translate-y-px hover:brightness-[1.03] hover:shadow-[0_24px_72px_rgba(190,201,218,0.24),0_0_0_1px_rgba(255,255,255,0.1)]",
  secondary:
    "border-white/12 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-px hover:border-cyan-100/24 hover:bg-white/[0.075]",
  ghost: "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
};

const sizeStyles: Record<AmoButtonSize, string> = {
  sm: "min-h-10 px-4 text-[10px] tracking-[0.26em]",
  md: "min-h-11 px-5 text-[11px] tracking-[0.28em]",
  lg: "min-h-12 px-6 text-[11px] tracking-[0.3em]",
};

export function amoButtonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: AmoButtonVariant;
  size?: AmoButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium uppercase transition duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/35 focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-45",
    fullWidth && "w-full",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

interface AmoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: AmoButtonVariant;
  size?: AmoButtonSize;
  fullWidth?: boolean;
}

export function AmoButton({
  children,
  className,
  size = "md",
  variant = "primary",
  fullWidth = false,
  ...props
}: AmoButtonProps) {
  return (
    <button className={amoButtonStyles({ variant, size, fullWidth, className })} {...props}>
      {children}
    </button>
  );
}
