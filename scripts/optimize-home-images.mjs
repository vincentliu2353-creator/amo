import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const images = [
  ["public/images/home/hero/hero-bg.jpg", "public/images/home/hero/hero-bg.webp", 900 * 1024, 92],
  ["public/images/home/future-objects/clock.jpg", "public/images/home/future-objects/clock.webp", 500 * 1024, 90],
  ["public/images/home/future-objects/lamp.jpg", "public/images/home/future-objects/lamp.webp", 500 * 1024, 90],
  ["public/images/home/future-objects/art-object.jpg", "public/images/home/future-objects/art-object.webp", 500 * 1024, 90],
  ["public/images/home/future-objects/oem-module.jpg", "public/images/home/future-objects/oem-module.webp", 500 * 1024, 90],
  ["public/images/home/future-objects/display-base.jpg", "public/images/home/future-objects/display-base.webp", 500 * 1024, 90],
  [
    "public/images/home/future-objects/brand-installation.jpg",
    "public/images/home/future-objects/brand-installation.webp",
    500 * 1024,
    90,
  ],
  [
    "public/images/home/technology/technology-bg.jpg",
    "public/images/home/technology/technology-bg.webp",
    500 * 1024,
    90,
  ],
  ["public/images/home/applications/retail.jpg", "public/images/home/applications/retail.webp", 500 * 1024, 90],
  ["public/images/home/applications/museum.jpg", "public/images/home/applications/museum.webp", 500 * 1024, 90],
  ["public/images/home/applications/hotel.jpg", "public/images/home/applications/hotel.webp", 500 * 1024, 90],
  ["public/images/home/applications/office.jpg", "public/images/home/applications/office.webp", 500 * 1024, 90],
  [
    "public/images/home/applications/exhibition.jpg",
    "public/images/home/applications/exhibition.webp",
    500 * 1024,
    90,
  ],
  [
    "public/images/home/applications/premium-gifts.jpg",
    "public/images/home/applications/premium-gifts.webp",
    500 * 1024,
    90,
  ],
];

async function encodeToTarget(input, output, maxBytes, initialQuality) {
  await mkdir(path.dirname(output), { recursive: true });

  for (let quality = initialQuality; quality >= 82; quality -= 2) {
    await sharp(input)
      .resize({
        width: 3840,
        height: 2160,
        fit: "cover",
        position: "centre",
        kernel: sharp.kernel.lanczos3,
      })
      .webp({
        quality,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(output);

    const { size } = await stat(output);

    if (size <= maxBytes) {
      return { quality, size };
    }
  }

  throw new Error(`${output} could not be encoded below ${maxBytes} bytes without dropping below quality 82.`);
}

for (const [input, output, maxBytes, initialQuality] of images) {
  const result = await encodeToTarget(input, output, maxBytes, initialQuality);
  console.log(`${output}: ${(result.size / 1024).toFixed(1)}KB at quality ${result.quality}`);
}
