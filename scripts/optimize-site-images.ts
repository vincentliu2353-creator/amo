import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { encodeWebp } from "../lib/server/encode-webp.ts";

const publicDir = new URL("../public/", import.meta.url);
const outputRoot = "/image-variants";
const aboutHero = "/images/about/original/about-ch02-question-reality.jpg";
const brandImages = ["/amo-logo-white.png", "/amo-favicon.png", "/downloads/amo-whatsapp-qr.png"];

const groups = {
  fullscreen: { widths: [480, 768, 1200, 1920], maxBytes: 600_000 },
  ordinary: { widths: [384, 768, 1200, 1600], maxBytes: 900_000 },
  product: { widths: [160, 320, 480, 768, 1200, 1600], maxBytes: 400_000 },
  brand: { widths: [64, 128, 256, 512], maxBytes: 900_000 },
};

async function listWebps(dir: string): Promise<string[]> {
  const entries = await readdir(new URL(`.${dir}/`, publicDir), { withFileTypes: true });
  const paths = await Promise.all(entries.map((entry) => {
    const relative = `${dir}/${entry.name}`;
    if (entry.isDirectory() && !["source", "original", "originals"].includes(entry.name)) {
      return listWebps(relative);
    }
    return entry.isFile() && entry.name.endsWith(".webp") ? [relative] : [];
  }));
  return paths.flat();
}

const sources = [
  ...await listWebps("/images"),
  ...await readdir(new URL("./products/rendered/", publicDir))
    .then((names) => names.filter((name) => name.endsWith(".png")).map((name) => `/products/rendered/${name}`)),
  aboutHero,
  ...brandImages,
].sort();

type Asset = { base: string; widths: number[]; blur?: string };
const manifest: Record<string, Asset> = {};
const report = [];

for (const src of sources) {
  const input = await readFile(new URL(`.${src}`, publicDir));
  const metadata = await sharp(input).metadata();
  const nativeWidth = [5, 6, 7, 8].includes(metadata.orientation ?? 1) ? metadata.height : metadata.width;
  if (!nativeWidth) throw new Error(`Missing width for ${src}`);

  const group = brandImages.includes(src) ? "brand"
    : src.startsWith("/products/") ? "product"
    : src === aboutHero || src.startsWith("/images/home/") || src.startsWith("/images/cases/") ||
      src.startsWith("/images/blog/") || src.endsWith("/oem-hero.webp") ? "fullscreen"
    : "ordinary";
  const { widths, maxBytes } = groups[group];
  // Include the source extension so similarly named originals cannot collide.
  const base = `${outputRoot}${src.replace(/\./g, "-")}`;
  await mkdir(new URL(`.${path.posix.dirname(base)}/`, publicDir), { recursive: true });

  const variants = new Map<number, number>();
  const requestedWidths = [...new Set(widths.map((width) => Math.min(width, nativeWidth)))];
  for (const width of requestedWidths) {
    const limit = group === "product" && width <= 480 ? 150_000 : maxBytes;
    const { data, info } = await encodeWebp(input, {
      width,
      maxBytes: limit,
      quality: group === "fullscreen" ? 88 : group === "ordinary" ? 80 : 84,
      lossless: group === "brand",
    });
    if (variants.has(info.width)) continue;
    const originalFits = metadata.format === "webp" && !metadata.orientation &&
      info.width === metadata.width && info.height === metadata.height && input.length < data.length;
    const bytes = originalFits ? input : data;
    await writeFile(new URL(`.${base}-${info.width}.webp`, publicDir), bytes);
    variants.set(info.width, bytes.length);
  }

  const sortedWidths = Array.from(variants.keys()).sort((a, b) => a - b);
  const asset: Asset = { base, widths: sortedWidths };
  if (src.startsWith("/images/home/")) {
    const blur = await sharp(input).autoOrient().resize({ width: 8, height: 8, fit: "inside" })
      .webp({ quality: 70 }).toBuffer();
    asset.blur = `data:image/webp;base64,${blur.toString("base64")}`;
  }
  manifest[src] = asset;
  report.push({ src, group, before: input.length, variants: Object.fromEntries(variants) });
}

await writeFile(new URL("../lib/images/site-image-manifest.json", import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
