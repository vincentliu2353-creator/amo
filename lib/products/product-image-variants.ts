const PRODUCT_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ?? "product-media";

const PRODUCT_ORIGINAL_PREFIX = "products/original/";
const PRODUCT_LARGE_PREFIX = "products/large/";
const PRODUCT_THUMB_PREFIX = "products/thumb/";

export interface ProductImageVariantPaths {
  productId: string;
  assetStem: string;
  originalExtension: string;
  originalPath: string;
  largePath: string;
  thumbPath: string;
}

export interface ProductImageVariantUrls {
  originalUrl: string;
  largeUrl: string;
  thumbUrl: string;
  isNormalized: boolean;
}

function normalizeSlashes(value: string) {
  return value.replace(/\\/g, "/");
}

function stripQueryAndHash(value: string) {
  return value.split("#", 1)[0]?.split("?", 1)[0] ?? value;
}

function extractPathish(value: string) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return url.pathname;
  } catch {
    return value;
  }
}

function extractExtensionFromPathish(value: string) {
  const normalized = stripQueryAndHash(normalizeSlashes(extractPathish(value))).trim();

  if (!normalized) {
    return "";
  }

  const segment = normalized.split("/").pop() ?? normalized;
  const separatorIndex = segment.lastIndexOf(".");

  if (separatorIndex === -1) {
    return "";
  }

  return segment.slice(separatorIndex).toLowerCase();
}

export function normalizeProductImageExtension(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  const extension = normalized.startsWith(".") ? normalized : normalized ? `.${normalized}` : "";

  switch (extension) {
    case ".jpeg":
    case ".jpg":
      return ".jpg";
    case ".png":
      return ".png";
    case ".webp":
      return ".webp";
    case ".jfif":
      return ".jpg";
    default:
      return ".png";
  }
}

export function resolveProductImageContentType(extension: string) {
  switch (normalizeProductImageExtension(extension)) {
    case ".jpg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

export function inferProductImageExtension(options: {
  fileName?: string | null;
  contentType?: string | null;
  imageUrl?: string | null;
  storagePath?: string | null;
}) {
  const fromFileName = extractExtensionFromPathish(options.fileName ?? "");

  if (fromFileName) {
    return normalizeProductImageExtension(fromFileName);
  }

  const fromStoragePath = extractExtensionFromPathish(options.storagePath ?? "");

  if (fromStoragePath) {
    return normalizeProductImageExtension(fromStoragePath);
  }

  const fromImageUrl = extractExtensionFromPathish(options.imageUrl ?? "");

  if (fromImageUrl) {
    return normalizeProductImageExtension(fromImageUrl);
  }

  const contentType = (options.contentType ?? "").trim().toLowerCase();

  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    return ".jpg";
  }

  if (contentType.includes("webp")) {
    return ".webp";
  }

  if (contentType.includes("png")) {
    return ".png";
  }

  return ".png";
}

export function sanitizeProductImageAssetStem(value: string) {
  const withoutExtension = value.replace(/\.[a-z0-9]+$/i, "");
  const sanitized = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "image";
}

export function buildProductImageVariantPaths(options: {
  productId: string;
  assetStem: string;
  originalExtension: string;
}): ProductImageVariantPaths {
  const productId = options.productId.trim();
  const assetStem = sanitizeProductImageAssetStem(options.assetStem);
  const originalExtension = normalizeProductImageExtension(options.originalExtension);

  return {
    productId,
    assetStem,
    originalExtension,
    originalPath: `${PRODUCT_ORIGINAL_PREFIX}${productId}/${assetStem}${originalExtension}`,
    largePath: `${PRODUCT_LARGE_PREFIX}${productId}/${assetStem}.webp`,
    thumbPath: `${PRODUCT_THUMB_PREFIX}${productId}/${assetStem}.webp`,
  };
}

export function deriveProductImageVariantPaths(storagePath: string | null | undefined) {
  const normalizedPath = normalizeSlashes((storagePath ?? "").trim());

  if (!normalizedPath.startsWith(PRODUCT_ORIGINAL_PREFIX)) {
    return null;
  }

  const relativePath = normalizedPath.slice(PRODUCT_ORIGINAL_PREFIX.length);
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  const productId = segments[0];
  const filename = segments.slice(1).join("/");
  const extension = extractExtensionFromPathish(filename);

  if (!extension) {
    return null;
  }

  const assetStem = filename.slice(0, filename.length - extension.length);

  return buildProductImageVariantPaths({
    productId,
    assetStem,
    originalExtension: extension,
  });
}

function encodeStoragePath(storagePath: string) {
  return storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function getProductStoragePublicUrl(storagePath: string | null | undefined) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const normalizedPath = (storagePath ?? "").trim();

  if (!supabaseUrl || !normalizedPath) {
    return "";
  }

  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_STORAGE_BUCKET}/${encodeStoragePath(
    normalizedPath,
  )}`;
}

export function resolveProductImageVariantUrls(options: {
  imageUrl?: string | null;
  storagePath?: string | null;
}): ProductImageVariantUrls {
  const imageUrl = options.imageUrl?.trim() ?? "";
  const storagePath = options.storagePath?.trim() ?? "";
  const normalizedPaths = deriveProductImageVariantPaths(storagePath);

  if (normalizedPaths) {
    const originalUrl = getProductStoragePublicUrl(normalizedPaths.originalPath);
    const largeUrl = getProductStoragePublicUrl(normalizedPaths.largePath) || imageUrl || originalUrl;
    const thumbUrl = getProductStoragePublicUrl(normalizedPaths.thumbPath) || largeUrl || originalUrl;

    return {
      originalUrl: originalUrl || imageUrl,
      largeUrl: largeUrl || originalUrl || imageUrl,
      thumbUrl: thumbUrl || largeUrl || originalUrl || imageUrl,
      isNormalized: true,
    };
  }

  const storageUrl = getProductStoragePublicUrl(storagePath);
  const fallbackUrl = imageUrl || storageUrl;

  return {
    originalUrl: storageUrl || fallbackUrl,
    largeUrl: fallbackUrl || storageUrl,
    thumbUrl: fallbackUrl || storageUrl,
    isNormalized: false,
  };
}

export function collectProductImageVariantStoragePaths(storagePath: string | null | undefined) {
  const normalizedPaths = deriveProductImageVariantPaths(storagePath ?? "");

  if (normalizedPaths) {
    return [
      normalizedPaths.originalPath,
      normalizedPaths.largePath,
      normalizedPaths.thumbPath,
    ];
  }

  const normalizedStoragePath = (storagePath ?? "").trim();

  return normalizedStoragePath ? [normalizedStoragePath] : [];
}
