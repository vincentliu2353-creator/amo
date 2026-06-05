import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

interface InnerPageShellProps {
  children: ReactNode;
  className?: string;
  showChrome?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function InnerPageShell({
  children,
  className,
  showChrome = false,
  showHeader = false,
  showFooter = false,
}: InnerPageShellProps) {
  const headerEnabled = showChrome || showHeader;
  const footerEnabled = showChrome || showFooter;

  return (
    <div className={cn("relative flex min-h-screen flex-col overflow-x-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.07),transparent_24%),linear-gradient(180deg,#020304_0%,#070b11_46%,#030405_100%)]"
      />
      {headerEnabled ? <SiteHeader /> : null}
      <main className="relative flex-1">{children}</main>
      {footerEnabled ? <SiteFooter /> : null}
    </div>
  );
}
