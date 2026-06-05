import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  id?: string;
}

export function SectionShell({
  children,
  eyebrow,
  title,
  description,
  className,
  id,
}: SectionShellProps) {
  return (
    <section id={id} className={cn("py-14 sm:py-20 lg:py-24", className)}>
      <Container>
        {(eyebrow || title || description) && title ? (
          <SectionHeading eyebrow={eyebrow} title={title} description={description} size="section" className="mb-10" />
        ) : null}
        {children}
      </Container>
    </section>
  );
}
