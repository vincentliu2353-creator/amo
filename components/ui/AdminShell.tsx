import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AdminNavItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Cases", disabled: true },
  { label: "Blog", disabled: true },
  { label: "RFQs", disabled: true },
  { label: "Settings", disabled: true },
];

interface AdminShellProps {
  current: "dashboard" | "products";
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminShell({ current, title, description, children, actions }: AdminShellProps) {
  return (
    <div className="rounded-[2.25rem] border border-white/10 bg-black text-white shadow-[0_24px_90px_rgba(0,0,0,0.34)]">
      <div className="border-b border-white/10 px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">AMO Admin</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/62">{description}</p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        <nav className="mt-8 flex flex-wrap gap-3">
          {adminNavItems.map((item) => {
            const active = (current === "dashboard" && item.href === "/admin") || (current === "products" && item.href === "/admin/products");

            if (!item.href || item.disabled) {
              return (
                <span
                  key={item.label}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/30"
                >
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full border px-4 py-3 text-sm transition",
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/12 text-white/64 hover:border-white/24 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 lg:p-10">
        <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/[0.02] px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">Workspace</p>
          <p className="mt-3 text-sm leading-6 text-white/62">
            Operational pages stay practical, quiet, and separate from the public brand storytelling layers.
          </p>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
