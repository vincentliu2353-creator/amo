import Link from "next/link";

import { cn } from "@/lib/utils";

interface ArticleCardProps {
  href: string;
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  imageLabel?: string;
  featured?: boolean;
  tone?: "light" | "dark";
}

export function ArticleCard({
  href,
  category,
  title,
  excerpt,
  meta,
  imageLabel = "AMO Journal",
  featured = false,
  tone = "light",
}: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[2rem] border transition duration-300",
        tone === "dark"
          ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] text-white hover:border-white/22"
          : "border-black/10 bg-white text-black hover:border-black/18",
        featured && "grid gap-0 lg:grid-cols-[1.2fr_1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "relative aspect-[4/3]",
            tone === "dark"
              ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#151515,#090909_70%)]"
              : "bg-[#ecebe6]",
            featured && "h-full aspect-auto min-h-[22rem]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0",
              tone === "dark"
                ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(9,9,9,0.16))]"
                : "bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(225,225,219,0.92))]",
            )}
          />
          <div className="absolute inset-0 scale-100 transition duration-500 group-hover:scale-[1.04]">
            <div className="flex h-full items-end justify-start p-6">
              <span
                className={cn(
                  "rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.24em] backdrop-blur",
                  tone === "dark"
                    ? "border border-white/14 bg-black/38 text-white/58"
                    : "border border-black/10 bg-white/70 text-black/56",
                )}
              >
                {imageLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("flex flex-col p-6 md:p-8", featured && "justify-between")}>
        <div>
          <p className={cn("text-xs uppercase tracking-[0.24em]", tone === "dark" ? "text-white/44" : "text-black/40")}>
            {category}
          </p>
          <Link href={href} className="block">
            <h2
              className={cn(
                "mt-4 text-3xl font-semibold tracking-tight transition duration-300 group-hover:-translate-y-0.5",
                tone === "dark" ? "text-white" : "text-black",
              )}
            >
              {title}
            </h2>
          </Link>
          <p className={cn("mt-4 text-base leading-relaxed", tone === "dark" ? "text-white/64" : "text-black/64")}>
            {excerpt}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className={cn("text-sm", tone === "dark" ? "text-white/44" : "text-black/44")}>{meta}</p>
          <Link
            href={href}
            className={cn(
              "text-sm font-medium transition",
              tone === "dark" ? "text-white hover:text-white/72" : "text-black hover:text-black/72",
            )}
          >
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
}
