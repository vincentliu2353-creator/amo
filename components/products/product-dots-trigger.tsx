import { cn } from "@/lib/utils";

interface ProductDotsTriggerProps {
  expanded: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

export function ProductDotsTrigger({ expanded, onClick, onMouseEnter, className }: ProductDotsTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "inline-flex items-center gap-3 rounded-full px-2 py-1.5 text-left transition duration-300 hover:bg-black/[0.03]",
        className,
      )}
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse product thumbnails" : "Reveal more product thumbnails"}
    >
      <span className="flex items-center gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-black/52 transition duration-300",
              expanded ? "scale-125 bg-black/84" : "scale-100",
            )}
          />
        ))}
      </span>
      <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-black/42">More Products</span>
    </button>
  );
}
