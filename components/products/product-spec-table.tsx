import type { SpecItem } from "@/types";
import { buildProductShowcaseSpecRows } from "@/lib/products/spec-fields";

interface ProductSpecTableProps {
  specs: SpecItem[];
}

export function ProductSpecTable({ specs }: ProductSpecTableProps) {
  const rows = buildProductShowcaseSpecRows(specs);

  return (
    <div className="w-full max-w-[24rem] border-t border-black/10">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-5 border-b border-black/10 py-1.5 text-[11px] leading-4 sm:text-[12px] sm:leading-5">
          <span className="text-black/44">{row.label}</span>
          <span className="text-right text-black/74">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
