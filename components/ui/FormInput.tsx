import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  tone?: "light" | "dark";
  children: ReactNode;
}

export function FormInput({
  label,
  htmlFor,
  error,
  hint,
  tone = "light",
  children,
}: FormInputProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor={htmlFor}
        className={cn(
          "block text-xs uppercase tracking-[0.24em]",
          tone === "dark" ? "text-white/48" : "text-black/48",
        )}
      >
        {label}
      </label>
      {children}
      {hint ? <p className={cn("text-sm", tone === "dark" ? "text-white/44" : "text-black/44")}>{hint}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
