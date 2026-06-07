import Image from "next/image";

import type { CaseImageAsset } from "@/components/cases/case-image-assets";
import { cn } from "@/lib/utils";

interface CaseStageVisualProps {
  captionMode?: "panel" | "plain";
  className?: string;
  detail?: string;
  image: CaseImageAsset;
  imageFit?: "contain" | "cover";
  label?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  quality?: number;
  sizes: string;
  theme?: "light" | "dark";
  title?: string;
  unoptimized?: boolean;
}

export function CaseStageVisual({
  captionMode = "panel",
  className,
  detail,
  image,
  imageFit = "cover",
  label,
  loading = "lazy",
  priority = false,
  quality = 80,
  sizes,
  theme = "light",
  title,
  unoptimized = false,
}: CaseStageVisualProps) {
  const dark = theme === "dark";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[34px] border shadow-[0_24px_70px_rgba(15,23,42,0.08)]",
        dark ? "border-white/10 bg-[#07090c]" : "border-black/8 bg-[#f5f4ee]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        loading={priority ? undefined : loading}
        unoptimized={unoptimized}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={cn(
          imageFit === "contain" ? "object-contain p-4 sm:p-6" : "object-cover",
          dark ? "bg-[#07090c]" : "bg-[#f5f4ee]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_40%,rgba(0,0,0,0.42)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_36%,rgba(15,23,42,0.08)_100%)]",
        )}
      />

      {label || title || detail ? (
        <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 lg:p-8">
          <div
            className={cn(
              "max-w-[21rem]",
              captionMode === "panel"
                ? cn("rounded-[26px] border px-5 py-4 backdrop-blur-md", dark ? "border-white/10 bg-black/26" : "border-white/55 bg-white/70")
                : "",
            )}
          >
            {label ? (
              <p
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.28em]",
                  captionMode === "plain"
                    ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
                    : dark
                      ? "text-white/52"
                      : "text-black/42",
                )}
              >
                {label}
              </p>
            ) : null}
            {title ? (
              <h3
                className={cn(
                  "mt-4 font-sans text-[24px] font-medium leading-[1.02] tracking-[-0.05em] sm:text-[30px] lg:text-[34px]",
                  captionMode === "plain"
                    ? "text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
                    : dark
                      ? "text-white"
                      : "text-black",
                )}
              >
                {title}
              </h3>
            ) : null}
            {detail ? (
              <p
                className={cn(
                  "mt-4 text-[14px] leading-6 sm:text-[15px]",
                  captionMode === "plain"
                    ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                    : dark
                      ? "text-white"
                      : "text-black/58",
                )}
              >
                {detail}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
