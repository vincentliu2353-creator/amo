import legacy from "./legacy-image-variants.json";
import manifest from "./site-image-manifest.json";

interface LocalImage {
  base: string;
  widths: number[];
  blur?: string;
}

const localImages: Record<string, LocalImage> = manifest;
const legacyProductWidths: Record<string, number[]> = legacy.products;
const legacyStorage = "https://nejotkmyuwswoihgxrfz.supabase.co/storage/v1/object/public";
const legacyProductBase = `${legacyStorage}/product-media/products/large/`;

// These published covers were matched byte-for-byte to the checked-in assets.
// Keep the original URLs in the records and metadata.
const legacyBlogCovers = new Map(legacy.blogSlugs.map((slug) => [
  `${legacyStorage}/blog-media/blogs/${slug}/${slug}.webp`,
  `/images/blog/heroes/${slug}.webp`,
]));

function getLocalImage(src: string, thumbnail: boolean) {
  if (!src.startsWith("/")) return undefined;
  const image = localImages[src];
  if (!image) return undefined;

  const widths = thumbnail && src.startsWith("/products/")
    ? image.widths.filter((width) => width <= 480)
    : image.widths;

  const url = (width: number) => `${image.base}-${width}.webp`;
  return {
    src: url(widths[widths.length - 1]),
    srcSet: widths.length > 1 ? widths.map((width) => `${url(width)} ${width}w`).join(", ") : undefined,
    blur: image.blur,
  };
}

function getProductImage(src: string, thumbnail: boolean, mobileWidth: number, desktopWidth: number) {
  const mobile = src.replace("/products/large/", "/products/thumb/");
  if (thumbnail) return { src: mobile, srcSet: undefined, blur: undefined };
  if (mobileWidth >= desktopWidth) return undefined;
  return { src, srcSet: `${mobile} ${mobileWidth}w, ${src} ${desktopWidth}w`, blur: undefined };
}

export function getResponsiveImage(src: string, thumbnail = false) {
  const local = getLocalImage(legacyBlogCovers.get(src) ?? src, thumbnail);
  if (local) return local;

  if (src.startsWith(legacyProductBase)) {
    const widths = legacyProductWidths[src.slice(legacyProductBase.length)];
    if (widths) return getProductImage(src, thumbnail, widths[0], widths[1]);
  }

  // New uploads include the actual companion widths in their storage URLs.
  if (!src.includes("/storage/v1/object/public/")) return undefined;
  const variant = /-amo-([bp])-(\d+)x(\d+)w\.webp$/.exec(src);
  if (!variant) return undefined;

  const [, kind, mobileWidth, desktopWidth] = variant;
  if (kind === "p") {
    if (!src.includes("/products/large/")) return undefined;
    return getProductImage(src, thumbnail, Number(mobileWidth), Number(desktopWidth));
  }

  const mobile = src.slice(0, variant.index) + `-amo-b-${mobileWidth}w.webp`;
  return { src, srcSet: `${mobile} ${mobileWidth}w, ${src} ${desktopWidth}w`, blur: undefined };
}

export function getProductThumbnailProps(src: string, sizes: string) {
  const image = getResponsiveImage(src, true);
  return { sizes: image?.srcSet ? sizes : undefined, srcSet: image?.srcSet, src: image?.src ?? src };
}
