"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import {
  joinTextList,
  serializeFaqItems,
  serializeKeyValueObject,
  slugifyValue,
} from "@/lib/admin/product-form";
import {
  createEmptyProductShowcaseSpecState,
  mergeProductShowcaseSpecs,
  PRODUCT_SHOWCASE_SPEC_FIELDS,
  splitProductShowcaseSpecs,
  type ProductShowcaseSpecLabel,
  type ProductShowcaseSpecState,
} from "@/lib/products/spec-fields";
import { buttonStyles, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminCategoryOption, AdminProductImage, AdminProductRecord, ContentStatus } from "@/types";

interface AdminProductsConsoleProps {
  categories: AdminCategoryOption[];
  products: AdminProductRecord[];
}

interface ProductEditorState {
  id: string | null;
  name: string;
  slug: string;
  categoryId: string;
  status: ContentStatus;
  featured: boolean;
  sku: string;
  series: string;
  summary: string;
  description: string;
  highlight: string;
  leadTimeText: string;
  minOrderQty: string;
  minOrderUnit: string;
  heroMetric: string;
  tagsText: string;
  applicationsText: string;
  featuresText: string;
  showcaseSpecs: ProductShowcaseSpecState;
  remainingSpecs: Record<string, string>;
  filterAttributesText: string;
  faqText: string;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywordsText: string;
  canonicalUrl: string;
  ogImageUrl: string;
  existingImages: AdminProductImage[];
  removedImageIds: string[];
  newFiles: File[];
}

type FieldErrors = Record<string, string>;
type StatusFilter = "all" | ContentStatus;

function buildEditorState(
  product: AdminProductRecord | null,
  defaultCategoryId: string,
): ProductEditorState {
  if (!product) {
    return {
      id: null,
      name: "",
      slug: "",
      categoryId: defaultCategoryId,
      status: "draft",
      featured: false,
      sku: "",
      series: "",
      summary: "",
      description: "",
      highlight: "",
      leadTimeText: "",
      minOrderQty: "",
      minOrderUnit: "unit",
      heroMetric: "",
      tagsText: "",
      applicationsText: "",
      featuresText: "",
      showcaseSpecs: createEmptyProductShowcaseSpecState(),
      remainingSpecs: {},
      filterAttributesText: "",
      faqText: "",
      sortOrder: "0",
      seoTitle: "",
      seoDescription: "",
      seoKeywordsText: "",
      canonicalUrl: "",
      ogImageUrl: "",
      existingImages: [],
      removedImageIds: [],
      newFiles: [],
    };
  }

  const { showcaseSpecs, remainingSpecs } = splitProductShowcaseSpecs(product.specs);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    status: product.status,
    featured: product.featured,
    sku: product.sku,
    series: product.series,
    summary: product.summary,
    description: product.description,
    highlight: product.highlight,
    leadTimeText: product.leadTimeText,
    minOrderQty: product.minOrderQty ? String(product.minOrderQty) : "",
    minOrderUnit: product.minOrderUnit,
    heroMetric: product.heroMetric,
    tagsText: joinTextList(product.tags),
    applicationsText: joinTextList(product.applications),
    featuresText: joinTextList(product.features),
    showcaseSpecs,
    remainingSpecs,
    filterAttributesText: serializeKeyValueObject(product.filterAttributes),
    faqText: serializeFaqItems(product.faqItems),
    sortOrder: String(product.sortOrder),
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    seoKeywordsText: joinTextList(product.seoKeywords),
    canonicalUrl: product.canonicalUrl,
    ogImageUrl: product.ogImageUrl,
    existingImages: product.images,
    removedImageIds: [],
    newFiles: [],
  };
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return "Draft";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusBadgeClass(status: ContentStatus) {
  return status === "published"
    ? "border-white/16 bg-white/[0.08] text-white"
    : "border-white/12 bg-transparent text-white/58";
}

const adminTextareaClassName =
  "w-full rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

function AdminSectionBlock({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">{eyebrow}</p>
        <h3 className="mt-3 font-display text-[1.85rem] font-semibold leading-[1.08] text-white">{title}</h3>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AdminStatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function AdminProductsConsole({
  categories,
  products: initialProducts,
}: AdminProductsConsoleProps) {
  const defaultCategoryId = categories[0]?.id ?? "";
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProducts[0]?.id ?? null,
  );
  const [editor, setEditor] = useState(
    buildEditorState(initialProducts[0] ?? null, defaultCategoryId),
  );
  const [slugAutoMode, setSlugAutoMode] = useState(initialProducts.length === 0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"idle" | "success" | "error">("idle");

  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      query.trim().length === 0 ||
      [
        product.name,
        product.slug,
        product.categoryName,
        product.series,
        product.sku,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const visibleImages = editor.existingImages.filter(
    (image) => !editor.removedImageIds.includes(image.id),
  );
  const previewImage = visibleImages.find((image) => image.isPrimary) ?? visibleImages[0] ?? null;
  const publishedCount = products.filter((product) => product.status === "published").length;
  const draftCount = products.length - publishedCount;

  function selectProduct(product: AdminProductRecord) {
    setSelectedProductId(product.id);
    setEditor(buildEditorState(product, defaultCategoryId));
    setSlugAutoMode(false);
    setFieldErrors({});
    setMessage("");
    setMessageTone("idle");
  }

  function resetForNewProduct() {
    setSelectedProductId(null);
    setEditor(buildEditorState(null, defaultCategoryId));
    setSlugAutoMode(true);
    setFieldErrors({});
    setMessage("");
    setMessageTone("idle");
  }

  function updateEditor<K extends keyof ProductEditorState>(
    key: K,
    value: ProductEditorState[K],
  ) {
    setEditor((current) => {
      const nextState = {
        ...current,
        [key]: value,
      };

      if (key === "name" && slugAutoMode) {
        nextState.slug = slugifyValue(String(value));
      }

      return nextState;
    });
  }

  function appendFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setEditor((current) => ({
      ...current,
      newFiles: [...current.newFiles, ...Array.from(files)],
    }));
  }

  function updateShowcaseSpec(label: ProductShowcaseSpecLabel, value: string) {
    setEditor((current) => ({
      ...current,
      showcaseSpecs: {
        ...current.showcaseSpecs,
        [label]: value,
      },
    }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage("");
    setMessageTone("idle");

    const formData = new FormData();
    formData.append("name", editor.name);
    formData.append("slug", editor.slug);
    formData.append("categoryId", editor.categoryId);
    formData.append("status", editor.status);
    formData.append("featured", String(editor.featured));
    formData.append("sku", editor.sku);
    formData.append("series", editor.series);
    formData.append("summary", editor.summary);
    formData.append("description", editor.description);
    formData.append("highlight", editor.highlight);
    formData.append("leadTimeText", editor.leadTimeText);
    formData.append("minOrderQty", editor.minOrderQty);
    formData.append("minOrderUnit", editor.minOrderUnit);
    formData.append("heroMetric", editor.heroMetric);
    formData.append("tagsText", editor.tagsText);
    formData.append("applicationsText", editor.applicationsText);
    formData.append("featuresText", editor.featuresText);
    formData.append(
      "specsText",
      serializeKeyValueObject(mergeProductShowcaseSpecs(editor.showcaseSpecs, editor.remainingSpecs)),
    );
    formData.append("filterAttributesText", editor.filterAttributesText);
    formData.append("faqText", editor.faqText);
    formData.append("sortOrder", editor.sortOrder);
    formData.append("seoTitle", editor.seoTitle);
    formData.append("seoDescription", editor.seoDescription);
    formData.append("seoKeywordsText", editor.seoKeywordsText);
    formData.append("canonicalUrl", editor.canonicalUrl);
    formData.append("ogImageUrl", editor.ogImageUrl);
    formData.append("removedImageIds", JSON.stringify(editor.removedImageIds));

    for (const file of editor.newFiles) {
      formData.append("images", file);
    }

    try {
      const response = await fetch(
        editor.id ? `/api/admin/products/${editor.id}` : "/api/admin/products",
        {
          method: editor.id ? "PATCH" : "POST",
          body: formData,
        },
      );

      const result = (await response.json()) as {
        message?: string;
        fieldErrors?: FieldErrors;
        product?: AdminProductRecord;
      };

      if (!response.ok || !result.product) {
        setFieldErrors(result.fieldErrors ?? {});
        throw new Error(result.message ?? "Unable to save product.");
      }

      const savedProduct = result.product;

      setProducts((current) => {
        const withoutSaved = current.filter((product) => product.id !== savedProduct.id);
        return [savedProduct, ...withoutSaved];
      });
      setSelectedProductId(savedProduct.id);
      setEditor(buildEditorState(savedProduct, defaultCategoryId));
      setSlugAutoMode(false);
      setMessage(result.message ?? "Product saved successfully.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save product.");
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editor.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${editor.name || "this product"}? This also removes linked images from Supabase Storage.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setFieldErrors({});
    setMessage("");

    try {
      const response = await fetch(`/api/admin/products/${editor.id}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to delete product.");
      }

      const nextProducts = products.filter((product) => product.id !== editor.id);
      setProducts(nextProducts);

      if (nextProducts.length > 0) {
        selectProduct(nextProducts[0]);
      } else {
        resetForNewProduct();
      }

      setMessage(result.message ?? "Product deleted successfully.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete product.");
      setMessageTone("error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8 [&_input]:placeholder:!text-white/34">
      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Catalog Control</p>
              <h2 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">Products</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, slug, category, or SKU"
              />

              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>

              <Button type="button" size="sm" onClick={resetForNewProduct}>
                New Product
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AdminStatTile label="Products" value={products.length} />
            <AdminStatTile label="Published" value={publishedCount} />
            <AdminStatTile label="Drafts" value={draftCount} />
          </div>

          <div className="divide-y divide-white/10 rounded-[20px] border border-white/10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const selected = product.id === selectedProductId;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={cn(
                      "grid w-full gap-4 px-5 py-4 text-left transition md:grid-cols-[minmax(0,1.2fr)_10rem_9rem_8rem] md:items-center",
                      selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                    )}
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{product.categoryName}</p>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-[1.08] text-white">{product.name}</h3>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/42">{product.slug}</p>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">{product.sku || "No SKU"}</div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                      Updated {formatDateLabel(product.updatedAt)}
                    </div>
                    <div className="flex items-center justify-start md:justify-end">
                      <span className={cn("rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]", statusBadgeClass(product.status))}>
                        {product.status}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
                No products match the current admin filters.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">
              {editor.id ? "Edit Product" : "Create Product"}
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] font-semibold leading-[1.06] text-white">
              {editor.id ? editor.name || "Product configuration" : "New product record"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">
              Save core catalog fields, switch between draft and published states, and upload image assets directly into Supabase Storage.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {editor.id ? (
              <Link
                href={`/products/${editor.slug}`}
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                View Public Page
              </Link>
            ) : null}
            {editor.id ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeleting || isSubmitting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </Button>
            ) : null}
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-white/14 bg-white/[0.06] p-5 text-[14px] leading-[22.75px] text-white/72">
            No categories are available. Seed or create categories in Supabase before managing products here.
          </div>
        ) : null}

        {message ? (
          <div
            className={cn(
              "mt-6 rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
              messageTone === "success"
                ? "border-white/16 bg-white/[0.08] text-white"
                : messageTone === "error"
                  ? "border-red-400/24 bg-red-500/10 text-red-200"
                  : "border-white/10 bg-white/[0.03] text-white/62",
            )}
          >
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <AdminSectionBlock
            eyebrow="Identity"
            title="Core catalog identity"
            description="Define the public product name, slug, category, publication state, and SKU-level references."
          >
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="admin-name" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Product Name
              </label>
              <Input
                id="admin-name"
                value={editor.name}
                onChange={(event) => updateEditor("name", event.target.value)}
                placeholder="AirCore Planar X1"
              />
              {fieldErrors.name ? <p className="text-sm text-rose-200">{fieldErrors.name}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-slug" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Slug
              </label>
              <Input
                id="admin-slug"
                value={editor.slug}
                onChange={(event) => {
                  setSlugAutoMode(false);
                  updateEditor("slug", slugifyValue(event.target.value));
                }}
                placeholder="aircore-planar-x1"
              />
              {fieldErrors.slug ? <p className="text-sm text-rose-200">{fieldErrors.slug}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-category" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Category
              </label>
              <Select
                id="admin-category"
                value={editor.categoryId}
                onChange={(event) => updateEditor("categoryId", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.status})
                  </option>
                ))}
              </Select>
              {fieldErrors.categoryId ? <p className="text-sm text-rose-200">{fieldErrors.categoryId}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-status" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Status
              </label>
              <Select
                id="admin-status"
                value={editor.status}
                onChange={(event) => updateEditor("status", event.target.value as ContentStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              {fieldErrors.status ? <p className="text-sm text-rose-200">{fieldErrors.status}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-sku" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                SKU
              </label>
              <Input
                id="admin-sku"
                value={editor.sku}
                onChange={(event) => updateEditor("sku", event.target.value)}
                placeholder="AMO-X1-2400"
              />
              {fieldErrors.sku ? <p className="text-sm text-rose-200">{fieldErrors.sku}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-series" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Series
              </label>
              <Input
                id="admin-series"
                value={editor.series}
                onChange={(event) => updateEditor("series", event.target.value)}
                placeholder="X Series"
              />
            </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <label className="flex items-center gap-3 text-sm text-white/72">
                  <input
                    type="checkbox"
                    checked={editor.featured}
                    onChange={(event) => updateEditor("featured", event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black text-white focus:ring-white/10"
                  />
                  Mark as featured in the public catalog
                </label>
              </div>
            </div>
          </AdminSectionBlock>

          <AdminSectionBlock
            eyebrow="Content"
            title="Public-facing content"
            description="Write the summary, long description, and lead commercial framing used throughout the catalog."
          >
            <div className="space-y-6">
              <div className="space-y-2">
            <label htmlFor="admin-summary" className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Summary
            </label>
            <textarea
              id="admin-summary"
              rows={3}
              value={editor.summary}
              onChange={(event) => updateEditor("summary", event.target.value)}
              className={adminTextareaClassName}
              placeholder="Short B2B catalog summary for cards and metadata."
            />
            {fieldErrors.summary ? <p className="text-sm text-rose-200">{fieldErrors.summary}</p> : null}
              </div>

              <div className="space-y-2">
            <label htmlFor="admin-description" className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Description
            </label>
            <textarea
              id="admin-description"
              rows={6}
              value={editor.description}
              onChange={(event) => updateEditor("description", event.target.value)}
              className={adminTextareaClassName}
              placeholder="Long-form product description shown on the public detail page."
            />
            {fieldErrors.description ? <p className="text-sm text-rose-200">{fieldErrors.description}</p> : null}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="admin-highlight" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Highlight
              </label>
              <Input
                id="admin-highlight"
                value={editor.highlight}
                onChange={(event) => updateEditor("highlight", event.target.value)}
                placeholder="Lead message shown beside the product hero."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-hero-metric" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Hero Metric
              </label>
              <Input
                id="admin-hero-metric"
                value={editor.heroMetric}
                onChange={(event) => updateEditor("heroMetric", event.target.value)}
                placeholder="2.4 g dynamic acceleration"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-lead-time" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Lead Time
              </label>
              <Input
                id="admin-lead-time"
                value={editor.leadTimeText}
                onChange={(event) => updateEditor("leadTimeText", event.target.value)}
                placeholder="8-10 weeks"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-sort-order" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Sort Order
              </label>
              <Input
                id="admin-sort-order"
                type="number"
                min={0}
                value={editor.sortOrder}
                onChange={(event) => updateEditor("sortOrder", event.target.value)}
              />
              {fieldErrors.sortOrder ? <p className="text-sm text-rose-200">{fieldErrors.sortOrder}</p> : null}
            </div>
              </div>
            </div>
          </AdminSectionBlock>

          <AdminSectionBlock
            eyebrow="Commercial Data"
            title="Lead time, quantity, and technical framing"
            description="Capture the operational details that influence how the product is evaluated and surfaced."
          >
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-[0.65fr_0.35fr]">
            <div className="space-y-2">
              <label htmlFor="admin-moq" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Minimum Order Quantity
              </label>
              <Input
                id="admin-moq"
                type="number"
                min={1}
                value={editor.minOrderQty}
                onChange={(event) => updateEditor("minOrderQty", event.target.value)}
                placeholder="1"
              />
              {fieldErrors.minOrderQty ? <p className="text-sm text-rose-200">{fieldErrors.minOrderQty}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-moq-unit" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                MOQ Unit
              </label>
              <Input
                id="admin-moq-unit"
                value={editor.minOrderUnit}
                onChange={(event) => updateEditor("minOrderUnit", event.target.value)}
                placeholder="line"
              />
            </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="admin-tags" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Tags
              </label>
              <textarea
                id="admin-tags"
                rows={4}
                value={editor.tagsText}
                onChange={(event) => updateEditor("tagsText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={"One tag per line\ncleanroom\nsemiconductor"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-applications" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Applications
              </label>
              <textarea
                id="admin-applications"
                rows={4}
                value={editor.applicationsText}
                onChange={(event) => updateEditor("applicationsText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={"One application per line\nwafer handling\noptical alignment"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-features" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Features
              </label>
              <textarea
                id="admin-features"
                rows={5}
                value={editor.featuresText}
                onChange={(event) => updateEditor("featuresText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={"One feature per line\nContactless planar motion\nIntegrated position feedback"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Showcase Specs
              </label>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {PRODUCT_SHOWCASE_SPEC_FIELDS.map((field) => (
                  <div key={field.label} className="space-y-2">
                    <label
                      htmlFor={`admin-spec-${slugifyValue(field.label)}`}
                      className="text-[11px] uppercase tracking-[0.22em] text-slate-500"
                    >
                      {field.label}
                    </label>
                    <Input
                      id={`admin-spec-${slugifyValue(field.label)}`}
                      value={editor.showcaseSpecs[field.label]}
                      onChange={(event) => updateShowcaseSpec(field.label, event.target.value)}
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
              {fieldErrors.specsText ? <p className="text-sm text-rose-200">{fieldErrors.specsText}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-filter-attributes" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Filter Attributes
              </label>
              <textarea
                id="admin-filter-attributes"
                rows={5}
                value={editor.filterAttributesText}
                onChange={(event) => updateEditor("filterAttributesText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={"industry: semiconductor\ncleanroom: true\nmax_payload_kg: 2.5"}
              />
              {fieldErrors.filterAttributesText ? (
                <p className="text-sm text-rose-200">{fieldErrors.filterAttributesText}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-faq" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                FAQ
              </label>
              <textarea
                id="admin-faq"
                rows={5}
                value={editor.faqText}
                onChange={(event) => updateEditor("faqText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={'Can the deck geometry be customized? :: Yes, tile count and interfaces can be adapted.'}
              />
              {fieldErrors.faqText ? <p className="text-sm text-rose-200">{fieldErrors.faqText}</p> : null}
            </div>
              </div>
            </div>
          </AdminSectionBlock>

          <AdminSectionBlock
            eyebrow="Media"
            title="Supabase Storage assets"
            description="Upload, remove, and stage product imagery without leaving the catalog workflow."
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Images</p>
                <h3 className="mt-2 font-display text-2xl text-white">Supabase Storage assets</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  Upload images to the configured storage bucket. The first remaining image is used as the primary product image.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center rounded-full border border-white/12 bg-transparent px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/72 transition hover:border-white/24">
                Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    appendFiles(event.currentTarget.files);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {fieldErrors.images ? <p className="mt-3 text-sm text-rose-200">{fieldErrors.images}</p> : null}

            {visibleImages.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleImages.map((image) => (
                  <article key={image.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                    <img src={image.imageUrl} alt={image.altText || editor.name || "Product image"} className="h-40 w-full object-cover" />
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]",
                            image.isPrimary
                              ? "border-white/16 bg-white/[0.08] text-white"
                              : "border-white/10 bg-transparent text-white/54",
                          )}
                        >
                          {image.isPrimary ? "Primary" : `Sort ${image.sortOrder}`}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditor((current) => ({
                              ...current,
                              removedImageIds: [...current.removedImageIds, image.id],
                            }))
                          }
                          className="text-xs uppercase tracking-[0.18em] text-white/54 transition hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs leading-6 text-white/48">{image.altText || image.storagePath}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/12 bg-transparent p-5 text-sm leading-7 text-white/48">
                No retained images yet. Upload new files to populate the gallery.
              </div>
            )}

            {editor.newFiles.length > 0 ? (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Pending uploads</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {editor.newFiles.map((file, index) => (
                    <button
                      key={`${file.name}-${file.size}-${index}`}
                      type="button"
                      onClick={() =>
                        setEditor((current) => ({
                          ...current,
                          newFiles: current.newFiles.filter((_, entryIndex) => entryIndex !== index),
                        }))
                      }
                      className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/54 transition hover:border-white/22 hover:text-white"
                    >
                      Remove {file.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            </div>
          </AdminSectionBlock>

          <AdminSectionBlock
            eyebrow="SEO"
            title="Search and metadata controls"
            description="Keep canonical, search, and Open Graph metadata aligned with the public product route."
          >
            <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="admin-seo-title" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                SEO Title
              </label>
              <Input
                id="admin-seo-title"
                value={editor.seoTitle}
                onChange={(event) => updateEditor("seoTitle", event.target.value)}
                placeholder="AirCore Planar X1 | AMO"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-canonical-url" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Canonical URL
              </label>
              <Input
                id="admin-canonical-url"
                value={editor.canonicalUrl}
                onChange={(event) => updateEditor("canonicalUrl", event.target.value)}
                placeholder="https://amo.example.com/products/aircore-planar-x1"
              />
              {fieldErrors.canonicalUrl ? <p className="text-sm text-rose-200">{fieldErrors.canonicalUrl}</p> : null}
            </div>

            <div className="space-y-2 xl:col-span-2">
              <label htmlFor="admin-seo-description" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                SEO Description
              </label>
              <textarea
                id="admin-seo-description"
                rows={3}
                value={editor.seoDescription}
                onChange={(event) => updateEditor("seoDescription", event.target.value)}
                className={adminTextareaClassName}
                placeholder="Search description for the product detail page."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-seo-keywords" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                SEO Keywords
              </label>
              <textarea
                id="admin-seo-keywords"
                rows={4}
                value={editor.seoKeywordsText}
                onChange={(event) => updateEditor("seoKeywordsText", event.target.value)}
                className={adminTextareaClassName}
                placeholder={"planar motor supplier\nmagnetic levitation platform"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-og-image" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                OG Image URL
              </label>
              <Input
                id="admin-og-image"
                value={editor.ogImageUrl}
                onChange={(event) => updateEditor("ogImageUrl", event.target.value)}
                placeholder="Optional override for Open Graph image"
              />
              {fieldErrors.ogImageUrl ? <p className="text-sm text-rose-200">{fieldErrors.ogImageUrl}</p> : null}
            </div>
            </div>
          </AdminSectionBlock>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Live Preview</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-[14rem_1fr]">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                {previewImage ? (
                  <img
                    src={previewImage.imageUrl}
                    alt={previewImage.altText || editor.name || "Product preview"}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(9,9,9,0.92))] p-4">
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/48">
                      Preview
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">{editor.categoryId ? "Product Preview" : "Draft Preview"}</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{editor.name || "Product Name"}</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
                  {editor.summary || "Short Description"}
                </p>
                <div className="mt-6">
                  {editor.slug ? (
                    <Link href={`/products/${editor.slug}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      View Product
                    </Link>
                  ) : (
                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/40">
                      View Product
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/48">
              Draft products stay hidden from the public catalog. Published products receive a timestamp automatically.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={resetForNewProduct}
                disabled={isSubmitting || isDeleting}
              >
                Reset Form
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || isDeleting || categories.length === 0}>
                {isSubmitting ? "Saving..." : editor.id ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
