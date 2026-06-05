import Link from "next/link";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface ProductsCatalogStateProps {
  eyebrow?: string;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

export function ProductsCatalogState({
  eyebrow = "Products",
  title,
  message,
  actionHref = "/rfq",
  actionLabel = "Request Quote",
  secondaryHref = "/",
  secondaryLabel = "Return Home",
  className,
}: ProductsCatalogStateProps) {
  return (
    <section className={cn("pb-20 pt-32 sm:pb-24 sm:pt-36", className)}>
      <Container>
        <div className="mx-auto max-w-3xl rounded-[40px] bg-white/72 px-6 py-12 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-10 sm:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/42">{eyebrow}</p>
          <h1 className="mx-auto mt-6 max-w-2xl font-sans text-[36px] font-medium leading-[0.94] tracking-[-0.06em] text-black sm:text-[52px]">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-black/62 sm:text-[17px]">{message}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={actionHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-[12px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-black/88"
            >
              {actionLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white/76 px-6 text-[12px] font-medium uppercase tracking-[0.2em] text-black transition hover:border-black/18 hover:bg-white"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
