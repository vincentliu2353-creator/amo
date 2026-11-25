import type { SupabaseClient } from "@supabase/supabase-js";
import { encodeWebp } from "./encode-webp.ts";

import {
  buildProductImageVariantPaths,
  collectProductImageVariantStoragePaths,
  getProductStoragePublicUrl,
  resolveProductImageContentType,
  sanitizeProductImageAssetStem,
} from "../products/product-image-variants.ts";

export const PRODUCT_IMAGE_LARGE_MAX_WIDTH = 1600;
export const PRODUCT_IMAGE_THUMB_MAX_WIDTH = 768;
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

export async function uploadProductImageVariantSet(
  supabase: SupabaseClient,
  options: {
    assetStem: string;
    inputBuffer: ArrayBuffer | ArrayBufferView | Buffer;
    originalContentType?: string | null;
    originalExtension?: string;
    productId: string;
    upsert?: boolean;
  },
) {
  const input = toBuffer(options.inputBuffer);
  // The backfill may retain a legacy original at its existing path. New admin
  // uploads store a compressed WebP in that slot and declare their actual widths.
  const preserveOriginal = Boolean(options.originalExtension);
  const [large, thumb, original] = await Promise.all([
    encodeWebp(input, {
      width: PRODUCT_IMAGE_LARGE_MAX_WIDTH, maxBytes: 400_000, quality: PRODUCT_IMAGE_LARGE_QUALITY,
    }),
    encodeWebp(input, {
      width: PRODUCT_IMAGE_THUMB_MAX_WIDTH, maxBytes: 150_000, quality: PRODUCT_IMAGE_THUMB_QUALITY,
    }),
    preserveOriginal ? null : encodeWebp(input, { width: 2400, maxBytes: 900_000, quality: 90 }),
  ]);
  const paths = buildProductImageVariantPaths({
    productId: options.productId,
    assetStem: preserveOriginal ? options.assetStem : `${options.assetStem}-amo-p-${thumb.info.width}x${large.info.width}w`,
    originalExtension: options.originalExtension ?? ".webp",
  });
  const originalContentType =
    options.originalContentType?.trim() || resolveProductImageContentType(paths.originalExtension);
  const uploadedPaths: string[] = [];

  try {
    for (const [path, body, contentType] of [
      [paths.originalPath, original?.data ?? input, originalContentType],
      [paths.largePath, large.data, "image/webp"],
      [paths.thumbPath, thumb.data, "image/webp"],
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
