"use client";

import { usePathname } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";

export function HomeSiteFooter() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return <ApprovedHomeFooter />;
}
