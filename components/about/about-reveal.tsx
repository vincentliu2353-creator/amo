"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

function buildThresholds(steps: number) {
  return Array.from({ length: steps + 1 }, (_, index) => index / steps);
}

export function useVisibilityRatio<T extends HTMLElement>({
  initialRatio = 0,
  steps = 20,
}: {
  initialRatio?: number;
  steps?: number;
} = {}) {
  const ref = useRef<T | null>(null);
  const [ratio, setRatio] = useState(initialRatio);
  const thresholds = useMemo(() => buildThresholds(steps), [steps]);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry.intersectionRatio);
      },
      { threshold: thresholds },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [thresholds]);

  return { ref, ratio };
}

interface AboutRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  hiddenClassName?: string;
  once?: boolean;
  threshold?: number;
  visibleClassName?: string;
}

export function AboutReveal({
  children,
  className,
  delayMs = 0,
  hiddenClassName = "translate-y-8 opacity-0 blur-[18px]",
  once = true,
  threshold = 0.22,
  visibleClassName = "translate-y-0 opacity-100 blur-0",
}: AboutRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? visibleClassName : hiddenClassName,
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
