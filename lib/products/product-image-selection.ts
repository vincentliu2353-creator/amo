import type { AdminProductImage, ProductShowcaseImage } from "@/types";

function normalizeUrl(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function pickShowcaseLargeImage(
  image: ProductShowcaseImage | null | undefined,
  fallback: string,
) {
  return (
    normalizeUrl(image?.largeUrl) ||
    normalizeUrl(image?.url) ||
    normalizeUrl(image?.originalUrl) ||
    normalizeUrl(fallback)
  );
}

export function pickShowcaseThumbImage(
  image: ProductShowcaseImage | null | undefined,
  fallback: string,
) {
  return (
    normalizeUrl(image?.thumbUrl) ||
    normalizeUrl(image?.largeUrl) ||
    normalizeUrl(image?.url) ||
    normalizeUrl(image?.originalUrl) ||
    normalizeUrl(fallback)
  );
}

export function pickAdminThumbImage(
  images: AdminProductImage[],
  fallback: string,
) {
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

  return (
    normalizeUrl(primaryImage?.thumbUrl) ||
    normalizeUrl(primaryImage?.largeUrl) ||
    normalizeUrl(primaryImage?.imageUrl) ||
    normalizeUrl(primaryImage?.originalUrl) ||
    normalizeUrl(fallback)
  );
}
