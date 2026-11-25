import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

import { amoGeoArticles, amoGeoKeywordPlan } from "./amo-blog-geo-batch-data.mjs";
import {
  businessGeoArticles,
  businessGeoKeywords,
  coreBusinessKeywords,
} from "./amo-blog-business-geo-batch-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const heroSourceDir = path.join(repoRoot, "public/images/blog/heroes/source");
const heroOutputDir = path.join(repoRoot, "public/images/blog/heroes");
const blogBucket = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET ?? "blog-media";
const siteUrl = "https://amolevitation.com";
const validateOnly = process.argv.includes("--validate");
const businessMode = process.argv.includes("--business");
const articles = businessMode ? businessGeoArticles : amoGeoArticles;

function normalizeKeyword(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

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
      const firstLine = lines[0] ?? "";
      const headingMatch = firstLine.match(/^#{1,6}\s+(.+)$/);

      if (headingMatch) {
        const heading = headingMatch[1]?.trim() ?? "";

        return {
          type: "paragraph",
          heading,
          content: lines.slice(1).join("\n").trim() || heading,
        };
      }

      return {
        type: "paragraph",
        heading: "",
        content: lines.join("\n"),
      };
    });
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
  return new URL(pathname, siteUrl).toString();
}

function extractInternalLinks(content) {
  return Array.from(content.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g))
    .map((match) => match[1]?.trim() ?? "")
    .filter(Boolean);
}

function requireSupabase() {
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

  if (!data?.public) {
    const { error: updateError } = await supabase.storage.updateBucket(blogBucket, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (updateError) {
      throw new Error(`Unable to update blog media bucket: ${updateError.message}`);
    }
  }
}

function validateKeywordPlan() {
  if (businessMode) {
    const normalized = businessGeoKeywords.map(normalizeKeyword);
    const unique = new Set(normalized);

    if (articles.length !== 10 || normalized.length !== 100 || unique.size !== 100) {
      throw new Error(
        `Expected 10 business articles and 100 unique keywords; received ${articles.length} articles, ${normalized.length} keywords, and ${unique.size} unique.`,
      );
    }

    for (const article of articles) {
      const visibleHits = article.seoKeywords.filter((keyword) =>
        article.body.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (!coreBusinessKeywords.every((keyword) => article.seoKeywords.includes(keyword))) {
        throw new Error(`${article.slug} is missing shared core business keywords.`);
      }

      if (visibleHits.length < 10) {
        throw new Error(`${article.slug} visibly covers only ${visibleHits.length} target keywords; expected at least 10.`);
      }
    }

    return unique.size;
  }

  if (amoGeoKeywordPlan.length !== 10 || amoGeoArticles.length !== 10) {
    throw new Error(
      `Expected 10 keyword plans and 10 articles; received ${amoGeoKeywordPlan.length} plans and ${amoGeoArticles.length} articles.`,
    );
  }

  const allKeywords = [];

  for (const entry of amoGeoKeywordPlan) {
    if (entry.queries.length !== 5) {
      throw new Error(`${entry.slug} has ${entry.queries.length} GEO queries; expected exactly 5.`);
    }

    allKeywords.push(...entry.queries.map(normalizeKeyword));
  }

  const uniqueKeywords = new Set(allKeywords);

  if (allKeywords.length !== 50 || uniqueKeywords.size !== 50) {
    throw new Error(
      `Expected 50 unique GEO queries; received ${allKeywords.length} total and ${uniqueKeywords.size} unique.`,
    );
  }

  return uniqueKeywords.size;
}

async function validateArticle(article) {
  const wordCount = countWords(article.body);
  const bodyBlocks = parseBlogContentInput(article.body);
  const internalLinks = extractInternalLinks(article.body);
  const sectionHeadings = Array.from(article.body.matchAll(/^##\s+(.+)$/gm)).map(
    (match) => match[1]?.trim() ?? "",
  );
  const keywordPlan = amoGeoKeywordPlan.find((entry) => entry.slug === article.slug);
  const sourcePath = businessMode
    ? path.join(heroOutputDir, article.imageSource)
    : path.join(heroSourceDir, `${article.slug}.png`);

  if (!businessMode && !keywordPlan) {
    throw new Error(`${article.slug} has no GEO keyword plan.`);
  }

  if (!businessMode && JSON.stringify(article.seoKeywords) !== JSON.stringify(keywordPlan.queries)) {
    throw new Error(`${article.slug} article keywords do not match its GEO keyword plan.`);
  }

  const minimumWords = businessMode ? 400 : 1000;

  if (wordCount < minimumWords || wordCount > 1500) {
    throw new Error(`${article.slug} has ${wordCount} words; expected ${minimumWords}-1500.`);
  }

  if (sectionHeadings.length < 8 || sectionHeadings.length > 9) {
    throw new Error(`${article.slug} has ${sectionHeadings.length} H2 sections; expected 8-9.`);
  }

  if (sectionHeadings[0]?.toLowerCase() !== "direct answer") {
    throw new Error(`${article.slug} must begin with a Direct Answer section.`);
  }

  if (!sectionHeadings.some((heading) => heading.toLowerCase() === "faq")) {
    throw new Error(`${article.slug} is missing a visible FAQ section.`);
  }

  if ((article.body.match(/^###\s+.+/gm) ?? []).length < 5) {
    throw new Error(`${article.slug} must include at least five visible FAQ questions.`);
  }

  if (!internalLinks.some((href) => ["/products", "/oem-odm", "/cases"].includes(href))) {
    throw new Error(`${article.slug} is missing a commercial internal link.`);
  }

  if (!internalLinks.some((href) => ["/rfq", "/contact"].includes(href))) {
    throw new Error(`${article.slug} is missing a conversion internal link.`);
  }

  if (!internalLinks.some((href) => href.startsWith("/blog/"))) {
    throw new Error(`${article.slug} is missing a related article link.`);
  }

  if (/amo\.example\.com|https?:\/\/[^/]*example\.com\//i.test(article.body)) {
    throw new Error(`${article.slug} contains a fake example.com URL.`);
  }

  await access(sourcePath);

  return {
    bodyBlocks,
    wordCount,
    readTime: readTimeLabel(wordCount),
    sectionCount: sectionHeadings.length,
    internalLinkCount: internalLinks.length,
    faqCount: (article.body.match(/^###\s+.+/gm) ?? []).length,
  };
}

async function processHeroImage(article) {
  await mkdir(heroOutputDir, { recursive: true });
  const sourcePath = businessMode
    ? path.join(heroOutputDir, article.imageSource)
    : path.join(heroSourceDir, `${article.slug}.png`);
  const outputPath = path.join(heroOutputDir, article.imageFilename);

  await sharp(sourcePath)
    .resize(businessMode ? 1200 : 1600, businessMode ? 675 : 900, {
      fit: "cover",
      position: "attention",
    })
    .webp({ quality: businessMode ? 72 : 90 })
    .toFile(outputPath);

  return outputPath;
}

async function uploadHeroImage(supabase, article, localPath) {
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

function buildKeywords(article) {
  return Array.from(
    new Set([
      "AMO",
      "magnetic levitation",
      "floating display",
      "GEO",
      "AI search",
      article.category,
      article.title,
      ...article.seoKeywords,
    ]),
  );
}

async function publishArticle(supabase, article) {
  const validation = await validateArticle(article);
  const localImagePath = await processHeroImage(article);
  const heroImageUrl = await uploadHeroImage(supabase, article, localImagePath);

  const { data, error } = await supabase
    .from("blogs")
    .upsert(
      {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: validation.bodyBlocks,
        category_label: article.category,
        tags: [
          "AMO",
          "magnetic levitation",
          "GEO",
          article.category,
          ...article.seoKeywords.slice(0, 2),
        ],
        status: "published",
        featured: false,
        seo_title: article.seoTitle,
        seo_description: article.seoDescription,
        seo_keywords: buildKeywords(article),
        canonical_url: absoluteUrl(`/blog/${article.slug}`),
        og_image_url: heroImageUrl,
        published_at: article.publishedAt,
      },
      { onConflict: "slug" },
    )
    .select("id, title, slug, category_label, status, og_image_url, published_at, seo_keywords")
    .single();

  if (error || !data) {
    throw new Error(`Unable to publish ${article.slug}: ${error?.message ?? "unknown error"}`);
  }

  return {
    ...data,
    imageFilename: article.imageFilename,
    wordCount: validation.wordCount,
    faqCount: validation.faqCount,
    readTime: validation.readTime,
  };
}

async function verifyPublishedRows(supabase) {
  const slugs = articles.map((article) => article.slug);
  const { data, error } = await supabase
    .from("blogs")
    .select("slug, status, og_image_url, seo_keywords")
    .in("slug", slugs);

  if (error) {
    throw new Error(`Unable to verify published GEO articles: ${error.message}`);
  }

  if ((data ?? []).length !== articles.length) {
    throw new Error(`Published verification returned ${data?.length ?? 0} of ${articles.length} rows.`);
  }

  for (const row of data ?? []) {
    if (row.status !== "published") {
      throw new Error(`${row.slug} is not published after upsert.`);
    }

    if (!row.og_image_url?.includes("supabase.co/storage/v1/object/public/")) {
      throw new Error(`${row.slug} does not use a Supabase public image URL.`);
    }
  }

  return data ?? [];
}

async function main() {
  const uniqueKeywordCount = validateKeywordPlan();
  const validations = [];

  for (const article of articles) {
    const result = await validateArticle(article);
    validations.push({
      slug: article.slug,
      category: article.category,
      wordCount: result.wordCount,
      sectionCount: result.sectionCount,
      faqCount: result.faqCount,
      geoKeywords: article.seoKeywords.length,
      readTime: result.readTime,
    });
  }

  console.log(`Validated ${articles.length} articles and ${uniqueKeywordCount} unique GEO queries.`);
  console.table(validations);

  if (validateOnly) {
    return;
  }

  const supabase = requireSupabase();
  await ensureBlogBucket(supabase);
  const published = [];

  for (const article of articles) {
    published.push(await publishArticle(supabase, article));
  }

  const verified = await verifyPublishedRows(supabase);
  console.log(`Published and verified ${verified.length} GEO articles.`);
  console.table(
    published.map((entry) => ({
      slug: entry.slug,
      status: entry.status,
      wordCount: entry.wordCount,
      faqCount: entry.faqCount,
      imageFilename: entry.imageFilename,
    })),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
