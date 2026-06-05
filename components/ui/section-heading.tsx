import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type SectionHeadingSize = "page" | "section" | "compact";
type SectionHeadingAlign = "left" | "center";

const titleSizes: Record<SectionHeadingSize, string> = {
  page: "text-4xl sm:text-6xl",
  section: "text-3xl sm:text-5xl",
  compact: "text-2xl sm:text-3xl",
};

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  size?: SectionHeadingSize;
  align?: SectionHeadingAlign;
  actions?: ReactNode;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  size = "section",
  align = "left",
  actions,
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      <div className={cn("max-w-5xl", align === "center" && "mx-auto")}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <HeadingTag
          className={cn(
            "mt-5 font-display font-semibold tracking-[-0.04em] text-white",
            titleSizes[size],
            titleClassName,
          )}
        >
          {title}
        </HeadingTag>
        {description ? (
          <p className={cn("mt-5 max-w-3xl text-[15px] leading-8 text-slate-300 sm:text-base", align === "center" && "mx-auto", descriptionClassName)}>
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className={cn("flex flex-wrap gap-3", align === "center" && "justify-center")}>{actions}</div> : null}
    </div>
  );
}
