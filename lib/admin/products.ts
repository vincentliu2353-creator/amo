import "server-only";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { slugifyValue } from "@/lib/admin/product-form";
import { resolveProductImageVariantUrls, inferProductImageExtension } from "@/lib/products/product-image-variants";
import { PRODUCT_SHOWCASE_SPEC_FIELDS } from "@/lib/products/spec-fields";
import {
  buildProductImageAssetStem,
  removeProductImageVariantFiles,
  uploadProductImageVariantSet,
} from "@/lib/server/product-image-pipeline";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type {
  AdminCategoryOption,
  AdminProductImage,
  AdminProductRecord,
  ContentStatus,
} from "@/types";

const PRODUCT_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ?? "product-media";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CUSTOMIZATION_SPEC_ALIASES = [
  "customization",
  "customisation",
  "customization options",
  "customisation options",
  "custom options",
  "custom options available",
  "oem options",
] as const;

const ADMIN_PRODUCT_SELECT = `
  id,
  category_id,
  slug,
  sku,
  name,
  series,
  status,
  featured,
  is_featured,
  featured_order,
  summary,
  description,
  highlight,
  lead_time_text,
  min_order_qty,
  min_order_unit,
  hero_metric,
  tags,
  applications,
  features,
  specs,
  filter_attributes,
  faq_items,
  sort_order,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  og_image_url,
  published_at,
  created_at,
  updated_at,
  categories!inner(id, slug, name),
  product_images(id, image_url, storage_path, alt_text, sort_order, is_primary)
`;

interface AdminMutationResult {
  message: string;
  product: AdminProductRecord;
}

export interface AdminFeaturedProductSelectionItem {
  id: string;
  featuredOrder: number | null;
}

interface ParsedAdminProductPayload {
  categoryId: string;
  slug: string;
  name: string;
  series: string;
  status: ContentStatus;
  summary: string;
  description: string;
  levitationHeight: string;
  rotation: string;
  diameter: string;
  loadCapacity: string;
  power: string;
  finish: string;
  minOrderQty: number;
  leadTimeText: string;
  customizationOptions: string;
  seoTitle: string;
  seoDescription: string;
  removedImageIds: string[];
  imageFiles: File[];
}

type FieldErrors = Record<string, string>;

export class AdminProductMutationError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status = 400, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "AdminProductMutationError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function normalizeStatus(value: string): ContentStatus | null {
  if (value === "draft" || value === "published") {
    return value;
  }

  return null;
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function normalizeCategory(value: unknown) {
  if (!value) {
    return null;
  }

  const record = Array.isArray(value) ? value[0] : value;

  if (!record || typeof record !== "object") {
    return null;
  }

  const category = record as Record<string, unknown>;

  if (
    typeof category.id !== "string" ||
    typeof category.slug !== "string" ||
    typeof category.name !== "string"
  ) {
    return null;
  }

  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
  };
}

function normalizeFaqItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const entry = item as Record<string, unknown>;
      const question = typeof entry.question === "string" ? entry.question : "";
      const answer = typeof entry.answer === "string" ? entry.answer : "";

      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

function normalizeRecord(
  value: unknown,
): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string | number | boolean>>(
    (accumulator, [key, entryValue]) => {
      if (
        typeof entryValue === "string" ||
        typeof entryValue === "number" ||
        typeof entryValue === "boolean"
      ) {
        accumulator[key] = entryValue;
      }

      return accumulator;
    },
    {},
  );
}

function normalizeImages(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const image = item as Record<string, unknown>;

      if (typeof image.id !== "string" || typeof image.image_url !== "string") {
        return null;
      }

      const storagePath = typeof image.storage_path === "string" ? image.storage_path : "";
      const variants = resolveProductImageVariantUrls({
        imageUrl: image.image_url,
        storagePath,
      });

      return {
        id: image.id,
        imageUrl: variants.largeUrl || image.image_url,
        originalUrl: variants.originalUrl || image.image_url,
        largeUrl: variants.largeUrl || image.image_url,
        thumbUrl: variants.thumbUrl || variants.largeUrl || image.image_url,
        storagePath,
        altText: typeof image.alt_text === "string" ? image.alt_text : "",
        sortOrder: typeof image.sort_order === "number" ? image.sort_order : 0,
        isPrimary: Boolean(image.is_primary),
      } satisfies AdminProductImage;
    })
    .filter((item): item is AdminProductImage => Boolean(item))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

async function resolveAdminImageUrls(
  _supabase: SupabaseClient,
  images: AdminProductImage[],
) {
  return images;
}

async function hydrateAdminProductRecord(
  supabase: SupabaseClient,
  product: AdminProductRecord,
) {
  const images = await resolveAdminImageUrls(supabase, product.images);

  return {
    ...product,
    images,
  };
}

async function hydrateAdminProductRecords(
  supabase: SupabaseClient,
  products: AdminProductRecord[],
) {
  return Promise.all(products.map((product) => hydrateAdminProductRecord(supabase, product)));
}

function mapAdminProductRow(row: Record<string, unknown>): AdminProductRecord {
  const category = normalizeCategory(row.categories);

  return {
    id: typeof row.id === "string" ? row.id : "",
    categoryId: typeof row.category_id === "string" ? row.category_id : category?.id ?? "",
    categoryName: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    slug: typeof row.slug === "string" ? row.slug : "",
    sku: typeof row.sku === "string" ? row.sku : "",
    name: typeof row.name === "string" ? row.name : "",
    series: typeof row.series === "string" ? row.series : "",
    status: row.status === "published" ? "published" : "draft",
    featured: Boolean(row.featured),
    isFeatured: Boolean(row.is_featured),
    featuredOrder: typeof row.featured_order === "number" ? row.featured_order : null,
    summary: typeof row.summary === "string" ? row.summary : "",
    description: typeof row.description === "string" ? row.description : "",
    highlight: typeof row.highlight === "string" ? row.highlight : "",
    leadTimeText: typeof row.lead_time_text === "string" ? row.lead_time_text : "",
    minOrderQty: typeof row.min_order_qty === "number" ? row.min_order_qty : null,
    minOrderUnit: typeof row.min_order_unit === "string" ? row.min_order_unit : "unit",
    heroMetric: typeof row.hero_metric === "string" ? row.hero_metric : "",
    tags: normalizeStringArray(row.tags),
    applications: normalizeStringArray(row.applications),
    features: normalizeStringArray(row.features),
    specs: normalizeRecord(row.specs) as Record<string, string>,
    filterAttributes: normalizeRecord(row.filter_attributes),
    faqItems: normalizeFaqItems(row.faq_items),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    seoTitle: typeof row.seo_title === "string" ? row.seo_title : "",
    seoDescription: typeof row.seo_description === "string" ? row.seo_description : "",
    seoKeywords: normalizeStringArray(row.seo_keywords),
    canonicalUrl: typeof row.canonical_url === "string" ? row.canonical_url : "",
    ogImageUrl: typeof row.og_image_url === "string" ? row.og_image_url : "",
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : "",
    images: normalizeImages(row.product_images),
  };
}

function sanitizeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return cleaned || "image";
}

function normalizeSpecLabel(label: string) {
  return label.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function isManagedSpecLabel(label: string) {
  const normalizedLabel = normalizeSpecLabel(label);

  for (const field of PRODUCT_SHOWCASE_SPEC_FIELDS) {
    if (field.aliases.some((alias) => normalizedLabel === alias || normalizedLabel.includes(alias))) {
      return true;
    }
  }

  return CUSTOMIZATION_SPEC_ALIASES.some(
    (alias) => normalizedLabel === alias || normalizedLabel.includes(alias),
  );
}

function buildManagedSpecs(
  parsed: ParsedAdminProductPayload,
  existingSpecs?: Record<string, string>,
) {
  const nextSpecs: Record<string, string> = {};

  for (const [label, value] of Object.entries(existingSpecs ?? {})) {
    if (!isManagedSpecLabel(label) && value.trim().length > 0) {
      nextSpecs[label] = value.trim();
    }
  }

  nextSpecs["Levitation Height"] = parsed.levitationHeight;
  nextSpecs.Rotation = parsed.rotation;
  nextSpecs.Diameter = parsed.diameter;
  nextSpecs["Load Capacity"] = parsed.loadCapacity;
  nextSpecs.Power = parsed.power;
  nextSpecs.Finish = parsed.finish;
  nextSpecs["Customization Options"] = parsed.customizationOptions;

  return nextSpecs;
}

function buildDefaultMinOrderUnit(quantity: number, existingUnit?: string) {
  if (!existingUnit || existingUnit === "unit" || existingUnit === "units") {
    return quantity === 1 ? "unit" : "units";
  }

  return existingUnit;
}

function mapConstraintError(error: unknown) {
  const record = error as Record<string, unknown> | null;
  const message = typeof record?.message === "string" ? record.message : "";
  const code = typeof record?.code === "string" ? record.code : "";

  if (code !== "23505") {
    return null;
  }

  if (message.includes("products_slug_key")) {
    return new AdminProductMutationError("This slug already exists.", 409, {
      slug: "This slug already exists.",
    });
  }

  if (message.includes("products_sku_key")) {
    return new AdminProductMutationError("This SKU already exists.", 409, {
      sku: "This SKU already exists.",
    });
  }

  return new AdminProductMutationError("This product conflicts with an existing record.", 409);
}

async function ensureUniqueSlug(
  supabase: SupabaseClient,
  requestedSlug: string,
  currentProductId?: string,
) {
  const slug = slugifyValue(requestedSlug);
  const { data, error } = await supabase
    .from("products")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new AdminProductMutationError(`Unable to validate slug uniqueness: ${error.message}`, 503);
  }

  if (data && data.id !== currentProductId) {
    throw new AdminProductMutationError("This slug already exists.", 409, {
      slug: "This slug already exists.",
    });
  }

  return slug;
}

async function getAdminProductById(supabase: SupabaseClient, productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw new AdminProductMutationError(`Unable to load the saved product: ${error.message}`, 503);
  }

  if (!data) {
    return null;
  }

  return hydrateAdminProductRecord(supabase, mapAdminProductRow(data as Record<string, unknown>));
}

async function ensureCategoryExists(supabase: SupabaseClient, categoryId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    throw new AdminProductMutationError(`Unable to validate the selected category: ${error.message}`, 503);
  }

  if (!data) {
    throw new AdminProductMutationError("Select a valid category before saving.", 400, {
      categoryId: "Select a valid category.",
    });
  }
}

function parseRequiredText(
  value: string,
  fieldName: string,
  label: string,
  fieldErrors: FieldErrors,
) {
  if (!value) {
    fieldErrors[fieldName] = `${label} is required.`;
  }

  return value;
}

function parsePositiveInteger(value: string, fieldName: string, label: string, fieldErrors: FieldErrors) {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    fieldErrors[fieldName] = `${label} must be a whole number greater than 0.`;
    return 0;
  }

  return numericValue;
}

function parseRemovedImageIds(rawValue: string, fieldErrors: FieldErrors) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      fieldErrors.images = "Unable to process removed images.";
      return [];
    }

    return parsed.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  } catch {
    fieldErrors.images = "Unable to process removed images.";
    return [];
  }
}

function validateImageFiles(imageFiles: File[], fieldErrors: FieldErrors) {
  const invalidFile = imageFiles.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));

  if (invalidFile) {
    fieldErrors.images = "Upload JPEG, PNG, or WebP images only.";
  }
}

async function ensureProductStorageBucket(supabase: SupabaseClient) {
  const { data, error } = await supabase.storage.getBucket(PRODUCT_STORAGE_BUCKET);

  if (error) {
    const isMissingBucket =
      error.message.toLowerCase().includes("not found") ||
      error.message.toLowerCase().includes("does not exist");

    if (!isMissingBucket) {
      throw new AdminProductMutationError(`Unable to access product media bucket: ${error.message}`, 503);
    }

    const { error: createError } = await supabase.storage.createBucket(PRODUCT_STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
    });

    if (createError) {
      throw new AdminProductMutationError(`Unable to create product media bucket: ${createError.message}`, 503);
    }

    return;
  }

  const bucket = data as { public?: boolean } | null;

  if (bucket?.public) {
    return;
  }

  const { error: updateError } = await supabase.storage.updateBucket(PRODUCT_STORAGE_BUCKET, {
    public: true,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
  });

  if (updateError) {
    throw new AdminProductMutationError(`Unable to update product media bucket: ${updateError.message}`, 503);
  }
}

function parseAdminProductFormData(formData: FormData): ParsedAdminProductPayload {
  const fieldErrors: FieldErrors = {};
  const status = normalizeStatus(normalizeString(formData.get("status"))) ?? "published";
  const name = parseRequiredText(normalizeString(formData.get("name")), "name", "Product name", fieldErrors);
  const series = parseRequiredText(normalizeString(formData.get("series")), "series", "Series", fieldErrors);
  const categoryId = parseRequiredText(normalizeString(formData.get("categoryId")), "categoryId", "Category", fieldErrors);
  const summary = parseRequiredText(normalizeString(formData.get("summary")), "summary", "Short description", fieldErrors);
  const description = parseRequiredText(normalizeString(formData.get("description")), "description", "Long description", fieldErrors);
  const levitationHeight = parseRequiredText(normalizeString(formData.get("levitationHeight")), "levitationHeight", "Levitation height", fieldErrors);
  const rotation = parseRequiredText(normalizeString(formData.get("rotation")), "rotation", "Rotation", fieldErrors);
  const diameter = parseRequiredText(normalizeString(formData.get("diameter")), "diameter", "Diameter", fieldErrors);
  const loadCapacity = parseRequiredText(normalizeString(formData.get("loadCapacity")), "loadCapacity", "Load capacity", fieldErrors);
  const power = parseRequiredText(normalizeString(formData.get("power")), "power", "Power", fieldErrors);
  const finish = parseRequiredText(normalizeString(formData.get("finish")), "finish", "Finish", fieldErrors);
  const leadTimeText = parseRequiredText(normalizeString(formData.get("leadTimeText")), "leadTimeText", "Lead time", fieldErrors);
  const customizationOptions = parseRequiredText(
    normalizeString(formData.get("customizationOptions")),
    "customizationOptions",
    "Customization options",
    fieldErrors,
  );
  const seoTitle = parseRequiredText(normalizeString(formData.get("seoTitle")), "seoTitle", "SEO title", fieldErrors);
  const seoDescription = parseRequiredText(
    normalizeString(formData.get("seoDescription")),
    "seoDescription",
    "SEO description",
    fieldErrors,
  );
  const minOrderQty = parsePositiveInteger(
    normalizeString(formData.get("minOrderQty")),
    "minOrderQty",
    "MOQ",
    fieldErrors,
  );
  const removedImageIds = parseRemovedImageIds(normalizeString(formData.get("removedImageIds")), fieldErrors);
  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  validateImageFiles(imageFiles, fieldErrors);

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminProductMutationError("Fix the highlighted fields before saving.", 400, fieldErrors);
  }

  return {
    categoryId,
    slug: slugifyValue(normalizeString(formData.get("slug")) || name),
    name,
    series,
    status,
    summary,
    description,
    levitationHeight,
    rotation,
    diameter,
    loadCapacity,
    power,
    finish,
    minOrderQty,
    leadTimeText,
    customizationOptions,
    seoTitle,
    seoDescription,
    removedImageIds,
    imageFiles,
  };
}

async function syncProductImages(
  supabase: SupabaseClient,
  options: {
    productId: string;
    slug: string;
    productName: string;
    existingImages: AdminProductImage[];
    removedImageIds: string[];
    imageFiles: File[];
  },
) {
  await ensureProductStorageBucket(supabase);

  const removableImages = options.existingImages.filter((image) => options.removedImageIds.includes(image.id));
  const removablePaths = removableImages.map((image) => image.storagePath);

  if (removablePaths.length > 0) {
    try {
      await removeProductImageVariantFiles(supabase, removablePaths);
    } catch (error) {
      throw new AdminProductMutationError(
        `Unable to remove product images: ${
          error instanceof Error ? error.message : "unknown storage removal failure"
        }`,
        503,
      );
    }
  }

  if (options.removedImageIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", options.productId)
      .in("id", options.removedImageIds);

    if (deleteError) {
      throw new AdminProductMutationError(`Unable to remove product image records: ${deleteError.message}`, 503);
    }
  }

  const remainingImages = options.existingImages.filter(
    (image) => !options.removedImageIds.includes(image.id),
  );
  let nextSortOrder = remainingImages.reduce((max, image) => Math.max(max, image.sortOrder), 0);
  const uploadedPaths: string[] = [];
  const insertedRows: Array<{
    product_id: string;
    image_url: string;
    storage_path: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
  }> = [];

  for (const [index, file] of options.imageFiles.entries()) {
    nextSortOrder += 10;

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const assetStem = buildProductImageAssetStem(
      `${Date.now()}-${index}-${sanitizeFileName(file.name)}`,
    );
    let uploadedAsset;

    try {
      uploadedAsset = await uploadProductImageVariantSet(supabase, {
        productId: options.productId,
        assetStem,
        inputBuffer: fileBytes,
        originalExtension: inferProductImageExtension({
          fileName: file.name,
          contentType: file.type,
        }),
        originalContentType: file.type || undefined,
        upsert: false,
      });
    } catch (error) {
      if (uploadedPaths.length > 0) {
        try {
          await removeProductImageVariantFiles(supabase, uploadedPaths);
        } catch {
          // Preserve the original upload error. Storage cleanup is best effort here.
        }
      }

      throw new AdminProductMutationError(
        `Unable to upload product images: ${
          error instanceof Error ? error.message : "unknown upload failure"
        }`,
        503,
      );
    }

    uploadedPaths.push(
      uploadedAsset.paths.originalPath,
      uploadedAsset.paths.largePath,
      uploadedAsset.paths.thumbPath,
    );

    insertedRows.push({
      product_id: options.productId,
      image_url: uploadedAsset.urls.largeUrl,
      storage_path: uploadedAsset.paths.originalPath,
      alt_text: `${options.productName} image ${remainingImages.length + index + 1}`,
      sort_order: nextSortOrder,
      is_primary: false,
    });
  }

  if (insertedRows.length > 0) {
    const { error: insertError } = await supabase.from("product_images").insert(insertedRows);

    if (insertError) {
      if (uploadedPaths.length > 0) {
        try {
          await removeProductImageVariantFiles(supabase, uploadedPaths);
        } catch {
          // Preserve the insert failure. Cleanup is best effort.
        }
      }

      throw new AdminProductMutationError(`Unable to save product image records: ${insertError.message}`, 503);
    }
  }

  const { data: finalImagesData, error: finalImagesError } = await supabase
    .from("product_images")
    .select("id, image_url, storage_path, alt_text, sort_order, is_primary")
    .eq("product_id", options.productId)
    .order("sort_order", { ascending: true });

  if (finalImagesError) {
    throw new AdminProductMutationError(`Unable to refresh product images: ${finalImagesError.message}`, 503);
  }

  const finalImages = normalizeImages(finalImagesData);
  const primaryImage = finalImages[0] ?? null;

  if (primaryImage) {
    const { error: clearPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", options.productId);

    if (clearPrimaryError) {
      throw new AdminProductMutationError(`Unable to update the primary product image: ${clearPrimaryError.message}`, 503);
    }

    const { error: setPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", primaryImage.id);

    if (setPrimaryError) {
      throw new AdminProductMutationError(`Unable to update the primary product image: ${setPrimaryError.message}`, 503);
    }
  }

  return {
    primaryImageUrl: primaryImage?.imageUrl ?? null,
  };
}

async function cleanupProductStorageAssets(supabase: SupabaseClient, productId: string) {
  const { data, error } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (error) {
    return;
  }

  const storagePaths = (data ?? [])
    .map((entry) => entry.storage_path)
    .filter((path): path is string => typeof path === "string" && path.length > 0);

  if (storagePaths.length > 0) {
    await removeProductImageVariantFiles(supabase, storagePaths);
  }
}

function revalidateAdminProductPaths(options: {
  productId?: string;
  slug?: string;
  previousSlug?: string;
}) {
  const paths = new Set<string>([
    "/admin",
    "/admin/products",
    "/admin/products/featured",
    "/admin/products/new",
    "/products",
  ]);

  if (options.productId) {
    paths.add(`/admin/products/${options.productId}/edit`);
  }

  if (options.slug) {
    paths.add(`/products/${options.slug}`);
  }

  if (options.previousSlug) {
    paths.add(`/products/${options.previousSlug}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

function resolveNextOgImageUrl(
  existingProduct: AdminProductRecord,
  primaryImageUrl: string | null,
  hasImageChanges: boolean,
) {
  if (primaryImageUrl) {
    return primaryImageUrl;
  }

  if (!hasImageChanges) {
    return existingProduct.ogImageUrl || null;
  }

  const previousImageUrls = new Set(existingProduct.images.map((image) => image.imageUrl));

  if (existingProduct.ogImageUrl && !previousImageUrls.has(existingProduct.ogImageUrl)) {
    return existingProduct.ogImageUrl;
  }

  return null;
}

export async function getAdminProductDashboardData(): Promise<{
  categories: AdminCategoryOption[];
  products: AdminProductRecord[];
}> {
  const supabase = createAdminSupabaseClient();
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name, status")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select(ADMIN_PRODUCT_SELECT)
      .order("updated_at", { ascending: false }),
  ]);

  if (categoriesResult.error) {
    throw new Error(`Unable to load product categories: ${categoriesResult.error.message}`);
  }

  if (productsResult.error) {
    throw new Error(`Unable to load admin product data: ${productsResult.error.message}`);
  }

  return {
    categories: (categoriesResult.data ?? []).map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      status: entry.status === "published" ? "published" : "draft",
    })),
    products: await hydrateAdminProductRecords(
      supabase,
      (productsResult.data ?? []).map((entry) => mapAdminProductRow(entry as Record<string, unknown>)),
    ),
  };
}

export async function getAdminProductEditorData(productId?: string): Promise<{
  categories: AdminCategoryOption[];
  product: AdminProductRecord | null;
}> {
  const supabase = createAdminSupabaseClient();
  const [categoriesResult, product] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name, status")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    productId ? getAdminProductById(supabase, productId) : Promise.resolve(null),
  ]);

  if (categoriesResult.error) {
    throw new Error(`Unable to load product categories: ${categoriesResult.error.message}`);
  }

  return {
    categories: (categoriesResult.data ?? []).map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      status: entry.status === "published" ? "published" : "draft",
    })),
    product,
  };
}

export async function getAdminFeaturedProductsData(): Promise<{
  products: AdminProductRecord[];
}> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load published products for featured selection: ${error.message}`);
  }

  return {
    products: await hydrateAdminProductRecords(
      supabase,
      (data ?? []).map((entry) => mapAdminProductRow(entry as Record<string, unknown>)),
    ),
  };
}

export async function saveAdminFeaturedProducts(
  selections: AdminFeaturedProductSelectionItem[],
): Promise<{ message: string }> {
  if (!Array.isArray(selections)) {
    throw new AdminProductMutationError("Featured product payload must be an array.", 400);
  }

  if (selections.length > 10) {
    throw new AdminProductMutationError("Select at most 10 featured products.", 400);
  }

  const normalizedSelections = selections.map((selection, index) => {
    if (!selection || typeof selection.id !== "string" || selection.id.trim().length === 0) {
      throw new AdminProductMutationError(`Featured product ${index + 1} is missing a valid id.`, 400);
    }

    return {
      id: selection.id,
    };
  });

  const seenIds = new Set<string>();

  for (const selection of normalizedSelections) {
    if (seenIds.has(selection.id)) {
      throw new AdminProductMutationError("Each featured product can only be selected once.", 400);
    }

    seenIds.add(selection.id);
  }

  const supabase = createAdminSupabaseClient();

  if (normalizedSelections.length > 0) {
    const { data, error } = await supabase
      .from("products")
      .select("id, status")
      .in("id", normalizedSelections.map((selection) => selection.id));

    if (error) {
      throw new AdminProductMutationError(`Unable to validate featured products: ${error.message}`, 503);
    }

    const publishedIds = new Set(
      (data ?? [])
        .filter((entry) => entry.status === "published")
        .map((entry) => entry.id)
        .filter((id): id is string => typeof id === "string"),
    );

    if (publishedIds.size !== normalizedSelections.length) {
      throw new AdminProductMutationError("Only published products can be featured on the Products page.", 400);
    }
  }

  const { error: clearOrderedError } = await supabase
    .from("products")
    .update({
      is_featured: false,
      featured_order: null,
    })
    .not("featured_order", "is", null);

  if (clearOrderedError) {
    throw new AdminProductMutationError(`Unable to clear existing featured product order: ${clearOrderedError.message}`, 503);
  }

  const { error: clearFlaggedError } = await supabase
    .from("products")
    .update({
      is_featured: false,
    })
    .eq("is_featured", true)
    .is("featured_order", null);

  if (clearFlaggedError) {
    throw new AdminProductMutationError(`Unable to clear existing featured products: ${clearFlaggedError.message}`, 503);
  }

  for (const [index, selection] of normalizedSelections.entries()) {
    const featuredOrder = index + 1;
    const { data, error: updateError } = await supabase
      .from("products")
      .update({
        is_featured: true,
        featured_order: featuredOrder,
      })
      .eq("id", selection.id)
      .eq("status", "published")
      .select("id")
      .maybeSingle();

    if (updateError) {
      throw new AdminProductMutationError(`Unable to save featured products: ${updateError.message}`, 503);
    }

    if (!data?.id) {
      throw new AdminProductMutationError("Only published products can be featured on the Products page.", 400);
    }
  }

  revalidateAdminProductPaths({});

  return {
    message:
      normalizedSelections.length > 0
        ? "Featured products saved for the Products page."
        : "Featured products cleared from the Products page.",
  };
}

export async function createAdminProduct(formData: FormData): Promise<AdminMutationResult> {
  const supabase = createAdminSupabaseClient();
  const parsed = parseAdminProductFormData(formData);

  await ensureCategoryExists(supabase, parsed.categoryId);

  const slug = await ensureUniqueSlug(supabase, parsed.slug);
  const publishedAt = parsed.status === "published" ? new Date().toISOString() : null;
  const specs = buildManagedSpecs(parsed);
  let createdProductId = "";

  try {
    const { data: createdRow, error: createError } = await supabase
      .from("products")
      .insert({
        category_id: parsed.categoryId,
        slug,
        sku: null,
        name: parsed.name,
        series: parsed.series,
        status: parsed.status,
        featured: false,
        is_featured: false,
        featured_order: null,
        summary: parsed.summary,
        description: parsed.description,
        highlight: parsed.summary,
        lead_time_text: parsed.leadTimeText,
        min_order_qty: parsed.minOrderQty,
        min_order_unit: buildDefaultMinOrderUnit(parsed.minOrderQty),
        hero_metric: null,
        tags: [],
        applications: [],
        features: [],
        specs,
        filter_attributes: {},
        faq_items: [],
        sort_order: 0,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        seo_keywords: [],
        canonical_url: null,
        og_image_url: null,
        published_at: publishedAt,
      })
      .select("id")
      .single();

    if (createError || !createdRow) {
      throw mapConstraintError(createError) ?? createError ?? new Error("Product creation failed.");
    }

    createdProductId = createdRow.id;

    const imageSync = await syncProductImages(supabase, {
      productId: createdProductId,
      slug,
      productName: parsed.name,
      existingImages: [],
      removedImageIds: [],
      imageFiles: parsed.imageFiles,
    });

    if (imageSync.primaryImageUrl) {
      const { error: ogUpdateError } = await supabase
        .from("products")
        .update({ og_image_url: imageSync.primaryImageUrl })
        .eq("id", createdProductId);

      if (ogUpdateError) {
        throw new AdminProductMutationError(`Unable to finalize the product image: ${ogUpdateError.message}`, 503);
      }
    }

    const product = await getAdminProductById(supabase, createdProductId);

    if (!product) {
      throw new AdminProductMutationError("The created product could not be reloaded.", 503);
    }

    revalidateAdminProductPaths({ productId: createdProductId, slug: product.slug });

    return {
      message: "Product created successfully.",
      product,
    };
  } catch (error) {
    if (createdProductId) {
      await cleanupProductStorageAssets(supabase, createdProductId);
      await supabase.from("products").delete().eq("id", createdProductId);
    }

    if (error instanceof AdminProductMutationError) {
      throw error;
    }

    const mappedError = mapConstraintError(error);

    if (mappedError) {
      throw mappedError;
    }

    throw new AdminProductMutationError(
      error instanceof Error ? error.message : "Unable to create the product.",
      503,
    );
  }
}

export async function updateAdminProduct(
  productId: string,
  formData: FormData,
): Promise<AdminMutationResult> {
  const supabase = createAdminSupabaseClient();
  const existingProduct = await getAdminProductById(supabase, productId);

  if (!existingProduct) {
    throw new AdminProductMutationError("This product does not exist.", 404);
  }

  const parsed = parseAdminProductFormData(formData);

  await ensureCategoryExists(supabase, parsed.categoryId);

  const slug = await ensureUniqueSlug(supabase, parsed.slug || existingProduct.slug, productId);
  const publishedAt =
    parsed.status === "published"
      ? existingProduct.publishedAt ?? new Date().toISOString()
      : null;
  const specs = buildManagedSpecs(parsed, existingProduct.specs);
  const nextHighlight =
    existingProduct.highlight.trim().length > 0 && existingProduct.highlight !== existingProduct.summary
      ? existingProduct.highlight
      : parsed.summary;

  try {
    const { error: updateError } = await supabase
      .from("products")
      .update({
        category_id: parsed.categoryId,
        slug,
        name: parsed.name,
        series: parsed.series,
        status: parsed.status,
        is_featured: parsed.status === "published" ? existingProduct.isFeatured : false,
        featured_order: parsed.status === "published" ? existingProduct.featuredOrder : null,
        summary: parsed.summary,
        description: parsed.description,
        highlight: nextHighlight,
        lead_time_text: parsed.leadTimeText,
        min_order_qty: parsed.minOrderQty,
        min_order_unit: buildDefaultMinOrderUnit(parsed.minOrderQty, existingProduct.minOrderUnit),
        specs,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        published_at: publishedAt,
      })
      .eq("id", productId);

    if (updateError) {
      throw mapConstraintError(updateError) ?? updateError;
    }

    const imageSync = await syncProductImages(supabase, {
      productId,
      slug,
      productName: parsed.name,
      existingImages: existingProduct.images,
      removedImageIds: parsed.removedImageIds,
      imageFiles: parsed.imageFiles,
    });

    const hasImageChanges = parsed.removedImageIds.length > 0 || parsed.imageFiles.length > 0;
    const nextOgImageUrl = resolveNextOgImageUrl(existingProduct, imageSync.primaryImageUrl, hasImageChanges);
    const { error: finalUpdateError } = await supabase
      .from("products")
      .update({
        og_image_url: nextOgImageUrl,
      })
      .eq("id", productId);

    if (finalUpdateError) {
      throw new AdminProductMutationError(`Unable to finalize the product update: ${finalUpdateError.message}`, 503);
    }

    const product = await getAdminProductById(supabase, productId);

    if (!product) {
      throw new AdminProductMutationError("The updated product could not be reloaded.", 503);
    }

    revalidateAdminProductPaths({
      productId,
      slug: product.slug,
      previousSlug: existingProduct.slug !== product.slug ? existingProduct.slug : undefined,
    });

    return {
      message: "Product updated successfully.",
      product,
    };
  } catch (error) {
    if (error instanceof AdminProductMutationError) {
      throw error;
    }

    const mappedError = mapConstraintError(error);

    if (mappedError) {
      throw mappedError;
    }

    throw new AdminProductMutationError(
      error instanceof Error ? error.message : "Unable to update the product.",
      503,
    );
  }
}

export async function deleteAdminProduct(productId: string) {
  const supabase = createAdminSupabaseClient();
  const product = await getAdminProductById(supabase, productId);

  if (!product) {
    throw new AdminProductMutationError("This product does not exist.", 404);
  }

  await ensureProductStorageBucket(supabase);

  const storagePaths = product.images
    .map((image) => image.storagePath)
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(PRODUCT_STORAGE_BUCKET)
      .remove(storagePaths);

    if (storageError) {
      throw new AdminProductMutationError(`Unable to remove product images: ${storageError.message}`, 503);
    }
  }

  const { error: deleteError } = await supabase.from("products").delete().eq("id", productId);

  if (deleteError) {
    throw new AdminProductMutationError(`Unable to delete the product: ${deleteError.message}`, 503);
  }

  revalidateAdminProductPaths({ productId, slug: product.slug });

  return {
    message: "Product deleted successfully.",
  };
}
