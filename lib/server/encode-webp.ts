import sharp from "sharp";

export async function encodeWebp(
  input: Buffer,
  { width, maxBytes, quality = 84, lossless = false }: {
    width: number;
    maxBytes: number;
    quality?: number;
    lossless?: boolean;
  },
) {
  // Prefer lowering quality over dimensions. For unusually dense images,
  // reduce both dimensions proportionally until the hard limit is met.
  for (let maxWidth = width; maxWidth >= 1; maxWidth = Math.floor(maxWidth * 0.8)) {
    const image = sharp(input, { animated: true })
      .autoOrient()
      .resize({ width: maxWidth, height: width * 2, fit: "inside", withoutEnlargement: true });

    if (lossless) {
      const result = await image.clone().webp({ lossless: true }).toBuffer({ resolveWithObject: true });
      if (result.data.length <= maxBytes) return result;
      continue;
    }

    for (const candidate of [quality, Math.min(quality, 72), 60, 48]) {
      const result = await image.clone().webp({ quality: candidate, effort: 5 }).toBuffer({ resolveWithObject: true });
      if (result.data.length <= maxBytes) return result;
    }
  }

  throw new Error(`Could not encode a WebP under ${maxBytes} bytes.`);
}
