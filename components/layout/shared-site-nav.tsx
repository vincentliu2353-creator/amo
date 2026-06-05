"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type SharedNavTheme = "dark" | "light";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cases", label: "Cases" },
  { href: "/oem-odm", label: "OEM&ODM" },
  { href: "/about", label: "About" },
];

const themeClasses: Record<
  SharedNavTheme,
  {
    active: string;
    button: string;
    item: string;
    mobileActive: string;
    mobileDropdownGlow: string;
    mobileDropdownPanel: string;
    mobileItem: string;
    mobileToggle: string;
    panel: string;
  }
> = {
  dark: {
    panel: "border-white/10 bg-black/34 text-white shadow-[0_24px_80px_rgba(0,0,0,0.26)]",
    item: "text-white/72 hover:bg-white/[0.04] hover:text-white hover:shadow-[0_0_26px_rgba(166,232,255,0.08)]",
    active: "border-white/12 bg-white/[0.08] text-white shadow-[0_0_26px_rgba(166,232,255,0.08)]",
    button: "border-white/16 bg-white/[0.06] text-white hover:border-white/28 hover:bg-white/[0.12]",
    mobileDropdownPanel:
      "border-white/[0.12] bg-[rgba(5,5,8,0.88)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)]",
    mobileDropdownGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_20%)]",
    mobileToggle: "border-white/10 bg-white/[0.04] text-white",
    mobileItem:
      "border-white/10 bg-white/[0.05] text-white hover:border-white/16 hover:bg-white/[0.08] hover:text-white",
    mobileActive: "border-white/14 bg-white/[0.1] text-white shadow-[0_0_26px_rgba(166,232,255,0.08)]",
  },
  light: {
    panel: "border-black/10 bg-white/78 text-black shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
    item: "text-black/64 hover:bg-black/[0.04] hover:text-black hover:shadow-[0_0_26px_rgba(15,23,42,0.08)]",
    active: "border-black/10 bg-black/[0.07] text-black shadow-[0_0_22px_rgba(15,23,42,0.08)]",
    button: "border-black/10 bg-black text-white hover:border-black/20 hover:bg-black/90",
    mobileDropdownPanel:
      "border-black/10 bg-[rgba(255,255,255,0.9)] text-black shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
    mobileDropdownGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%)]",
    mobileToggle: "border-black/10 bg-black/5 text-black",
    mobileItem:
      "border-black/8 bg-black/[0.04] text-black/80 hover:border-black/12 hover:bg-black/[0.07] hover:text-black",
    mobileActive: "border-black/10 bg-black/[0.08] text-black shadow-[0_0_22px_rgba(15,23,42,0.08)]",
  },
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SharedSiteNavProps {
  theme: SharedNavTheme;
}

export function SharedSiteNav({ theme }: SharedSiteNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500">
      <Container className="py-4 sm:py-5">
        <div className="relative">
          <div
            className={cn(
              "rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-500 sm:px-6",
              themeClasses[theme].panel,
            )}
          >
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
              <Link
                href="/"
                aria-label="AMO homepage"
                className="inline-flex h-9 w-[64px] items-center justify-center justify-self-start rounded-full bg-black"
              >
                <Image
                  src="/amo-logo-white.png"
                  alt="AMO"
                  width={37}
                  height={17}
                  priority
                  className="h-[19px] w-auto"
                />
              </Link>

              <nav className="hidden items-center justify-center gap-2 lg:flex">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full border border-transparent px-3 py-2 text-xs uppercase tracking-[0.26em] transition duration-300",
                        isActive ? themeClasses[theme].active : themeClasses[theme].item,
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/rfq"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition duration-300",
                    themeClasses[theme].button,
                  )}
                >
                  Request Quote
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen((open) => !open)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden",
                    themeClasses[theme].mobileToggle,
                  )}
                  aria-expanded={mobileOpen}
                  aria-label="Toggle navigation menu"
                >
                  <span className="space-y-1.5">
                    <span className="block h-px w-4 bg-current" />
                    <span className="block h-px w-4 bg-current" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[60] lg:hidden",
              "transition-all duration-300 ease-out",
              mobileOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-[22px] border p-4 backdrop-blur-2xl",
                themeClasses[theme].mobileDropdownPanel,
              )}
            >
              <div
                aria-hidden
                className={cn("pointer-events-none absolute inset-0", themeClasses[theme].mobileDropdownGlow)}
              />
              <nav className="relative grid gap-2">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-[20px] border px-4 py-3 text-sm uppercase tracking-[0.22em] transition duration-300",
                        isActive ? themeClasses[theme].mobileActive : themeClasses[theme].mobileItem,
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  href="/rfq"
                  className={cn(
                    "mt-2 inline-flex w-full items-center justify-center rounded-[20px] px-4 py-3 text-sm font-medium uppercase tracking-[0.22em] transition duration-300",
                    themeClasses[theme].button,
                  )}
                >
                  Request Quote
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
