import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import type { FaqItem, Product, PublicBlogRecord } from "@/types";

const DEFAULT_OG_IMAGE_PATH = "/images/home/hero/hero-bg.webp";

const DEFAULT_KEYWORDS = [
  "AMO",
  "magnetic levitation manufacturer",
  "magnetic levitation OEM",
  "custom magnetic levitation products",
  "levitating clock manufacturer",
  "levitating lamp manufacturer",
  "floating display manufacturer",
  "magnetic levitation gift manufacturer",
];

export const BLOG_SEO_KEYWORDS = [
  "magnetic levitation manufacturer",
  "magnetic levitation OEM",
  "custom magnetic levitation products",
  "levitating clock manufacturer",
  "levitating lamp manufacturer",
  "floating display manufacturer",
  "magnetic levitation gift manufacturer",
];

export const DEFAULT_METADATA_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function resolveMetadataImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  }

  return imageUrl.startsWith("/") ? absoluteUrl(imageUrl) : imageUrl;
}

function dedupeKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));
}

function resolveMetadataTitle(title: string): Metadata["title"] {
  return title.toLowerCase().includes(siteConfig.name.toLowerCase()) ? { absolute: title } : title;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  robots?: Metadata["robots"];
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  robots = DEFAULT_METADATA_ROBOTS,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const metadataImageUrl = resolveMetadataImageUrl(image);

  return {
    title: resolveMetadataTitle(title),
    description,
    keywords: dedupeKeywords([...DEFAULT_KEYWORDS, ...keywords]),
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      images: metadataImageUrl
        ? [
            {
              url: metadataImageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metadataImageUrl ? [metadataImageUrl] : undefined,
    },
  };
}

export function buildNoIndexMetadata({ title, description, path, image }: Omit<BuildMetadataOptions, "robots" | "keywords" | "type">) {
  return buildMetadata({
    title,
    description,
    path,
    image,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  });
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logoPath),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hong Kong",
      addressRegion: "Kowloon",
      addressCountry: "HK",
      streetAddress: siteConfig.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      availableLanguage: ["English", "Chinese"],
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Magnetic levitation products",
      "Levitating clocks",
      "Levitating lamps",
      "Floating display systems",
      "Custom magnetic levitation products",
      "OEM manufacturing",
      "ODM manufacturing",
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logoPath),
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/products?query={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
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
  const productImageUrl = resolveMetadataImageUrl(product.productImage);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.highlight || product.description,
    image: productImageUrl ? [productImageUrl] : undefined,
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
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
  };
}

function buildArticleTitle(post: PublicBlogRecord) {
  if (post.seoTitle?.trim()) {
    return post.seoTitle.trim();
  }

  return `${post.title} | AMO Journal`;
}

function buildArticleDescription(post: PublicBlogRecord) {
  return post.seoDescription?.trim() || post.excerpt;
}

export function buildBlogArticleMetadata(post: PublicBlogRecord): Metadata {
  const title = buildArticleTitle(post);
  const description = buildArticleDescription(post);
  const metadataImageUrl = resolveMetadataImageUrl(post.coverImage);

  return {
    ...buildMetadata({
      title,
      description,
      path: `/blog/${post.slug}`,
      image: post.coverImage,
      type: "article",
      keywords: [post.category, post.title, ...BLOG_SEO_KEYWORDS],
    }),
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.publishedAt,
      images: [
        {
          url: metadataImageUrl,
          alt: post.title,
        },
      ],
    },
  };
}

export function generateArticleJsonLd(post: PublicBlogRecord) {
  const metadataImageUrl = resolveMetadataImageUrl(post.coverImage);
  const authorType = post.author.toLowerCase().includes("amo") ? "Organization" : "Person";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: buildArticleTitle(post),
    description: buildArticleDescription(post),
    image: metadataImageUrl ? [metadataImageUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": authorType,
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logoPath),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
  };
}
