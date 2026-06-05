"use client";

import { useDeferredValue, useState } from "react";

import { NexusProductCard } from "@/components/products/nexus-product-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Product } from "@/types";

interface ProductExplorerProps {
  products: Product[];
  categories: string[];
}

export function ProductExplorer({ products, categories }: ProductExplorerProps) {
  const categoryOptions = ["All", ...categories];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const deferredQuery = useDeferredValue(query);

  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      deferredQuery.trim().length === 0 ||
      [product.name, product.summary, product.category, ...product.tags, ...product.applications]
        .join(" ")
        .toLowerCase()
        .includes(deferredQuery.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;

    return matchesQuery && matchesCategory;
  });

  const visibleCategoryCount = new Set(filteredProducts.map((product) => product.category)).size;
  const visibleFeaturedCount = filteredProducts.filter((product) => product.featured).length;
  const visibleTagCount = new Set(filteredProducts.flatMap((product) => product.tags)).size;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid gap-3 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px">
          <div className="h-full rounded-[23px] border border-[#262626] bg-[#171717]/88 p-6 backdrop-blur-[24px] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div>
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Catalog Filters</p>
                <p className="mt-4 max-w-sm font-sans text-[28px] font-medium leading-[32px] tracking-[-0.025em] text-white">
                  Search, narrow, and evaluate the live catalog without leaving the page.
                </p>
              </div>

              <p className="text-[14px] leading-[22.75px] text-[#A3A3A3]">
                Search and category filtering stay bound to the current published Supabase catalog while quote and favorite actions remain attached to every product card.
              </p>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product, category, application, or technical tag"
                className="min-h-[60px] rounded-[23px] border-[#262626] bg-black/32 px-5 text-[14px] leading-[22.75px] text-white placeholder:text-[#A3A3A3] focus:border-cyan-300/30 focus:bg-black/42 focus:shadow-[0_0_0_1px_rgba(0,240,255,0.12)]"
              />

              <Select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-h-[60px] rounded-[23px] border-[#262626] bg-black/32 px-5 text-[14px] leading-[22.75px] text-white focus:border-cyan-300/30 focus:bg-black/42 focus:shadow-[0_0_0_1px_rgba(0,240,255,0.12)]"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        <aside className="rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px">
          <div className="h-full rounded-[23px] border border-[#262626] bg-[#171717]/88 p-6 backdrop-blur-[24px] sm:p-8">
            <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Visible Scope</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[24px] border border-white/8 bg-black/28 p-4">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Matched</p>
                <p className="mt-3 font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white">
                  {filteredProducts.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-black/28 p-4">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Families</p>
                <p className="mt-3 font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white">
                  {visibleCategoryCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-black/28 p-4">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Tags</p>
                <p className="mt-3 font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white">
                  {visibleTagCount}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/8 pt-6">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Featured In View</p>
              <p className="mt-3 text-[14px] leading-[22.75px] text-white">{visibleFeaturedCount} highlighted systems remain visible after the current filters.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            label: "Matched Systems",
            value: String(filteredProducts.length).padStart(2, "0"),
            note: "Products currently visible for OEM and industrial sourcing review.",
          },
          {
            label: "Product Families",
            value: String(categories.length).padStart(2, "0"),
            note: "Distinct catalog families preserved in the current Supabase dataset.",
          },
          {
            label: "Catalog Status",
            value: query.trim() || category !== "All" ? "LIVE" : "OPEN",
            note: "Search, category filter, favorites, and RFQ actions remain interactive.",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px"
          >
            <div className="h-full rounded-[23px] border border-[#262626] bg-[#171717]/88 p-5 backdrop-blur-[24px]">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">{metric.label}</p>
              <p className="mt-4 font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white">{metric.value}</p>
              <p className="mt-3 text-[14px] leading-[22.75px] text-[#A3A3A3]">{metric.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <NexusProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))] p-px">
          <div className="rounded-[23px] border border-dashed border-[#262626] bg-[#171717]/88 px-6 py-10 text-center backdrop-blur-[24px] sm:px-8">
            <p className="font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white">
              No products match the current filters.
            </p>
            <p className="mt-4 text-[14px] leading-[22.75px] text-[#A3A3A3]">
              Reset the search or contact AMO for a custom OEM configuration.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
