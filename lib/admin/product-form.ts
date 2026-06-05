import type { FaqItem } from "@/types";

interface ParseTextResult<T> {
  value: T;
  error?: string;
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferScalarValue(rawValue: string) {
  if (/^(true|false)$/i.test(rawValue)) {
    return rawValue.toLowerCase() === "true";
  }

  if (/^-?\d+(?:\.\d+)?$/.test(rawValue)) {
    return Number(rawValue);
  }

  return rawValue;
}

export function slugifyValue(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "product";
}

export function splitTextList(value: string) {
  return value
    .split(/[\n,]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function joinTextList(values: string[]) {
  return values.join("\n");
}

export function parseKeyValueText(
  value: string,
  options?: {
    inferScalar?: boolean;
    label?: string;
  },
): ParseTextResult<Record<string, string | number | boolean>> {
  const lines = normalizeLines(value);
  const result: Record<string, string | number | boolean> = {};

  for (const [index, line] of lines.entries()) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0 || separatorIndex === line.length - 1) {
      return {
        value: {},
        error: `${options?.label ?? "Field"} line ${index + 1} must use "key: value" format.`,
      };
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key || !rawValue) {
      return {
        value: {},
        error: `${options?.label ?? "Field"} line ${index + 1} must use "key: value" format.`,
      };
    }

    result[key] = options?.inferScalar ? inferScalarValue(rawValue) : rawValue;
  }

  return { value: result };
}

export function serializeKeyValueObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  return Object.entries(value as Record<string, unknown>)
    .map(([key, entryValue]) => `${key}: ${String(entryValue)}`)
    .join("\n");
}

export function parseFaqText(value: string): ParseTextResult<FaqItem[]> {
  const lines = normalizeLines(value);
  const items: FaqItem[] = [];

  for (const [index, line] of lines.entries()) {
    const separatorIndex = line.indexOf("::");

    if (separatorIndex <= 0 || separatorIndex === line.length - 2) {
      return {
        value: [],
        error: `FAQ line ${index + 1} must use "Question :: Answer" format.`,
      };
    }

    const question = line.slice(0, separatorIndex).trim();
    const answer = line.slice(separatorIndex + 2).trim();

    if (!question || !answer) {
      return {
        value: [],
        error: `FAQ line ${index + 1} must use "Question :: Answer" format.`,
      };
    }

    items.push({ question, answer });
  }

  return { value: items };
}

export function serializeFaqItems(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const entry = item as Record<string, unknown>;
      const question = typeof entry.question === "string" ? entry.question.trim() : "";
      const answer = typeof entry.answer === "string" ? entry.answer.trim() : "";

      if (!question || !answer) {
        return null;
      }

      return `${question} :: ${answer}`;
    })
    .filter((entry): entry is string => Boolean(entry))
    .join("\n");
}
