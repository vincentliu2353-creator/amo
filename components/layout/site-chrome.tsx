"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { HomeSiteFooter } from "@/components/layout/home-site-footer";
import { HomeSiteHeader } from "@/components/layout/home-site-header";
import { QuoteDock } from "@/components/rfq/quote-dock";

const CHROMELESS_PREFIXES = ["/sales-deck", "/company-deck"] as const;

function isChromelessPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return CHROMELESS_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isChromelessPath(pathname)) {
    return <div className="relative min-h-screen overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.05),transparent_24%)]" />
      <HomeSiteHeader />
      <div className="relative flex-1">{children}</div>
      <HomeSiteFooter />
      <QuoteDock />
    </div>
  );
}
