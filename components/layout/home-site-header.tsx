"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SharedSiteNav, type SharedNavTheme } from "@/components/layout/shared-site-nav";

export function HomeSiteHeader() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<SharedNavTheme>("dark");

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let frame = 0;

    const updateTheme = () => {
      frame = 0;

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));
      let nextTheme: SharedNavTheme = "dark";
      let bestScore = -1;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const score = visibleHeight / Math.max(1, Math.min(window.innerHeight, rect.height));

        if (score > bestScore) {
          bestScore = score;
          nextTheme = section.dataset.headerTheme === "light" ? "light" : "dark";
        }
      }

      setTheme(nextTheme);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateTheme);
    };

    updateTheme();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  if (pathname !== "/") {
    return null;
  }

  return <SharedSiteNav theme={theme} />;
}
