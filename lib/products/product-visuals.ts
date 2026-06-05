import type { Product, ProductShowcaseImage } from "@/types";

type ProductVisualKey = "clock" | "lamp" | "sculpture" | "platform";

type ProductVisualSubject = Pick<Product, "slug" | "name" | "category" | "summary" | "description" | "highlight" | "tags" | "applications">;

const PRODUCT_VISUAL_ORDER: ProductVisualKey[] = ["clock", "lamp", "sculpture", "platform"];

const PRODUCT_VISUAL_LIBRARY: Record<
  ProductVisualKey,
  {
    alt: string;
    url: string;
  }
> = {
  clock: {
    url: "/products/rendered/levitating-clock-hero.png",
    alt: "Photorealistic levitating clock product render on a white studio background",
  },
  lamp: {
    url: "/products/rendered/levitating-lamp-hero.png",
    alt: "Photorealistic levitating lamp product render on a white studio background",
  },
  sculpture: {
    url: "/products/rendered/floating-display-sculpture-hero.png",
    alt: "Photorealistic floating display sculpture render on a white studio background",
  },
  platform: {
    url: "/products/rendered/oem-maglev-platform-hero.png",
    alt: "Photorealistic OEM magnetic levitation platform render on a white studio background",
  },
};

const PRODUCT_VISUAL_MATCHERS: Array<{ key: ProductVisualKey; keywords: string[] }> = [
  {
    key: "clock",
    keywords: ["clock", "timepiece", "desk clock", "table clock", "watch"],
  },
  {
    key: "lamp",
    keywords: ["lamp", "light", "lighting", "lantern", "luminous"],
  },
  {
    key: "platform",
    keywords: ["oem", "odm", "platform", "module", "kit", "developer", "integration", "motion core"],
  },
  {
    key: "sculpture",
    keywords: ["display", "sculpture", "globe", "art", "retail", "brand", "exhibition", "hospitality", "gift"],
  },
];

function buildProductSearchText(product: ProductVisualSubject) {
  return [
    product.slug,
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

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickProductVisualKey(product: ProductVisualSubject): ProductVisualKey {
  const haystack = buildProductSearchText(product);

  for (const matcher of PRODUCT_VISUAL_MATCHERS) {
    if (matcher.keywords.some((keyword) => haystack.includes(keyword))) {
      return matcher.key;
    }
  }

  const seed = product.slug || product.name || product.category || "amo";
  return PRODUCT_VISUAL_ORDER[hashString(seed) % PRODUCT_VISUAL_ORDER.length];
}

export function isPlaceholderProductVisualUrl(url: string | null | undefined) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return true;
  }

  const normalizedUrl = url.trim().toLowerCase();

  return normalizedUrl.includes("amo.example.com") || /https?:\/\/[^/]*example\.com\//.test(normalizedUrl);
}

export function getFallbackProductVisual(product: ProductVisualSubject) {
  return PRODUCT_VISUAL_LIBRARY[pickProductVisualKey(product)];
}

export function resolveProductPrimaryImage(product: ProductVisualSubject, url: string | null | undefined) {
  if (!isPlaceholderProductVisualUrl(url)) {
    return typeof url === "string" ? url.trim() : "";
  }

  return getFallbackProductVisual(product).url;
}

export function applyProductVisualFallback<T extends Product>(product: T): T {
  return {
    ...product,
    productImage: resolveProductPrimaryImage(product, product.productImage),
  };
}

export function resolveProductShowcaseGallery(
  product: ProductVisualSubject,
  images: ProductShowcaseImage[],
): ProductShowcaseImage[] {
  const realImages = images
    .filter((image) => !isPlaceholderProductVisualUrl(image.url))
    .map((image) => ({
      ...image,
      alt: image.alt.trim().length > 0 ? image.alt : product.name,
    }));

  if (realImages.length > 0) {
    return realImages;
  }

  const fallback = getFallbackProductVisual(product);

  return [
    {
      url: fallback.url,
      alt: fallback.alt,
      isPrimary: true,
      sortOrder: 0,
    },
  ];
}
