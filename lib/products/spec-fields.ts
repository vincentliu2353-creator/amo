import type { SpecItem } from "@/types";

export const PRODUCT_SHOWCASE_SPEC_FIELDS = [
  {
    label: "Levitation Height",
    aliases: ["levitation height", "floating height", "lift height", "levitation gap"],
  },
  {
    label: "Rotation",
    aliases: ["rotation", "rotational speed", "spin"],
  },
  {
    label: "Diameter",
    aliases: ["diameter", "size", "width"],
  },
  {
    label: "Load Capacity",
    aliases: ["load capacity", "capacity", "weight capacity", "payload"],
  },
  {
    label: "Power",
    aliases: ["power", "power supply", "input power", "voltage"],
  },
  {
    label: "Finish",
    aliases: ["finish", "surface", "material", "color"],
  },
] as const;

export type ProductShowcaseSpecLabel = (typeof PRODUCT_SHOWCASE_SPEC_FIELDS)[number]["label"];

export type ProductShowcaseSpecState = Record<ProductShowcaseSpecLabel, string>;

type ProductSpecValueRecord = Record<string, string>;

function normalizeSpecLabel(label: string) {
  return label.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function createEmptyProductShowcaseSpecState(): ProductShowcaseSpecState {
  return {
    "Levitation Height": "",
    Rotation: "",
    Diameter: "",
    "Load Capacity": "",
    Power: "",
    Finish: "",
  };
}

function resolveCanonicalSpecLabel(label: string): ProductShowcaseSpecLabel | null {
  const normalizedLabel = normalizeSpecLabel(label);

  for (const field of PRODUCT_SHOWCASE_SPEC_FIELDS) {
    if (field.aliases.some((alias) => normalizedLabel === alias || normalizedLabel.includes(alias))) {
      return field.label;
    }
  }

  return null;
}

export function splitProductShowcaseSpecs(specs: ProductSpecValueRecord) {
  const showcaseSpecs = createEmptyProductShowcaseSpecState();
  const remainingSpecs: ProductSpecValueRecord = {};

  for (const [label, value] of Object.entries(specs)) {
    const canonicalLabel = resolveCanonicalSpecLabel(label);

    if (!canonicalLabel) {
      remainingSpecs[label] = value;
      continue;
    }

    if (!showcaseSpecs[canonicalLabel]) {
      showcaseSpecs[canonicalLabel] = value;
      continue;
    }

    remainingSpecs[label] = value;
  }

  return {
    showcaseSpecs,
    remainingSpecs,
  };
}

export function mergeProductShowcaseSpecs(
  showcaseSpecs: ProductShowcaseSpecState,
  remainingSpecs: ProductSpecValueRecord,
) {
  const mergedSpecs: ProductSpecValueRecord = {};

  for (const field of PRODUCT_SHOWCASE_SPEC_FIELDS) {
    const value = showcaseSpecs[field.label].trim();

    if (value.length > 0) {
      mergedSpecs[field.label] = value;
    }
  }

  for (const [label, value] of Object.entries(remainingSpecs)) {
    if (resolveCanonicalSpecLabel(label)) {
      continue;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > 0) {
      mergedSpecs[label] = trimmedValue;
    }
  }

  return mergedSpecs;
}

export function buildProductShowcaseSpecRows(specs: SpecItem[]) {
  return PRODUCT_SHOWCASE_SPEC_FIELDS.map((field) => {
    const match = specs.find((spec) => {
      const normalizedLabel = normalizeSpecLabel(spec.label);
      return field.aliases.some((alias) => normalizedLabel === alias || normalizedLabel.includes(alias));
    });

    return {
      label: field.label,
      value: match?.value?.trim() || "—",
    };
  });
}
