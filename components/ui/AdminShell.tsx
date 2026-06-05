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
    <div className="rounded-[2rem] border border-white/8 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
      <div className="grid min-h-[72vh] lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between rounded-t-[2rem] bg-[#0b0b0b] p-6 text-white lg:rounded-l-[2rem] lg:rounded-tr-none lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">AMO Admin</p>
            <nav className="mt-8 space-y-2">
              {adminNavItems.map((item) => {
                const active = (current === "dashboard" && item.href === "/admin") || (current === "products" && item.href === "/admin/products");

                if (!item.href || item.disabled) {
                  return (
                    <span
                      key={item.label}
                      className="block rounded-full px-4 py-3 text-sm text-white/34"
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
                      "block rounded-full px-4 py-3 text-sm transition",
                      active ? "bg-white text-black" : "text-white/64 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">Workspace</p>
            <p className="mt-3 text-sm leading-6 text-white/68">Operational pages stay practical, quiet, and separate from the public brand storytelling layers.</p>
          </div>
        </aside>

        <div className="rounded-b-[2rem] bg-[#fbfaf7] p-6 text-black lg:rounded-r-[2rem] lg:rounded-bl-none lg:p-10">
          <div className="flex flex-col gap-4 border-b border-black/8 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/42">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/62">{description}</p>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
