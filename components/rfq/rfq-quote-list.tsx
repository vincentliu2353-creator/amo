/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inputClassName =
  "min-h-[52px] rounded-[1.5rem] border border-white/20 bg-transparent px-5 text-base text-white shadow-none placeholder:text-white/40 focus:border-white focus:bg-white/[0.03]";

const textareaClassName =
  "min-h-[120px] w-full rounded-[1.5rem] border border-white/20 bg-transparent px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-white focus:bg-white/[0.03]";

function normalizeQuantity(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }

  return Math.floor(parsed);
}

export function RfqQuoteList() {
  const { hydrated, quoteItems, removeFromQuote, updateQuoteItem } = useSiteStore();

  if (!hydrated) {
    return (
      <section className="space-y-6 border-b border-white/12 pb-14 md:pb-16">
        <div>
          <div className="h-4 w-36 animate-pulse rounded-full bg-white/8" />
          <div className="mt-6 h-12 w-64 animate-pulse rounded-full bg-white/8" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="h-[22rem] animate-pulse rounded-[2rem] bg-white/8 lg:min-w-[23rem] lg:flex-1" />
          <div className="h-[22rem] animate-pulse rounded-[2rem] bg-white/8 lg:min-w-[23rem] lg:flex-1" />
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-white/12 pb-14 md:pb-16">
      <p className="text-xs uppercase tracking-[0.28em] text-white/42">Quote List Active</p>
      <h2 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-7xl">
        SELECTED PRODUCTS
      </h2>
      <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/66 md:text-lg">
        Review the products currently stored in your quote list before sending the RFQ form.
        <br />
        Quantity and notes are saved immediately in your local quote list.
      </p>

      {quoteItems.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            No products selected yet.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
            Add products to your quote list before submitting a request.
          </p>
          <div className="mt-6">
            <Link href="/products" className={buttonStyles({ size: "sm" })}>
              View Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:overflow-x-auto lg:pb-2">
          {quoteItems.map((item) => (
            <article
              key={item.product_slug}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 lg:min-h-[27rem] lg:min-w-[24rem] lg:flex-1"
            >
              <div className="flex h-full flex-col">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
                  <div className="flex aspect-[4/3] items-center justify-center bg-black/30 p-4">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.24em] text-white/36">
                        No image
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                    {item.product_slug || "AMO product"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {item.product_name}
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  <div>
                    <label
                      htmlFor={`rfq-quote-quantity-${item.product_slug}`}
                      className="text-xs uppercase tracking-[0.24em] text-white/42"
                    >
                      Quantity
                    </label>
                    <Input
                      id={`rfq-quote-quantity-${item.product_slug}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuoteItem(item.product_slug, {
                          quantity: normalizeQuantity(event.target.value),
                        })
                      }
                      className={`${inputClassName} mt-3`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`rfq-quote-notes-${item.product_slug}`}
                      className="text-xs uppercase tracking-[0.24em] text-white/42"
                    >
                      Notes
                    </label>
                    <textarea
                      id={`rfq-quote-notes-${item.product_slug}`}
                      value={item.notes}
                      onChange={(event) =>
                        updateQuoteItem(item.product_slug, {
                          notes: event.target.value,
                        })
                      }
                      className={`${textareaClassName} mt-3`}
                      placeholder="Add packaging, finish, logo, quantity split, or other request notes."
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => removeFromQuote(item.product_slug)}
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                      className:
                        "border-red-400/24 text-red-200 hover:border-red-300/32 hover:text-red-100",
                    })}
                  >
                    Remove
                  </button>
                  <Link
                    href={`/products/${item.product_slug}`}
                    className={buttonStyles({ variant: "ghost", size: "sm" })}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
