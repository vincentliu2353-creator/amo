import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { AmoCard } from "@/components/ui/amo-card";
import { buttonStyles } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NotFound() {
  return (
    <PageShell width="content">
      <AmoCard tone="hero" padding="lg" className="text-center">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/80">404</p>
        <SectionHeading
          as="h1"
          title="The requested AMO page was not found."
          description="This scaffold includes all core routes, but the current path does not match an existing product, case study, or page."
          size="page"
          align="center"
          className="mt-4"
        />
        <div className="mt-8">
          <Link href="/" className={buttonStyles({ size: "sm" })}>
            Return Home
          </Link>
        </div>
      </AmoCard>
    </PageShell>
  );
}
