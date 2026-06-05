import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

function accentColor(accent: string, alpha: number) {
  return `rgb(${accent} / ${alpha})`;
}

function Ring({
  accent,
  className,
  rotate = 0,
}: {
  accent: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={cn("absolute rounded-full border", className)}
      style={{
        borderColor: accentColor(accent, 0.28),
        boxShadow: `0 0 80px ${accentColor(accent, 0.16)}`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }}
    />
  );
}

function FieldLines({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-x-8 top-10 bottom-10 overflow-hidden rounded-[23px] opacity-70">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-[-8%] right-[-8%] h-px"
          style={{
            top: `${12 + index * 11}%`,
            background: `linear-gradient(90deg, transparent, ${accentColor(accent, 0.22)}, transparent)`,
            transform: `translateY(${index % 2 === 0 ? "0" : "6px"})`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroVideoPlaceholder() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_18%),linear-gradient(180deg,#010101_0%,#050505_42%,#0a0a0a_100%)]" />
      <div className="absolute inset-y-0 right-[-18%] w-[62%] rounded-l-[46%] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_35%,rgba(255,255,255,0)_90%)] opacity-70 blur-[2px]" />
      <div className="absolute right-[8%] top-[16%] h-[72vh] w-[38vw] min-w-[240px] rounded-[48%] border border-white/10 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.24),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_42%,rgba(255,255,255,0)_100%)] opacity-55 shadow-[0_0_120px_rgba(255,255,255,0.06)]" />
      <div className="animate-home-drift absolute -left-12 top-[20%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_66%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/68 to-transparent" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-[-10%] right-[28%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ top: `${18 + index * 11}%` }}
        />
      ))}
      <div className="absolute left-[10%] top-[18%] h-44 w-44 rounded-full border border-white/10" />
      <div className="absolute left-[12%] top-[20%] h-40 w-40 animate-home-pulse rounded-full border border-white/15" />
      <div className="absolute bottom-[14%] left-[8%] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-white/45">
        Video Placeholder
      </div>
    </div>
  );
}

export function ProductStageVisual({
  accent,
  indexLabel,
  label,
}: {
  accent: string;
  indexLabel: string;
  label: string;
}) {
  const panelStyle: CSSProperties = {
    backgroundImage: `radial-gradient(circle at 24% 18%, ${accentColor(accent, 0.18)}, transparent 20%), linear-gradient(180deg, #060606 0%, #0f0f0f 100%)`,
  };

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-[24px] border border-black/10 bg-black text-white shadow-[0_24px_120px_rgba(0,0,0,0.24)]" style={panelStyle}>
      <FieldLines accent={accent} />
      <div className="absolute inset-x-8 bottom-8 top-8 rounded-[23px] border border-white/8" />
      <Ring accent={accent} className="left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 animate-home-orbit" />
      <Ring accent={accent} className="left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2" rotate={22} />
      <div
        className="animate-home-float absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 rounded-[32%] border border-white/14 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_44%,rgba(255,255,255,0)_100%)] shadow-[0_26px_90px_rgba(0,0,0,0.4)]"
        style={{ boxShadow: `0 26px 90px rgba(0,0,0,0.42), 0 0 80px ${accentColor(accent, 0.22)}` }}
      />
      <div
        className="absolute left-1/2 top-[68%] h-7 w-40 -translate-x-1/2 rounded-full blur-lg"
        style={{ background: accentColor(accent, 0.28) }}
      />
      <div className="absolute left-8 top-8 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/55">{indexLabel}</div>
      <div className="absolute bottom-8 left-8 max-w-[12rem] font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/45">{label}</div>
    </div>
  );
}

export function TechnicalDiagramVisual() {
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(115,229,255,0.12),transparent_28%),linear-gradient(180deg,#07090d_0%,#0b0d11_100%)] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-8 rounded-[23px] border border-white/8" />
      <svg viewBox="0 0 720 560" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="field-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(128,222,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 7 }).map((_, index) => (
          <path
            key={index}
            d={`M70 ${120 + index * 44} C 220 ${72 + index * 22}, 500 ${168 + index * 18}, 650 ${112 + index * 44}`}
            fill="none"
            stroke="url(#field-line)"
            strokeWidth="1.4"
            opacity={0.45 + index * 0.06}
          />
        ))}
        <ellipse cx="360" cy="414" rx="184" ry="54" fill="none" stroke="rgba(128,222,255,0.28)" strokeWidth="3" />
        <ellipse cx="360" cy="414" rx="132" ry="32" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
        <line x1="566" y1="136" x2="566" y2="336" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" strokeDasharray="6 8" />
        <rect x="578" y="146" width="72" height="34" rx="17" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
        <text x="614" y="167" fill="rgba(255,255,255,0.72)" fontSize="12" textAnchor="middle" letterSpacing="0">
          18 MM
        </text>
      </svg>
      <div className="absolute left-1/2 top-[34%] h-32 w-32 -translate-x-1/2 rounded-[30%] border border-white/18 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.26),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_55%,rgba(255,255,255,0)_100%)] shadow-[0_0_90px_rgba(128,222,255,0.16)]" />
      <div className="absolute left-1/2 top-[58%] h-6 w-40 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-xl" />
      <div className="absolute left-[12%] top-[14%] rounded-full border border-white/10 bg-white/5 px-4 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/45">
        Field Geometry
      </div>
      <div className="absolute bottom-[12%] left-[12%] rounded-full border border-cyan-300/18 bg-cyan-300/8 px-4 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-cyan-50/80">
        Silent Lift Base
      </div>
    </div>
  );
}

export function ProcessMorphVisual({
  accent,
  stepLabel,
}: {
  accent: string;
  stepLabel: string;
}) {
  return (
    <div
      className="relative min-h-[380px] overflow-hidden rounded-[24px] border border-black/10 bg-black text-white"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor(accent, 0.18)}, transparent 18%), linear-gradient(180deg, #080808 0%, #111111 100%)`,
      }}
    >
      <div className="absolute inset-8 rounded-[23px] border border-white/8" />
      <div className="absolute left-8 top-8 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-white/45">{stepLabel}</div>
      <div className="absolute inset-x-[16%] top-[18%] h-[44%] rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />
      <div className="absolute inset-x-[22%] top-[28%] h-[34%] rounded-[23px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
      <div className="absolute inset-x-[28%] top-[38%] h-[24%] rounded-[23px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
      <div className="absolute left-1/2 top-[68%] h-5 w-44 -translate-x-1/2 rounded-full blur-xl" style={{ background: accentColor(accent, 0.3) }} />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-[18%] right-[18%] h-px"
          style={{
            top: `${20 + index * 16}%`,
            background: `linear-gradient(90deg, transparent, ${accentColor(accent, 0.22)}, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

export function ScenarioSceneVisual({
  accent,
  caption,
  title,
}: {
  accent: string;
  caption: string;
  title: string;
}) {
  return (
    <div
      className="relative min-h-[460px] overflow-hidden rounded-[2.75rem] border border-white/10 text-white shadow-[0_36px_120px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor(accent, 0.22)}, transparent 20%), linear-gradient(160deg, rgba(255,255,255,0.08), rgba(8,8,8,0.94) 62%)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="absolute inset-x-[10%] bottom-0 top-[18%] rounded-t-[2.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
      <div className="absolute left-[18%] top-[24%] h-[44%] w-[24%] rounded-[1.5rem] border border-white/10 bg-white/6" />
      <div className="absolute right-[18%] top-[20%] h-[48%] w-[30%] rounded-[2rem] border border-white/10 bg-white/5" />
      <div className="absolute left-1/2 top-[54%] h-28 w-28 -translate-x-1/2 rounded-[28%] border border-white/16 bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.26),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_48%,rgba(255,255,255,0)_100%)] shadow-[0_0_90px_rgba(0,0,0,0.34)]" />
      <div className="absolute left-1/2 top-[70%] h-5 w-36 -translate-x-1/2 rounded-full blur-xl" style={{ background: accentColor(accent, 0.3) }} />
      <div className="absolute bottom-8 left-8 right-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">{caption}</p>
        <p className="mt-3 max-w-sm font-display text-3xl">{title}</p>
      </div>
    </div>
  );
}
