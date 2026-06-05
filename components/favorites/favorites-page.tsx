"use client";

import Link from "next/link";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types";

export function FavoritesPage({ products }: { products: Product[] }) {
  const { addToQuote, favorites, hydrated, inQuote, removeFavorite } = useSiteStore();
  const availableSlugs = new Set(products.map((product) => product.slug));

  const favoriteProducts = products.filter((product) => favorites.includes(product.slug));
  const unavailableFavorites = favorites.filter((slug) => !availableSlugs.has(slug));

  if (!hydrated) {
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[28rem] animate-pulse rounded-[2rem] bg-black/6" />
        ))}
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <EmptyState
        eyebrow="Saved Products"
        title="Nothing Saved Yet"
        description="Explore our collection of magnetic levitation products."
        action={
          <Link href="/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            View Products
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {unavailableFavorites.length > 0 ? (
        <div className="rounded-[2rem] border border-black/10 bg-[#f5f5f2] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">Unavailable Saved Items</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/62">
            Some products saved earlier are no longer available in the published catalog. Remove them to keep the list current.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {unavailableFavorites.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => removeFavorite(slug)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black/54 transition hover:border-black/18 hover:text-black"
              >
                Remove {slug}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {favoriteProducts.map((product) => {
          const quoted = inQuote(product.slug);

          return (
            <article key={product.slug} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-[#ecebe6]">
                {product.productImage ? (
                  <img src={product.productImage} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full items-end p-6">
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-black/48">
                      AMO Product
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-black/42">{product.category}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">{product.name}</h2>
                <p className="mt-4 text-base leading-relaxed text-black/62">{product.summary}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/products/${product.slug}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      addToQuote({
                        product_id: product.id,
                        product_name: product.name,
                        product_slug: product.slug,
                        product_image: product.productImage,
                        quantity: 1,
                        notes: "",
                      })
                    }
                    className={buttonStyles({ size: "sm" })}
                  >
                    {quoted ? "Added To Quote" : "Add To Quote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFavorite(product.slug)}
                    className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black/54 transition hover:border-black/18 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
