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
  charcoal: "#111111",
  line: "#222222",
  muted: "#8A8A8A",
  paper: "#E9E4DC",
  white: "#EDEDED",
};

const FONTS = {
  body: "Avenir Next",
  display: "Avenir Next",
};

const BODY_TEXT =
  "AMO helps brands, distributors, and design studios turn ordinary product presentation into floating visual experiences through OEM and ODM magnetic levitation development.";

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
  if (src.endsWith(".png")) {
    return "image/png";
  }

  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (src.endsWith(".webp")) {
    return "image/webp";
  }

  return "application/octet-stream";
}

async function loadAssetMap(projectRoot) {
  const filePath = path.join(projectRoot, "data", "company-deck-asset-map.json");
  return JSON.parse(await readFile(filePath, "utf8"));
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

function addShape(slide, config) {
  return slide.shapes.add(config);
}

function addText(slide, {
  align = "left",
  autoFit = "shrinkText",
  bold = false,
  color = COLORS.white,
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
}) {
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

function addPanel(slide, {
  borderColor = "none",
  borderWidth = 0,
  fill = COLORS.charcoal,
  height,
  left,
  opacity = 1,
  shadow,
  top,
  width,
}) {
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
    shadow,
  });
}

function addLine(slide, {
  color = COLORS.line,
  left,
  top,
  width,
  height = 0.1,
  weight = 1,
}) {
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

function addDot(slide, {
  fill = COLORS.accent,
  left,
  lineColor = COLORS.accent,
  lineWidth = 1,
  size = 8,
  top,
}) {
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
      fill: lineColor,
      width: lineWidth,
    },
  });
}

async function addImage(slide, resolveImage, {
  alt,
  borderColor,
  borderWidth = 0,
  fit = "cover",
  height,
  left,
  src,
  top,
  width,
}) {
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

function addChip(slide, {
  accent = false,
  left,
  text,
  top,
  width,
}) {
  const height = 28;
  const fill = accent ? transparentFill(COLORS.accent, 0.12) : transparentFill("#FFFFFF", 0.05);
  const line = accent ? COLORS.accent : "#2E2E2E";
  const textColor = accent ? "#DCC08A" : "#B8B8B8";

  slide.shapes.add({
    geometry: "rect",
    position: { height, left, top, width },
    borderRadius: 0,
    fill,
    line: { style: "solid", fill: line, width: 1 },
  });

  addText(slide, {
    align: "center",
    bold: true,
    color: textColor,
    fontSize: 10,
    height,
    left,
    text,
    top: top + 6,
    width,
  });
}

function addFooter(slide, pageNumber, light = false) {
  const color = light ? "#3A3A3A" : "#7D7D7D";

  addText(slide, {
    color,
    fontSize: 10,
    height: 20,
    left: 42,
    text: `${String(pageNumber).padStart(2, "0")} / ${String(TOTAL_SLIDES).padStart(2, "0")}`,
    top: 684,
    width: 140,
  });

  addText(slide, {
    align: "right",
    color,
    fontSize: 10,
    height: 20,
    left: 1010,
    text: "AMOLEVITATION.COM",
    top: 684,
    width: 228,
  });
}

async function addLogo(slide, resolveImage, { light = false, centered = false } = {}) {
  if (centered) {
    await addImage(slide, resolveImage, {
      fit: "contain",
      height: 36,
      left: 540,
      src: "/amo-logo-white.png",
      top: 292,
      width: 200,
    });
    return;
  }

  const y = 28;
  const x = 42;
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 18,
    left: x,
    src: "/amo-logo-white.png",
    top: y,
    width: 74,
  });

  addText(slide, {
    color: light ? "#8E7345" : "#8E7345",
    fontSize: 9,
    height: 20,
    left: 126,
    text: "AMO COMPANY PROFILE DECK",
    top: 30,
    width: 190,
  });
}

async function applyChrome(slide, resolveImage, options) {
  const {
    backgroundFill = COLORS.bg,
    backgroundImage,
    darkOverlay = 0,
    light = false,
    pageNumber,
    showLogo = true,
  } = options;

  slide.background.fill = backgroundFill;

  if (backgroundImage) {
    await addBackgroundImage(slide, resolveImage, backgroundImage, { opacity: 1 });
  }

  if (darkOverlay > 0) {
    addPanel(slide, {
      fill: COLORS.bg,
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

function addTitleBlock(slide, {
  eyebrow,
  body,
  title,
  subtitle,
  x = 56,
  y = 84,
  w = 440,
  light = false,
}) {
  const titleColor = light ? "#111111" : COLORS.white;
  const subtitleColor = light ? "#4F4F4F" : "#B9B9B9";
  const bodyColor = light ? "#5E5E5E" : "#9E9E9E";
  const eyebrowColor = light ? "#9B7A3B" : "#D0AB66";

  if (eyebrow) {
    addLine(slide, {
      color: light ? "#B68D45" : COLORS.accent,
      left: x,
      top: y + 8,
      weight: 1.5,
      width: 40,
    });
    addText(slide, {
      bold: true,
      color: eyebrowColor,
      fontSize: 10,
      height: 16,
      left: x + 52,
      text: eyebrow.toUpperCase(),
      top: y,
      width: 220,
    });
  }

  addText(slide, {
    bold: true,
    color: titleColor,
    fontSize: title.length > 28 ? 46 : 52,
    height: 120,
    left: x,
    text: title,
    top: y + 26,
    width: w,
  });

  if (subtitle) {
    addText(slide, {
      color: subtitleColor,
      fontSize: 20,
      height: 70,
      left: x,
      text: subtitle,
      top: y + 132,
      width: w,
    });
  }

  if (body) {
    addText(slide, {
      color: bodyColor,
      fontSize: 17,
      height: 90,
      left: x,
      text: body,
      top: y + 204,
      width: w,
    });
  }
}

function addLabelBlock(slide, {
  body,
  number,
  title,
  x,
  y,
  w,
  h = 84,
}) {
  addPanel(slide, {
    borderColor: "#222222",
    borderWidth: 1,
    fill: COLORS.charcoal,
    height: h,
    left: x,
    opacity: 0.78,
    top: y,
    width: w,
  });
  addLine(slide, {
    color: COLORS.accent,
    left: x + 16,
    top: y + 12,
    weight: 1.2,
    width: 28,
  });

  if (number) {
    addText(slide, {
      bold: true,
      color: "#727272",
      fontSize: 10,
      height: 16,
      left: x + 16,
      text: number,
      top: y + 14,
      width: 40,
    });
  }

  addText(slide, {
    bold: true,
    color: COLORS.white,
    fontSize: 15,
    height: 22,
    left: x + 16,
    text: title,
    top: y + (number ? 30 : 24),
    width: w - 32,
  });

  if (body) {
    addText(slide, {
      color: "#9E9E9E",
      fontSize: 12,
      height: h - 44,
      left: x + 16,
      text: body,
      top: y + (number ? 50 : 44),
      width: w - 32,
    });
  }
}

async function buildSlide01(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 1, showLogo: false });
  await addLogo(slide, resolveImage, { centered: true });
  addText(slide, {
    align: "center",
    color: "#8B8B8B",
    fontSize: 14,
    height: 22,
    left: 450,
    text: "Magnetic Levitation",
    top: 348,
    width: 380,
  });
}

async function buildSlide02(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 2 });
  addTitleBlock(slide, {
    body: "AMO creates magnetic levitation products that turn ordinary objects into spatial focal points.",
    eyebrow: "Opening",
    subtitle: "Custom floating display systems for premium retail, hospitality, gifting, exhibitions, and OEM product development.",
    title: "Magnetic Levitation for Future Spaces",
    w: 456,
    x: 58,
    y: 82,
  });
  addChip(slide, { left: 58, text: "Retail", top: 322, width: 72 });
  addChip(slide, { left: 138, text: "Hospitality", top: 322, width: 98 });
  addChip(slide, { left: 244, text: "Premium Gifts", top: 322, width: 110 });
  addChip(slide, { left: 362, text: "Exhibitions", top: 322, width: 92 });
  addChip(slide, { left: 462, text: "OEM Development", top: 322, width: 132 });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 20,
    borderWidth: 1,
    fit: "cover",
    height: 530,
    left: 676,
    src: assetMap.page02.hero,
    top: 96,
    width: 488,
  });
  addPanel(slide, {
    borderColor: "#1E1E1E",
    borderWidth: 1,
    fill: COLORS.bg,
    height: 530,
    left: 1178,
    opacity: 1,
    top: 96,
    width: 38,
  });
  addLine(slide, { color: "#2E2E2E", left: 1188, top: 146, width: 18 });
  addLine(slide, { color: "#585858", left: 1188, top: 576, width: 18 });
}

async function buildSlide03(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 3 });
  addTitleBlock(slide, {
    body: "Shelves, counters, and standard stands show the object, but they rarely create a moment. In crowded retail, exhibitions, and launch environments, attention disappears quickly.",
    eyebrow: "Problem Insight",
    subtitle: "Premium products are often presented in the same way as ordinary products.",
    title: "The Problem with Static Display",
    w: 340,
    x: 58,
    y: 82,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 386,
    left: 456,
    src: "/images/cases/before-standard-display.webp",
    top: 94,
    width: 760,
  });
  addLabelBlock(slide, {
    body: "Standard shelf, standard counter, standard sightline.",
    title: "Typical Scene",
    w: 360,
    x: 456,
    y: 514,
  });
  addLabelBlock(slide, {
    body: "The object is present, but the brand moment never happens.",
    title: "Result",
    w: 360,
    x: 856,
    y: 514,
  });
}

async function buildSlide04(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/home/future-objects/display-base.webp",
    darkOverlay: 0.42,
    pageNumber: 4,
  });
  addTitleBlock(slide, {
    body: "When an object floats, people stop. The display becomes less like a stand and more like a controlled brand moment.",
    eyebrow: "Attention",
    subtitle: "Levitation adds movement, silence, distance, and focus.",
    title: "A New Way to Hold Attention",
    w: 432,
    x: 58,
    y: 88,
  });
  addLabelBlock(slide, {
    body: "One object. One field of focus. Less noise around it.",
    title: "Visual Effect",
    w: 208,
    x: 58,
    y: 560,
  });
  addLabelBlock(slide, {
    body: "The presentation becomes part of the value perception.",
    title: "Brand Impact",
    w: 228,
    x: 988,
    y: 560,
  });
}

async function buildSlide05(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/about/about-ch05-magnetic-field.webp",
    darkOverlay: 0.72,
    pageNumber: 5,
  });
  addLine(slide, {
    color: COLORS.accent,
    left: 58,
    top: 150,
    weight: 1.5,
    width: 44,
  });
  addText(slide, {
    bold: true,
    color: COLORS.white,
    fontSize: 58,
    height: 160,
    left: 58,
    text: "Levitation is not a feature.\nIt is a new way to present value.",
    top: 170,
    width: 620,
  });
  addText(slide, {
    color: "#A0A0A0",
    fontSize: 18,
    height: 60,
    left: 58,
    text: "AMO uses magnetic levitation as a design language for future retail, premium gifting, and spatial brand experiences.",
    top: 340,
    width: 470,
  });
}

async function buildSlide06(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 6 });
  addTitleBlock(slide, {
    body: "We design and manufacture floating display products, levitating lamps, magnetic display bases, OEM modules, premium gifts, and custom levitation systems for commercial environments.",
    eyebrow: "Company Profile",
    title: "AMO is a B2B magnetic levitation product and OEM / ODM solution company.",
    w: 386,
    x: 58,
    y: 82,
  });
  addLabelBlock(slide, {
    body: "Manufacturer-direct support for buyers, studios, distributors, and commercial project teams.",
    title: "Business Role",
    w: 332,
    x: 58,
    y: 492,
  });
  addLabelBlock(slide, {
    body: "Presentation logic, engineering stability, and delivery readiness are developed together.",
    title: "Project Lens",
    w: 332,
    x: 58,
    y: 592,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 392,
    left: 520,
    src: assetMap.page06.main,
    top: 96,
    width: 690,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 16,
    borderWidth: 1,
    fit: "cover",
    height: 162,
    left: 520,
    src: assetMap.page06.detailA,
    top: 522,
    width: 334,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 16,
    borderWidth: 1,
    fit: "cover",
    height: 162,
    left: 876,
    src: assetMap.page06.detailB,
    top: 522,
    width: 334,
  });
}

async function buildSlide07(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 7 });
  addTitleBlock(slide, {
    body: "AMO supports global brands, distributors, design studios, retail display partners, and project-based buyers with design, engineering, sampling, production, and delivery coordination.",
    eyebrow: "Business Structure",
    subtitle: "Business liaison in Hong Kong. Production capability in Shenzhen. Service for international B2B projects.",
    title: "Global Business Structure",
    w: 520,
    x: 58,
    y: 82,
  });
  addLine(slide, { color: "#1A1A1A", left: 214, top: 446, width: 794 });
  addLine(slide, { color: "#252525", left: 184, top: 504, width: 854 });
  addLine(slide, { color: "#1A1A1A", left: 244, top: 562, width: 734 });

  const nodes = [
    {
      body: "Commercial contact, international communication, and project coordination.",
      title: "Hong Kong",
      x: 304,
      y: 504,
    },
    {
      body: "Engineering follow-through, production planning, assembly control, and manufacturing execution.",
      title: "Shenzhen",
      x: 612,
      y: 504,
    },
    {
      body: "Sampling, packaging, export coordination, and delivery support for international programs.",
      title: "Global Delivery",
      x: 918,
      y: 504,
    },
  ];

  nodes.forEach(({ title, body, x, y }) => {
    addDot(slide, { left: x - 5, size: 10, top: y - 5 });
    addLine(slide, { color: "#373737", left: x, top: y - 70, width: 0.1, height: 54, weight: 1 });
    addText(slide, {
      align: "center",
      bold: true,
      color: COLORS.white,
      fontSize: 20,
      height: 26,
      left: x - 110,
      text: title,
      top: y - 126,
      width: 220,
    });
    addText(slide, {
      align: "center",
      color: "#969696",
      fontSize: 13,
      height: 56,
      left: x - 128,
      text: body,
      top: y - 92,
      width: 256,
    });
  });
}

async function buildSlide08(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 8 });
  addTitleBlock(slide, {
    body: "AMO supports three levels of cooperation for buyers with different timing, complexity, and customization depth.",
    eyebrow: "Cooperation Model",
    subtitle: "Finished Products. OEM Development. ODM Collaboration.",
    title: "Business Model",
    w: 540,
    x: 58,
    y: 82,
  });
  const columns = [
    {
      body: "Finished magnetic levitation products ready for distributors and commercial buyers who want a premium category already resolved.",
      image: "/images/home/future-objects/clock.webp",
      title: "Finished Products",
    },
    {
      body: "OEM customization based on existing AMO product platforms, tuned around branding, packaging, finish, lighting, and use case.",
      image: "/images/oem/optimized/custom-branding.webp",
      title: "OEM Development",
    },
    {
      body: "ODM collaboration for new floating concepts that need product definition, engineering logic, prototype validation, and manufacturing planning.",
      image: "/images/home/future-objects/oem-module.webp",
      title: "ODM Collaboration",
    },
  ];

  for (const [index, item] of columns.entries()) {
    const x = 58 + index * 388;
    addPanel(slide, {
      borderColor: COLORS.line,
      borderRadius: 18,
      borderWidth: 1,
      fill: COLORS.charcoal,
      height: 410,
      left: x,
      opacity: 1,
      top: 264,
      width: 356,
    });
    addText(slide, {
      bold: true,
      color: COLORS.white,
      fontSize: 24,
      height: 40,
      left: x + 22,
      text: item.title,
      top: 288,
      width: 312,
    });
    addText(slide, {
      color: "#A0A0A0",
      fontSize: 15,
      height: 108,
      left: x + 22,
      text: item.body,
      top: 336,
      width: 312,
    });
    await addImage(slide, resolveImage, {
      borderRadius: 14,
      fit: "cover",
      height: 186,
      left: x + 22,
      src: item.image,
      top: 456,
      width: 312,
    });
  }
}

async function buildSlide09(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: assetMap.page09.background,
    darkOverlay: 0.34,
    pageNumber: 9,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.56,
    top: 0,
    width: 560,
  });
  addTitleBlock(slide, {
    body: "Built for partners who need premium product presentation.",
    eyebrow: "Audience",
    title: "Who We Serve",
    w: 358,
    x: 58,
    y: 96,
  });
  addText(slide, {
    color: "#9D9D9D",
    fontSize: 16,
    height: 80,
    left: 58,
    text: "Buyers come to AMO when the object needs to feel more visible, more valuable, and more intentional inside a space.",
    top: 278,
    width: 332,
  });
  const audiences = [
    "Brands",
    "Design Studios",
    "Retail Display Partners",
    "Event & Exhibition Agencies",
    "Premium Gift Companies",
    "Distributors",
  ];
  audiences.forEach((item, index) => {
    const y = 132 + index * 72;
    addText(slide, {
      color: COLORS.white,
      fontSize: 28,
      height: 34,
      left: 752,
      text: item,
      top: y,
      width: 378,
    });
    addLine(slide, { color: "#3A3A3A", left: 752, top: y + 42, width: 396 });
  });
}

async function buildSlide10(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 10 });
  addTitleBlock(slide, {
    eyebrow: "Trust Signal",
    subtitle: "Design presence, engineering stability, and commercial readiness.",
    title: "Why Clients Choose AMO",
    w: 334,
    x: 58,
    y: 82,
  });
  addPanel(slide, {
    borderColor: COLORS.line,
    borderRadius: 22,
    borderWidth: 1,
    fill: COLORS.charcoal,
    height: 510,
    left: 458,
    opacity: 1,
    top: 110,
    width: 764,
  });
  await addImage(slide, resolveImage, {
    borderRadius: 20,
    fit: "cover",
    height: 420,
    left: 592,
    src: assetMap.page10.main,
    top: 150,
    width: 430,
  });
  const keywords = [
    { text: "Design-led Presentation", x: 486, y: 156, w: 188 },
    { text: "Stable Magnetic Architecture", x: 1028, y: 156, w: 170 },
    { text: "OEM / ODM Customization", x: 486, y: 574, w: 170 },
    { text: "Prototype & Sampling Support", x: 670, y: 574, w: 184 },
    { text: "Production & Delivery Coordination", x: 868, y: 574, w: 238 },
  ];
  keywords.forEach((item, index) => {
    addText(slide, {
      color: index < 2 ? COLORS.white : "#C9C9C9",
      fontSize: 13,
      height: 28,
      left: item.x,
      text: item.text,
      top: item.y,
      width: item.w,
    });
  });
  addLine(slide, { color: "#3C3C3C", left: 676, top: 170, width: 86 });
  addLine(slide, { color: "#3C3C3C", left: 942, top: 170, width: 70 });
  addLine(slide, { color: "#3C3C3C", left: 650, top: 560, width: 136 });
  addLine(slide, { color: "#3C3C3C", left: 848, top: 560, width: 92 });
}

async function buildSlide11(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 11 });
  addTitleBlock(slide, {
    body: "AMO does not simply place an object above a base. We design the floating behavior, visual rhythm, structure, surface, and commercial use case as one system.",
    eyebrow: "Technical Capability",
    subtitle: "A complete system of object, base, magnetic field, electronics, balance, and presentation.",
    title: "Magnetic Levitation System",
    w: 388,
    x: 58,
    y: 82,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 358,
    left: 486,
    src: "/images/home/future-objects/oem-module.webp",
    top: 100,
    width: 736,
  });
  const items = [
    ["Object", "The floating object is tuned as part of the field, not treated as decoration added later."],
    ["Base", "The base controls lift, balance, power behavior, and surface language at the same time."],
    ["Control", "Electronics and magnetic control define how calm, stable, and repeatable the motion feels."],
    ["Presentation", "Presentation intent shapes height, rotation, proportion, and the way attention is directed."],
  ];
  items.forEach(([title, body], index) => {
    addLabelBlock(slide, {
      body,
      title,
      w: 176,
      x: 486 + index * 184,
      y: 494,
      h: 144,
    });
  });
}

async function buildSlide12(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 12 });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 520,
    left: 58,
    src: assetMap.page12.main,
    top: 108,
    width: 540,
  });
  addTitleBlock(slide, {
    body: "Stability depends on magnetic tuning, object weight, center of gravity, base structure, and environmental use. AMO evaluates these factors during engineering and prototype development.",
    eyebrow: "Engineering Detail",
    subtitle: "Controlled balance for long-term visual presentation.",
    title: "Stable Levitation",
    w: 520,
    x: 664,
    y: 104,
  });
  const points = [
    ["Balance", "How the object sits inside the field without wandering or visual tension."],
    ["Center of Gravity", "Where weight is carried and how that influences the floating attitude."],
    ["Magnetic Control", "How electronics and field tuning keep the experience calm and repeatable."],
  ];
  points.forEach(([title, body], index) => {
    const y = 366 + index * 88;
    addLine(slide, { color: COLORS.accent, left: 664, top: y + 12, width: 18 });
    addText(slide, {
      bold: true,
      color: "#D7C08C",
      fontSize: 12,
      height: 18,
      left: 692,
      text: title,
      top: y,
      width: 220,
    });
    addText(slide, {
      color: "#A4A4A4",
      fontSize: 14,
      height: 48,
      left: 692,
      text: body,
      top: y + 22,
      width: 444,
    });
  });
}

async function buildSlide13(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 13 });
  addTitleBlock(slide, {
    body: "Movement helps the object become visible from every angle.",
    eyebrow: "Motion",
    subtitle: "Rotation is useful for retail counters, exhibitions, windows, and product launch displays where the object needs to be seen continuously without manual interaction.",
    title: "360°–720° Rotation",
    w: 406,
    x: 58,
    y: 96,
  });
  addChip(slide, { left: 58, text: "Retail Counters", top: 314, width: 124 });
  addChip(slide, { left: 190, text: "Launch Displays", top: 314, width: 126 });
  addChip(slide, { left: 324, text: "Exhibition Viewing", top: 314, width: 140 });
  addPanel(slide, {
    borderColor: COLORS.line,
    borderRadius: 20,
    borderWidth: 1,
    fill: "#0A0A0A",
    height: 520,
    left: 516,
    opacity: 1,
    top: 108,
    width: 706,
  });
  slide.shapes.add({
    geometry: "ellipse",
    position: { height: 380, left: 694, top: 176, width: 380 },
    fill: "none",
    line: { style: "solid", fill: "#343434", width: 1 },
  });
  slide.shapes.add({
    geometry: "ellipse",
    position: { height: 294, left: 736, top: 218, width: 294 },
    fill: "none",
    line: { style: "solid", fill: COLORS.accent, width: 1 },
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 320,
    left: 686,
    src: assetMap.page13.main,
    top: 206,
    width: 400,
  });
}

async function buildSlide14(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/home/applications/hotel.webp",
    darkOverlay: 0.46,
    pageNumber: 14,
  });
  addTitleBlock(slide, {
    body: "AMO products are suitable for premium spaces where the display must attract attention without mechanical noise or visual distraction.",
    eyebrow: "Atmosphere",
    subtitle: "Designed for spaces where technology should feel calm.",
    title: "Silent Operation",
    w: 420,
    x: 58,
    y: 94,
  });
  addLabelBlock(slide, {
    body: "Hotels, showrooms, suites, lounges, and executive interiors.",
    title: "Best Context",
    w: 222,
    x: 58,
    y: 574,
  });
  addPanel(slide, {
    borderColor: "#3A3A3A",
    borderRadius: 18,
    borderWidth: 1,
    fill: COLORS.bg,
    height: 146,
    left: 928,
    opacity: 0.64,
    top: 518,
    width: 268,
  });
  addText(slide, {
    bold: true,
    color: "#B8B8B8",
    fontSize: 11,
    height: 18,
    left: 948,
    text: "Operational Mood",
    top: 542,
    width: 180,
  });
  addText(slide, {
    color: "#A0A0A0",
    fontSize: 14,
    height: 70,
    left: 948,
    text: "The technology stays in service of the space. Calm acoustics are part of the luxury impression.",
    top: 568,
    width: 220,
  });
}

async function buildSlide15(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 15 });
  addTitleBlock(slide, {
    body: "Weight, volume, shell material, center of gravity, base geometry, and viewing angle all affect the final system. AMO evaluates these variables before prototype development.",
    eyebrow: "Load Logic",
    subtitle: "Every floating object needs its own magnetic logic.",
    title: "Load & Balance Engineering",
    w: 418,
    x: 58,
    y: 104,
  });
  addPanel(slide, {
    borderColor: "#D1CAC0",
    borderRadius: 20,
    borderWidth: 1,
    fill: "#ECE7DF",
    height: 500,
    left: 548,
    opacity: 1,
    top: 112,
    width: 642,
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 340,
    left: 640,
    src: assetMap.page15.main,
    top: 180,
    width: 428,
  });
  const callouts = [
    { label: "Weight", x: 600, y: 144, x2: 760, y2: 236 },
    { label: "Center of Gravity", x: 950, y: 180, x2: 948, y2: 314 },
    { label: "Viewing Intent", x: 838, y: 562, x2: 888, y2: 448 },
  ];
  callouts.forEach((item) => {
    addText(slide, {
      bold: true,
      color: "#474747",
      fontSize: 12,
      height: 18,
      left: item.x,
      text: item.label,
      top: item.y,
      width: 140,
    });
    addLine(slide, {
      color: "#888888",
      left: item.x + 8,
      top: item.y + 24,
      width: item.x2 - (item.x + 8),
      height: item.y2 - (item.y + 24),
      weight: 1,
    });
  });
}

async function buildSlide16(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 16 });
  addTitleBlock(slide, {
    body: "Commercial projects require more than a successful demo. AMO focuses on stable performance, component selection, assembly consistency, packaging protection, and quality control before delivery.",
    eyebrow: "Repeatability",
    subtitle: "From visual effect to repeatable use.",
    title: "Commercial Reliability",
    w: 382,
    x: 58,
    y: 92,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 360,
    left: 58,
    src: "/images/about/about-ch04-metal-surface.webp",
    top: 324,
    width: 706,
  });
  ["Components", "Assembly", "QC", "Packaging"].forEach((item, index) => {
    addLabelBlock(slide, {
      title: item,
      w: 330,
      x: 828,
      y: 226 + index * 110,
      h: 90,
    });
  });
}

async function buildSlide17(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: assetMap.page17.background,
    darkOverlay: 0.74,
    pageNumber: 17,
  });
  addTitleBlock(slide, {
    body: "A clear path from project idea to production-ready magnetic levitation product.",
    eyebrow: "OEM Capability",
    subtitle: "From concept to floating product.",
    title: "OEM / ODM Development",
    w: 468,
    x: 58,
    y: 86,
  });
  addLine(slide, { color: "#4A4A4A", left: 92, top: 520, width: 1092 });
  const steps = ["Brief", "Concept", "Engineering", "Prototype", "Sampling", "Production", "Delivery"];
  steps.forEach((step, index) => {
    const x = 92 + index * 156;
    addPanel(slide, {
      borderColor: "#2E2E2E",
      borderRadius: 14,
      borderWidth: 1,
      fill: "#121212",
      height: index % 2 === 0 ? 110 : 94,
      left: x,
      opacity: 1,
      top: index % 2 === 0 ? 454 : 470,
      width: 124,
    });
    addText(slide, {
      align: "center",
      color: COLORS.white,
      fontSize: 15,
      height: 24,
      left: x + 10,
      text: step,
      top: index % 2 === 0 ? 496 : 506,
      width: 104,
    });
  });
}

async function buildSlide18(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 18 });
  addTitleBlock(slide, {
    body: "The prototype stage validates levitation stability, rotation rhythm, visual proportion, material direction, lighting, user experience, and packaging readiness.",
    eyebrow: "Validation",
    subtitle: "Before production, the floating behavior must be proven.",
    title: "Prototype & Sampling",
    w: 384,
    x: 58,
    y: 92,
  });
  const checklist = [
    "Levitation Stability",
    "Rotation Rhythm",
    "Material Finish",
    "Lighting Effect",
    "Packaging Readiness",
  ];
  checklist.forEach((item, index) => {
    addLine(slide, { color: COLORS.accent, left: 58, top: 372 + index * 46, width: 16 });
    addText(slide, {
      color: "#C9C9C9",
      fontSize: 15,
      height: 22,
      left: 84,
      text: item,
      top: 360 + index * 46,
      width: 236,
    });
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 410,
    left: 470,
    src: assetMap.page18.main,
    top: 114,
    width: 520,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 16,
    borderWidth: 1,
    fit: "cover",
    height: 196,
    left: 1012,
    src: assetMap.page18.detailA,
    top: 114,
    width: 196,
  });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 16,
    borderWidth: 1,
    fit: "cover",
    height: 196,
    left: 1012,
    src: assetMap.page18.detailB,
    top: 328,
    width: 196,
  });
}

async function buildSlide19(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 19 });
  addTitleBlock(slide, {
    body: "Customizable elements include object shape, base form, material, finish, logo, lighting, levitation height, rotation, packaging, and OEM module integration.",
    eyebrow: "Customization",
    subtitle: "Designed around the brand, object, and application.",
    title: "Customization System",
    w: 366,
    x: 58,
    y: 92,
  });
  addPanel(slide, {
    borderColor: COLORS.line,
    borderWidth: 1,
    fill: "#0D0D0D",
    height: 510,
    left: 428,
    opacity: 1,
    top: 108,
    width: 794,
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 336,
    left: 642,
    src: assetMap.page19.main,
    top: 166,
    width: 366,
  });

  const leftItems = [
    ["Object", 188],
    ["Base", 286],
    ["Finish", 384],
  ];
  leftItems.forEach(([label, y]) => {
    addText(slide, {
      bold: true,
      color: COLORS.white,
      fontSize: 15,
      height: 22,
      left: 470,
      text: label,
      top: y,
      width: 128,
    });
    addLine(slide, { color: COLORS.accent, left: 548, top: y + 12, width: 86, weight: 1.2 });
  });

  const rightItems = [
    ["Lighting", 172],
    ["Logo", 252],
    ["Packaging", 332],
    ["Module", 412],
  ];
  rightItems.forEach(([label, y]) => {
    addText(slide, {
      bold: true,
      color: COLORS.white,
      fontSize: 15,
      height: 22,
      left: 1052,
      text: label,
      top: y,
      width: 138,
    });
    addLine(slide, { color: COLORS.accent, left: 976, top: y + 12, width: 64, weight: 1.2 });
  });
}

async function buildSlide20(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 20 });
  addTitleBlock(slide, {
    eyebrow: "Product Matrix",
    subtitle: "A complete magnetic levitation product ecosystem.",
    title: "Product Range Overview",
    w: 440,
    x: 58,
    y: 82,
  });
  const items = [
    ["Floating Display Bases", "/images/home/future-objects/display-base.webp", 58, 258, 410, 392],
    ["Levitating Clocks", "/images/home/future-objects/clock.webp", 494, 258, 224, 188],
    ["Levitating Lamps", "/images/home/future-objects/lamp.webp", 740, 258, 224, 188],
    ["Display Art Objects", "/images/home/future-objects/art-object.webp", 986, 258, 224, 188],
    ["OEM Maglev Modules", "/images/home/future-objects/oem-module.webp", 494, 462, 224, 188],
    ["Premium Gifts", "/images/home/applications/premium-gifts.webp", 740, 462, 224, 188],
    ["Custom Installations", "/images/home/future-objects/brand-installation.webp", 986, 462, 224, 188],
  ];
  for (const [title, src, x, y, width, height] of items) {
    await addImage(slide, resolveImage, {
      borderColor: COLORS.line,
      borderWidth: 1,
      fit: "cover",
      height,
      left: x,
      src,
      top: y,
      width,
    });
    addPanel(slide, {
      fill: COLORS.bg,
      height: 42,
      left: x,
      opacity: 0.52,
      top: y + height - 42,
      width,
    });
    addText(slide, {
      color: COLORS.white,
      fontSize: width > 300 ? 16 : 13,
      height: 20,
      left: x + 16,
      text: title,
      top: y + height - 30,
      width: width - 32,
    });
  }
}

async function buildSlide21(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 21 });
  addTitleBlock(slide, {
    body: "Display bases help brands isolate one object and make it the visual center of a counter, window, booth, or presentation table.",
    eyebrow: "Category 01",
    subtitle: "For hero products, limited editions, retail counters, and exhibition presentation.",
    title: "Floating Display Bases",
    w: 426,
    x: 58,
    y: 84,
  });
  addChip(slide, { left: 58, text: "Watches", top: 314, width: 82 });
  addChip(slide, { left: 148, text: "Jewelry", top: 314, width: 84 });
  addChip(slide, { left: 240, text: "Fragrance", top: 314, width: 96 });
  addChip(slide, { left: 344, text: "Collectibles", top: 314, width: 102 });
  addChip(slide, { left: 58, text: "Awards", top: 350, width: 76 });
  addChip(slide, { left: 142, text: "Limited Editions", top: 350, width: 132 });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 288,
    left: 58,
    src: "/images/home/future-objects/display-base.webp",
    top: 394,
    width: 456,
  });
  const detailSources = [assetMap.page21.detailA, assetMap.page21.detailB, assetMap.page21.detailC];
  for (const [index, src] of detailSources.entries()) {
    await addImage(slide, resolveImage, {
      borderColor: COLORS.line,
      borderRadius: 16,
      borderWidth: 1,
      fit: "cover",
      height: 180,
      left: 578,
      src,
      top: 118 + index * 188,
      width: 630,
    });
  }
}

async function buildSlide22(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/home/future-objects/lamp.webp",
    darkOverlay: 0.42,
    pageNumber: 22,
  });
  addTitleBlock(slide, {
    body: "AMO levitating lamps combine light, balance, and movement to create a quiet technological atmosphere in premium environments.",
    eyebrow: "Category 02",
    subtitle: "Floating light objects for hospitality, interiors, and signature spaces.",
    title: "Levitating Lamps",
    w: 440,
    x: 58,
    y: 94,
  });
  ["Hotels", "Lounges", "Suites", "Showrooms", "Offices"].forEach((item, index) => {
    addChip(slide, {
      accent: true,
      left: 58 + (index % 3) * 110,
      text: item,
      top: 594 + Math.floor(index / 3) * 34,
      width: item === "Showrooms" ? 102 : 92,
    });
  });
}

async function buildSlide23(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundFill: "#F5F2EB",
    light: true,
    pageNumber: 23,
  });
  addPanel(slide, {
    borderColor: "#D8D0C4",
    borderWidth: 1,
    fill: "#FFFFFF",
    height: 544,
    left: 478,
    opacity: 0.72,
    top: 96,
    width: 728,
  });
  addTitleBlock(slide, {
    body: "Functional objects with a floating visual identity.",
    eyebrow: "Category 03",
    subtitle: "Levitating clocks bring time, motion, and spatial presence together for premium interiors, offices, gifts, and design-led product collections.",
    light: true,
    title: "Levitating Clocks",
    w: 336,
    x: 58,
    y: 104,
  });
  ["Executive Gifts", "Office Interiors", "Design Stores", "Collector Products"].forEach((item, index) => {
    const x = 58 + (index % 2) * 170;
    const y = 534 + Math.floor(index / 2) * 40;
    addLine(slide, { color: COLORS.accent, left: x, top: y + 10, width: 20, weight: 1.2 });
    addText(slide, {
      color: "#595959",
      fontSize: 12,
      height: 18,
      left: x + 30,
      text: item,
      top: y,
      width: 136,
    });
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 454,
    left: 540,
    src: "/products/rendered/levitating-clock-hero.png",
    top: 132,
    width: 604,
  });
}

async function buildSlide24(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/home/future-objects/art-object.webp",
    darkOverlay: 0.44,
    pageNumber: 24,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 710,
    opacity: 0.28,
    top: 0,
    width: 570,
  });
  addTitleBlock(slide, {
    body: "Suspended objects can become symbolic displays for exhibitions, museums, retail environments, collector spaces, and future-facing brand storytelling.",
    eyebrow: "Category 04",
    subtitle: "Floating objects as sculptural brand language.",
    title: "Display Art Objects",
    w: 394,
    x: 810,
    y: 160,
  });
}

async function buildSlide25(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 25 });
  addTitleBlock(slide, {
    body: "Magnetic systems for private-label and product development programs.",
    eyebrow: "Category 05",
    subtitle: "AMO can support module-based development for partners who need levitation platforms, custom bases, embedded electronics, object integration, or branded product lines.",
    title: "OEM Maglev Modules",
    w: 392,
    x: 58,
    y: 92,
  });
  addPanel(slide, {
    borderColor: COLORS.line,
    borderRadius: 20,
    borderWidth: 1,
    fill: COLORS.charcoal,
    height: 520,
    left: 438,
    opacity: 1,
    top: 104,
    width: 784,
  });
  await addImage(slide, resolveImage, {
    fit: "contain",
    height: 380,
    left: 662,
    src: assetMap.page25.main,
    top: 150,
    width: 372,
  });
  const modules = [
    ["01", "Levitation Platform", "Base architecture, magnetic field planning, and presentation scale."],
    ["02", "Control Electronics", "Power behavior, load tuning, rotation, and stability logic."],
    ["03", "Object Integration", "Shell structure, material selection, balance, and brand adaptation."],
    ["04", "Product Line Support", "Private-label products, custom bases, and distributor-ready programs."],
  ];
  modules.forEach(([number, title, body], index) => {
    const x = index < 2 ? 466 : 854;
    const y = index % 2 === 0 ? 134 : 402;
    addLabelBlock(slide, {
      body,
      number,
      title,
      w: 220,
      x,
      y,
      h: 148,
    });
  });
}

async function buildSlide26(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 26 });
  await addImage(slide, resolveImage, {
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    fit: "cover",
    height: 520,
    left: 58,
    src: "/images/home/applications/premium-gifts.webp",
    top: 108,
    width: 610,
  });
  addTitleBlock(slide, {
    body: "A floating branded object can become a VIP gift, commemorative product, executive award, collector edition, or launch souvenir that continues to live on a desk, shelf, or display surface.",
    eyebrow: "Category 06",
    subtitle: "Make the gift display-worthy.",
    title: "Premium Gifts",
    w: 470,
    x: 732,
    y: 122,
  });
  ["VIP Gifts", "Executive Awards", "Collector Editions", "Launch Souvenirs"].forEach((item, index) => {
    addChip(slide, {
      accent: true,
      left: 732 + (index % 2) * 160,
      text: item,
      top: 502 + Math.floor(index / 2) * 36,
      width: 144,
    });
  });
}

async function buildSlide27(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: assetMap.page27.background,
    darkOverlay: 0.36,
    pageNumber: 27,
  });
  addPanel(slide, {
    borderColor: "#333333",
    borderRadius: 18,
    borderWidth: 1,
    fill: COLORS.bg,
    height: 236,
    left: 54,
    opacity: 0.64,
    top: 430,
    width: 446,
  });
  addTitleBlock(slide, {
    body: "For boutique counters, flagship stores, launch zones, and window displays, levitation helps one product stand apart from surrounding visual noise.",
    eyebrow: "Application 01",
    subtitle: "Create a premium pause point inside retail space.",
    title: "Retail & Visual Merchandising",
    w: 394,
    x: 82,
    y: 462,
  });
  addChip(slide, { left: 82, text: "Hero Product", top: 618, width: 108 });
  addChip(slide, { left: 198, text: "Launch Zone", top: 618, width: 106 });
  addChip(slide, { left: 312, text: "Window Display", top: 618, width: 118 });
}

async function buildSlide28(slide, resolveImage) {
  await applyChrome(slide, resolveImage, {
    backgroundImage: "/images/cases/space-exhibition.webp",
    darkOverlay: 0.38,
    pageNumber: 28,
  });
  addPanel(slide, {
    fill: COLORS.bg,
    height: 720,
    left: 0,
    opacity: 0.22,
    top: 0,
    width: 600,
  });
  addTitleBlock(slide, {
    body: "Trade shows, pop-ups, and product launches need a clear visual hook. A floating object creates curiosity, filming moments, and a memorable booth signature.",
    eyebrow: "Application 02",
    subtitle: "Movement attracts attention in crowded environments.",
    title: "Exhibitions & Brand Activations",
    w: 430,
    x: 58,
    y: 92,
  });
  addChip(slide, { left: 58, text: "Curiosity", top: 588, width: 88 });
  addChip(slide, { left: 154, text: "Filming Moments", top: 588, width: 124 });
  addChip(slide, { left: 286, text: "Booth Signature", top: 588, width: 120 });
}

async function buildSlide29(slide, resolveImage) {
  await applyChrome(slide, resolveImage, { pageNumber: 29 });
  addTitleBlock(slide, {
    body: "AMO products can support hotel lobbies, lounges, suites, CEO offices, museums, collector rooms, and future-facing interiors where the object needs presence without noise.",
    eyebrow: "Application 03",
    subtitle: "Quiet technology for premium spaces.",
    title: "Hospitality, Museums & Offices",
    w: 494,
    x: 58,
    y: 82,
  });
  const images = [
    ["/images/home/applications/hotel.webp", "Hospitality"],
    ["/images/home/applications/museum.webp", "Museums"],
    ["/images/home/applications/office.webp", "Offices"],
  ];
  for (const [index, [src, title]] of images.entries()) {
    const x = 58 + index * 390;
    await addImage(slide, resolveImage, {
      borderColor: COLORS.line,
      borderRadius: 16,
      borderWidth: 1,
      fit: "cover",
      height: 346,
      left: x,
      src,
      top: 316,
      width: 366,
    });
    addPanel(slide, {
      fill: COLORS.bg,
      height: 54,
      left: x,
      opacity: 0.54,
      top: 608,
      width: 366,
    });
    addText(slide, {
      color: COLORS.white,
      fontSize: 16,
      height: 20,
      left: x + 18,
      text: title,
      top: 624,
      width: 180,
    });
  }
}

async function buildSlide30(slide, resolveImage, assetMap) {
  await applyChrome(slide, resolveImage, { pageNumber: 30 });
  addTitleBlock(slide, {
    subtitle: "Send us the object, the use case, and the launch goal.",
    eyebrow: "Call To Action",
    title: "Start Your Floating Display Project",
    w: 470,
    x: 58,
    y: 102,
  });
  addText(slide, {
    color: "#9D9D9D",
    fontSize: 16,
    height: 22,
    left: 58,
    text: "To prepare a useful proposal, please share:",
    top: 304,
    width: 332,
  });
  [
    "Object Type",
    "Quantity Target",
    "Application Scenario",
    "Customization Needs",
    "Timeline",
    "Target Market",
    "Reference Images or Concept Notes",
  ].forEach((item, index) => {
    addText(slide, {
      color: "#C0C0C0",
      fontSize: 15,
      height: 24,
      left: 58,
      text: `${index + 1}. ${item}`,
      top: 344 + index * 32,
      width: 360,
    });
  });
  addPanel(slide, {
    borderColor: COLORS.line,
    borderRadius: 20,
    borderWidth: 1,
    fill: COLORS.charcoal,
    height: 566,
    left: 642,
    opacity: 1,
    top: 80,
    width: 570,
  });
  const info = [
    ["RFQ", "amolevitation.com/rfq"],
    ["Email", "hello@amolevitation.com"],
    ["WhatsApp / Phone", "+852 6942 9864"],
    ["Website", "amolevitation.com"],
  ];
  info.forEach(([label, value], index) => {
    const y = 126 + index * 84;
    addText(slide, {
      bold: true,
      color: "#BBBBBB",
      fontSize: 12,
      height: 18,
      left: 682,
      text: label,
      top: y,
      width: 180,
    });
    addText(slide, {
      color: COLORS.white,
      fontSize: 18,
      height: 24,
      left: 682,
      text: value,
      top: y + 24,
      width: 260,
    });
  });
  addText(slide, {
    bold: true,
    color: "#BBBBBB",
    fontSize: 12,
    height: 18,
    left: 682,
    text: "Business Liaison",
    top: 462,
    width: 180,
  });
  addText(slide, {
    color: "#C2C2C2",
    fontSize: 15,
    height: 110,
    left: 682,
    text: "Unit No. 1201, 12th Floor, Metropolis Tower,\n10 Metropolis Drive,\nHunghom, Kowloon,\nHong Kong",
    top: 488,
    width: 246,
  });
  await addImage(slide, resolveImage, {
    borderColor: "#D8D8D8",
    borderRadius: 14,
    borderWidth: 1,
    fit: "contain",
    height: 200,
    left: 990,
    src: assetMap.page30.qr,
    top: 376,
    width: 180,
  });
}

const DEFAULT_BUILDERS = [
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
  const assetMap = await loadAssetMap(projectRoot);
  const resolveImage = createImageResolver(projectRoot);
  const presentation = Presentation.create({ slideSize: PAGE_SIZE });

  for (const builder of DEFAULT_BUILDERS) {
    const slide = presentation.slides.add();
    await builder(slide, resolveImage, assetMap);
  }

  return presentation;
}

export { PAGE_SIZE, TOTAL_SLIDES };
