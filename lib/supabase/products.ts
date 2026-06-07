import type { SupabaseClient } from "@supabase/supabase-js";

import {
  applyProductVisualFallback,
  resolveProductPrimaryImage,
  resolveProductShowcaseGallery,
} from "@/lib/products/product-visuals";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FaqItem, Product, ProductRelatedCase, ProductShowcaseImage, ProductShowcaseProduct, SpecItem } from "@/types";

const PRODUCT_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET ?? "product-media";

interface CategoryRow {
  slug: string;
  name: string;
}

interface ProductImageRow {
  product_id?: string;
  image_url: string;
  storage_path?: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface ProductCatalogOptions {
  limit?: number;
  orderBy?: "default" | "created_at_desc";
}

export interface ProductDetailResult {
  product: Product;
  relatedCases: ProductRelatedCase[];
  images: ProductShowcaseImage[];
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeSpecs(value: unknown): SpecItem[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>).map(([label, rawValue]) => ({
    label: label.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()),
    value: typeof rawValue === "string" ? rawValue : String(rawValue),
  }));
}

function normalizeFaqs(value: unknown): FaqItem[] {
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

      return {
        question,
        answer,
      };
    })
    .filter((item): item is FaqItem => Boolean(item));
}

function normalizeCategory(value: unknown): CategoryRow | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return normalizeCategory(value[0]);
  }

  if (typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.name !== "string" || typeof record.slug !== "string") {
    return null;
  }

  return {
    slug: record.slug,
    name: record.name,
  };
}

function formatMinOrderQty(quantity: number | null, unit: string | null) {
  if (!quantity) {
    return "Custom configuration";
  }

  return `${quantity} ${unit ?? "unit"}`;
}

function mapProductRow(row: Record<string, unknown>): Product {
  const category = normalizeCategory(row.categories);

  return applyProductVisualFallback({
    id: typeof row.id === "string" ? row.id : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    name: typeof row.name === "string" ? row.name : "AMO Product",
    series: typeof row.series === "string" ? row.series : "AMO Series",
    category: category?.name ?? "Uncategorized",
    productImage: typeof row.og_image_url === "string" ? row.og_image_url : "",
    summary: typeof row.summary === "string" ? row.summary : "",
    description: typeof row.description === "string" ? row.description : "",
    highlight:
      typeof row.highlight === "string" && row.highlight.length > 0
        ? row.highlight
        : "Configured for precision, clean transport, and OEM manufacturing performance.",
    leadTime:
      typeof row.lead_time_text === "string" && row.lead_time_text.length > 0
        ? row.lead_time_text
        : "Program dependent",
    minOrderQty: formatMinOrderQty(
      typeof row.min_order_qty === "number" ? row.min_order_qty : null,
      typeof row.min_order_unit === "string" ? row.min_order_unit : null,
    ),
    heroMetric:
      typeof row.hero_metric === "string" && row.hero_metric.length > 0
        ? row.hero_metric
        : "Configured per application",
    tags: normalizeStringArray(row.tags),
    applications: normalizeStringArray(row.applications),
    features: normalizeStringArray(row.features),
    specs: normalizeSpecs(row.specs),
    faqs: normalizeFaqs(row.faq_items),
    featured: Boolean(row.featured),
    caseStudySlugs: [],
  });
}

async function getSupabase() {
  try {
    return createServerSupabaseClient();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Supabase is not configured for product data fetching.",
    );
  }
}

async function resolveSignedImageRows(
  supabase: SupabaseClient,
  rows: ProductImageRow[],
) {
  const storagePaths = Array.from(
    new Set(
      rows
        .map((row) => row.storage_path)
        .filter((path): path is string => typeof path === "string" && path.length > 0),
    ),
  );

  if (storagePaths.length === 0) {
    return rows;
  }

  const { data, error } = await supabase.storage
    .from(PRODUCT_STORAGE_BUCKET)
    .createSignedUrls(storagePaths, 60 * 60 * 24 * 7);

  if (error || !data) {
    return rows;
  }

  const signedUrlsByPath = new Map(
    data
      .filter((entry) => entry.path && entry.signedUrl)
      .map((entry) => [entry.path, entry.signedUrl] as const),
  );

  return rows.map((row) => {
    if (!row.storage_path) {
      return row;
    }

    const signedUrl = signedUrlsByPath.get(row.storage_path);

    if (!signedUrl) {
      return row;
    }

    return {
      ...row,
      image_url: signedUrl,
    };
  });
}

export async function getPublishedProductCatalog(options: ProductCatalogOptions = {}) {
  const supabase = await getSupabase();

  const productsQuery = supabase
    .from("products")
    .select(
      "id, slug, name, series, summary, description, highlight, lead_time_text, min_order_qty, min_order_unit, hero_metric, tags, applications, features, specs, faq_items, featured, og_image_url, categories!inner(slug, name)",
    )
    .eq("status", "published");

  if (options.orderBy === "created_at_desc") {
    productsQuery.order("created_at", { ascending: false });
  } else {
    productsQuery.order("featured", { ascending: false });
    productsQuery.order("sort_order", { ascending: true });
    productsQuery.order("name", { ascending: true });
  }

  if (typeof options.limit === "number" && options.limit > 0) {
    productsQuery.limit(options.limit);
  }

  const [productsResult, categoriesResult] = await Promise.all([
    productsQuery,
    supabase
      .from("categories")
      .select("slug, name")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (productsResult.error) {
    throw new Error(`Unable to load AMO products: ${productsResult.error.message}`);
  }

  if (categoriesResult.error) {
    throw new Error(`Unable to load product categories: ${categoriesResult.error.message}`);
  }

  const products = (productsResult.data ?? []).map((row) => mapProductRow(row as Record<string, unknown>));
  const categories = (categoriesResult.data ?? [])
    .map((row) => row.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0);

  return {
    products,
    categories,
  };
}

export async function getPublishedProductShowcaseCatalog(): Promise<{
  products: ProductShowcaseProduct[];
  categories: string[];
}>;
export async function getPublishedProductShowcaseCatalog(options: ProductCatalogOptions): Promise<{
  products: ProductShowcaseProduct[];
  categories: string[];
}>;
export async function getPublishedProductShowcaseCatalog(options: ProductCatalogOptions = {}): Promise<{
  products: ProductShowcaseProduct[];
  categories: string[];
}> {
  const { products, categories } = await getPublishedProductCatalog(options);

  if (products.length === 0) {
    return {
      products: [],
      categories,
    };
  }

  const supabase = await getSupabase();
  const productIds = products.map((product) => product.id).filter((productId) => productId.length > 0);

  if (productIds.length === 0) {
    return {
      products: products.map((product) => ({
        ...product,
        galleryImages: resolveProductShowcaseGallery(
          product,
          product.productImage.length > 0
            ? [
                {
                  url: product.productImage,
                  alt: product.name,
                  isPrimary: true,
                  sortOrder: 0,
                },
              ]
            : [],
        ),
      })),
      categories,
    };
  }

  const { data: imagesResult, error: imagesError } = await supabase
    .from("product_images")
    .select("product_id, image_url, storage_path, alt_text, is_primary, sort_order")
    .in("product_id", productIds)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true });

  if (imagesError) {
    throw new Error(`Unable to load product gallery images: ${imagesError.message}`);
  }

  const resolvedImageRows = await resolveSignedImageRows(
    supabase,
    (imagesResult ?? []) as ProductImageRow[],
  );
  const imagesByProduct = new Map<string, ProductShowcaseImage[]>();

  for (const row of resolvedImageRows) {
    if (typeof row.product_id !== "string" || typeof row.image_url !== "string" || row.image_url.length === 0) {
      continue;
    }

    const entry: ProductShowcaseImage = {
      url: row.image_url,
      alt: row.alt_text?.trim() || "AMO product image",
      isPrimary: row.is_primary,
      sortOrder: row.sort_order,
    };

    const existing = imagesByProduct.get(row.product_id) ?? [];
    existing.push(entry);
    imagesByProduct.set(row.product_id, existing);
  }

  return {
    products: products.map((product) => {
      const galleryImages = imagesByProduct.get(product.id) ?? [];
      const fallbackImage = product.productImage.length > 0 ? [{ url: product.productImage, alt: product.name, isPrimary: true, sortOrder: 0 }] : [];
      const resolvedGallery = resolveProductShowcaseGallery(product, galleryImages.length > 0 ? galleryImages : fallbackImage);
      const primaryImage = resolveProductPrimaryImage(
        product,
        resolvedGallery.find((image) => image.isPrimary)?.url ?? resolvedGallery[0]?.url ?? product.productImage,
      );

      return {
        ...product,
        productImage: primaryImage,
        galleryImages: resolvedGallery,
      };
    }),
    categories,
  };
}

export async function getPublishedProductBySlug(slug: string): Promise<ProductDetailResult | null> {
  const supabase = await getSupabase();

  const { data: productRow, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, name, series, summary, description, highlight, lead_time_text, min_order_qty, min_order_unit, hero_metric, tags, applications, features, specs, faq_items, featured, og_image_url, categories!inner(slug, name)",
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (productError) {
    throw new Error(`Unable to load product detail: ${productError.message}`);
  }

  if (!productRow) {
    return null;
  }

  const product = mapProductRow(productRow as Record<string, unknown>);

  const [casesResult, imagesResult] = await Promise.all([
    supabase
      .from("cases")
      .select("slug, title, industry, summary, case_products!inner(product_id)")
      .eq("status", "published")
      .eq("case_products.product_id", product.id)
      .order("published_at", { ascending: false }),
    supabase
      .from("product_images")
      .select("image_url, storage_path, alt_text, is_primary, sort_order")
      .eq("product_id", product.id)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true }),
  ]);

  if (casesResult.error) {
    throw new Error(`Unable to load related cases: ${casesResult.error.message}`);
  }

  if (imagesResult.error) {
    throw new Error(`Unable to load product images: ${imagesResult.error.message}`);
  }

  const relatedCases: ProductRelatedCase[] = (casesResult.data ?? []).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    sector: entry.industry ?? "Industrial",
    summary: entry.summary ?? "",
  }));

  const resolvedImageRows = await resolveSignedImageRows(
    supabase,
    (imagesResult.data ?? []) as ProductImageRow[],
  );
  const images = resolvedImageRows.map((entry) => ({
    url: entry.image_url,
    alt: entry.alt_text?.trim() || product.name,
    isPrimary: entry.is_primary,
    sortOrder: entry.sort_order,
  }));
  const resolvedGallery = resolveProductShowcaseGallery(product, images);
  const primaryImage =
    resolvedGallery.find((entry) => entry.isPrimary)?.url ?? resolvedGallery[0]?.url ?? product.productImage;

  return {
    product: {
      ...product,
      productImage: resolveProductPrimaryImage(product, primaryImage),
    },
    relatedCases,
    images: resolvedGallery,
  };
}
