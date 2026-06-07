/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminProductRecord, ContentStatus } from "@/types";

interface AdminProductsConsoleProps {
  products: AdminProductRecord[];
  notice?: {
    message: string;
    tone: "success" | "error";
  } | null;
}

type StatusFilter = "all" | ContentStatus;

function formatDateLabel(value: string | null) {
  if (!value) {
    return "Draft";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusBadgeClass(status: ContentStatus) {
  return status === "published"
    ? "border-white/16 bg-white/[0.08] text-white"
    : "border-white/12 bg-transparent text-white/58";
}

function AdminStatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function AdminProductsConsole({ products, notice }: AdminProductsConsoleProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      query.trim().length === 0 ||
      [product.name, product.slug, product.categoryName, product.series, product.sku]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const publishedCount = products.filter((product) => product.status === "published").length;
  const draftCount = products.length - publishedCount;

  return (
    <div className="space-y-8">
      {notice ? (
        <div
          className={cn(
            "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
            notice.tone === "success"
              ? "border-white/16 bg-white/[0.08] text-white"
              : "border-red-400/24 bg-red-500/10 text-red-200",
          )}
        >
          {notice.message}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Catalog Control</p>
              <h2 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">Products</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                Keep the admin list focused on search, review, and navigation. Create and edit products from dedicated upload screens.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, slug, category, or SKU"
              />

              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>

              <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
                New Product
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AdminStatTile label="Products" value={products.length} />
            <AdminStatTile label="Published" value={publishedCount} />
            <AdminStatTile label="Drafts" value={draftCount} />
          </div>

          <div className="divide-y divide-white/10 rounded-[20px] border border-white/10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const previewImage =
                  product.images.find((image) => image.isPrimary)?.imageUrl ??
                  product.images[0]?.imageUrl ??
                  product.ogImageUrl;

                return (
                  <article
                    key={product.id}
                    className="grid gap-5 px-5 py-4 md:grid-cols-[7.5rem_minmax(0,1.35fr)_10rem_9rem_auto] md:items-center"
                  >
                    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.05]">
                      <div className="flex h-24 items-center justify-center bg-white/[0.04] p-3">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] uppercase tracking-[0.22em] text-white/36">No image</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{product.categoryName}</p>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-[1.08] text-white">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/42">{product.slug}</p>
                      <p className="mt-3 text-sm leading-6 text-white/56">{product.summary}</p>
                    </div>

                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                      {product.sku || "No SKU"}
                    </div>

                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                      Updated {formatDateLabel(product.updatedAt)}
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]",
                          statusBadgeClass(product.status),
                        )}
                      >
                        {product.status}
                      </span>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={buttonStyles({ variant: "secondary", size: "sm" })}
                      >
                        Edit
                      </Link>
                      {product.status === "published" ? (
                        <Link
                          href={`/products/${product.slug}`}
                          className={buttonStyles({ variant: "ghost", size: "sm" })}
                        >
                          View
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
                No products match the current admin filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
