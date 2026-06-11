import type { BlogSection } from "@/types";

interface BlogBodyBlock {
  type?: string;
  heading?: string;
  content?: string;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBlogBodyBlocks(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const block = entry as BlogBodyBlock;
      const content = normalizeText(block.content);
      const heading = normalizeText(block.heading);

      if (!content) {
        return null;
      }

      return {
        type: normalizeText(block.type) || "paragraph",
        heading,
        content,
      };
    })
    .filter(
      (
        block,
      ): block is {
        type: string;
        heading: string;
        content: string;
      } => Boolean(block),
    );
}

export function parseBlogBody(value: unknown): BlogSection[] {
  return normalizeBlogBodyBlocks(value).map((block) => ({
    heading: block.heading,
    body: block.content,
  }));
}

export function serializeBlogBody(value: unknown) {
  const blocks = normalizeBlogBodyBlocks(value);

  return blocks
    .map((block) => {
      if (block.heading) {
        return `## ${block.heading}\n${block.content}`;
      }

      return block.content;
    })
    .join("\n\n");
}

export function parseBlogContentInput(content: string) {
  return content
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);

      if (lines.length === 0) {
        return null;
      }

      const firstLine = lines[0] ?? "";
      const headingMatch = firstLine.match(/^#{1,6}\s+(.+)$/);

      if (headingMatch) {
        const contentLines = lines.slice(1).join("\n").trim();

        return {
          type: "paragraph",
          heading: headingMatch[1]?.trim() ?? "",
          content: contentLines || headingMatch[1]?.trim() || "",
        };
      }

      return {
        type: "paragraph",
        heading: "",
        content: lines.join("\n"),
      };
    })
    .filter(
      (
        block,
      ): block is {
        type: string;
        heading: string;
        content: string;
      } => Boolean(block && block.content),
    );
}

export function calculateBlogReadTimeFromSections(sections: BlogSection[]) {
  const words = sections
    .flatMap((section) => [section.heading, section.body])
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min read`;
}
