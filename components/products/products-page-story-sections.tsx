/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";

import { ScrollReveal } from "@/components/home/home-scroll";
import { ProductDetailQuoteActions } from "@/components/products/product-detail-quote-actions";
import { Container } from "@/components/ui/container";
import type { ProductShowcaseProduct } from "@/types";

const capabilityItems = [
  "Stable Levitation",
  "360° / 720° Rotation",
  "Low Noise Operation",
  "Custom Load Capacity",
  "Commercial-Grade Components",
] as const;

const oemCapabilities = [
  { label: "01", title: "Logo" },
  { label: "02", title: "Material" },
  { label: "03", title: "Color" },
  { label: "04", title: "Size" },
  { label: "05", title: "Packaging" },
  { label: "06", title: "Magnetic Module" },
] as const;

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function firstSentence(value: string) {
  const cleaned = normalizeText(value);

  if (!cleaned) {
    return "";
  }

  const sentenceMatch = cleaned.match(/^[\s\S]*?[.!?](?:\s|$)/);
  const copy = sentenceMatch?.[0]?.trim() || cleaned;

  if (copy.length <= 160) {
    return copy;
  }

  return `${copy.slice(0, 157).trimEnd()}...`;
}

function buildPositioningSentence(product: ProductShowcaseProduct) {
  return (
    firstSentence(product.summary) ||
    firstSentence(product.highlight) ||
    firstSentence(product.description) ||
    "Magnetic levitation presentation engineered for premium commercial environments."
  );
}

function IconFrame({ label }: { label: string }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-black/[0.035] text-[11px] font-medium uppercase tracking-[0.22em] text-black/54">
      {label}
    </span>
  );
}

function RelatedProductCard({ product }: { product: ProductShowcaseProduct }) {
  const image = product.galleryImages[0]?.url || product.productImage;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/8 bg-[#fafaf8] transition duration-500 hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="relative flex min-h-[18rem] items-center justify-center overflow-hidden bg-white p-6">
          <img
            src={image}
            alt={product.galleryImages[0]?.alt || product.name}
            className="h-[14rem] w-auto max-w-full object-contain transition duration-700 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-[0.24em] text-black/42">{product.category}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-black/34">{product.series}</span>
          </div>

          <h3 className="font-sans text-[28px] font-medium leading-[1.02] tracking-[-0.03em] text-black">
            {product.name}
          </h3>
          <p className="max-w-xl text-[14px] leading-6 text-black/62">{buildPositioningSentence(product)}</p>

          <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-black">
            <span>View Product</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4.5 10h10" />
              <path d="m10 4.5 5.5 5.5-5.5 5.5" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

interface ProductsPageStorySectionsProps {
  activeIndex: number;
  products: ProductShowcaseProduct[];
}

export function ProductsPageStorySections({ activeIndex, products }: ProductsPageStorySectionsProps) {
  const activeProduct = products[activeIndex] ?? products[0];
  const relatedProducts =
    products.length > 1
      ? [...products.slice(activeIndex + 1), ...products.slice(0, activeIndex)].slice(0, Math.min(4, products.length - 1))
      : [];

  if (!activeProduct) {
    return null;
  }

  return (
    <>
      <section data-header-theme="dark" className="relative overflow-hidden bg-black py-20 text-white sm:py-24 lg:min-h-[92vh] lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_22%),repeating-linear-gradient(90deg,rgba(255,255,255,0.045)_0,rgba(255,255,255,0.045)_1px,transparent_1px,transparent_120px),linear-gradient(180deg,#050505_0%,#0b0b0c_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.1),transparent_18%),radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.06),transparent_32%)]" />

        <Container className="relative z-10 flex min-h-full flex-col justify-center">
          <ScrollReveal className="max-w-3xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/42">Technical Capability</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
              Engineered for stable motion, low-noise presentation, and repeatable commercial deployment.
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {capabilityItems.map((item, index) => (
              <ScrollReveal
                key={item}
                delayMs={index * 60}
                className="rounded-[26px] border border-white/10 bg-white/[0.04] px-5 py-6 backdrop-blur"
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">{`0${index + 1}`}</p>
                <p className="mt-5 text-[16px] leading-7 text-white">{item}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section data-header-theme="light" className="bg-white py-20 sm:py-24 lg:py-28">
        <Container>
          <ScrollReveal className="max-w-3xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-black/38">OEM & ODM</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,4vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.04em] text-black">
              Configure the platform around your brand, object, and deployment environment.
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {oemCapabilities.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delayMs={index * 60}
                className="rounded-[28px] border border-black/8 bg-[#fafaf8] px-5 py-6"
              >
                <div className="flex items-start gap-4">
                  <IconFrame label={item.label} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">Customization</p>
                    <h3 className="mt-3 text-[24px] font-medium tracking-[-0.03em] text-black">{item.title}</h3>
                    <p className="mt-3 text-[14px] leading-6 text-black/62">
                      Tailor {item.title.toLowerCase()} requirements to match the object, brand system, and production brief.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 ? (
        <section data-header-theme="light" className="bg-[#f5f4ef] py-20 sm:py-24 lg:py-28">
          <Container>
            <ScrollReveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-black/38">Related Products</p>
                <h2 className="mt-6 font-sans text-[clamp(2rem,4vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.04em] text-black">
                  Explore adjacent levitation systems with the same premium presentation language.
                </h2>
              </div>

              <Link
                href="/products"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black transition duration-300 hover:border-black/18 hover:bg-white/78 sm:text-[11px]"
              >
                View Products
              </Link>
            </ScrollReveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((entry) => (
                <ScrollReveal key={entry.slug} delayMs={80}>
                  <RelatedProductCard product={entry} />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section data-header-theme="dark" className="relative overflow-hidden bg-black py-20 text-white sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,#030303_0%,#070707_100%)]" />

        <Container className="relative z-10">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/42">Final Inquiry</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,4.8vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
              Tell us about your floating product idea.
            </h2>
            <p className="mt-6 text-[15px] leading-7 text-white/66 sm:text-[16px]">
              We support custom magnetic levitation products for global brands, distributors, and design studios.
            </p>
            <ProductDetailQuoteActions product={activeProduct} className="mt-8 justify-center" theme="dark" />
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
