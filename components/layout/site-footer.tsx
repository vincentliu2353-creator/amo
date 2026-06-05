import Link from "next/link";

import { AmoCard } from "@/components/ui/amo-card";
import { amoButtonStyles } from "@/components/ui/amo-button";
import { Container } from "@/components/ui/container";
import { footerCategories, footerPrograms, footerNav, siteConfig } from "@/lib/site-config";

const footerChannels = ["LinkedIn Placeholder", "WeChat Placeholder", "Technical Support Placeholder"];
export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black/92">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(166,232,255,0.16),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,#030405_0%,#090d13_100%)]"
      />

      <Container className="relative py-14 sm:py-16">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.65fr_0.7fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.3em] text-white">AMO</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">Premium B2B Platform</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Magnetic levitation platforms positioned for OEM integration, industrial transfer precision, and premium motion presentation.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Navigation</p>
            <div className="mt-4 space-y-3">
              {footerNav.map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Product Categories</p>
            <div className="mt-4 space-y-3">
              {footerCategories.map((item) => (
                <Link key={item.label} href={item.href} className="block text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-slate-500">OEM / ODM</p>
            <div className="mt-4 space-y-3">
              {footerPrograms.map((item) => (
                <Link key={item.label} href={item.href} className="block text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <AmoCard tone="hero" padding="md" className="h-full">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Contact AMO</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">
              Discuss the motion architecture before the RFQ gets locked.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Start with product selection, OEM integration, or a clean technical brief. The commercial path stays precise from first contact.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/rfq" className={amoButtonStyles({ size: "sm" })}>
                Get Quote
              </Link>
              <a href={`mailto:${siteConfig.email}`} className={amoButtonStyles({ variant: "secondary", size: "sm" })}>
                Email AMO
              </a>
            </div>
          </AmoCard>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            © 2026 AMO. Magnetic levitation systems for OEM manufacturing and premium product display.
          </p>

          <div className="flex flex-wrap gap-2">
            {footerChannels.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-slate-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
