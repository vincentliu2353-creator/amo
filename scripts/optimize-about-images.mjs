import fs from "fs/promises";
import path from "path";

import sharp from "sharp";

const root = process.cwd();

const inputDir = path.join(root, "public/images/about/original");
const outputDir = path.join(root, "public/images/about");

const images = [
  {
    input: "about-ch04-metal-surface.jpg",
    output: "about-ch04-metal-surface.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch04-precision-edge.jpg",
    output: "about-ch04-precision-edge.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch04-magnetic-pattern.jpg",
    output: "about-ch04-magnetic-pattern.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch04-light-reflection.jpg",
    output: "about-ch04-light-reflection.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch05-magnetic-field.jpg",
    output: "about-ch05-magnetic-field.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch05-levitation-ring.jpg",
    output: "about-ch05-levitation-ring.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch05-motion-path.jpg",
    output: "about-ch05-motion-path.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch05-balance-system.jpg",
    output: "about-ch05-balance-system.webp",
    width: 1200,
    quality: 75,
  },
  {
    input: "about-ch07-museum.jpg",
    output: "about-ch07-museum.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "about-ch07-architecture.jpg",
    output: "about-ch07-architecture.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "about-ch07-retail.jpg",
    output: "about-ch07-retail.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "about-ch07-hospitality.jpg",
    output: "about-ch07-hospitality.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "about-ch07-future-workspace.jpg",
    output: "about-ch07-future-workspace.webp",
    width: 1920,
    quality: 80,
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(image) {
  const inputPath = path.join(inputDir, image.input);
  const outputPath = path.join(outputDir, image.output);

  const exists = await fileExists(inputPath);

  if (!exists) {
    console.warn(`Skipped: ${image.input} not found in ${inputDir}`);
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
    })
    .toFile(outputPath);

  const stat = await fs.stat(outputPath);
  const sizeKB = Math.round(stat.size / 1024);

  console.log(`Optimized: ${image.output} - ${sizeKB}KB`);
}

async function main() {
  await ensureDir(outputDir);

  for (const image of images) {
    await optimizeImage(image);
  }

  console.log("About images optimized.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
