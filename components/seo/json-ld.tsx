type JsonLdValue =
  | null
  | string
  | number
  | boolean
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

interface JsonLdProps {
  data: unknown;
}

function sanitizeJsonLdValue(value: unknown): JsonLdValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => sanitizeJsonLdValue(entry))
      .filter((entry): entry is JsonLdValue => entry !== undefined);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    const sanitizedEntries = Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => [key, sanitizeJsonLdValue(entry)] as const)
      .filter(([, entry]) => entry !== undefined);

    return Object.fromEntries(sanitizedEntries) as { [key: string]: JsonLdValue };
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return undefined;
}

function serializeJsonLd(data: unknown) {
  const sanitized = sanitizeJsonLdValue(data);

  if (sanitized === undefined) {
    return null;
  }

  return JSON.stringify(sanitized)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: JsonLdProps) {
  const serialized = serializeJsonLd(data);

  if (!serialized) {
    return null;
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />;
}
