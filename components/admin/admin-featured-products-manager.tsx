"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pickAdminThumbImage } from "@/lib/products/product-image-selection";
import { cn } from "@/lib/utils";
import type { AdminProductRecord } from "@/types";

interface AdminFeaturedProductsManagerProps {
  products: AdminProductRecord[];
}

interface FeaturedManagerProduct {
  categoryName: string;
  id: string;
  images: AdminProductRecord["images"];
  isFeatured: boolean;
  featuredOrder: number | null;
  name: string;
  ogImageUrl: string;
  slug: string;
  summary: string;
  updatedAt: string;
}

function compareFeaturedManagerProducts(left: FeaturedManagerProduct, right: FeaturedManagerProduct) {
  if (left.isFeatured !== right.isFeatured) {
    return left.isFeatured ? -1 : 1;
  }

  if (left.isFeatured && right.isFeatured) {
    const leftOrder = left.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.featuredOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }

  const leftUpdatedAt = Date.parse(left.updatedAt);
  const rightUpdatedAt = Date.parse(right.updatedAt);

  if (Number.isFinite(leftUpdatedAt) && Number.isFinite(rightUpdatedAt) && leftUpdatedAt !== rightUpdatedAt) {
    return rightUpdatedAt - leftUpdatedAt;
  }

  return left.name.localeCompare(right.name);
}

function normalizeFeaturedOrders(products: FeaturedManagerProduct[]) {
  const orderedFeaturedProducts = products
    .filter((product) => product.isFeatured)
    .sort((left, right) => {
      const leftOrder = left.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.featuredOrder ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.name.localeCompare(right.name);
    });

  const featuredOrderById = new Map(
    orderedFeaturedProducts.map((product, index) => [product.id, index + 1]),
  );

  return products.map((product) => ({
    ...product,
    isFeatured: product.isFeatured,
    featuredOrder: product.isFeatured ? featuredOrderById.get(product.id) ?? null : null,
  }));
}

function buildInitialProducts(products: AdminProductRecord[]) {
  return normalizeFeaturedOrders(
    products.map((product) => ({
      categoryName: product.categoryName,
      id: product.id,
      images: product.images,
      isFeatured: product.isFeatured,
      featuredOrder: product.featuredOrder,
      name: product.name,
      ogImageUrl: product.ogImageUrl,
      slug: product.slug,
      summary: product.summary,
      updatedAt: product.updatedAt,
    })),
  );
}

function buildSelectionSignature(products: FeaturedManagerProduct[]) {
  return products
    .filter((product) => product.isFeatured)
    .sort((left, right) => (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (right.featuredOrder ?? Number.MAX_SAFE_INTEGER))
    .map((product) => `${product.id}:${product.featuredOrder ?? "null"}`)
    .join("|");
}

function reorderFeaturedProducts(
  products: FeaturedManagerProduct[],
  productId: string,
  nextOrder: number,
) {
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .sort((left, right) => (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (right.featuredOrder ?? Number.MAX_SAFE_INTEGER));
  const currentIndex = featuredProducts.findIndex((product) => product.id === productId);

  if (currentIndex === -1) {
    return products;
  }

  const [movedProduct] = featuredProducts.splice(currentIndex, 1);
  const targetIndex = Math.max(0, Math.min(featuredProducts.length, nextOrder - 1));
  featuredProducts.splice(targetIndex, 0, movedProduct);

  const reorderedIds = new Map(featuredProducts.map((product, index) => [product.id, index + 1]));

  return products.map((product) => {
    if (!product.isFeatured) {
      return {
        ...product,
        featuredOrder: null,
      };
    }

    return {
      ...product,
      featuredOrder: reorderedIds.get(product.id) ?? null,
    };
  });
}

function formatDateLabel(value: string) {
  const parsed = Date.parse(value);

  if (!Number.isFinite(parsed)) {
    return "Recently updated";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(parsed));
}

export function AdminFeaturedProductsManager({ products }: AdminFeaturedProductsManagerProps) {
  const router = useRouter();
  const initialProducts = buildInitialProducts(products);
  const [items, setItems] = useState(initialProducts);
  const [initialSignature, setInitialSignature] = useState(buildSelectionSignature(initialProducts));
  const [query, setQuery] = useState("");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestTone, setRequestTone] = useState<"success" | "error">("success");
  const [isSaving, setIsSaving] = useState(false);

  const selectedCount = items.filter((product) => product.isFeatured).length;
  const hasChanges = buildSelectionSignature(items) !== initialSignature;
  const filteredProducts = [...items]
    .sort(compareFeaturedManagerProducts)
    .filter((product) => {
      if (query.trim().length === 0) {
        return true;
      }

      return [product.name, product.slug, product.categoryName]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    });

  function toggleFeatured(productId: string) {
    setRequestMessage(null);
    setRequestTone("success");

    const targetProduct = items.find((product) => product.id === productId);

    if (!targetProduct) {
      return;
    }

    if (!targetProduct.isFeatured && selectedCount >= 10) {
      setRequestMessage("Only 10 published products can be featured on the Products page.");
      setRequestTone("error");
      return;
    }

    const nextItems = items.map((product) => {
      if (product.id !== productId) {
        return product;
      }

      return {
        ...product,
        isFeatured: !product.isFeatured,
        featuredOrder: product.isFeatured ? null : 999,
      };
    });

    setItems(normalizeFeaturedOrders(nextItems));
  }

  function updateFeaturedOrder(productId: string, value: string) {
    const targetProduct = items.find((product) => product.id === productId);

    if (!targetProduct?.isFeatured) {
      return;
    }

    const numericValue = Number(value.replace(/[^\d]/g, ""));

    if (!Number.isInteger(numericValue) || numericValue < 1) {
      return;
    }

    setRequestMessage(null);
    setRequestTone("success");
    setItems(reorderFeaturedProducts(items, productId, Math.min(numericValue, selectedCount)));
  }

  function clearAllSelections() {
    setRequestMessage(null);
    setRequestTone("success");
    setItems(
      items.map((product) => ({
        ...product,
        isFeatured: false,
        featuredOrder: null,
      })),
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setRequestMessage(null);
    setRequestTone("success");

    try {
      const response = await fetch("/api/admin/products/featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: items
            .filter((product) => product.isFeatured)
            .sort((left, right) => (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (right.featuredOrder ?? Number.MAX_SAFE_INTEGER))
            .map((product) => ({
              id: product.id,
              featuredOrder: product.featuredOrder,
            })),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save featured products.");
      }

      const nextSignature = buildSelectionSignature(items);
      setInitialSignature(nextSignature);
      setRequestMessage(result.message ?? "Featured products saved.");
      setRequestTone("success");
      router.refresh();
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : "Unable to save featured products.");
      setRequestTone("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {requestMessage ? (
        <div
          className={cn(
            "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
            requestTone === "success"
              ? "border-white/16 bg-white/[0.08] text-white"
              : "border-red-400/24 bg-red-500/10 text-red-200",
          )}
        >
          {requestMessage}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Products Page Showcase</p>
              <h2 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">Featured Products</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                Select up to 10 published products for the main Products page hero showcase. If no products are selected, the public page falls back to the latest 10 published products automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/12 px-4 py-3 text-sm text-white/72">
                {selectedCount} / 10 selected
              </span>
              <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back to Products
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search published products"
            />
            <Button type="button" variant="ghost" size="sm" onClick={clearAllSelections} disabled={isSaving || selectedCount === 0}>
              Clear All
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? "Saving..." : "Save Featured Products"}
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-white/10 px-5 py-6 text-sm leading-7 text-white/48">
              No published products are available yet. Publish product records before building the Products page showcase.
            </div>
          ) : (
            <div className="divide-y divide-white/10 rounded-[20px] border border-white/10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const previewImage = pickAdminThumbImage(product.images, product.ogImageUrl);

                  return (
                    <article
                      key={product.id}
                      className="grid gap-5 px-5 py-4 md:grid-cols-[auto_5.5rem_minmax(0,1.4fr)_8rem_auto] md:items-center"
                    >
                      <label className="flex items-center gap-3 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={product.isFeatured}
                          onChange={() => toggleFeatured(product.id)}
                          className="h-4 w-4 rounded border-white/20 bg-transparent"
                        />
                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/62">
                          {product.isFeatured ? "Featured" : "Available"}
                        </span>
                      </label>

                      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.05]">
                        <div className="relative flex h-20 items-center justify-center bg-white/[0.04] p-3">
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={product.name}
                              fill
                              sizes="88px"
                              className="object-contain p-3"
                            />
                          ) : (
                            <span className="text-[10px] uppercase tracking-[0.22em] text-white/36">No image</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{product.categoryName}</p>
                        <h3 className="mt-3 font-display text-[1.25rem] font-semibold leading-[1.08] text-white">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/42">{product.slug}</p>
                        <p className="mt-3 text-sm leading-6 text-white/56">{product.summary}</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor={`featured-order-${product.id}`}
                          className="text-[11px] uppercase tracking-[0.22em] text-white/42"
                        >
                          Order
                        </label>
                        <Input
                          id={`featured-order-${product.id}`}
                          inputMode="numeric"
                          value={product.isFeatured ? String(product.featuredOrder ?? "") : ""}
                          onChange={(event) => updateFeaturedOrder(product.id, event.target.value)}
                          disabled={!product.isFeatured || isSaving}
                          placeholder="-"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]",
                            product.isFeatured
                              ? "border-white/16 bg-white/[0.08] text-white"
                              : "border-white/10 text-white/42",
                          )}
                        >
                          {product.isFeatured ? `Showcase ${product.featuredOrder ?? "-"}` : "Not selected"}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/42">
                          Updated {formatDateLabel(product.updatedAt)}
                        </span>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className={buttonStyles({ variant: "ghost", size: "sm" })}
                        >
                          Edit
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
                  No published products match the current search.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
