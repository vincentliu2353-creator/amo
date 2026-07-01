import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

import { amoStep17Articles } from "./amo-blog-step17-batch-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const heroSourceDir = path.join(repoRoot, "public/images/blog/heroes/source");
const heroOutputDir = path.join(repoRoot, "public/images/blog/heroes");
const blogBucket = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET ?? "blog-media";
const validateOnly = process.argv.includes("--validate");

function parseBlogContentInput(content) {
  return content
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

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
    .filter(Boolean);
}

function countWords(value) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function readTimeLabel(wordCount) {
  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
}

function absoluteUrl(pathname) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amo.example.com";
  return new URL(pathname, base).toString();
}

function extractInternalLinks(content) {
  return Array.from(content.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g))
    .map((match) => match[1]?.trim() ?? "")
    .filter(Boolean);
}

function requireSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with node --env-file=.env.local.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function ensureBlogBucket(supabase) {
  const { data, error } = await supabase.storage.getBucket(blogBucket);

  if (error) {
    const lower = error.message.toLowerCase();
    const missing = lower.includes("not found") || lower.includes("does not exist");

    if (!missing) {
      throw new Error(`Unable to access blog media bucket: ${error.message}`);
    }

    const { error: createError } = await supabase.storage.createBucket(blogBucket, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (createError) {
      throw new Error(`Unable to create blog media bucket: ${createError.message}`);
    }

    return;
  }

  if (data?.public) {
    return;
  }

  const { error: updateError } = await supabase.storage.updateBucket(blogBucket, {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (updateError) {
    throw new Error(`Unable to update blog media bucket: ${updateError.message}`);
  }
}

async function processHeroImage(article) {
  await mkdir(heroOutputDir, { recursive: true });
  const sourceSlug = article.imageSourceSlug ?? article.slug;
  const sourcePath = path.join(heroSourceDir, `${sourceSlug}.png`);
  const outputPath = path.join(heroOutputDir, article.imageFilename);

  await sharp(sourcePath)
    .resize(1600, 900, {
      fit: "cover",
      position: "attention",
    })
    .webp({ quality: 90 })
    .toFile(outputPath);

  return outputPath;
}

async function uploadHeroImage(supabase, article, localPath) {
  await ensureBlogBucket(supabase);
  const bytes = await readFile(localPath);
  const storagePath = `blogs/${article.slug}/${article.imageFilename}`;
  const { error } = await supabase.storage.from(blogBucket).upload(storagePath, bytes, {
    contentType: "image/webp",
    upsert: true,
  });

  if (error) {
    throw new Error(`Unable to upload hero image for ${article.slug}: ${error.message}`);
  }

  return supabase.storage.from(blogBucket).getPublicUrl(storagePath).data.publicUrl;
}

function validateArticle(article) {
  const wordCount = countWords(article.body);
  const bodyBlocks = parseBlogContentInput(article.body);
  const internalLinks = extractInternalLinks(article.body);
  const sectionHeadings = Array.from(article.body.matchAll(/^##\s+(.+)$/gm)).map((match) => match[1]?.trim() ?? "");
  const hasFaqSection = sectionHeadings.some((heading) => heading.toLowerCase() === "faq");
  const hasCommercialLink = internalLinks.some((href) => ["/products", "/oem-odm", "/cases"].includes(href));
  const hasConversionLink = internalLinks.some((href) => ["/rfq", "/contact"].includes(href));
  const hasRelatedBlogLink = internalLinks.some((href) => href.startsWith("/blog/"));

  if (wordCount < 1000 || wordCount > 1500) {
    throw new Error(`${article.slug} has ${wordCount} words; expected 1000-1500.`);
  }

  if (sectionHeadings.length < 7 || sectionHeadings.length > 9) {
    throw new Error(`${article.slug} has ${sectionHeadings.length} H2 sections; expected 7-9.`);
  }

  if (bodyBlocks.length < 7) {
    throw new Error(`${article.slug} does not contain enough structured sections.`);
  }

  if (!hasFaqSection) {
    throw new Error(`${article.slug} is missing a visible FAQ section.`);
  }

  if (!hasCommercialLink) {
    throw new Error(`${article.slug} is missing a commercial page link.`);
  }

  if (!hasConversionLink) {
    throw new Error(`${article.slug} is missing a conversion page link.`);
  }

  if (!hasRelatedBlogLink) {
    throw new Error(`${article.slug} is missing a related blog article link.`);
  }

  return {
    wordCount,
    bodyBlocks,
    readTime: readTimeLabel(wordCount),
    internalLinkCount: internalLinks.length,
    sectionCount: sectionHeadings.length,
  };
}

function buildKeywords(article) {
  return Array.from(
    new Set(
      [
        "AMO",
        "magnetic levitation",
        "floating display",
        article.category,
        article.title,
        ...(article.seoKeywords ?? []),
      ].filter(Boolean),
    ),
  );
}

async function publishArticle(supabase, article) {
  const { bodyBlocks, wordCount, readTime } = validateArticle(article);
  const processedImagePath = await processHeroImage(article);
  const heroImageUrl = await uploadHeroImage(supabase, article, processedImagePath);
  const seoKeywords = buildKeywords(article);

  const { data, error } = await supabase
    .from("blogs")
    .upsert(
      {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: bodyBlocks,
        category_label: article.category,
        tags: ["AMO", "magnetic levitation", article.category, ...(article.seoKeywords ?? []).slice(0, 2)],
        status: "published",
        featured: false,
        seo_title: article.seoTitle,
        seo_description: article.seoDescription,
        seo_keywords: seoKeywords,
        canonical_url: absoluteUrl(`/blog/${article.slug}`),
        og_image_url: heroImageUrl,
        published_at: article.publishedAt,
      },
      {
        onConflict: "slug",
      },
    )
    .select("id, title, slug, category_label, status, og_image_url, published_at")
    .single();

  if (error || !data) {
    throw new Error(`Unable to publish ${article.slug}: ${error?.message ?? "unknown error"}`);
  }

  return {
    title: data.title,
    slug: data.slug,
    category: data.category_label,
    imageFilename: article.imageFilename,
    imageSourceSlug: article.imageSourceSlug ?? article.slug,
    publishStatus: data.status,
    imageUrl: data.og_image_url,
    publishedAt: data.published_at,
    wordCount,
    readTime,
  };
}

async function main() {
  const validations = amoStep17Articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    category: article.category,
    imageFilename: article.imageFilename,
    imageSourceSlug: article.imageSourceSlug ?? article.slug,
    ...validateArticle(article),
  }));

  if (validateOnly) {
    console.table(
      validations.map((entry) => ({
        title: entry.title,
        slug: entry.slug,
        category: entry.category,
        imageFilename: entry.imageFilename,
        imageSourceSlug: entry.imageSourceSlug,
        wordCount: entry.wordCount,
        sectionCount: entry.sectionCount,
        readTime: entry.readTime,
      })),
    );
    return;
  }

  const supabase = requireSupabaseEnv();
  const summary = [];

  for (const article of amoStep17Articles) {
    const result = await publishArticle(supabase, article);
    summary.push(result);
  }

  console.table(
    summary.map((entry) => ({
      title: entry.title,
      slug: entry.slug,
      category: entry.category,
      imageFilename: entry.imageFilename,
      publishStatus: entry.publishStatus,
    })),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
