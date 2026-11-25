import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1280;
const H = 720;
const TOTAL_SLIDES = 30;
const PAGE_SIZE = { width: W, height: H };

const COLORS = {
  accent: "#C8A96A",
  bg: "#050505",
  charcoal: "#0B0B0B",
  deep: "#111111",
  footer: "#7E7E7E",
  line: "#2A2A2A",
  paper: "#EEE8DE",
  softLine: "#D6CDC0",
  text: "#F2F2F2",
  textDark: "#161616",
  textMuted: "#9A9A9A",
};

const FONTS = {
  body: "Avenir Next",
  display: "Avenir Next",
};

const ASSETS = {
  qr: "/downloads/amo-whatsapp-qr.png",
  slide02: "/images/blog/heroes/why-luxury-retail-stores-use-floating-product-displays.webp",
  slide03: "/images/cases/before-standard-display.webp",
  slide04: "/images/cases/after-levitation-display.webp",
  slide05: "/images/about/about-ch05-magnetic-field.webp",
  slide06: "/images/blog/heroes/custom-magnetic-levitation-display-manufacturer.webp",
  slide07: "/images/oem/optimized/development-capability.webp",
  slide10: "/images/blog/heroes/floating-display-manufacturer-guide.webp",
  slide11: "/images/cases/space-office.webp",
  slide12: "/images/oem/optimized/oem-hero.webp",
  slide13: "/images/home/future-objects/oem-module.webp",
  slide14: "/images/blog/heroes/floating-display-for-watch-brands.webp",
  slide15Main: "/products/rendered/levitating-clock-hero.png",
  slide16: "/images/blog/heroes/museum-displays-creating-distance-focus-and-curiosity.webp",
  slide17Main: "/products/rendered/floating-display-sculpture-hero.png",
  slide18: "/images/oem/optimized/custom-surface-finish.webp",
  slide19A: "/products/rendered/levitating-clock-hero.png",
  slide19B: "/products/rendered/levitating-lamp-hero.png",
  slide19C: "/images/home/future-objects/display-base.webp",
  slide19D: "/images/home/future-objects/art-object.webp",
  slide19E: "/images/home/future-objects/oem-module.webp",
  slide19F: "/images/home/applications/premium-gifts.webp",
  slide19G: "/images/home/future-objects/brand-installation.webp",
  slide20Main: "/products/rendered/levitating-clock-hero.png",
  slide20DetailA: "/images/home/future-objects/clock.webp",
  slide20DetailB: "/images/cases/space-office.webp",
  slide21Main: "/images/home/future-objects/lamp.webp",
  slide21DetailA: "/products/rendered/levitating-lamp-hero.png",
  slide21DetailB: "/images/home/applications/hotel.webp",
  slide22Main: "/images/home/future-objects/display-base.webp",
  slide22Detail: "/products/rendered/floating-display-sculpture-hero.png",
  slide23: "/images/home/future-objects/art-object.webp",
  slide24Main: "/images/home/future-objects/oem-module.webp",
  slide24DetailA: "/products/rendered/oem-maglev-platform-hero.png",
  slide24DetailB: "/images/oem/optimized/development-capability.webp",
  slide25: "/images/home/applications/premium-gifts.webp",
  slide26: "/images/home/future-objects/brand-installation.webp",
  slide27: "/images/cases/space-retail-store.webp",
  slide28: "/images/cases/space-exhibition.webp",
  slide29: "/images/blog/heroes/oem-magnetic-levitation-products-from-concept-to-production.webp",
};

function px(value) {
  return Math.round(value);
}

function transparentFill(hex, opacity = 1) {
  return {
    type: "solid",
    color: {
      type: "rgb",
      value: hex,
      transform: { opacity },
    },
  };
}

function resolvePublicPath(projectRoot, src) {
  return path.join(projectRoot, "public", src.replace(/^\//, ""));
}

function inferContentType(src) {
  if (src.endsWith(".png")) return "image/png";
  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) return "image/jpeg";
  if (src.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function createImageResolver(projectRoot) {
  const cache = new Map();

  return async function resolveImage(src) {
    if (cache.has(src)) {
      return cache.get(src);
    }

    const filePath = resolvePublicPath(projectRoot, src);
    const sourceBytes = await readFile(filePath);
    const isWebp = src.endsWith(".webp");
    const bytes = isWebp ? await sharp(sourceBytes).png().toBuffer() : sourceBytes;
    const asset = {
      alt: path.basename(src),
      blob: bytes,
      contentType: isWebp ? "image/png" : inferContentType(src),
    };
    cache.set(src, asset);
    return asset;
  };
}

function addText(
  slide,
  {
    align = "left",
    autoFit = "shrinkText",
    bold = false,
    color = COLORS.text,
    fontSize = 18,
    height,
    insets,
    italic = false,
    left,
    text,
    top,
    typeface = FONTS.body,
    verticalAlignment = "top",
    width,
  },
) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: {
      height: px(height),
      left: px(left),
      top: px(top),
      width: px(width),
    },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });

  shape.text = text;
  shape.text.style = {
    alignment: align,
    autoFit,
    bold,
    color,
    fontSize,
    insets: insets ?? { bottom: 0, left: 0, right: 0, top: 0 },
    italic,
    typeface,
    verticalAlignment,
    wrap: "square",
  };

  return shape;
}

function addPanel(
  slide,
  {
    borderColor = "none",
    borderWidth = 0,
    fill = COLORS.deep,
    height,
    left,
    opacity = 1,
    top,
    width,
  },
) {
  return slide.shapes.add({
    geometry: "rect",
    position: {
      height: px(height),
      left: px(left),
      top: px(top),
      width: px(width),
    },
    borderRadius: 0,
    fill: transparentFill(fill, opacity),
    line: {
      style: "solid",
      fill: borderColor,
      width: borderWidth,
    },
  });
}

function addLine(
  slide,
  {
    color = COLORS.line,
    height = 0.1,
    left,
    top,
    weight = 1,
    width,
  },
) {
  return slide.shapes.add({
    geometry: "line",
    position: {
      height,
      left,
      top,
      width,
    },
    fill: "none",
    line: {
      style: "solid",
      fill: color,
      width: weight,
    },
  });
}

function addCircleOutline(
  slide,
  {
    color = COLORS.line,
    left,
    size,
    top,
    weight = 1,
  },
) {
  return slide.shapes.add({
    geometry: "ellipse",
    position: {
      height: size,
      left,
      top,
      width: size,
    },
    fill: "none",
    line: {
      style: "solid",
      fill: color,
      width: weight,
    },
  });
}

function addDot(
  slide,
  {
    fill = COLORS.accent,
    left,
    size = 8,
    top,
  },
) {
  return slide.shapes.add({
    geometry: "ellipse",
    position: {
      height: size,
      left,
      top,
      width: size,
    },
    fill: transparentFill(fill, 1),
    line: {
      style: "solid",
      fill,
      width: 1,
    },
  });
}

async function addImage(
  slide,
  resolveImage,
  {
    alt,
    borderColor,
    borderWidth = 0,
    fit = "cover",
    height,
    left,
    src,
    top,
    width,
  },
) {
  const asset = await resolveImage(src);

  if (borderWidth > 0 && borderColor) {
    addPanel(slide, {
      borderColor,
      borderWidth,
      fill: COLORS.bg,
      height,
      left,
      opacity: 0,
      top,
      width,
    });
  }

  return slide.images.add({
    alt: alt ?? asset.alt,
    blob: asset.blob,
    borderRadius: 0,
    contentType: asset.contentType,
    fit,
    position: {
      height: px(height),
      left: px(left),
      top: px(top),
      width: px(width),
    },
  });
}

async function addBackgroundImage(slide, resolveImage, src, { opacity = 1 } = {}) {
  const asset = await resolveImage(src);
  slide.images.add({
    alt: asset.alt,
    blob: asset.blob,
    contentType: asset.contentType,
    fit: "cover",
    position: { height: H, left: 0, top: 0, width: W },
  });

  if (opacity < 1) {
    addPanel(slide, {
      fill: COLORS.bg,
      height: H,
      left: 0,
      opacity: 1 - opacity,
      top: 0,
      width: W,
    });
  }
}

function addFooter(slide, pageNumber, light = false) {
  const color = light ? "#6A635B" : COLORS.footer;

  addText(slide, {
    bold: true,
    color,
    fontSize: 10,
    height: 18,
    left: 42,
    text: "AMO",
    top: 684,
    width: 80,
  });

  addText(slide, {
    align: "center",
    color,
    fontSize: 9,
    height: 18,
    left: 320,
    text: "Magnetic Levitation Products & OEM Display Systems",
    top: 684,
    width: 640,
  });

  addText(slide, {
    align: "right",
    color,
    fontSize: 10,
    height: 18,
    left: 1104,
    text: `${String(pageNumber).padStart(2, "0")} / ${String(TOTAL_SLIDES).padStart(2, "0")}`,
    top: 684,
    width: 120,
  });
}

async function addLogo(slide, resolveImage, { centered = false, light = false } = {}) {
  const logoSrc = "/amo-logo-white.png";

  if (centered) {
    await addImage(slide, resolveImage, {
      fit: "contain",
      height: 44,
      left: 522,
      src: logoSrc,
      top: 272,
      width: 236,
    });
    return;
  }

  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 18,
    left: 42,
    src: logoSrc,
    top: 30,
    width: 78,
  });

  if (light) {
    addPanel(slide, {
      fill: COLORS.paper,
      height: 20,
      left: 36,
      opacity: 0.08,
      top: 26,
      width: 90,
    });
  }
}

function addSectionLabel(slide, { label, x = 72, y = 104, light = false }) {
  addLine(slide, {
    color: COLORS.accent,
    left: x,
    top: y + 8,
    weight: 1.4,
    width: 42,
  });

  addText(slide, {
    bold: true,
    color: light ? "#9A7035" : COLORS.accent,
    fontSize: 12,
    height: 16,
    left: x + 54,
    text: label.toUpperCase(),
    top: y,
    width: 220,
  });
}

function addHeadlineGroup(
  slide,
  {
    body,
    label,
    light = false,
    subtitle,
    title,
    width = 430,
    x = 72,
    y = 100,
  },
) {
  if (label) {
    addSectionLabel(slide, { label, x, y, light });
  }

  addText(slide, {
    bold: true,
    color: light ? COLORS.textDark : COLORS.text,
    fontSize: title.length > 34 ? 54 : 62,
    height: 140,
    left: x,
    text: title,
    top: y + 26,
    width,
  });

  if (subtitle) {
    addText(slide, {
      color: light ? "#5F5A54" : COLORS.textMuted,
      fontSize: 22,
      height: 76,
      left: x,
      text: subtitle,
      top: y + 148,
      width,
    });
  }

  if (body) {
    addText(slide, {
      color: light ? "#62605C" : COLORS.textMuted,
      fontSize: 18,
      height: 92,
      left: x,
      text: body,
      top: y + 228,
      width,
    });
  }
}

function addTagSet(
  slide,
  {
    cols = 2,
    gapX = 170,
    gapY = 30,
    light = false,
    tags,
    width = 130,
    x,
    y,
  },
) {
  tags.forEach((tag, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const left = x + col * gapX;
    const top = y + row * gapY;
    addLine(slide, {
      color: light ? "#B88C46" : COLORS.accent,
      left,
      top: top + 10,
      weight: 1.1,
      width: 22,
    });
    addText(slide, {
      color: light ? "#6E675E" : "#B9B9B9",
      fontSize: 12,
      height: 18,
      left: left + 34,
      text: tag,
      top,
      width,
    });
  });
}

function addPointList(
  slide,
  {
    color = COLORS.textMuted,
    fontSize = 16,
    items,
    width = 300,
    x,
    y,
  },
) {
  items.forEach((item, index) => {
    addText(slide, {
      color,
      fontSize,
      height: 22,
      left: x,
      text: `${index + 1}. ${item}`,
      top: y + index * 30,
      width,
    });
  });
}

async function applyChrome(
  slide,
  resolveImage,
  {
    backgroundFill = COLORS.bg,
    backgroundImage,
    darkOverlay = 0,
    light = false,
    pageNumber,
    showLogo = true,
  },
) {
  slide.background.fill = backgroundFill;

  if (backgroundImage) {
    await addBackgroundImage(slide, resolveImage, backgroundImage, { opacity: 1 });
  }

  if (darkOverlay > 0) {
    addPanel(slide, {
      fill: light ? COLORS.paper : COLORS.bg,
      height: H,
      left: 0,
      opacity: darkOverlay,
      top: 0,
      width: W,
    });
  }

  if (showLogo) {
    await addLogo(slide, resolveImage, { light });
  }

  addFooter(slide, pageNumber, light);
}

async function buildSlide01(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 1, showLogo: false });
  await addLogo(slide, resolveImage, { centered: true });
  addText(slide, {
    align: "center",
    bold: true,
    color: COLORS.text,
    fontSize: 80,
    height: 84,
    left: 360,
    text: "AMO",
    top: 334,
    width: 560,
  });
  addText(slide, {
    align: "center",
    color: COLORS.textMuted,
    fontSize: 20,
    height: 26,
    left: 280,
    text: "Magnetic Levitation Products & OEM Display Systems",
    top: 420,
    width: 720,
  });
}

async function buildSlide02(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 2 });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 560,
    left: 640,
    src: ASSETS.slide02,
    top: 98,
    width: 560,
  });
  addHeadlineGroup(slide, {
    body: "AMO creates floating product experiences for retail, hospitality, gifting, exhibitions, and custom brand display systems.",
    label: "Opening",
    title: "Magnetic Levitation for Future Spaces",
    width: 470,
    x: 72,
    y: 102,
  });
}

async function buildSlide03(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 3 });
  addHeadlineGroup(slide, {
    body: "Retail shelves, counters, booths, and gift presentations are crowded with static objects.\nPremium products need a stronger visual pause.",
    label: "Problem",
    title: "Most displays are seen.\nFew are remembered.",
    width: 410,
    x: 72,
    y: 108,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 516,
    left: 570,
    src: ASSETS.slide03,
    top: 118,
    width: 610,
  });
}

async function buildSlide04(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide04,
    darkOverlay: 0.54,
    pageNumber: 4,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.2,
    top: 0,
    width: 460,
  });
  addHeadlineGroup(slide, {
    body: "Levitation adds motion, distance, silence, and curiosity.\nIt turns a product from an item into a moment.",
    label: "Shift",
    title: "When an object floats, attention stops.",
    width: 420,
    x: 72,
    y: 110,
  });
}

async function buildSlide05(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide05,
    darkOverlay: 0.74,
    pageNumber: 5,
  });
  addSectionLabel(slide, { label: "Philosophy", x: 72, y: 136 });
  addText(slide, {
    bold: true,
    color: COLORS.text,
    fontSize: 72,
    height: 182,
    left: 72,
    text: "Levitation is not a feature.\nIt is a new way to present value.",
    top: 178,
    width: 788,
  });
  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 20,
    height: 72,
    left: 72,
    text: "AMO transforms ordinary objects into suspended moments through magnetic control, industrial design, and commercial product development.",
    top: 408,
    width: 600,
  });
}

async function buildSlide06(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 6 });
  addHeadlineGroup(slide, {
    body: "AMO was built around one belief:\nfuture product presentation should not stay static.\nIt should move, float, and create curiosity.",
    label: "Story",
    title: "From gravity to brand experience.",
    width: 420,
    x: 72,
    y: 112,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 504,
    left: 616,
    src: ASSETS.slide06,
    top: 118,
    width: 564,
  });
}

async function buildSlide07(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 7 });
  addHeadlineGroup(slide, {
    body: "AMO is a B2B magnetic levitation product and OEM/ODM solution company.\nWe develop floating displays, lamps, art objects, OEM modules, premium gifts, and custom installations for commercial spaces and brand programs.",
    label: "Company",
    title: "AMO Company Profile",
    width: 432,
    x: 72,
    y: 106,
  });
  addText(slide, {
    bold: true,
    color: COLORS.accent,
    fontSize: 18,
    height: 22,
    left: 72,
    text: "Design + Engineering + Manufacturing + Customization",
    top: 400,
    width: 460,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 528,
    left: 600,
    src: ASSETS.slide07,
    top: 106,
    width: 590,
  });
}

async function buildSlide08(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 8 });
  addHeadlineGroup(slide, {
    body: "Business Liaison: Hong Kong\nProduction Base: Shenzhen\nService Scope: Global brands, distributors, design studios, and display partners",
    label: "Structure",
    title: "Designed for global B2B collaboration.",
    width: 430,
    x: 72,
    y: 106,
  });

  addLine(slide, { color: "#2E2E2E", left: 640, top: 344, width: 110, weight: 1.2 });
  addLine(slide, { color: "#2E2E2E", left: 750, top: 344, width: 138, weight: 1.2 });
  addLine(slide, { color: "#2E2E2E", left: 888, top: 344, width: 176, weight: 1.2 });
  addDot(slide, { left: 634, top: 340, size: 8 });
  addDot(slide, { left: 744, top: 340, size: 8 });
  addDot(slide, { left: 882, top: 340, size: 8 });
  addDot(slide, { left: 1060, top: 340, size: 8 });

  addText(slide, {
    bold: true,
    color: COLORS.text,
    fontSize: 22,
    height: 28,
    left: 596,
    text: "Hong Kong",
    top: 276,
    width: 140,
  });
  addText(slide, {
    bold: true,
    color: COLORS.text,
    fontSize: 22,
    height: 28,
    left: 716,
    text: "Shenzhen",
    top: 398,
    width: 140,
  });
  addText(slide, {
    bold: true,
    color: COLORS.text,
    fontSize: 22,
    height: 28,
    left: 986,
    text: "Global Delivery",
    top: 276,
    width: 180,
  });

  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 14,
    height: 40,
    left: 586,
    text: "Business liaison",
    top: 306,
    width: 120,
  });
  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 14,
    height: 40,
    left: 716,
    text: "Production base",
    top: 428,
    width: 120,
  });
  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 14,
    height: 40,
    left: 982,
    text: "Service scope",
    top: 306,
    width: 120,
  });
}

async function buildSlide09(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide29,
    darkOverlay: 0.82,
    pageNumber: 9,
  });
  addHeadlineGroup(slide, {
    label: "Journey",
    title: "A focused journey into floating product systems.",
    width: 440,
    x: 72,
    y: 96,
  });

  addLine(slide, { color: "#2E2E2E", left: 96, top: 420, width: 1090, weight: 1.2 });
  const milestones = [
    ["01", "Technology Exploration", "Magnetic suspension, balance, control, and product feasibility."],
    ["02", "Product Design", "Floating clocks, lamps, display objects, and commercial bases."],
    ["03", "Commercial Applications", "Retail, hospitality, exhibitions, gifting, and collector presentation."],
    ["04", "OEM & ODM Programs", "Custom product development for brands, distributors, and studios."],
    ["05", "Global Delivery", "Export-ready packaging, documentation, and production coordination."],
  ];

  milestones.forEach(([index, title, body], idx) => {
    const x = 110 + idx * 216;
    addDot(slide, { left: x, top: 414, size: 12 });
    addText(slide, {
      bold: true,
      color: COLORS.accent,
      fontSize: 12,
      height: 16,
      left: x - 4,
      text: index,
      top: 364,
      width: 32,
    });
    addText(slide, {
      bold: true,
      color: COLORS.text,
      fontSize: 18,
      height: 22,
      left: x + 18,
      text: title,
      top: 356,
      width: 172,
    });
    addText(slide, {
      color: COLORS.textMuted,
      fontSize: 13,
      height: 54,
      left: x + 18,
      text: body,
      top: 386,
      width: 176,
    });
  });
}

async function buildSlide10(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 10 });
  addHeadlineGroup(slide, {
    body: "AMO helps brands create display experiences that feel engineered, memorable, and commercially useful.",
    label: "Purpose",
    title: "Because premium products deserve more than a surface.",
    width: 420,
    x: 72,
    y: 110,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 470,
    left: 560,
    src: ASSETS.slide10,
    top: 124,
    width: 620,
  });
  [
    ["Create focus", 550, 154, 120],
    ["Increase perceived value", 990, 266, 178],
    ["Support custom product development", 866, 546, 250],
  ].forEach(([label, x, y, width]) => {
    addLine(slide, { color: COLORS.accent, left: x, top: y + 10, width: 28, weight: 1.1 });
    addText(slide, {
      bold: true,
      color: COLORS.text,
      fontSize: 14,
      height: 18,
      left: x + 40,
      text: label,
      top: y,
      width,
    });
  });
}

async function buildSlide11(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide11,
    darkOverlay: 0.5,
    pageNumber: 11,
  });
  addHeadlineGroup(slide, {
    body: "AMO works best when a product, object, or brand moment needs a stronger form of presentation.",
    label: "Audience",
    title: "Built for B2B partners.",
    width: 384,
    x: 72,
    y: 106,
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 320,
    left: 524,
    src: "/images/home/future-objects/brand-installation.webp",
    top: 214,
    width: 232,
  });
  const labels = [
    ["Brands", 454, 176],
    ["Design Studios", 842, 182],
    ["Retail Display Partners", 910, 300],
    ["Event Agencies", 872, 430],
    ["Distributors", 474, 478],
    ["Premium Gift Companies", 324, 338],
  ];
  labels.forEach(([label, x, y]) => {
    addLine(slide, { color: COLORS.accent, left: x, top: y + 10, width: 24, weight: 1.1 });
    addText(slide, {
      bold: true,
      color: COLORS.text,
      fontSize: 14,
      height: 18,
      left: x + 34,
      text: label,
      top: y,
      width: 170,
    });
  });
}

async function buildSlide12(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 12 });
  addHeadlineGroup(slide, {
    label: "Why AMO",
    subtitle: "Visual impact. OEM/ODM flexibility. Magnetic engineering. Prototype development. Production delivery.",
    title: "Design language meets engineering control.",
    width: 420,
    x: 72,
    y: 106,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 520,
    left: 560,
    src: ASSETS.slide12,
    top: 112,
    width: 620,
  });
  [
    ["Visual impact", 532, 162],
    ["OEM / ODM flexibility", 980, 174],
    ["Magnetic engineering", 1008, 304],
    ["Prototype development", 532, 520],
    ["Production delivery", 958, 542],
  ].forEach(([label, x, y]) => {
    addLine(slide, { color: COLORS.accent, left: x, top: y + 10, width: 24, weight: 1.1 });
    addText(slide, {
      bold: true,
      color: COLORS.text,
      fontSize: 14,
      height: 18,
      left: x + 34,
      text: label,
      top: y,
      width: 170,
    });
  });
}

async function buildSlide13(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 13 });
  addHeadlineGroup(slide, {
    body: "AMO develops magnetic field control, mechanical structure, electronics, exterior form, rotation behavior, and commercial reliability as one complete system.",
    label: "Technology",
    title: "The levitation system is the product.",
    width: 390,
    x: 72,
    y: 108,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 490,
    left: 540,
    src: ASSETS.slide13,
    top: 128,
    width: 640,
  });
}

async function buildSlide14(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 14 });
  addHeadlineGroup(slide, {
    body: "Reliable magnetic balance designed for long-duration display use in real commercial environments.",
    label: "Performance",
    title: "Stable Levitation",
    width: 360,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Balance Control", "Low Drift", "Continuous Display"],
    width: 170,
    x: 72,
    y: 420,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 534,
    left: 524,
    src: ASSETS.slide14,
    top: 104,
    width: 656,
  });
}

async function buildSlide15(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 15 });
  addHeadlineGroup(slide, {
    body: "Controlled rotation helps products reveal form, material, and detail without manual interaction.",
    label: "Motion",
    title: "360° / 720° Rotation",
    width: 390,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Retail counters", "Exhibition booths", "Hero product displays"],
    width: 180,
    x: 72,
    y: 428,
  });
  addPanel(slide, {
    borderColor: "#252525",
    borderWidth: 1,
    fill: COLORS.deep,
    height: 520,
    left: 510,
    opacity: 1,
    top: 110,
    width: 670,
  });
  addCircleOutline(slide, { color: "#333333", left: 694, size: 210, top: 194, weight: 1 });
  addCircleOutline(slide, { color: COLORS.accent, left: 664, size: 270, top: 164, weight: 1 });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 330,
    left: 618,
    src: ASSETS.slide15Main,
    top: 194,
    width: 360,
  });
}

async function buildSlide16(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide16,
    darkOverlay: 0.46,
    pageNumber: 16,
  });
  addHeadlineGroup(slide, {
    body: "AMO systems are designed to keep the floating experience visually present without creating distracting mechanical or electrical noise.",
    label: "Atmosphere",
    title: "Quiet technology for premium spaces.",
    width: 430,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 2,
    tags: ["Hotels", "Showrooms", "Offices", "Museums"],
    width: 120,
    x: 72,
    y: 460,
  });
}

async function buildSlide17(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 17 });
  addHeadlineGroup(slide, {
    body: "Load capacity is planned around object weight, center of gravity, material, shell structure, rotation target, and installation environment.",
    label: "Engineering",
    title: "Every object has a different balance.",
    width: 420,
    x: 72,
    y: 106,
  });
  addPanel(slide, {
    borderColor: "#DDD6CA",
    borderWidth: 1,
    fill: COLORS.paper,
    height: 516,
    left: 560,
    opacity: 1,
    top: 112,
    width: 620,
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 350,
    left: 708,
    src: ASSETS.slide17Main,
    top: 180,
    width: 330,
  });
  [
    ["Weight", 640, 182, 70, "#4E4A45"],
    ["Center of gravity", 936, 210, 126, "#4E4A45"],
    ["Shell material", 642, 494, 110, "#4E4A45"],
    ["Base diameter", 926, 470, 108, "#4E4A45"],
    ["Rotation behavior", 826, 558, 118, "#4E4A45"],
  ].forEach(([label, x, y, width, color]) => {
    addLine(slide, { color: COLORS.accent, left: x, top: y + 10, width: 24, weight: 1.1 });
    addText(slide, {
      bold: true,
      color,
      fontSize: 13,
      height: 18,
      left: x + 34,
      text: label,
      top: y,
      width,
    });
  });
}

async function buildSlide18(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 18 });
  addHeadlineGroup(slide, {
    body: "AMO focuses on stability, repeatability, component quality, assembly control, packaging, and long-term display performance.",
    label: "Reliability",
    title: "Built for commercial use.",
    width: 394,
    x: 72,
    y: 108,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Long-duration display use", "Commercial components", "Production consistency", "Quality inspection"],
    width: 210,
    x: 72,
    y: 418,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 522,
    left: 548,
    src: ASSETS.slide18,
    top: 108,
    width: 632,
  });
}

async function buildSlide19(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 19 });
  addHeadlineGroup(slide, {
    body: "Levitating Clocks\nLevitating Lamps\nDisplay Art Objects\nOEM Maglev Modules\nFloating Display Bases\nCustom Brand Installations\nPremium Gifts",
    label: "Range",
    title: "One technology.\nMultiple product directions.",
    width: 380,
    x: 72,
    y: 108,
  });
  const imageFrames = [
    [ASSETS.slide19A, 524, 160, 168, 150],
    [ASSETS.slide19B, 712, 160, 168, 150],
    [ASSETS.slide19C, 900, 160, 248, 150],
    [ASSETS.slide19D, 524, 332, 248, 168],
    [ASSETS.slide19E, 792, 332, 356, 168],
  ];
  for (const [src, x, y, width, height] of imageFrames) {
    await addImage(slide, resolveImage, {
      borderColor: "#202020",
      borderWidth: 1,
      fit: "cover",
      height,
      left: x,
      src,
      top: y,
      width,
    });
  }
  addTagSet(slide, {
    cols: 2,
    gapX: 210,
    gapY: 28,
    tags: [
      "Levitating Clocks",
      "Levitating Lamps",
      "Display Art Objects",
      "OEM Maglev Modules",
      "Floating Display Bases",
      "Custom Brand Installations",
      "Premium Gifts",
    ],
    width: 170,
    x: 524,
    y: 534,
  });
}

async function buildSlide20(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 20 });
  addHeadlineGroup(slide, {
    body: "Time objects redesigned for modern spaces, reception areas, executive desks, and premium gifting.",
    label: "Category",
    title: "Levitating Clocks",
    width: 372,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Desk Statements", "Reception Displays", "Luxury Gifting"],
    width: 160,
    x: 72,
    y: 420,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "contain",
    height: 360,
    left: 520,
    src: ASSETS.slide20Main,
    top: 120,
    width: 378,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 164,
    left: 922,
    src: ASSETS.slide20DetailA,
    top: 118,
    width: 258,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 188,
    left: 828,
    src: ASSETS.slide20DetailB,
    top: 304,
    width: 352,
  });
}

async function buildSlide21(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 21 });
  addHeadlineGroup(slide, {
    body: "Floating light sculptures for premium interiors, hospitality spaces, suites, lounges, and architectural accents.",
    label: "Category",
    title: "Levitating Lamps",
    width: 372,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Ambient Glow", "Hospitality Suites", "Architectural Accent"],
    width: 190,
    x: 72,
    y: 420,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 500,
    left: 500,
    src: ASSETS.slide21Main,
    top: 116,
    width: 420,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "contain",
    height: 220,
    left: 942,
    src: ASSETS.slide21DetailA,
    top: 116,
    width: 238,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 244,
    left: 942,
    src: ASSETS.slide21DetailB,
    top: 372,
    width: 238,
  });
}

async function buildSlide22(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 22 });
  addHeadlineGroup(slide, {
    body: "Magnetic stages for hero products, limited editions, retail counters, museum-style presentation, and collector objects.",
    label: "Category",
    title: "Floating Display Bases",
    width: 390,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Hero Product", "Retail Counter", "Collector Edition"],
    width: 160,
    x: 72,
    y: 426,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 514,
    left: 506,
    src: ASSETS.slide22Main,
    top: 112,
    width: 674,
  });
}

async function buildSlide23(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide23,
    darkOverlay: 0.34,
    pageNumber: 23,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.22,
    top: 0,
    width: 490,
  });
  addHeadlineGroup(slide, {
    body: "Suspended sculptural objects for brand storytelling, launch installations, window displays, and curated interiors.",
    label: "Category",
    title: "Display Art Objects",
    width: 400,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Brand Storytelling", "Launch Installation", "Window Display"],
    width: 188,
    x: 72,
    y: 428,
  });
}

async function buildSlide24(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 24 });
  addHeadlineGroup(slide, {
    body: "Custom levitation platforms, electronics, magnetic systems, and module integration for private-label and product development programs.",
    label: "Category",
    title: "OEM Maglev Modules",
    width: 386,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Controller Integration", "Load Tuning", "Private Label"],
    width: 172,
    x: 72,
    y: 426,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 356,
    left: 498,
    src: ASSETS.slide24Main,
    top: 118,
    width: 682,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "contain",
    height: 140,
    left: 498,
    src: ASSETS.slide24DetailA,
    top: 492,
    width: 286,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 140,
    left: 802,
    src: ASSETS.slide24DetailB,
    top: 492,
    width: 378,
  });
}

async function buildSlide25(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 25 });
  addHeadlineGroup(slide, {
    body: "Floating branded objects for VIP gifts, commemorative launches, executive programs, and collector editions.",
    label: "Category",
    title: "Premium Gifts",
    width: 370,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["VIP Gifts", "Brand Milestones", "Collector Editions"],
    width: 170,
    x: 72,
    y: 426,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 520,
    left: 520,
    src: ASSETS.slide25,
    top: 108,
    width: 660,
  });
}

async function buildSlide26(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 26 });
  addHeadlineGroup(slide, {
    body: "Statement levitation pieces for hospitality lobbies, event spaces, flagship stores, and branded spatial design.",
    label: "Category",
    title: "Custom Floating Installations",
    width: 390,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 1,
    tags: ["Lobby Centerpieces", "Event Activations", "Signature Commissions"],
    width: 180,
    x: 72,
    y: 426,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#202020",
    borderWidth: 1,
    fit: "cover",
    height: 520,
    left: 500,
    src: ASSETS.slide26,
    top: 108,
    width: 680,
  });
}

async function buildSlide27(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide27,
    darkOverlay: 0.4,
    pageNumber: 27,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.18,
    top: 0,
    width: 480,
  });
  addHeadlineGroup(slide, {
    body: "Floating presentation creates a premium pause point for hero products, limited releases, elevated counters, and flagship windows.",
    label: "Application",
    title: "Retail Stores",
    width: 380,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 2,
    gapX: 150,
    tags: ["Watches", "Jewelry", "Fragrance", "Beauty", "Limited editions"],
    width: 120,
    x: 72,
    y: 456,
  });
}

async function buildSlide28(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide28,
    darkOverlay: 0.42,
    pageNumber: 28,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.22,
    top: 0,
    width: 492,
  });
  addHeadlineGroup(slide, {
    body: "In crowded event environments, motion and suspension help a product become easier to notice, photograph, and remember.",
    label: "Application",
    title: "Exhibitions & Brand Activations",
    width: 408,
    x: 72,
    y: 110,
  });
  addTagSet(slide, {
    cols: 2,
    gapX: 154,
    tags: ["Trade shows", "Pop-ups", "Launch events", "Demo zones"],
    width: 120,
    x: 72,
    y: 458,
  });
}

async function buildSlide29(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: ASSETS.slide29,
    darkOverlay: 0.86,
    pageNumber: 29,
  });
  addHeadlineGroup(slide, {
    body: "AMO helps global brands, distributors, and design studios move from concept to commercial-ready floating product.",
    label: "Partnership",
    title: "From idea to floating product.",
    width: 420,
    x: 72,
    y: 104,
  });
  addLine(slide, { color: "#2E2E2E", left: 128, top: 498, width: 1040, weight: 1.2 });
  const steps = ["Brief", "Concept Design", "Engineering", "Prototype", "Sampling", "Mass Production", "Global Delivery"];
  steps.forEach((step, index) => {
    const x = 128 + index * 172;
    addDot(slide, { left: x, top: 492, size: 12 });
    addText(slide, {
      align: "center",
      bold: true,
      color: COLORS.text,
      fontSize: 14,
      height: 18,
      left: x - 48,
      text: step,
      top: 454,
      width: 110,
    });
  });
}

async function buildSlide30(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 30 });
  addSectionLabel(slide, { label: "Contact", x: 72, y: 104 });
  addText(slide, {
    bold: true,
    color: COLORS.text,
    fontSize: 54,
    height: 168,
    left: 72,
    text: "Start your floating display project.",
    top: 130,
    width: 430,
  });
  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 17,
    height: 42,
    left: 72,
    text: "Customization + RFQ checklist for a focused project start.",
    top: 316,
    width: 420,
  });

  addText(slide, {
    bold: true,
    color: COLORS.accent,
    fontSize: 12,
    height: 16,
    left: 72,
    text: "CUSTOMIZATION",
    top: 362,
    width: 160,
  });
  addTagSet(slide, {
    cols: 3,
    gapX: 136,
    gapY: 30,
    tags: ["Product shape", "Magnetic base", "Surface finish", "Lighting", "Logo", "Packaging", "OEM module"],
    width: 92,
    x: 72,
    y: 384,
  });

  addText(slide, {
    bold: true,
    color: COLORS.accent,
    fontSize: 12,
    height: 16,
    left: 72,
    text: "RFQ CHECKLIST",
    top: 470,
    width: 160,
  });
  ["Object type", "Quantity target", "Application scenario", "Customization needs", "Timeline", "Target market", "Reference images"].forEach(
    (item, index) => {
      addText(slide, {
        color: COLORS.textMuted,
        fontSize: 15,
        height: 20,
        left: 72,
        text: `${index + 1}. ${item}`,
        top: 494 + index * 27,
        width: 290,
      });
    },
  );

  addPanel(slide, {
    borderColor: "#222222",
    borderWidth: 1,
    fill: COLORS.deep,
    height: 560,
    left: 670,
    opacity: 1,
    top: 88,
    width: 540,
  });
  const contacts = [
    ["Website", "amolevitation.com"],
    ["RFQ", "amolevitation.com/rfq"],
    ["Email", "hello@amolevitation.com"],
    ["WhatsApp / Phone", "+852 6942 9864"],
  ];
  contacts.forEach(([label, value], index) => {
    const y = 128 + index * 74;
    addText(slide, {
      bold: true,
      color: "#B9B9B9",
      fontSize: 12,
      height: 16,
      left: 706,
      text: label,
      top: y,
      width: 170,
    });
    addText(slide, {
      color: COLORS.text,
      fontSize: 17,
      height: 22,
      left: 706,
      text: value,
      top: y + 22,
      width: 260,
    });
  });
  addText(slide, {
    bold: true,
    color: "#B9B9B9",
    fontSize: 12,
    height: 16,
    left: 706,
    text: "Business Liaison",
    top: 432,
    width: 160,
  });
  addText(slide, {
    color: COLORS.textMuted,
    fontSize: 15,
    height: 120,
    left: 706,
    text: "Unit No. 1201, 12th Floor, Metropolis Tower,\n10 Metropolis Drive,\nHunghom, Kowloon,\nHong Kong",
    top: 456,
    width: 230,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#D8D8D8",
    borderWidth: 1,
    fit: "contain",
    height: 202,
    left: 986,
    src: ASSETS.qr,
    top: 360,
    width: 180,
  });
}

const BUILDERS = [
  buildSlide01,
  buildSlide02,
  buildSlide03,
  buildSlide04,
  buildSlide05,
  buildSlide06,
  buildSlide07,
  buildSlide08,
  buildSlide09,
  buildSlide10,
  buildSlide11,
  buildSlide12,
  buildSlide13,
  buildSlide14,
  buildSlide15,
  buildSlide16,
  buildSlide17,
  buildSlide18,
  buildSlide19,
  buildSlide20,
  buildSlide21,
  buildSlide22,
  buildSlide23,
  buildSlide24,
  buildSlide25,
  buildSlide26,
  buildSlide27,
  buildSlide28,
  buildSlide29,
  buildSlide30,
];

export async function createCompanyDeckPresentation({ Presentation, projectRoot }) {
  const resolveImage = createImageResolver(projectRoot);
  const presentation = Presentation.create({ slideSize: PAGE_SIZE });

  for (const builder of BUILDERS) {
    const slide = presentation.slides.add();
    await builder(slide, resolveImage);
  }

  return presentation;
}

export { PAGE_SIZE, TOTAL_SLIDES };
