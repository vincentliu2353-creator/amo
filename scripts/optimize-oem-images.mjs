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
const originalsDir = path.join(root, "public/images/oem/originals");
const outputDir = path.join(root, "public/images/oem/optimized");
const maxWidth = 1920;
const quality = 78;
const maxBytes = 900 * 1024;
const sourcePattern = /\.(jpe?g|png)$/i;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function getSourceFiles() {
  const entries = await fs.readdir(originalsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && sourcePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function toWebpName(filename) {
  return filename.replace(sourcePattern, ".webp");
}

function formatKB(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

async function optimizeImage(filename) {
  const inputPath = path.join(originalsDir, filename);
  const outputName = toWebpName(filename);
  const outputPath = path.join(outputDir, outputName);

  await sharp(inputPath)
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const stat = await fs.stat(outputPath);
  const isOversized = stat.size > maxBytes;
  const status = isOversized ? "WARN" : "OK";

  console.log(`${status}: ${outputName} - ${formatKB(stat.size)}`);

  if (isOversized) {
    console.warn(`Warning: ${outputName} exceeds 900KB`);
  }
}

async function main() {
  await ensureDir(outputDir);

  const files = await getSourceFiles();

  if (files.length === 0) {
    throw new Error(`No JPG or PNG files found in ${originalsDir}`);
  }

  for (const file of files) {
    await optimizeImage(file);
  }

  console.log("OEM images optimized.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
