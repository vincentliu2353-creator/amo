import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { parseFaqText, parseKeyValueText, slugifyValue, splitTextList } from "@/lib/admin/product-form";
import type {
  AdminCategoryOption,
  AdminProductImage,
  AdminProductRecord,
  ContentStatus,
} from "@/types";

const PRODUCT_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ?? "product-media";

const ADMIN_PRODUCT_SELECT = `
  id,
  category_id,
  slug,
  sku,
  name,
  series,
  status,
  featured,
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

interface ParsedAdminProductPayload {
  categoryId: string;
  slug: string;
  sku: string | null;
  name: string;
  series: string | null;
  status: ContentStatus;
  featured: boolean;
  summary: string;
  description: string;
  highlight: string | null;
  leadTimeText: string | null;
  minOrderQty: number | null;
  minOrderUnit: string | null;
  heroMetric: string | null;
  tags: string[];
  applications: string[];
  features: string[];
  specs: Record<string, string>;
  filterAttributes: Record<string, string | number | boolean>;
  faqItems: Array<{ question: string; answer: string }>;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  canonicalUrl: string | null;
  ogImageUrl: string | null;
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

      return {
        id: image.id,
        imageUrl: image.image_url,
        storagePath: typeof image.storage_path === "string" ? image.storage_path : "",
        altText: typeof image.alt_text === "string" ? image.alt_text : "",
        sortOrder: typeof image.sort_order === "number" ? image.sort_order : 0,
        isPrimary: Boolean(image.is_primary),
      } satisfies AdminProductImage;
    })
    .filter((item): item is AdminProductImage => Boolean(item))
    .sort((left, right) => left.sortOrder - right.sortOrder);
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

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function sanitizeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return cleaned || "image";
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

async function buildUniqueSlug(
  supabase: SupabaseClient,
  requestedSlug: string,
  currentProductId?: string,
) {
  const baseSlug = slugifyValue(requestedSlug);
  const { data, error } = await supabase
    .from("products")
    .select("id, slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    throw new AdminProductMutationError(`Unable to validate slug uniqueness: ${error.message}`, 503);
  }

  const existingSlugs = new Set(
    (data ?? [])
      .filter((entry) => entry.id !== currentProductId)
      .map((entry) => entry.slug),
  );

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;

  while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
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

  return mapAdminProductRow(data as Record<string, unknown>);
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

function parsePositiveInteger(
  value: string,
  fieldName: string,
  fieldErrors: FieldErrors,
  options?: { allowEmpty?: boolean; defaultValue?: number; minimum?: number },
) {
  if (!value) {
    return options?.allowEmpty ? null : options?.defaultValue ?? 0;
  }

  const numericValue = Number(value);
  const minimum = options?.minimum ?? 0;

  if (!Number.isInteger(numericValue) || numericValue < minimum) {
    fieldErrors[fieldName] = "Enter a valid whole number.";
    return null;
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

function parseAdminProductFormData(formData: FormData): ParsedAdminProductPayload {
  const fieldErrors: FieldErrors = {};
  const status = normalizeStatus(normalizeString(formData.get("status")));
  const name = normalizeString(formData.get("name"));
  const summary = normalizeString(formData.get("summary"));
  const description = normalizeString(formData.get("description"));
  const categoryId = normalizeString(formData.get("categoryId"));
  const slugInput = normalizeString(formData.get("slug"));
  const canonicalUrl = normalizeString(formData.get("canonicalUrl"));
  const ogImageUrl = normalizeString(formData.get("ogImageUrl"));
  const specsResult = parseKeyValueText(normalizeString(formData.get("specsText")), {
    label: "Specs",
  });
  const filterAttributesResult = parseKeyValueText(
    normalizeString(formData.get("filterAttributesText")),
    {
      inferScalar: true,
      label: "Filter attributes",
    },
  );
  const faqResult = parseFaqText(normalizeString(formData.get("faqText")));
  const minOrderQtyRaw = normalizeString(formData.get("minOrderQty"));
  const sortOrderRaw = normalizeString(formData.get("sortOrder"));
  const removedImageIds = parseRemovedImageIds(normalizeString(formData.get("removedImageIds")), fieldErrors);
  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!categoryId) {
    fieldErrors.categoryId = "Category is required.";
  }

  if (!name) {
    fieldErrors.name = "Product name is required.";
  }

  if (!summary) {
    fieldErrors.summary = "Summary is required.";
  }

  if (!description) {
    fieldErrors.description = "Description is required.";
  }

  if (!status) {
    fieldErrors.status = "Status must be draft or published.";
  }

  if (canonicalUrl && !isValidUrl(canonicalUrl)) {
    fieldErrors.canonicalUrl = "Enter a valid canonical URL.";
  }

  if (ogImageUrl && !isValidUrl(ogImageUrl)) {
    fieldErrors.ogImageUrl = "Enter a valid image URL.";
  }

  if (specsResult.error) {
    fieldErrors.specsText = specsResult.error;
  }

  if (filterAttributesResult.error) {
    fieldErrors.filterAttributesText = filterAttributesResult.error;
  }

  if (faqResult.error) {
    fieldErrors.faqText = faqResult.error;
  }

  const minOrderQty =
    minOrderQtyRaw.length > 0
      ? parsePositiveInteger(minOrderQtyRaw, "minOrderQty", fieldErrors, {
          allowEmpty: true,
          minimum: 1,
        })
      : null;
  const sortOrder = parsePositiveInteger(sortOrderRaw, "sortOrder", fieldErrors, {
    defaultValue: 0,
    minimum: 0,
  });

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminProductMutationError("Fix the highlighted fields before saving.", 400, fieldErrors);
  }

  return {
    categoryId,
    slug: slugInput || slugifyValue(name),
    sku: normalizeString(formData.get("sku")) || null,
    name,
    series: normalizeString(formData.get("series")) || null,
    status: status ?? "draft",
    featured: normalizeString(formData.get("featured")) === "true",
    summary,
    description,
    highlight: normalizeString(formData.get("highlight")) || null,
    leadTimeText: normalizeString(formData.get("leadTimeText")) || null,
    minOrderQty,
    minOrderUnit: normalizeString(formData.get("minOrderUnit")) || null,
    heroMetric: normalizeString(formData.get("heroMetric")) || null,
    tags: splitTextList(normalizeString(formData.get("tagsText"))),
    applications: splitTextList(normalizeString(formData.get("applicationsText"))),
    features: splitTextList(normalizeString(formData.get("featuresText"))),
    specs: specsResult.value as Record<string, string>,
    filterAttributes: filterAttributesResult.value,
    faqItems: faqResult.value,
    sortOrder: sortOrder ?? 0,
    seoTitle: normalizeString(formData.get("seoTitle")) || null,
    seoDescription: normalizeString(formData.get("seoDescription")) || null,
    seoKeywords: splitTextList(normalizeString(formData.get("seoKeywordsText"))),
    canonicalUrl: canonicalUrl || null,
    ogImageUrl: ogImageUrl || null,
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
  const removableImages = options.existingImages.filter((image) => options.removedImageIds.includes(image.id));
  const removablePaths = removableImages
    .map((image) => image.storagePath)
    .filter((path): path is string => Boolean(path));

  if (removablePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(PRODUCT_STORAGE_BUCKET)
      .remove(removablePaths);

    if (storageError) {
      throw new AdminProductMutationError(`Unable to remove product images: ${storageError.message}`, 503);
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

    const storagePath = `products/${options.slug}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
    const fileBytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_STORAGE_BUCKET)
      .upload(storagePath, fileBytes, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove(uploadedPaths);
      }

      throw new AdminProductMutationError(`Unable to upload product images: ${uploadError.message}`, 503);
    }

    uploadedPaths.push(storagePath);

    insertedRows.push({
      product_id: options.productId,
      image_url: supabase.storage.from(PRODUCT_STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl,
      storage_path: storagePath,
      alt_text: `${options.productName} image ${remainingImages.length + index + 1}`,
      sort_order: nextSortOrder,
      is_primary: false,
    });
  }

  if (insertedRows.length > 0) {
    const { error: insertError } = await supabase.from("product_images").insert(insertedRows);

    if (insertError) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove(uploadedPaths);
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
    await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove(storagePaths);
  }
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
    products: (productsResult.data ?? []).map((entry) => mapAdminProductRow(entry as Record<string, unknown>)),
  };
}

export async function createAdminProduct(formData: FormData): Promise<AdminMutationResult> {
  const supabase = createAdminSupabaseClient();
  const parsed = parseAdminProductFormData(formData);

  await ensureCategoryExists(supabase, parsed.categoryId);

  const slug = await buildUniqueSlug(supabase, parsed.slug);
  const publishedAt = parsed.status === "published" ? new Date().toISOString() : null;
  let createdProductId = "";

  try {
    const { data: createdRow, error: createError } = await supabase
      .from("products")
      .insert({
        category_id: parsed.categoryId,
        slug,
        sku: parsed.sku,
        name: parsed.name,
        series: parsed.series,
        status: parsed.status,
        featured: parsed.featured,
        summary: parsed.summary,
        description: parsed.description,
        highlight: parsed.highlight,
        lead_time_text: parsed.leadTimeText,
        min_order_qty: parsed.minOrderQty,
        min_order_unit: parsed.minOrderUnit ?? "unit",
        hero_metric: parsed.heroMetric,
        tags: parsed.tags,
        applications: parsed.applications,
        features: parsed.features,
        specs: parsed.specs,
        filter_attributes: parsed.filterAttributes,
        faq_items: parsed.faqItems,
        sort_order: parsed.sortOrder,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        seo_keywords: parsed.seoKeywords,
        canonical_url: parsed.canonicalUrl,
        og_image_url: parsed.ogImageUrl,
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

    const nextOgImageUrl = parsed.ogImageUrl || imageSync.primaryImageUrl;

    if (nextOgImageUrl) {
      const { error: ogUpdateError } = await supabase
        .from("products")
        .update({ og_image_url: nextOgImageUrl })
        .eq("id", createdProductId);

      if (ogUpdateError) {
        throw new AdminProductMutationError(`Unable to finalize the product image: ${ogUpdateError.message}`, 503);
      }
    }

    const product = await getAdminProductById(supabase, createdProductId);

    if (!product) {
      throw new AdminProductMutationError("The created product could not be reloaded.", 503);
    }

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

  const slug = await buildUniqueSlug(supabase, parsed.slug || existingProduct.slug, productId);
  const publishedAt =
    parsed.status === "published"
      ? existingProduct.publishedAt ?? new Date().toISOString()
      : null;

  try {
    const { error: updateError } = await supabase
      .from("products")
      .update({
        category_id: parsed.categoryId,
        slug,
        sku: parsed.sku,
        name: parsed.name,
        series: parsed.series,
        status: parsed.status,
        featured: parsed.featured,
        summary: parsed.summary,
        description: parsed.description,
        highlight: parsed.highlight,
        lead_time_text: parsed.leadTimeText,
        min_order_qty: parsed.minOrderQty,
        min_order_unit: parsed.minOrderUnit ?? "unit",
        hero_metric: parsed.heroMetric,
        tags: parsed.tags,
        applications: parsed.applications,
        features: parsed.features,
        specs: parsed.specs,
        filter_attributes: parsed.filterAttributes,
        faq_items: parsed.faqItems,
        sort_order: parsed.sortOrder,
        seo_title: parsed.seoTitle,
        seo_description: parsed.seoDescription,
        seo_keywords: parsed.seoKeywords,
        canonical_url: parsed.canonicalUrl,
        og_image_url: parsed.ogImageUrl,
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

    const nextOgImageUrl = parsed.ogImageUrl || imageSync.primaryImageUrl;
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

  return {
    message: "Product deleted successfully.",
  };
}
