import type { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

import {
  buildProductImageVariantPaths,
  collectProductImageVariantStoragePaths,
  getProductStoragePublicUrl,
  normalizeProductImageExtension,
  resolveProductImageContentType,
  sanitizeProductImageAssetStem,
} from "../products/product-image-variants.ts";

export const PRODUCT_IMAGE_LARGE_MAX_WIDTH = 1600;
export const PRODUCT_IMAGE_THUMB_MAX_WIDTH = 480;
export const PRODUCT_IMAGE_LARGE_QUALITY = 86;
export const PRODUCT_IMAGE_THUMB_QUALITY = 80;

const PRODUCT_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ?? "product-media";

function toBuffer(value: ArrayBuffer | ArrayBufferView | Buffer) {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }

  return Buffer.from(value);
}

export function buildProductImageAssetStem(value: string) {
  return sanitizeProductImageAssetStem(value);
}

export async function createProductImageVariantBuffers(options: {
  inputBuffer: ArrayBuffer | ArrayBufferView | Buffer;
  largeQuality?: number;
  thumbQuality?: number;
}) {
  const inputBuffer = toBuffer(options.inputBuffer);
  const largeQuality = options.largeQuality ?? PRODUCT_IMAGE_LARGE_QUALITY;
  const thumbQuality = options.thumbQuality ?? PRODUCT_IMAGE_THUMB_QUALITY;

  const [largeBuffer, thumbBuffer] = await Promise.all([
    sharp(inputBuffer)
      .rotate()
      .resize({
        width: PRODUCT_IMAGE_LARGE_MAX_WIDTH,
        withoutEnlargement: true,
        fit: "inside",
        kernel: sharp.kernel.lanczos3,
      })
      .webp({
        quality: largeQuality,
        effort: 5,
      })
      .toBuffer(),
    sharp(inputBuffer)
      .rotate()
      .resize({
        width: PRODUCT_IMAGE_THUMB_MAX_WIDTH,
        withoutEnlargement: true,
        fit: "inside",
        kernel: sharp.kernel.lanczos3,
      })
      .webp({
        quality: thumbQuality,
        effort: 5,
      })
      .toBuffer(),
  ]);

  return {
    originalBuffer: inputBuffer,
    largeBuffer,
    thumbBuffer,
  };
}

export async function uploadProductImageVariantSet(
  supabase: SupabaseClient,
  options: {
    assetStem: string;
    inputBuffer: ArrayBuffer | ArrayBufferView | Buffer;
    originalContentType?: string | null;
    originalExtension: string;
    productId: string;
    upsert?: boolean;
  },
) {
  const paths = buildProductImageVariantPaths({
    productId: options.productId,
    assetStem: options.assetStem,
    originalExtension: normalizeProductImageExtension(options.originalExtension),
  });
  const originalContentType =
    options.originalContentType?.trim() ||
    resolveProductImageContentType(paths.originalExtension);
  const { originalBuffer, largeBuffer, thumbBuffer } =
    await createProductImageVariantBuffers({
      inputBuffer: options.inputBuffer,
    });
  const uploadedPaths: string[] = [];

  try {
    for (const [path, body, contentType] of [
      [paths.originalPath, originalBuffer, originalContentType],
      [paths.largePath, largeBuffer, "image/webp"],
      [paths.thumbPath, thumbBuffer, "image/webp"],
    ] as const) {
      const { error } = await supabase.storage
        .from(PRODUCT_STORAGE_BUCKET)
        .upload(path, body, {
          contentType,
          upsert: options.upsert ?? true,
        });

      if (error) {
        throw error;
      }

      uploadedPaths.push(path);
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from(PRODUCT_STORAGE_BUCKET)
        .remove(uploadedPaths);
    }

    throw error;
  }

  return {
    paths,
    urls: {
      originalUrl: getProductStoragePublicUrl(paths.originalPath),
      largeUrl: getProductStoragePublicUrl(paths.largePath),
      thumbUrl: getProductStoragePublicUrl(paths.thumbPath),
    },
  };
}

export async function removeProductImageVariantFiles(
  supabase: SupabaseClient,
  storagePaths: Array<string | null | undefined>,
) {
  const removablePaths = Array.from(
    new Set(storagePaths.flatMap((storagePath) => collectProductImageVariantStoragePaths(storagePath))),
  );

  if (removablePaths.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_STORAGE_BUCKET)
    .remove(removablePaths);

  if (error) {
    throw error;
  }
}
