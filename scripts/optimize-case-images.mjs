import fs from "fs/promises";
import path from "path";

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    return (await import(new URL("../node_modules/.pnpm/node_modules/sharp/lib/index.js", import.meta.url))).default;
  }
}

const sharp = await loadSharp();
const root = process.cwd();
const imageDir = path.join(root, "public/images/cases");

const images = [
  {
    input: "featured-case-retail.jpg",
    maxKB: 350,
    output: "featured-case-retail.webp",
    quality: 92,
    width: 1254,
  },
  {
    input: "application-retail.jpg",
    maxKB: 450,
    output: "application-retail.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "application-museum.jpg",
    maxKB: 450,
    output: "application-museum.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "application-hotel.jpg",
    maxKB: 450,
    output: "application-hotel.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "application-office.jpg",
    maxKB: 450,
    output: "application-office.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "application-exhibition.jpg",
    maxKB: 450,
    output: "application-exhibition.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "application-gifts.jpg",
    maxKB: 450,
    output: "application-gifts.webp",
    quality: 88,
    width: 1400,
  },
  {
    input: "before-standard-display.jpg",
    maxKB: 350,
    output: "before-standard-display.webp",
    quality: 92,
    width: 1254,
  },
  {
    input: "after-levitation-display.jpg",
    maxKB: 350,
    output: "after-levitation-display.webp",
    quality: 92,
    width: 1254,
  },
  {
    input: "space-retail-store.jpg",
    maxKB: 700,
    output: "space-retail-store.webp",
    quality: 90,
    width: 1672,
  },
  {
    input: "space-museum.jpg",
    maxKB: 700,
    output: "space-museum.webp",
    quality: 90,
    width: 1672,
  },
  {
    input: "space-hotel.jpg",
    maxKB: 700,
    output: "space-hotel.webp",
    quality: 90,
    width: 1672,
  },
  {
    input: "space-office.jpg",
    maxKB: 700,
    output: "space-office.webp",
    quality: 90,
    width: 1672,
  },
  {
    input: "space-exhibition.jpg",
    maxKB: 700,
    output: "space-exhibition.webp",
    quality: 90,
    width: 1672,
  },
  {
    input: "space-premium-gifts.jpg",
    maxKB: 700,
    output: "space-premium-gifts.webp",
    quality: 90,
    width: 1672,
  },
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(image) {
  const inputPath = path.join(imageDir, image.input);
  const outputPath = path.join(imageDir, image.output);

  if (!(await fileExists(inputPath))) {
    console.warn(`Skipped: ${image.input} not found in ${imageDir}`);
    return;
  }

  await sharp(inputPath)
    .resize({
      width: image.width,
      withoutEnlargement: true,
    })
    .webp({
      quality: image.quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const stat = await fs.stat(outputPath);
  const sizeKB = Math.round(stat.size / 1024);
  const status = sizeKB <= image.maxKB ? "OK" : "OVER";

  console.log(`${status}: ${image.output} - ${sizeKB}KB (target <= ${image.maxKB}KB)`);
}

for (const image of images) {
  await optimizeImage(image);
}

console.log("Cases images optimized.");
