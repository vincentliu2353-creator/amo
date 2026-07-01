import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import type { FaqItem, Product, PublicBlogRecord } from "@/types";

const DEFAULT_OG_IMAGE_PATH = "/images/home/hero/hero-bg.webp";
const ORGANIZATION_DESCRIPTION =
  "AMO is a B2B magnetic levitation products manufacturer and magnetic levitation company focused on floating displays, levitating lamps, premium gifts, display art objects, and OEM/ODM product development.";

const DEFAULT_KEYWORDS = [
  "AMO",
  "magnetic levitation manufacturer",
  "magnetic levitation products manufacturer",
  "magnetic levitation company",
  "magnetic levitation factory",
  "magnetic levitation product supplier",
  "magnetic levitation OEM",
  "custom magnetic levitation products",
  "levitating lamp manufacturer",
  "floating display manufacturer",
  "premium magnetic levitation gifts",
  "floating display systems",
];

const PRODUCT_DISPLAY_SEO_KEYWORDS = [
  "magnetic display stand",
  "levitating display stand",
  "floating display stand",
  "magnetic floating display",
  "magnetic levitation display stand",
  "levitating product presentation",
  "custom floating display",
];

const PRODUCT_CLOCK_SEO_KEYWORDS = [
  "magnetic levitation clock",
  "magnetic floating clock",
  "levitating desk clock",
  "floating desk clock",
  "premium levitating clock",
  "luxury levitating clock",
  "custom levitating clock",
  "OEM levitating clock",
  "ODM levitating clock",
  "levitating clock manufacturer",
  "magnetic levitation clock manufacturer",
  "levitating clock supplier",
  "floating clock supplier",
  "OEM levitating clock manufacturer",
];

const PRODUCT_LAMP_SEO_KEYWORDS = [
  "magnetic floating lamp",
  "levitating table lamp",
  "floating table lamp",
  "levitating light",
  "magnetic floating light",
  "floating LED lamp",
  "custom levitating lamp",
  "OEM levitating lamp",
  "ODM levitating lamp",
  "magnetic levitation lamp supplier",
  "OEM levitating lamp manufacturer",
];

const BUYER_INTENT_SEMANTIC_KEYWORDS = [
  "MOQ magnetic levitation products",
  "magnetic levitation lead time",
  "magnetic levitation sample validation",
  "magnetic levitation export readiness",
  "design brief for OEM magnetic levitation products",
  "magnetic levitation prototype validation",
  "OEM magnetic levitation sampling",
  "magnetic levitation mass production",
  "B2B magnetic levitation sourcing",
  "magnetic levitation sourcing checklist",
  "OEM floating display development",
];

const PRODUCT_ART_SEO_KEYWORDS = [
  "display art object",
  "floating art object",
  "magnetic levitation art",
  "magnetic floating sculpture",
  "floating decorative object",
  "levitating decorative object",
  "kinetic sculpture",
  "magnetic kinetic sculpture",
  "custom levitating sculpture",
  "floating installation art",
];

const PRODUCT_GIFT_SEO_KEYWORDS = [
  "magnetic floating gift",
  "executive levitating gift",
  "corporate levitating gift",
  "luxury floating gift",
  "OEM magnetic levitation gift",
  "branded floating gift",
  "private label levitating gift",
  "custom magnetic levitation gifts for corporate clients",
];

export const BLOG_SEO_KEYWORDS = [
  "magnetic levitation manufacturer",
  "magnetic levitation OEM",
  "custom magnetic levitation products",
  "levitating lamp manufacturer",
  "floating display manufacturer",
  "premium magnetic levitation gifts",
  "custom floating installations",
  "magnetic levitation technology",
  "how magnetic levitation works",
  "electromagnetic levitation",
  "magnetic suspension technology",
  "active magnetic levitation",
  "magnetic balance system",
  "magnetic control system",
  "floating object technology",
  "levitation engineering",
  "magnetic stabilization system",
  "floating museum display",
  "magnetic levitation museum display",
  "trade show floating display",
  "magnetic levitation exhibition display",
  "floating display for luxury retail brands",
  "magnetic levitation display for perfume brands",
  "floating display for watch brands",
  "floating display for jewelry stores",
  "custom magnetic levitation display manufacturer",
  "OEM floating product display supplier",
  "magnetic levitation display manufacturer China",
  "custom levitating product manufacturer",
  "custom magnetic levitation gifts for corporate clients",
  "OEM levitating clock manufacturer",
  "OEM levitating lamp manufacturer",
  "custom floating display for exhibitions",
  "magnetic levitation prototype manufacturer",
  ...BUYER_INTENT_SEMANTIC_KEYWORDS,
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

function includesAnyKeyword(haystack: string, keywords: string[]) {
  return keywords.some((keyword) => haystack.includes(keyword));
}

function buildProductKeywordCorpus(product: Product) {
  return [
    product.name,
    product.category,
    product.summary,
    product.description,
    product.highlight,
    ...product.tags,
    ...product.applications,
  ]
    .join(" ")
    .toLowerCase();
}

export function buildProductSeoKeywords(product: Product) {
  const haystack = buildProductKeywordCorpus(product);
  const keywords = [product.category, ...product.tags, ...product.applications];

  if (
    includesAnyKeyword(haystack, [
      "display",
      "retail",
      "exhibition",
      "museum",
      "brand",
      "showcase",
      "launch",
      "window",
    ])
  ) {
    keywords.push(...PRODUCT_DISPLAY_SEO_KEYWORDS);
  }

  if (includesAnyKeyword(haystack, ["clock", "timepiece", "desk clock", "table clock"])) {
    keywords.push(...PRODUCT_CLOCK_SEO_KEYWORDS);
  }

  if (includesAnyKeyword(haystack, ["lamp", "light", "lighting", "lantern", "luminous"])) {
    keywords.push(...PRODUCT_LAMP_SEO_KEYWORDS);
  }

  if (includesAnyKeyword(haystack, ["art", "sculpture", "decorative", "object", "installation"])) {
    keywords.push(...PRODUCT_ART_SEO_KEYWORDS);
  }

  if (includesAnyKeyword(haystack, ["gift", "gifting", "executive", "corporate", "commemorative", "collector"])) {
    keywords.push(...PRODUCT_GIFT_SEO_KEYWORDS);
  }

  return dedupeKeywords(keywords);
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
    description: ORGANIZATION_DESCRIPTION,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logoPath),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit No. 1201, 12th Floor, Metropolis Tower, 10 Metropolis Drive",
      addressLocality: "Hunghom",
      addressRegion: "Kowloon",
      addressCountry: "HK",
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
      "Magnetic levitation products manufacturer",
      "Magnetic levitation company",
      "Magnetic levitation factory",
      "Magnetic levitation solution provider",
      "Magnetic levitation product supplier",
      "Magnetic levitation device manufacturer",
      "Levitating lamps",
      "Floating display systems",
      "Magnetic display stand",
      "Floating display stand",
      "Levitating display stand",
      "Magnetic floating display",
      "Magnetic levitation display stand",
      "Custom floating display",
      "Display art objects",
      "Premium magnetic levitation gifts",
      "Custom magnetic levitation products",
      "OEM manufacturing",
      "ODM manufacturing",
      "ODM magnetic levitation products",
      "Custom magnetic levitation manufacturer",
      "Private label magnetic levitation products",
      "Magnetic levitation OEM manufacturer",
      "Magnetic levitation ODM supplier",
      "Custom floating products manufacturer",
      "MOQ magnetic levitation products",
      "Magnetic levitation lead time",
      "Magnetic levitation sample validation",
      "Magnetic levitation export readiness",
      "Design brief for OEM magnetic levitation products",
      "Magnetic levitation prototype validation",
      "OEM magnetic levitation sampling",
      "Magnetic levitation mass production",
      "B2B magnetic levitation sourcing",
      "Magnetic levitation sourcing checklist",
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: ORGANIZATION_DESCRIPTION,
    keywords: dedupeKeywords(BLOG_SEO_KEYWORDS).join(", "),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logoPath),
      },
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

export function extractVisibleBlogFaqs(post: PublicBlogRecord): FaqItem[] {
  return post.sections.flatMap((section) => {
    const normalizedHeading = section.heading.trim().toLowerCase();

    if (normalizedHeading !== "buyer faq" && normalizedHeading !== "faq" && normalizedHeading !== "frequently asked questions") {
      return [];
    }

    return section.body
      .split(/\n\s*\n/g)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .flatMap((chunk) => {
        const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
        const firstLine = lines[0] ?? "";

        if (!firstLine.startsWith("### ")) {
          return [];
        }

        const question = firstLine.replace(/^###\s+/, "").trim();
        const answer = lines
          .slice(1)
          .join(" ")
          .replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, "$1")
          .trim();

        if (!question || !answer) {
          return [];
        }

        return [{ question, answer }];
      });
  });
}

export function generateProductJsonLd(product: Product) {
  const productImageUrl = resolveMetadataImageUrl(product.productImage);
  const keywords = buildProductSeoKeywords(product);

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
      url: siteConfig.url,
    },
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    additionalProperty:
      product.specs.length > 0
        ? product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          }))
        : undefined,
    url: absoluteUrl(`/products/${product.slug}`),
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

function buildArticleTextCorpus(post: PublicBlogRecord) {
  return [
    post.title,
    post.seoTitle,
    post.seoDescription,
    post.excerpt,
    post.category,
    ...post.sections.flatMap((section) => [section.heading, section.body]),
  ]
    .join(" ")
    .toLowerCase();
}

function buildArticleTopicKeywords(post: PublicBlogRecord) {
  const corpus = buildArticleTextCorpus(post);
  const matchedKeywords = BLOG_SEO_KEYWORDS.filter((keyword) => corpus.includes(keyword.toLowerCase()));

  return dedupeKeywords([post.category, ...matchedKeywords]).slice(0, 20);
}

function extractInternalArticleLinks(post: PublicBlogRecord) {
  const links = post.sections
    .flatMap((section) => Array.from(section.body.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g)))
    .map((match) => match[1]?.trim() ?? "")
    .filter((href) => href.startsWith("/"));

  return dedupeKeywords(links);
}

export function generateBlogJsonLd(posts: PublicBlogRecord[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AMO Journal",
    description:
      "AMO Journal publishes B2B articles on floating displays, OEM magnetic levitation products, supplier evaluation, sourcing, museums, exhibitions, hospitality, gifts, and magnetic levitation technology.",
    url: absoluteUrl("/blog"),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logoPath),
      },
    },
    keywords: dedupeKeywords(BLOG_SEO_KEYWORDS).join(", "),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      alternativeHeadline:
        post.seoTitle?.trim() && post.seoTitle.trim() !== post.title ? post.seoTitle.trim() : undefined,
      description: buildArticleDescription(post),
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || undefined,
      articleSection: post.category,
      image: post.coverImage ? [resolveMetadataImageUrl(post.coverImage)] : undefined,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    })),
  };
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
      modifiedTime: post.updatedAt || undefined,
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
  const keywords = dedupeKeywords([post.category, post.title, post.seoTitle || "", post.seoDescription || "", ...BLOG_SEO_KEYWORDS]);
  const topicKeywords = buildArticleTopicKeywords(post);
  const internalLinks = extractInternalArticleLinks(post);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    alternativeHeadline:
      post.seoTitle?.trim() && post.seoTitle.trim() !== post.title ? post.seoTitle.trim() : undefined,
    description: buildArticleDescription(post),
    abstract: post.excerpt,
    image: metadataImageUrl ? [metadataImageUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || undefined,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
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
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    isPartOf: {
      "@type": "Blog",
      name: "AMO Journal",
      url: absoluteUrl("/blog"),
    },
    articleSection: post.category,
    keywords: keywords.join(", "),
    about: topicKeywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    mentions: internalLinks.map((href) => ({
      "@type": "WebPage",
      url: absoluteUrl(href),
    })),
  };
}
