"use client";

import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/home/home-scroll";
import { ProductDetailQuoteActions } from "@/components/products/product-detail-quote-actions";
import { Container } from "@/components/ui/container";
import {
  pickShowcaseLargeImage,
  pickShowcaseThumbImage,
} from "@/lib/products/product-image-selection";
import { buildProductShowcaseSpecRows } from "@/lib/products/spec-fields";
import { cn } from "@/lib/utils";
import type { Product, ProductShowcaseImage, ProductShowcaseProduct, SpecItem } from "@/types";

interface ProductDetailExperienceProps {
  product: Product;
  images: ProductShowcaseImage[];
  relatedProducts: ProductShowcaseProduct[];
}

interface DetailStorySection {
  body: string;
  image: ProductShowcaseImage;
  number: string;
  title: string;
}

interface DetailSpecRow {
  label: string;
  value: string;
}

interface OemCapability {
  label: string;
  title: string;
}

const capabilityItems = [
  "Stable Levitation",
  "360° / 720° Rotation",
  "Low Noise Operation",
  "Custom Load Capacity",
  "Commercial-Grade Components",
] as const;

const oemCapabilities: OemCapability[] = [
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

function findSpecValue(specs: SpecItem[], aliases: string[]) {
  const match = specs.find((spec) => {
    const label = spec.label.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    return aliases.some((alias) => label === alias || label.includes(alias));
  });

  return match?.value?.trim() || "";
}

function buildPositioningSentence(product: Product) {
  return (
    firstSentence(product.summary) ||
    firstSentence(product.highlight) ||
    firstSentence(product.description) ||
    "Magnetic levitation presentation engineered for premium commercial environments."
  );
}

function buildPhilosophyCopy(product: Product) {
  return firstSentence(product.description) || "Designed to transform ordinary objects into floating visual experiences.";
}

function buildFeatureSections(product: Product, gallery: ProductShowcaseImage[]): DetailStorySection[] {
  const fallbackBody = [
    "Controlled levitation draws attention without introducing visual noise into the space.",
    "Quiet movement and disciplined materials help the object feel considered, premium, and brand ready.",
    "AMO platforms are built to support custom programs, repeated deployments, and technical integration needs.",
  ];

  return [
    {
      number: "01",
      title: "Precision In Suspension",
      body: firstSentence(product.summary) || fallbackBody[0],
      image: gallery[0],
    },
    {
      number: "02",
      title: "Built For Brand Presence",
      body: firstSentence(product.description) || firstSentence(product.features[0] ?? "") || fallbackBody[1],
      image: gallery[1] ?? gallery[0],
    },
    {
      number: "03",
      title: "Ready For Program Scale",
      body: firstSentence(product.highlight) || firstSentence(product.features[1] ?? "") || fallbackBody[2],
      image: gallery[2] ?? gallery[0],
    },
  ];
}

function buildSpecificationRows(product: Product): DetailSpecRow[] {
  const showcaseRows = buildProductShowcaseSpecRows(product.specs);
  const customizationOptions = findSpecValue(product.specs, [
    "customization",
    "customisation",
    "custom options",
    "custom options available",
    "oem options",
  ]);

  return [
    ...showcaseRows,
    { label: "MOQ", value: normalizeText(product.minOrderQty) || "—" },
    { label: "Lead Time", value: normalizeText(product.leadTime) || "—" },
    { label: "Customization Options", value: customizationOptions || "—" },
  ];
}

function IconFrame({ label }: { label: string }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[11px] font-medium uppercase tracking-[0.22em] text-white/54">
      {label}
    </span>
  );
}

function RelatedProductCard({ product }: { product: ProductShowcaseProduct }) {
  const image = pickShowcaseThumbImage(product.galleryImages[0], product.productImage);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/8 bg-[#fafaf8] transition duration-500 hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="relative flex min-h-[18rem] items-center justify-center overflow-hidden bg-white p-6">
          <Image
            src={image}
            alt={product.galleryImages[0]?.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-contain p-6 transition duration-700 group-hover:scale-[1.03]"
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

export function ProductDetailExperience({
  product,
  images,
  relatedProducts,
}: ProductDetailExperienceProps) {
  const gallery =
    images.length > 0
      ? images
      : [
          {
            url: product.productImage,
            alt: product.name,
            isPrimary: true,
            sortOrder: 0,
          },
        ];
  const positioningSentence = buildPositioningSentence(product);
  const philosophyCopy = buildPhilosophyCopy(product);
  const featureSections = buildFeatureSections(product, gallery);
  const specificationRows = buildSpecificationRows(product);
  const heroImage = pickShowcaseLargeImage(gallery[0], product.productImage);

  return (
    <>
      <section data-header-theme="light" className="relative min-h-screen overflow-hidden bg-white text-black">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-y-0 left-0 z-10 w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.78)_34%,rgba(255,255,255,0.18)_60%,rgba(255,255,255,0)_78%)]" />

        <Container className="relative z-20 flex min-h-screen items-end py-24 sm:py-28 lg:items-center lg:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
            <ScrollReveal className="relative z-30 max-w-3xl">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-black/44 transition hover:text-black"
              >
                <span>View Products</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4.5 10h10" />
                  <path d="m10 4.5 5.5 5.5-5.5 5.5" />
                </svg>
              </Link>

              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">
                {product.category} / {product.series}
              </p>
              <h1 className="mt-6 max-w-4xl font-sans text-[clamp(3rem,8vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-black">
                {product.name}
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-black/62 sm:text-[16px]">{positioningSentence}</p>

              <ProductDetailQuoteActions product={product} className="mt-8" theme="light" />

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Series", value: product.series },
                  { label: "Lead Time", value: product.leadTime },
                  { label: "MOQ", value: product.minOrderQty },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-black/8 bg-black/[0.02] px-4 py-4 backdrop-blur"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-black/38">{item.label}</p>
                    <p className="mt-3 text-[13px] leading-6 text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <div className="relative z-0 min-h-[42svh] sm:min-h-[52svh] lg:min-h-[82vh]">
              <ScrollReveal
                delayMs={180}
                className="absolute inset-0 flex items-end justify-center lg:justify-center"
                hiddenClassName="translate-y-10 opacity-0"
                visibleClassName="translate-y-0 opacity-100"
              >
                <div className="relative z-0 h-[54svh] w-full sm:h-[62svh] lg:h-[84vh] lg:-translate-x-[10%] xl:h-[88vh]">
                  <Image
                    src={heroImage}
                    alt={gallery[0]?.alt || product.name}
                    fill
                    priority
                    quality={88}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 56vw, 48vw"
                    className="object-contain object-center"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      <section data-header-theme="dark" className="bg-black py-20 text-white sm:py-24 lg:py-28">
        <Container>
          <ScrollReveal className="mx-auto max-w-5xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/40">Product Philosophy</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,5vw,4.9rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
              {philosophyCopy}
            </h2>
          </ScrollReveal>
        </Container>
      </section>

      {featureSections.map((section, index) => {
        const dark = index % 2 === 1;
        const reverse = index % 2 === 1;

        return (
          <section
            key={section.number}
            data-header-theme={dark ? "dark" : "light"}
            className={cn("relative overflow-hidden", dark ? "bg-black text-white" : "bg-white text-black")}
          >
            <div
              className={cn(
                "absolute inset-0",
                dark
                  ? "bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.06),transparent_20%),linear-gradient(180deg,#050505_0%,#090909_100%)]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fafaf8_100%)]",
              )}
            />

            <Container className="relative z-10 py-20 sm:py-24 lg:py-28">
              <div className="grid items-center gap-12 lg:min-h-[82vh] lg:grid-cols-[0.72fr_1.28fr]">
                <ScrollReveal className={cn("relative z-30 max-w-2xl", reverse && "lg:order-2 lg:justify-self-end")}>
                  <p className={cn("text-[10px] font-medium uppercase tracking-[0.26em]", dark ? "text-white/40" : "text-black/38")}>
                    {section.number} / Feature Showcase
                  </p>
                  <h2 className="mt-6 font-sans text-[clamp(2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                    {section.title}
                  </h2>
                  <p className={cn("mt-6 max-w-xl text-[15px] leading-7 sm:text-[16px]", dark ? "text-white/66" : "text-black/62")}>
                    {section.body}
                  </p>
                </ScrollReveal>

                <ScrollReveal
                  delayMs={180}
                  className={cn("relative z-0", reverse && "lg:order-1")}
                  hiddenClassName="translate-y-10 opacity-0"
                  visibleClassName="translate-y-0 opacity-100"
                >
                  <div className="flex min-h-[36svh] items-center justify-center sm:min-h-[48svh] lg:min-h-[74vh]">
                    <div className="relative h-[42svh] w-full sm:h-[56svh] lg:h-[78vh]">
                      <Image
                        src={pickShowcaseLargeImage(section.image, product.productImage)}
                        alt={section.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        quality={85}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </Container>
          </section>
        );
      })}

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
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-black/38">Specifications</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,4vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.04em] text-black">
              Technical data prepared for sourcing, specification, and program evaluation.
            </h2>
          </ScrollReveal>

          <ScrollReveal delayMs={120} className="mt-12 overflow-hidden rounded-[28px] border border-black/8 bg-[#fbfbfa]">
            <div className="divide-y divide-black/7">
              {specificationRows.map((row) => (
                <div key={row.label} className="grid gap-3 px-5 py-4 text-[12px] leading-6 sm:grid-cols-[0.9fr_1.1fr] sm:px-7 sm:text-[13px]">
                  <span className="uppercase tracking-[0.2em] text-black/40">{row.label}</span>
                  <span className="text-black/74">{row.value || "—"}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section data-header-theme="dark" className="bg-black py-20 text-white sm:py-24 lg:py-28">
        <Container>
          <ScrollReveal className="max-w-3xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/40">OEM & ODM</p>
            <h2 className="mt-6 font-sans text-[clamp(2rem,4vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
              Configure the platform around your brand, object, and deployment environment.
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {oemCapabilities.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delayMs={index * 60}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-6"
              >
                <div className="flex items-start gap-4">
                  <IconFrame label={item.label} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Customization</p>
                    <h3 className="mt-3 text-[24px] font-medium tracking-[-0.03em] text-white">{item.title}</h3>
                    <p className="mt-3 text-[14px] leading-6 text-white/62">
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

            <div className="mt-12 grid gap-5 xl:grid-cols-4 md:grid-cols-2">
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
            <ProductDetailQuoteActions product={product} className="mt-8 justify-center" theme="dark" />
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
