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
}

export function ArticleCard({
  href,
  category,
  title,
  excerpt,
  meta,
  imageLabel = "AMO Journal",
  featured = false,
}: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[2rem] border border-black/10 bg-white transition duration-300 hover:border-black/18",
        featured && "grid gap-0 lg:grid-cols-[1.2fr_1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className={cn("relative aspect-[4/3] bg-[#ecebe6]", featured && "h-full aspect-auto min-h-[22rem]")}>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(225,225,219,0.92))]" />
          <div className="absolute inset-0 scale-100 transition duration-500 group-hover:scale-[1.04]">
            <div className="flex h-full items-end justify-start p-6">
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-black/56 backdrop-blur">
                {imageLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("flex flex-col p-6 md:p-8", featured && "justify-between")}>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-black/40">{category}</p>
          <Link href={href} className="block">
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black transition duration-300 group-hover:-translate-y-0.5">
              {title}
            </h2>
          </Link>
          <p className="mt-4 text-base leading-relaxed text-black/64">{excerpt}</p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-black/44">{meta}</p>
          <Link href={href} className="text-sm font-medium text-black transition hover:text-black/72">
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
}
