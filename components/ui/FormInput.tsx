import type { ReactNode } from "react";

interface FormInputProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormInput({ label, htmlFor, error, hint, children }: FormInputProps) {
  return (
    <div className="space-y-3">
      <label htmlFor={htmlFor} className="block text-xs uppercase tracking-[0.24em] text-black/48">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-black/44">{hint}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
