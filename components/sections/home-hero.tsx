import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

const metrics = [
  { label: "Programs launched", value: "80+" },
  { label: "Response time", value: "24h" },
  { label: "Precision tier", value: "+/- 5 um" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_80%_18%,rgba(148,163,184,0.16),transparent_24%),linear-gradient(180deg,#050816_0%,#070d1d_42%,#050816_100%)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.08]" />
      <div className="absolute left-1/2 top-[12%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[140px]" />

      <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="max-w-3xl">
          <Eyebrow>B2B Magnetic Levitation Platform</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.92] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Contactless motion systems engineered for OEM production advantage.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            AMO designs magnetic levitation products for precision transport, six-axis stabilization, and software-defined
            factory routing. Built for semiconductor, photonics, medical, and advanced automation programs.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/products" className={buttonStyles({ size: "lg" })}>
              Explore Product Systems
            </Link>
            <Link href="/oem-odm" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              OEM & ODM Capabilities
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-glow">
                <p className="font-display text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(124,243,255,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(10,15,30,0.28)_35%,rgba(3,7,18,0.85)_100%)] shadow-glow" />
          <div className="relative grid min-h-[32rem] gap-6 rounded-[2rem] p-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/75">Platform Advantage</p>
              <p className="mt-4 font-display text-3xl text-white">Software-defined routing, zero-contact wear, and premium line differentiation.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Precision Control</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Levitation stages and planar motors tuned for cleanroom transport, optical alignment, and adaptive buffering.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">OEM Launch Support</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Co-development from concept study to pilot line commissioning, with white-label and ODM options.
                </p>
              </div>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Industries</p>
                <p className="mt-3 text-sm text-white">Semiconductor, photonics, medical, new energy</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Programs</p>
                <p className="mt-3 text-sm text-white">Pilot line, OEM module, factory retrofit</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Commercial Models</p>
                <p className="mt-3 text-sm text-white">Standard, OEM, ODM, private-label</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

