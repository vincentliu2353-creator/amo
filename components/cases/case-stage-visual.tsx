import { cn } from "@/lib/utils";

export type CaseSceneVariant =
  | "retail"
  | "museum"
  | "hotel"
  | "exhibition"
  | "office"
  | "gifting"
  | "before"
  | "after";

interface CaseStageVisualProps {
  className?: string;
  detail?: string;
  label?: string;
  theme?: "light" | "dark";
  title?: string;
  variant: CaseSceneVariant;
}

const sceneStyles: Record<
  CaseSceneVariant,
  {
    beam: string;
    glow: string;
    orb: string;
    panel: string;
    shell: string;
    stage: string;
  }
> = {
  retail: {
    beam: "rgba(15,23,42,0.14)",
    glow: "rgba(224,232,238,0.88)",
    orb: "rgba(255,255,255,0.96)",
    panel: "#f4f3ee",
    shell: "#ffffff",
    stage: "#eceae3",
  },
  museum: {
    beam: "rgba(24,30,36,0.16)",
    glow: "rgba(229,233,235,0.82)",
    orb: "rgba(244,246,247,0.94)",
    panel: "#f2f2ef",
    shell: "#fdfdfc",
    stage: "#ebeae6",
  },
  hotel: {
    beam: "rgba(31,25,21,0.18)",
    glow: "rgba(234,226,220,0.8)",
    orb: "rgba(255,249,244,0.95)",
    panel: "#f4efea",
    shell: "#fffdfb",
    stage: "#eee4db",
  },
  exhibition: {
    beam: "rgba(18,28,38,0.17)",
    glow: "rgba(226,234,241,0.84)",
    orb: "rgba(247,250,252,0.96)",
    panel: "#f3f5f7",
    shell: "#ffffff",
    stage: "#e8edf1",
  },
  office: {
    beam: "rgba(20,28,33,0.16)",
    glow: "rgba(223,230,233,0.82)",
    orb: "rgba(246,249,250,0.95)",
    panel: "#f1f4f4",
    shell: "#fcfdfd",
    stage: "#e8eded",
  },
  gifting: {
    beam: "rgba(36,28,18,0.18)",
    glow: "rgba(238,232,220,0.84)",
    orb: "rgba(255,251,245,0.96)",
    panel: "#f5f1ea",
    shell: "#fffdf9",
    stage: "#efe8dc",
  },
  before: {
    beam: "rgba(64,64,64,0.16)",
    glow: "rgba(235,235,235,0.86)",
    orb: "rgba(242,242,242,0.92)",
    panel: "#f3f3f2",
    shell: "#fcfcfb",
    stage: "#ececeb",
  },
  after: {
    beam: "rgba(255,255,255,0.14)",
    glow: "rgba(142,166,184,0.24)",
    orb: "rgba(255,255,255,0.94)",
    panel: "#0d1014",
    shell: "#050607",
    stage: "#11161d",
  },
};

function UpperPlatform({ dark }: { dark: boolean }) {
  return (
    <>
      <div
        className={cn(
          "absolute left-[11%] top-[12%] h-[14%] w-[22%] rounded-[30px] border",
          dark ? "border-white/10 bg-white/[0.06]" : "border-black/8 bg-white/70",
        )}
      />
      <div
        className={cn(
          "absolute right-[10%] top-[20%] h-[10%] w-[16%] rounded-[24px] border",
          dark ? "border-white/10 bg-white/[0.05]" : "border-black/8 bg-white/62",
        )}
      />
    </>
  );
}

function SideFrames({ dark }: { dark: boolean }) {
  return (
    <>
      <div
        className={cn(
          "absolute bottom-[14%] left-[12%] h-[28%] w-[21%] rounded-t-[34px] border",
          dark ? "border-white/10 bg-white/[0.05]" : "border-black/7 bg-white/54",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[14%] right-[12%] h-[36%] w-[24%] rounded-t-[40px] border",
          dark ? "border-white/10 bg-white/[0.06]" : "border-black/7 bg-white/58",
        )}
      />
    </>
  );
}

function VariantObject({ dark, variant }: { dark: boolean; variant: CaseSceneVariant }) {
  const baseClass = dark ? "border-white/15 bg-white/[0.08]" : "border-black/8 bg-white/80";

  if (variant === "museum") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[42%] h-[18%] w-[18%] -translate-x-1/2 rounded-[42%] border", baseClass)} />
        <div className={cn("absolute left-1/2 top-[53%] h-[5%] w-[22%] -translate-x-1/2 rounded-full", dark ? "bg-white/12" : "bg-black/8")} />
      </>
    );
  }

  if (variant === "hotel") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[39%] h-[19%] w-[14%] -translate-x-1/2 rounded-[30px] border", baseClass)} />
        <div className={cn("absolute left-1/2 top-[36%] h-[6%] w-[6%] -translate-x-1/2 rounded-full border", baseClass)} />
      </>
    );
  }

  if (variant === "exhibition") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[40%] h-[16%] w-[24%] -translate-x-1/2 rounded-[28px] border", baseClass)} />
        <div className={cn("absolute left-1/2 top-[58%] h-[4%] w-[28%] -translate-x-1/2 rounded-full", dark ? "bg-white/10" : "bg-black/8")} />
      </>
    );
  }

  if (variant === "office") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[36%] h-[22%] w-[10%] -translate-x-1/2 rounded-[24px] border", baseClass)} />
        <div className={cn("absolute left-1/2 top-[34%] h-[4%] w-[18%] -translate-x-1/2 rounded-full border", baseClass)} />
      </>
    );
  }

  if (variant === "gifting") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[41%] h-[16%] w-[16%] -translate-x-1/2 rounded-[26px] border", baseClass)} />
        <div
          className={cn(
            "absolute left-1/2 top-[37%] h-[8%] w-[8%] -translate-x-1/2 rounded-[12px] border",
            baseClass,
          )}
        />
      </>
    );
  }

  if (variant === "before") {
    return (
      <>
        <div className={cn("absolute left-1/2 top-[50%] h-[10%] w-[26%] -translate-x-1/2 rounded-[20px] border", baseClass)} />
        <div className={cn("absolute left-1/2 top-[41%] h-[12%] w-[12%] -translate-x-1/2 rounded-[18px] border", baseClass)} />
      </>
    );
  }

  return (
    <>
      <div className={cn("absolute left-1/2 top-[40%] h-[16%] w-[16%] -translate-x-1/2 rounded-[30px] border", baseClass)} />
      <div className={cn("absolute left-1/2 top-[58%] h-[4%] w-[24%] -translate-x-1/2 rounded-full", dark ? "bg-white/10" : "bg-black/8")} />
    </>
  );
}

export function CaseStageVisual({
  className,
  detail,
  label,
  theme = "light",
  title,
  variant,
}: CaseStageVisualProps) {
  const dark = theme === "dark";
  const style = sceneStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[34px] border shadow-[0_24px_70px_rgba(15,23,42,0.08)]",
        dark ? "border-white/10" : "border-black/8",
        className,
      )}
      style={{
        backgroundImage: dark
          ? `radial-gradient(circle at 18% 18%, ${style.glow}, transparent 24%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 20%), linear-gradient(180deg, ${style.shell} 0%, ${style.panel} 100%)`
          : `radial-gradient(circle at 18% 18%, ${style.glow}, transparent 24%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.94), transparent 20%), linear-gradient(180deg, ${style.shell} 0%, ${style.panel} 100%)`,
      }}
    >
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] opacity-26"
            : "bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] opacity-32",
        )}
        style={{ backgroundSize: "56px 56px" }}
      />
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_30%,rgba(0,0,0,0.3)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_28%,rgba(15,23,42,0.08)_100%)]",
        )}
      />

      <UpperPlatform dark={dark} />
      <SideFrames dark={dark} />

      <div
        className={cn(
          "absolute inset-x-[18%] top-[36%] h-px bg-gradient-to-r from-transparent to-transparent",
          dark ? "via-white/18" : "via-black/12",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-[22%] top-[58%] h-px bg-gradient-to-r from-transparent to-transparent",
          dark ? "via-white/14" : "via-black/10",
        )}
      />

      <VariantObject dark={dark} variant={variant} />

      <div
        className="absolute left-1/2 top-[61%] h-10 w-40 -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: style.beam }}
      />
      <div
        className={cn(
          "absolute left-1/2 top-[46%] h-24 w-24 -translate-x-1/2 rounded-[30px] border shadow-[0_0_80px_rgba(255,255,255,0.42)] sm:h-28 sm:w-28",
          dark ? "border-white/18" : "border-white/70",
        )}
        style={{ backgroundColor: style.orb }}
      />
      <div className={cn("absolute inset-0", dark ? "bg-black/6" : "")} />

      {(label || title || detail) ? (
        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 lg:p-8">
          <div className="max-w-[21rem]">
            {label ? (
              <p className={cn("text-[10px] font-medium uppercase tracking-[0.28em]", dark ? "text-white/44" : "text-black/42")}>
                {label}
              </p>
            ) : null}
            {title ? (
              <h3 className={cn("mt-4 font-sans text-[24px] font-medium leading-[1.02] tracking-[-0.05em] sm:text-[30px] lg:text-[34px]", dark ? "text-white" : "text-black")}>
                {title}
              </h3>
            ) : null}
            {detail ? (
              <p className={cn("mt-4 text-[14px] leading-6 sm:text-[15px]", dark ? "text-white/64" : "text-black/56")}>
                {detail}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
