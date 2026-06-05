import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SectionContainer({ children, className, ...props }: SectionContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-6 md:px-10 lg:px-16", className)} {...props}>
      {children}
    </div>
  );
}
