"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;

      if (travel <= 0) {
        const visible = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        setProgress(visible);
        return;
      }

      setProgress(clamp(-rect.top / travel));
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return { ref, progress };
}

export function getActiveIndex(progress: number, length: number) {
  if (length <= 1) {
    return 0;
  }

  return Math.min(length - 1, Math.max(0, Math.floor(progress * length)));
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  hiddenClassName?: string;
  once?: boolean;
  threshold?: number;
  visibleClassName?: string;
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  hiddenClassName = "translate-y-8 opacity-0 blur-[18px]",
  once = true,
  threshold = 0.28,
  visibleClassName = "translate-y-0 opacity-100 blur-0",
}: ScrollRevealProps) {
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
      className={cn("transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]", visible ? visibleClassName : hiddenClassName, className)}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
