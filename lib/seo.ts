import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import type { FaqItem, Product } from "@/types";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
}: BuildMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Suzhou",
      addressRegion: "Jiangsu",
      addressCountry: "CN",
      streetAddress: siteConfig.address,
    },
    areaServed: ["Asia", "Europe", "North America"],
    knowsAbout: ["Magnetic levitation", "Planar motors", "OEM automation", "Cleanroom transport"],
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function generateFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.productImage || undefined,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    sku: product.id,
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    keywords: product.tags.join(", "),
    additionalProperty: product.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
    url: absoluteUrl(`/products/${product.slug}`),
  };
}
