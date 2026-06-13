import { createClient } from "@supabase/supabase-js";

import {
  deriveProductImageVariantPaths,
  inferProductImageExtension,
  resolveProductImageVariantUrls,
} from "../lib/products/product-image-variants.ts";
import {
  buildProductImageAssetStem,
  uploadProductImageVariantSet,
} from "../lib/server/product-image-pipeline.ts";

interface ProductImageRow {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string | null;
  is_primary: boolean;
}

interface OptimizationFailure {
  id: string;
  error: string;
}

function loadEnv() {
  process.loadEnvFile?.(".env.local");
}

function requireEnv(key: string) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

async function downloadSourceImage(row: ProductImageRow) {
  const variants = resolveProductImageVariantUrls({
    imageUrl: row.image_url,
    storagePath: row.storage_path,
  });
  const candidateUrls = Array.from(
    new Set(
      [variants.originalUrl, row.image_url, variants.largeUrl]
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  );

  for (const url of candidateUrls) {
    const response = await fetch(url);

    if (!response.ok) {
      continue;
    }

    const buffer = await response.arrayBuffer();

    return {
      buffer,
      contentType: response.headers.get("content-type"),
      sourceUrl: url,
    };
  }

  throw new Error("Unable to download the source product image.");
}

async function main() {
  loadEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, storage_path, is_primary")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load product_images: ${error.message}`);
  }

  const rows = (data ?? []) as ProductImageRow[];
  let optimizedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const failures: OptimizationFailure[] = [];

  for (const row of rows) {
    const existingVariants = resolveProductImageVariantUrls({
      imageUrl: row.image_url,
      storagePath: row.storage_path,
    });
    const normalizedPaths = deriveProductImageVariantPaths(row.storage_path);
    const alreadyOptimized =
      existingVariants.isNormalized &&
      row.image_url.trim() === existingVariants.largeUrl &&
      Boolean(normalizedPaths);

    if (alreadyOptimized) {
      skippedCount += 1;
      continue;
    }

    try {
      const source = await downloadSourceImage(row);
      const originalExtension =
        normalizedPaths?.originalExtension ??
        inferProductImageExtension({
          storagePath: row.storage_path,
          imageUrl: source.sourceUrl,
          contentType: source.contentType,
        });
      const uploadedAsset = await uploadProductImageVariantSet(supabase, {
        productId: row.product_id,
        assetStem: normalizedPaths?.assetStem ?? buildProductImageAssetStem(row.id),
        inputBuffer: source.buffer,
        originalExtension,
        originalContentType: source.contentType,
        upsert: true,
      });

      const { error: imageUpdateError } = await supabase
        .from("product_images")
        .update({
          storage_path: uploadedAsset.paths.originalPath,
          image_url: uploadedAsset.urls.largeUrl,
        })
        .eq("id", row.id);

      if (imageUpdateError) {
        throw new Error(`Unable to update product_images row: ${imageUpdateError.message}`);
      }

      if (row.is_primary) {
        const { error: productUpdateError } = await supabase
          .from("products")
          .update({
            og_image_url: uploadedAsset.urls.largeUrl,
          })
          .eq("id", row.product_id);

        if (productUpdateError) {
          throw new Error(`Unable to update product hero image: ${productUpdateError.message}`);
        }
      }

      optimizedCount += 1;
      console.log(
        `[optimized] ${row.id} -> original=${uploadedAsset.paths.originalPath} large=${uploadedAsset.paths.largePath} thumb=${uploadedAsset.paths.thumbPath}`,
      );
    } catch (optimizationError) {
      failedCount += 1;
      const message =
        optimizationError instanceof Error
          ? optimizationError.message
          : "Unknown optimization failure";
      failures.push({
        id: row.id,
        error: message,
      });
      console.error(`[failed] ${row.id}: ${message}`);
    }
  }

  const summary = {
    total: rows.length,
    optimizedCount,
    skippedCount,
    failedCount,
    failures,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

await main();
