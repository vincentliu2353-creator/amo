import type { ReactNode } from "react";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { cn } from "@/lib/utils";
import { ProductsSiteHeader } from "@/components/products/products-site-header";

interface ProductsPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ProductsPageLayout({ children, className }: ProductsPageLayoutProps) {
  return (
    <div className={cn("relative min-h-screen overflow-x-hidden bg-black text-[#111111]", className)}>
      <ProductsSiteHeader />

      <main className="relative z-10">{children}</main>
      <ApprovedHomeFooter />
    </div>
  );
}
