/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { slugifyValue } from "@/lib/admin/product-form";
import { splitProductShowcaseSpecs } from "@/lib/products/spec-fields";
import { cn } from "@/lib/utils";
import type {
  AdminCategoryOption,
  AdminProductImage,
  AdminProductRecord,
  ContentStatus,
} from "@/types";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
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
const adminTextareaClassName =
  "w-full rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

interface AdminProductFormProps {
  categories: AdminCategoryOption[];
  mode: "create" | "edit";
  notice?: {
    message: string;
    tone: "success" | "error";
  } | null;
  product: AdminProductRecord | null;
}

interface ProductFormState {
  name: string;
  slug: string;
  categoryId: string;
  status: ContentStatus;
  series: string;
  summary: string;
  description: string;
  levitationHeight: string;
  rotation: string;
  diameter: string;
  loadCapacity: string;
  power: string;
  finish: string;
  minOrderQty: string;
  leadTimeText: string;
  customizationOptions: string;
  seoTitle: string;
  seoDescription: string;
  existingImages: AdminProductImage[];
  removedImageIds: string[];
  newFiles: File[];
}

interface SubmitResponse {
  fieldErrors?: FieldErrors;
  message?: string;
  product?: AdminProductRecord;
}

type FieldErrors = Record<string, string>;
type BatchStage =
  | "idle"
  | "uploading-images"
  | "generating-content"
  | "saving-products"
  | "publishing-products"
  | "completed";

type ProductRequestFields = Pick<
  ProductFormState,
  | "name"
  | "slug"
  | "categoryId"
  | "status"
  | "series"
  | "summary"
  | "description"
  | "levitationHeight"
  | "rotation"
  | "diameter"
  | "loadCapacity"
  | "power"
  | "finish"
  | "minOrderQty"
  | "leadTimeText"
  | "customizationOptions"
  | "seoTitle"
  | "seoDescription"
  | "removedImageIds"
>;

interface BatchResultItem {
  fileName: string;
  message: string;
  name: string;
  productId?: string;
  slug: string;
  status: "success" | "error";
}

interface GenerationPreset {
  descriptors: string[];
  descriptionFocus: string;
  finish: string;
  namePrefix: string;
  seoNoun: string;
  series: string;
  summaryFocus: string;
}

const BATCH_STAGE_SEQUENCE: BatchStage[] = [
  "uploading-images",
  "generating-content",
  "saving-products",
  "publishing-products",
  "completed",
];

const CATEGORY_GENERATION_PRESETS: Record<string, GenerationPreset> = {
  "Display Art Objects": {
    descriptors: ["Sculpture", "Form", "Object", "Monolith", "Beacon"],
    descriptionFocus: "premium exhibition storytelling, lobby installations, and collector-grade display programs",
    finish: "Suggested: polished metal, stone, or translucent composite - editable",
    namePrefix: "AMO Nova",
    seoNoun: "levitating display object",
    series: "Nova Series",
    summaryFocus: "gallery-grade floating display",
  },
  "Exhibition Displays": {
    descriptors: ["Showcase", "Beacon", "Totem", "Display Tower", "Presentation Form"],
    descriptionFocus: "trade-show launches, branded hero displays, and high-visibility presentation environments",
    finish: "Suggested: exhibition-grade mixed material finish - editable",
    namePrefix: "AMO Arc",
    seoNoun: "floating product display",
    series: "Arc Series",
    summaryFocus: "high-visibility levitating showcase",
  },
  "Levitating Clocks": {
    descriptors: ["Chronograph", "Time Halo", "Axis Clock", "Orbit Dial", "Signature Clock"],
    descriptionFocus: "hospitality lounges, executive gifts, and premium retail clock programs",
    finish: "Suggested: brushed metal and stone composite - editable",
    namePrefix: "AMO Orbit",
    seoNoun: "magnetic levitation clock",
    series: "Orbit Series",
    summaryFocus: "floating timepiece display",
  },
  "Levitating Lamps": {
    descriptors: ["Halo Lamp", "Lumen Lamp", "Prism Lamp", "Aurelia Lamp", "Glow Form"],
    descriptionFocus: "boutique hospitality lighting, premium gifting, and statement desk display programs",
    finish: "Suggested: brushed metal with luminous composite accents - editable",
    namePrefix: "AMO Halo",
    seoNoun: "magnetic levitation lamp",
    series: "Halo Series",
    summaryFocus: "floating light sculpture",
  },
  "OEM Maglev Modules": {
    descriptors: ["Levitation Module", "Display Core", "Motion Platform", "Integration Module", "Showcase Engine"],
    descriptionFocus: "OEM integration, custom retail fixtures, and engineered prototype programs",
    finish: "Suggested: engineering-grade metal housing - editable",
    namePrefix: "AMO Core",
    seoNoun: "OEM magnetic levitation module",
    series: "Core Series",
    summaryFocus: "integration-ready maglev module",
  },
  "Premium Gifts": {
    descriptors: ["Gift Object", "Signature Piece", "Collector Display", "Presentation Icon", "Keepsake Display"],
    descriptionFocus: "executive gifting, commemorative launches, and luxury presentation packaging programs",
    finish: "Suggested: luxury metal and stone finish - editable",
    namePrefix: "AMO Signature",
    seoNoun: "premium floating display",
    series: "Signature Series",
    summaryFocus: "premium levitating gift object",
  },
};

function normalizeSpecLabel(label: string) {
  return label.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function extractCustomizationOptions(specs: Record<string, string>) {
  for (const [label, value] of Object.entries(specs)) {
    const normalizedLabel = normalizeSpecLabel(label);

    if (
      CUSTOMIZATION_SPEC_ALIASES.some(
        (alias) => normalizedLabel === alias || normalizedLabel.includes(alias),
      )
    ) {
      return value;
    }
  }

  return "";
}

function getGenerationPreset(categoryName: string): GenerationPreset {
  return (
    CATEGORY_GENERATION_PRESETS[categoryName] ?? {
      descriptors: ["Display Object", "Showcase Form", "Floating Accent", "Presentation Piece", "Signature Object"],
      descriptionFocus: "premium retail, hospitality, and exhibition display programs",
      finish: "Suggested: premium mixed material finish - editable",
      namePrefix: "AMO Nova",
      seoNoun: "magnetic levitation product",
      series: "Nova Series",
      summaryFocus: "premium levitating display",
    }
  );
}

function humanizeFileStem(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const normalized = baseName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (
    normalized.length < 4 ||
    /^ig [a-z0-9 ]{18,}$/i.test(normalized) ||
    /^[a-f0-9 ]{16,}$/i.test(normalized)
  ) {
    return "";
  }

  return normalized
    .split(" ")
    .filter((part) => part.length > 1 && !/^\d+$/.test(part))
    .slice(0, 4)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function clampText(value: string, maxLength: number) {
  return value.length <= maxLength ? value : value.slice(0, maxLength).trimEnd();
}

function buildGeneratedBatchProduct(options: {
  autoPublish: boolean;
  categoryId: string;
  categoryName: string;
  file: File;
  index: number;
}): ProductRequestFields {
  const preset = getGenerationPreset(options.categoryName);
  const descriptor = preset.descriptors[options.index % preset.descriptors.length];
  const fileStem = humanizeFileStem(options.file.name);
  const ordinal = String(options.index + 1).padStart(2, "0");
  const generatedName = fileStem ? `AMO ${fileStem}` : `${preset.namePrefix} ${descriptor}`;
  const slugSuffix = `${Date.now().toString(36)}-${ordinal}`;
  const slug = `${slugifyValue(generatedName)}-${slugSuffix}`;
  const summary = `Premium ${preset.summaryFocus} designed for ${preset.descriptionFocus}.`;
  const description = `${generatedName} is a concept-ready ${options.categoryName.toLowerCase()} developed for ${preset.descriptionFocus}. It uses AMO's magnetic levitation presentation language to help sales and design teams publish a polished product placeholder immediately, then refine commercial specifications, finishes, and OEM details inside the edit workflow without blocking catalog launch speed.`;
  const seoTitle = clampText(`${generatedName} | AMO`, 60);
  const seoDescription = clampText(
    `${generatedName} is a ${preset.seoNoun} for premium retail, hospitality, exhibition, and OEM display programs.`,
    160,
  );

  return {
    categoryId: options.categoryId,
    customizationOptions: "Logo integration, finish tuning, packaging, magnetic module calibration, size adjustment",
    description,
    diameter: "TBD",
    finish: preset.finish,
    leadTimeText: "TBD - editable",
    levitationHeight: "TBD",
    loadCapacity: "TBD",
    minOrderQty: "1",
    name: generatedName,
    power: "TBD",
    removedImageIds: [],
    rotation: "Suggested: 360° continuous",
    seoDescription,
    seoTitle,
    series: preset.series,
    slug,
    status: options.autoPublish ? "published" : "draft",
    summary,
  };
}

function appendProductRequestBody(
  body: FormData,
  fields: ProductRequestFields,
  files: File[],
) {
  body.append("name", fields.name);
  body.append("slug", fields.slug);
  body.append("categoryId", fields.categoryId);
  body.append("status", fields.status);
  body.append("series", fields.series);
  body.append("summary", fields.summary);
  body.append("description", fields.description);
  body.append("levitationHeight", fields.levitationHeight);
  body.append("rotation", fields.rotation);
  body.append("diameter", fields.diameter);
  body.append("loadCapacity", fields.loadCapacity);
  body.append("power", fields.power);
  body.append("finish", fields.finish);
  body.append("minOrderQty", fields.minOrderQty);
  body.append("leadTimeText", fields.leadTimeText);
  body.append("customizationOptions", fields.customizationOptions);
  body.append("seoTitle", fields.seoTitle);
  body.append("seoDescription", fields.seoDescription);
  body.append("removedImageIds", JSON.stringify(fields.removedImageIds));

  for (const file of files) {
    body.append("images", file);
  }
}

function batchStageLabel(stage: BatchStage, autoPublish: boolean) {
  if (stage === "publishing-products" && !autoPublish) {
    return "Publishing skipped (draft mode)";
  }

  switch (stage) {
    case "uploading-images":
      return "Uploading images...";
    case "generating-content":
      return "Generating content...";
    case "saving-products":
      return "Saving products...";
    case "publishing-products":
      return "Publishing products...";
    case "completed":
      return "Completed";
    default:
      return "Ready";
  }
}

function buildFormState(
  product: AdminProductRecord | null,
  defaultCategoryId: string,
): ProductFormState {
  if (!product) {
    return {
      name: "",
      slug: "",
      categoryId: defaultCategoryId,
      status: "published",
      series: "",
      summary: "",
      description: "",
      levitationHeight: "",
      rotation: "",
      diameter: "",
      loadCapacity: "",
      power: "",
      finish: "",
      minOrderQty: "1",
      leadTimeText: "",
      customizationOptions: "",
      seoTitle: "",
      seoDescription: "",
      existingImages: [],
      removedImageIds: [],
      newFiles: [],
    };
  }

  const { showcaseSpecs } = splitProductShowcaseSpecs(product.specs);

  return {
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    status: product.status,
    series: product.series,
    summary: product.summary,
    description: product.description,
    levitationHeight: showcaseSpecs["Levitation Height"],
    rotation: showcaseSpecs.Rotation,
    diameter: showcaseSpecs.Diameter,
    loadCapacity: showcaseSpecs["Load Capacity"],
    power: showcaseSpecs.Power,
    finish: showcaseSpecs.Finish,
    minOrderQty: product.minOrderQty ? String(product.minOrderQty) : "1",
    leadTimeText: product.leadTimeText,
    customizationOptions: extractCustomizationOptions(product.specs),
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    existingImages: product.images,
    removedImageIds: [],
    newFiles: [],
  };
}

function validateClientState(state: ProductFormState) {
  const fieldErrors: FieldErrors = {};

  if (!state.name.trim()) fieldErrors.name = "Product name is required.";
  if (!state.slug.trim()) fieldErrors.slug = "Slug is required.";
  if (!state.categoryId) fieldErrors.categoryId = "Category is required.";
  if (!state.series.trim()) fieldErrors.series = "Series is required.";
  if (!state.summary.trim()) fieldErrors.summary = "Short description is required.";
  if (!state.description.trim()) fieldErrors.description = "Long description is required.";
  if (!state.levitationHeight.trim()) fieldErrors.levitationHeight = "Levitation height is required.";
  if (!state.rotation.trim()) fieldErrors.rotation = "Rotation is required.";
  if (!state.diameter.trim()) fieldErrors.diameter = "Diameter is required.";
  if (!state.loadCapacity.trim()) fieldErrors.loadCapacity = "Load capacity is required.";
  if (!state.power.trim()) fieldErrors.power = "Power is required.";
  if (!state.finish.trim()) fieldErrors.finish = "Finish is required.";
  if (!state.minOrderQty.trim() || !/^[1-9]\d*$/.test(state.minOrderQty.trim())) {
    fieldErrors.minOrderQty = "MOQ must be a whole number greater than 0.";
  }
  if (!state.leadTimeText.trim()) fieldErrors.leadTimeText = "Lead time is required.";
  if (!state.customizationOptions.trim()) {
    fieldErrors.customizationOptions = "Customization options are required.";
  }
  if (!state.seoTitle.trim()) fieldErrors.seoTitle = "SEO title is required.";
  if (!state.seoDescription.trim()) fieldErrors.seoDescription = "SEO description is required.";

  const invalidFile = state.newFiles.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));

  if (invalidFile) {
    fieldErrors.images = "Upload JPEG, PNG, or WebP images only.";
  }

  return fieldErrors;
}

async function submitProductRequest(options: {
  body: FormData;
  method: "PATCH" | "POST";
  onProgress: (nextValue: number | null) => void;
  url: string;
}) {
  return new Promise<{ data: SubmitResponse; ok: boolean }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(options.method, options.url);
    request.responseType = "json";

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        options.onProgress(null);
        return;
      }

      options.onProgress(Math.max(1, Math.min(100, Math.round((event.loaded / event.total) * 100))));
    };

    request.onload = () => {
      const data =
        request.response && typeof request.response === "object"
          ? (request.response as SubmitResponse)
          : ({} as SubmitResponse);

      resolve({
        data,
        ok: request.status >= 200 && request.status < 300,
      });
    };

    request.onerror = () => {
      reject(new Error("Unable to reach the admin product API."));
    };

    request.send(options.body);
  });
}

function NoticeBanner({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "success" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
        tone === "success"
          ? "border-white/16 bg-white/[0.08] text-white"
          : "border-red-400/24 bg-red-500/10 text-red-200",
      )}
    >
      {children}
    </div>
  );
}

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
        <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-xs uppercase tracking-[0.24em] text-slate-400">
      {children}
    </label>
  );
}

function UploadProgress({ value }: { value: number | null }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Upload Progress</p>
        <p className="text-sm text-white/74">{typeof value === "number" ? `${value}%` : "Saving..."}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-[width] duration-200"
          style={{ width: `${typeof value === "number" ? value : 35}%` }}
        />
      </div>
    </div>
  );
}

export function AdminProductForm({
  categories,
  mode,
  notice,
  product,
}: AdminProductFormProps) {
  const router = useRouter();
  const defaultCategoryId = categories[0]?.id ?? "";
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  const [formState, setFormState] = useState(buildFormState(product, defaultCategoryId));
  const [slugAutoMode, setSlugAutoMode] = useState(mode === "create");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestTone, setRequestTone] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [batchCategoryId, setBatchCategoryId] = useState(defaultCategoryId);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([]);
  const [batchStage, setBatchStage] = useState<BatchStage>("idle");
  const [batchStageIndex, setBatchStageIndex] = useState(-1);
  const [batchTone, setBatchTone] = useState<"success" | "error">("success");
  const [batchUploadProgress, setBatchUploadProgress] = useState<number | null>(null);
  const [currentBatchFileName, setCurrentBatchFileName] = useState<string | null>(null);
  const [currentBatchItemIndex, setCurrentBatchItemIndex] = useState<number>(0);
  const [autoPublishGenerated, setAutoPublishGenerated] = useState(true);
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);

  const visibleExistingImages = formState.existingImages.filter(
    (image) => !formState.removedImageIds.includes(image.id),
  );
  const previewImage =
    visibleExistingImages.find((image) => image.isPrimary) ??
    visibleExistingImages[0] ??
    null;

  async function flushUi() {
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  function updateField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setFormState((current) => {
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

    const incomingFiles = Array.from(files);
    const validFiles = incomingFiles.filter((file) => ALLOWED_IMAGE_TYPES.has(file.type));

    setFormState((current) => ({
      ...current,
      newFiles: [...current.newFiles, ...validFiles],
    }));

    if (validFiles.length !== incomingFiles.length) {
      setFieldErrors((current) => ({
        ...current,
        images: "Upload JPEG, PNG, or WebP images only.",
      }));
      return;
    }

    setFieldErrors((current) => {
      if (!current.images) {
        return current;
      }

      const remaining = { ...current };
      delete remaining.images;
      return remaining;
    });
  }

  function removeNewFile(index: number) {
    setFormState((current) => ({
      ...current,
      newFiles: current.newFiles.filter((_, fileIndex) => fileIndex !== index),
    }));
  }

  function appendBatchFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const incomingFiles = Array.from(files);
    const validFiles = incomingFiles.filter((file) => ALLOWED_IMAGE_TYPES.has(file.type));
    const nextFiles = [...batchFiles, ...validFiles].slice(0, 10);

    setBatchFiles(nextFiles);

    if (validFiles.length !== incomingFiles.length) {
      setBatchMessage("Batch upload accepts JPEG, PNG, or WebP images only.");
      setBatchTone("error");
      return;
    }

    if (incomingFiles.length + batchFiles.length > 10) {
      setBatchMessage("Batch generation is limited to 10 products per run. Extra files were ignored.");
      setBatchTone("error");
      return;
    }

    setBatchMessage(null);
  }

  function removeBatchFile(index: number) {
    setBatchFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  async function handleBatchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isDeleting || categories.length === 0) {
      return;
    }

    if (!batchCategoryId) {
      setBatchMessage("Select a category before starting batch generation.");
      setBatchTone("error");
      return;
    }

    if (batchFiles.length === 0) {
      setBatchMessage("Upload between 1 and 10 product images to start batch generation.");
      setBatchTone("error");
      return;
    }

    if (batchFiles.length > 10) {
      setBatchMessage("Batch generation is limited to 10 products per run.");
      setBatchTone("error");
      return;
    }

    setIsBatchSubmitting(true);
    setBatchMessage(null);
    setBatchResults([]);
    setBatchStage("uploading-images");
    setBatchStageIndex(0);
    setBatchUploadProgress(0);
    const nextResults: BatchResultItem[] = [];
    const categoryName = categoryNameById.get(batchCategoryId) ?? "Display Art Objects";

    try {
      for (const [index, file] of batchFiles.entries()) {
        setCurrentBatchFileName(file.name);
        setCurrentBatchItemIndex(index + 1);
        setBatchStage("uploading-images");
        setBatchStageIndex(0);
        setBatchUploadProgress(1);
        await flushUi();

        setBatchStage("generating-content");
        setBatchStageIndex(1);
        await flushUi();

        const generatedProduct = buildGeneratedBatchProduct({
          autoPublish: autoPublishGenerated,
          categoryId: batchCategoryId,
          categoryName,
          file,
          index,
        });

        const body = new FormData();
        appendProductRequestBody(body, generatedProduct, [file]);

        setBatchStage("saving-products");
        setBatchStageIndex(2);

        try {
          const response = await submitProductRequest({
            body,
            method: "POST",
            onProgress: (nextValue) => {
              setBatchStage("uploading-images");
              setBatchStageIndex(0);
              setBatchUploadProgress(nextValue);

              if (typeof nextValue === "number" && nextValue >= 100) {
                setBatchStage("saving-products");
                setBatchStageIndex(2);
              }
            },
            url: "/api/admin/products",
          });

          if (!response.ok || !response.data.product) {
            nextResults.push({
              fileName: file.name,
              message: response.data.message ?? "Unable to save the generated product.",
              name: generatedProduct.name,
              slug: generatedProduct.slug,
              status: "error",
            });
            setBatchResults([...nextResults]);
            continue;
          }

          if (autoPublishGenerated) {
            setBatchStage("publishing-products");
            setBatchStageIndex(3);
            await flushUi();
          }

          nextResults.push({
            fileName: file.name,
            message: autoPublishGenerated ? "Published" : "Saved as draft",
            name: response.data.product.name,
            productId: response.data.product.id,
            slug: response.data.product.slug,
            status: "success",
          });
          setBatchResults([...nextResults]);
        } catch (error) {
          nextResults.push({
            fileName: file.name,
            message: error instanceof Error ? error.message : "Unable to process this product.",
            name: generatedProduct.name,
            slug: generatedProduct.slug,
            status: "error",
          });
          setBatchResults([...nextResults]);
        }
      }

      setBatchStage("completed");
      setBatchStageIndex(4);
      setBatchUploadProgress(null);

      const successCount = nextResults.filter((item) => item.status === "success").length;
      const failureCount = nextResults.length - successCount;

      if (successCount > 0) {
        setBatchMessage(
          failureCount > 0
            ? `${successCount} products processed successfully. ${failureCount} failed and can be retried below.`
            : `${successCount} products ${autoPublishGenerated ? "published" : "saved as drafts"} successfully.`,
        );
        setBatchTone(failureCount > 0 ? "error" : "success");
        router.refresh();
      } else {
        setBatchMessage("No products were created. Review the failures below and try again.");
        setBatchTone("error");
      }

      if (failureCount === 0) {
        setBatchFiles([]);
      } else {
        const failedFileNames = new Set(
          nextResults.filter((item) => item.status === "error").map((item) => item.fileName),
        );
        setBatchFiles((current) => current.filter((file) => failedFileNames.has(file.name)));
      }
    } finally {
      setCurrentBatchFileName(null);
      setCurrentBatchItemIndex(0);
      setIsBatchSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateClientState(formState);

    setFieldErrors(nextFieldErrors);
    setRequestMessage(null);
    setRequestTone("success");

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    const body = new FormData();
    appendProductRequestBody(body, formState, formState.newFiles);

    setIsSubmitting(true);
    setUploadProgress(formState.newFiles.length > 0 ? 1 : null);

    try {
      const targetUrl =
        mode === "edit" && product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products";
      const response = await submitProductRequest({
        body,
        method: mode === "edit" && product ? "PATCH" : "POST",
        onProgress: setUploadProgress,
        url: targetUrl,
      });

      if (!response.ok || !response.data.product) {
        setFieldErrors(response.data.fieldErrors ?? {});
        setRequestMessage(response.data.message ?? "Unable to save the product.");
        setRequestTone("error");
        return;
      }

      setUploadProgress(100);

      const redirectHref =
        mode === "create"
          ? "/admin/products?created=1"
          : `/admin/products/${response.data.product.id}/edit?updated=1`;

      router.push(redirectHref);
      router.refresh();
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : "Unable to save the product.");
      setRequestTone("error");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }

  async function handleDelete() {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${product.name || "this product"}? This also removes linked images from Supabase Storage.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setRequestMessage(null);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to delete the product.");
      }

      router.push("/admin/products?deleted=1");
      router.refresh();
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : "Unable to delete the product.");
      setRequestTone("error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner tone={notice.tone}>{notice.message}</NoticeBanner> : null}
      {requestMessage ? <NoticeBanner tone={requestTone}>{requestMessage}</NoticeBanner> : null}

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
          Back to Products
        </Link>
        {product?.status === "published" ? (
          <Link href={`/products/${product.slug}`} className={buttonStyles({ variant: "ghost", size: "sm" })}>
            View Public Page
          </Link>
        ) : null}
        {mode === "edit" && product ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDeleting || isSubmitting || isBatchSubmitting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        ) : null}
      </div>

      {categories.length === 0 ? (
        <NoticeBanner tone="error">
          No categories are available. Seed or create categories in Supabase before managing products here.
        </NoticeBanner>
      ) : null}

      {mode === "create" ? (
        <form onSubmit={handleBatchSubmit} className="space-y-6">
          {batchMessage ? <NoticeBanner tone={batchTone}>{batchMessage}</NoticeBanner> : null}

          <AdminSectionBlock
            eyebrow="Batch Generate"
            title="One-click product generation"
            description="Upload 1 to 10 product images and publish them immediately without a review or confirm step. Generated records use the current admin schema and can still be refined later from the edit page."
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="batch-category">Category</FieldLabel>
                    <Select
                      id="batch-category"
                      value={batchCategoryId}
                      onChange={(event) => setBatchCategoryId(event.target.value)}
                      disabled={isBatchSubmitting}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.status})
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <label className="flex items-start gap-3 text-sm text-white/78">
                      <input
                        type="checkbox"
                        checked={autoPublishGenerated}
                        onChange={(event) => setAutoPublishGenerated(event.target.checked)}
                        disabled={isBatchSubmitting}
                        className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent"
                      />
                      <span>
                        <span className="block text-xs uppercase tracking-[0.24em] text-white/42">
                          Auto Publish Generated Products
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-white/62">
                          Enabled by default. Disable to save generated products as drafts.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="batch-images">Batch Product Images</FieldLabel>
                  <input
                    id="batch-images"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES}
                    multiple
                    onChange={(event) => appendBatchFiles(event.target.files)}
                    disabled={isBatchSubmitting}
                    className="block w-full rounded-[1.35rem] border border-dashed border-white/16 bg-white/[0.03] px-4 py-5 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.22em] file:text-black"
                  />
                  <p className="text-sm leading-6 text-white/48">
                    Upload 1 to 10 JPEG, PNG, or WebP files. The generator creates one product per image and sends it directly through the existing admin save flow.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Queued files</p>
                    <p className="text-xs text-white/48">{batchFiles.length}/10</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {batchFiles.length > 0 ? (
                      batchFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-white">{file.name}</p>
                            <p className="text-xs text-white/42">{Math.max(1, Math.round(file.size / 1024))} KB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isBatchSubmitting}
                            onClick={() => removeBatchFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-white/48">
                        No files queued yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <Link href="/admin/products" className={buttonStyles({ variant: "ghost", size: "sm" })}>
                    Open Products
                  </Link>
                  <Button type="submit" size="sm" disabled={isBatchSubmitting || categories.length === 0}>
                    {isBatchSubmitting
                      ? "Processing batch..."
                      : autoPublishGenerated
                        ? "Generate and Publish"
                        : "Generate and Save Drafts"}
                  </Button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Progress</p>
                    <p className="text-sm text-white/74">{batchStageLabel(batchStage, autoPublishGenerated)}</p>
                  </div>
                  {currentBatchFileName ? (
                    <p className="mt-3 text-sm leading-6 text-white/56">
                      Processing {currentBatchItemIndex} of {batchFiles.length}: {currentBatchFileName}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-white/56">
                      Start a batch to replace manual validation with direct generation, save, and publish.
                    </p>
                  )}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-200"
                      style={{
                        width: `${typeof batchUploadProgress === "number" ? batchUploadProgress : batchStage === "completed" ? 100 : 18}%`,
                      }}
                    />
                  </div>
                  <div className="mt-5 space-y-2">
                    {BATCH_STAGE_SEQUENCE.map((stage, index) => {
                      const isComplete = batchStage === "completed" || (batchStageIndex >= 0 && index < batchStageIndex);
                      const isActive = batchStage === stage;

                      return (
                        <div
                          key={stage}
                          className={cn(
                            "rounded-[16px] border px-3 py-3 text-sm",
                            isActive
                              ? "border-white/18 bg-white/[0.08] text-white"
                              : isComplete
                                ? "border-white/12 bg-white/[0.04] text-white/78"
                                : "border-white/8 bg-transparent text-white/42",
                          )}
                        >
                          {batchStageLabel(stage, autoPublishGenerated)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Results</p>
                    <p className="text-xs text-white/48">{batchResults.length} processed</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {batchResults.length > 0 ? (
                      batchResults.map((item) => (
                        <article
                          key={`${item.fileName}-${item.slug}`}
                          className={cn(
                            "rounded-[18px] border p-4",
                            item.status === "success"
                              ? "border-white/10 bg-white/[0.03]"
                              : "border-red-400/20 bg-red-500/10",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-white">{item.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/42">{item.slug}</p>
                              <p className="mt-3 text-sm leading-6 text-white/62">{item.message}</p>
                            </div>
                            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/62">
                              {item.status}
                            </span>
                          </div>
                          {item.status === "success" && item.productId ? (
                            <div className="mt-4 flex flex-wrap gap-3">
                              <Link
                                href={`/admin/products/${item.productId}/edit`}
                                className={buttonStyles({ variant: "secondary", size: "sm" })}
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/products/${item.slug}`}
                                className={buttonStyles({ variant: "ghost", size: "sm" })}
                              >
                                View
                              </Link>
                            </div>
                          ) : null}
                        </article>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-white/48">
                        Completed products and failures will be listed here as the batch progresses.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AdminSectionBlock>
        </form>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminSectionBlock
          eyebrow="Identity"
          title={mode === "create" ? "Manual product editor" : product?.name || "Edit product"}
          description={
            mode === "create"
              ? "Use this fallback editor when a product needs hand-authored details instead of the one-click batch generator above."
              : "Save only the fields required by the public products experience, plus publication state and image assets."
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="admin-name">Product Name</FieldLabel>
              <Input
                id="admin-name"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="AirCore Planar X1"
              />
              {fieldErrors.name ? <p className="text-sm text-rose-200">{fieldErrors.name}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-slug">Slug</FieldLabel>
              <Input
                id="admin-slug"
                value={formState.slug}
                onChange={(event) => {
                  setSlugAutoMode(false);
                  updateField("slug", slugifyValue(event.target.value));
                }}
                placeholder="aircore-planar-x1"
              />
              {fieldErrors.slug ? <p className="text-sm text-rose-200">{fieldErrors.slug}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-category">Category</FieldLabel>
              <Select
                id="admin-category"
                value={formState.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
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
              <FieldLabel htmlFor="admin-status">Status</FieldLabel>
              <Select
                id="admin-status"
                value={formState.status}
                onChange={(event) => updateField("status", event.target.value as ContentStatus)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <FieldLabel htmlFor="admin-series">Series</FieldLabel>
              <Input
                id="admin-series"
                value={formState.series}
                onChange={(event) => updateField("series", event.target.value)}
                placeholder="X Series"
              />
              {fieldErrors.series ? <p className="text-sm text-rose-200">{fieldErrors.series}</p> : null}
            </div>
          </div>
        </AdminSectionBlock>

        <AdminSectionBlock
          eyebrow="Copy"
          title="Descriptions and SEO"
          description="These fields drive the product showcase, detail page introduction, and search metadata."
        >
          <div className="grid gap-5">
            <div className="space-y-2">
              <FieldLabel htmlFor="admin-summary">Short Description</FieldLabel>
              <textarea
                id="admin-summary"
                rows={3}
                value={formState.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                placeholder="High-throughput magnetic levitation platform for premium product display."
                className={adminTextareaClassName}
              />
              {fieldErrors.summary ? <p className="text-sm text-rose-200">{fieldErrors.summary}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-description">Long Description</FieldLabel>
              <textarea
                id="admin-description"
                rows={6}
                value={formState.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe the product, use case, and overall positioning."
                className={adminTextareaClassName}
              />
              {fieldErrors.description ? <p className="text-sm text-rose-200">{fieldErrors.description}</p> : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="admin-seo-title">SEO Title</FieldLabel>
                <Input
                  id="admin-seo-title"
                  value={formState.seoTitle}
                  onChange={(event) => updateField("seoTitle", event.target.value)}
                  placeholder="AirCore Planar X1 | AMO"
                />
                {fieldErrors.seoTitle ? <p className="text-sm text-rose-200">{fieldErrors.seoTitle}</p> : null}
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="admin-seo-description">SEO Description</FieldLabel>
                <textarea
                  id="admin-seo-description"
                  rows={3}
                  value={formState.seoDescription}
                  onChange={(event) => updateField("seoDescription", event.target.value)}
                  placeholder="Concise search description for the product page."
                  className={adminTextareaClassName}
                />
                {fieldErrors.seoDescription ? <p className="text-sm text-rose-200">{fieldErrors.seoDescription}</p> : null}
              </div>
            </div>
          </div>
        </AdminSectionBlock>

        <AdminSectionBlock
          eyebrow="Specs"
          title="Product specifications"
          description="These fields feed the public specification table and detail-page configuration copy."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel htmlFor="admin-levitation-height">Levitation Height</FieldLabel>
              <Input
                id="admin-levitation-height"
                value={formState.levitationHeight}
                onChange={(event) => updateField("levitationHeight", event.target.value)}
                placeholder="20-25 mm"
              />
              {fieldErrors.levitationHeight ? <p className="text-sm text-rose-200">{fieldErrors.levitationHeight}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-rotation">Rotation</FieldLabel>
              <Input
                id="admin-rotation"
                value={formState.rotation}
                onChange={(event) => updateField("rotation", event.target.value)}
                placeholder="360° continuous"
              />
              {fieldErrors.rotation ? <p className="text-sm text-rose-200">{fieldErrors.rotation}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-diameter">Diameter</FieldLabel>
              <Input
                id="admin-diameter"
                value={formState.diameter}
                onChange={(event) => updateField("diameter", event.target.value)}
                placeholder="120 mm"
              />
              {fieldErrors.diameter ? <p className="text-sm text-rose-200">{fieldErrors.diameter}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-load-capacity">Load Capacity</FieldLabel>
              <Input
                id="admin-load-capacity"
                value={formState.loadCapacity}
                onChange={(event) => updateField("loadCapacity", event.target.value)}
                placeholder="1.5 kg"
              />
              {fieldErrors.loadCapacity ? <p className="text-sm text-rose-200">{fieldErrors.loadCapacity}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-power">Power</FieldLabel>
              <Input
                id="admin-power"
                value={formState.power}
                onChange={(event) => updateField("power", event.target.value)}
                placeholder="24 V DC"
              />
              {fieldErrors.power ? <p className="text-sm text-rose-200">{fieldErrors.power}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-finish">Finish</FieldLabel>
              <Input
                id="admin-finish"
                value={formState.finish}
                onChange={(event) => updateField("finish", event.target.value)}
                placeholder="Matte anodized aluminum"
              />
              {fieldErrors.finish ? <p className="text-sm text-rose-200">{fieldErrors.finish}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-moq">MOQ</FieldLabel>
              <Input
                id="admin-moq"
                inputMode="numeric"
                value={formState.minOrderQty}
                onChange={(event) => updateField("minOrderQty", event.target.value.replace(/[^\d]/g, ""))}
                placeholder="1"
              />
              {fieldErrors.minOrderQty ? <p className="text-sm text-rose-200">{fieldErrors.minOrderQty}</p> : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="admin-lead-time">Lead Time</FieldLabel>
              <Input
                id="admin-lead-time"
                value={formState.leadTimeText}
                onChange={(event) => updateField("leadTimeText", event.target.value)}
                placeholder="6-8 weeks"
              />
              {fieldErrors.leadTimeText ? <p className="text-sm text-rose-200">{fieldErrors.leadTimeText}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2 xl:col-span-1">
              <FieldLabel htmlFor="admin-customization">Customization Options</FieldLabel>
              <Input
                id="admin-customization"
                value={formState.customizationOptions}
                onChange={(event) => updateField("customizationOptions", event.target.value)}
                placeholder="Logo, material, color, size, packaging"
              />
              {fieldErrors.customizationOptions ? <p className="text-sm text-rose-200">{fieldErrors.customizationOptions}</p> : null}
            </div>
          </div>
        </AdminSectionBlock>

        <AdminSectionBlock
          eyebrow="Images"
          title="Supabase Storage assets"
          description="Upload multiple product images. The first retained image becomes the primary image used across the Products showcase and detail page."
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
            <div className="space-y-5">
              <div className="space-y-2">
                <FieldLabel htmlFor="admin-images">Product Images</FieldLabel>
                <input
                  id="admin-images"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  multiple
                  onChange={(event) => appendFiles(event.target.files)}
                  className="block w-full rounded-[1.35rem] border border-dashed border-white/16 bg-white/[0.03] px-4 py-5 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.22em] file:text-black"
                />
                <p className="text-sm leading-6 text-white/48">
                  Accepted formats: JPEG, PNG, WebP.
                </p>
                {fieldErrors.images ? <p className="text-sm text-rose-200">{fieldErrors.images}</p> : null}
              </div>

              {isSubmitting ? <UploadProgress value={uploadProgress} /> : null}

              {formState.newFiles.length > 0 ? (
                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">New files</p>
                  <div className="mt-4 space-y-3">
                    {formState.newFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-white">{file.name}</p>
                          <p className="text-xs text-white/42">{Math.max(1, Math.round(file.size / 1024))} KB</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNewFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
                <div className="flex min-h-[18rem] items-center justify-center bg-white/[0.04] p-6">
                  {previewImage ? (
                    <img
                      src={previewImage.imageUrl}
                      alt={previewImage.altText || formState.name || "Product image"}
                      className="max-h-[18rem] w-auto max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-white/42">
                      <p className="text-[11px] uppercase tracking-[0.24em]">Preview</p>
                      <p className="mt-3 text-sm">No retained images yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Retained images</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibleExistingImages.length > 0 ? (
                    visibleExistingImages.map((image) => (
                      <article key={image.id} className="rounded-[18px] border border-white/10 bg-black/20 p-3">
                        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] bg-white/[0.04] p-3">
                          <img
                            src={image.imageUrl}
                            alt={image.altText || formState.name || "Product image"}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-xs text-white/48">{image.isPrimary ? "Primary image" : "Gallery image"}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setFormState((current) => ({
                                ...current,
                                removedImageIds: [...current.removedImageIds, image.id],
                              }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-white/10 px-4 py-6 text-sm leading-6 text-white/48 sm:col-span-2">
                      No retained images yet. Upload new files to populate the gallery.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminSectionBlock>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/admin/products" className={buttonStyles({ variant: "ghost", size: "sm" })}>
            Cancel
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || isDeleting || isBatchSubmitting || categories.length === 0}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? formState.status === "published"
                  ? "Save and Publish"
                  : "Save Draft"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
