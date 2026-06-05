import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { SectionShell } from "@/components/ui/section-shell";
import type { CaseStudy } from "@/types";

export function CaseStrip({ cases }: { cases: CaseStudy[] }) {
  return (
    <SectionShell
      eyebrow="Production Proof"
      title="Built for lines where transport quality changes the process outcome"
      description="Case studies are positioned to reassure B2B buyers that AMO understands validation, uptime, and integration realities."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {cases.map((entry) => (
          <article key={entry.slug} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-glow">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">{entry.sector}</p>
            <h3 className="mt-4 font-display text-2xl text-white">{entry.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{entry.summary}</p>
            <div className="mt-6 space-y-3 border-t border-white/8 pt-5 text-sm text-slate-300">
              {entry.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-4">
                  <span>{metric.label}</span>
                  <span className="text-white">{metric.value}</span>
                </div>
              ))}
            </div>
            <Link href={`/cases/${entry.slug}`} className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-6" })}>
              Read Case
            </Link>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

