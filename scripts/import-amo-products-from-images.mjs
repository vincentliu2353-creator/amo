import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { createClient } from "@supabase/supabase-js";
import {
  collectProductImageVariantStoragePaths,
  inferProductImageExtension,
} from "../lib/products/product-image-variants.ts";
import {
  buildProductImageAssetStem,
  uploadProductImageVariantSet,
} from "../lib/server/product-image-pipeline.ts";

const PRODUCT_STORAGE_BUCKET = "product-media";
const DEFAULT_IMPORT_BATCH = "amo-image-import-2026-06-12";
const DEFAULT_LEVITATION_HEIGHT = "TBD";
const DEFAULT_DIAMETER = "TBD";
const DEFAULT_LOAD_CAPACITY = "TBD";
const DEFAULT_POWER = "TBD";
const DEFAULT_MOQ = 1;
const DEFAULT_MOQ_UNIT = "unit (editable)";
const DEFAULT_LEAD_TIME = "TBD - editable";
const DEFAULT_CUSTOMIZATION_OPTIONS =
  "logo, finish, packaging, lighting, magnetic module, size adjustment";
const DEFAULT_SEO_KEYWORDS = [
  "magnetic levitation product",
  "levitating display",
  "floating product display",
  "OEM magnetic levitation",
  "B2B levitation supplier",
  "premium floating display",
];

const CATEGORY_DEFINITIONS = [
  {
    slug: "levitating-clocks",
    name: "Levitating Clocks",
    shortDescription: "Floating time display objects for retail, hospitality, and premium gifting.",
    description:
      "AMO levitating clocks combine time symbolism, magnetic suspension, and premium presentation for branded interiors and collectible displays.",
    sortOrder: 10,
    seoTitle: "AMO Levitating Clocks",
    seoDescription:
      "Levitating clocks and floating timepiece displays for retail, hospitality, and premium gifts.",
  },
  {
    slug: "levitating-lamps",
    name: "Levitating Lamps",
    shortDescription: "Floating lighting objects for boutique hospitality, desks, and statement interiors.",
    description:
      "AMO levitating lamps bring magnetic suspension, sculptural light, and OEM customization into premium commercial lighting programs.",
    sortOrder: 20,
    seoTitle: "AMO Levitating Lamps",
    seoDescription:
      "Magnetic levitation lamps and floating light sculptures for hospitality, retail, and gifting.",
  },
  {
    slug: "display-art-objects",
    name: "Display Art Objects",
    shortDescription: "Sculptural levitating forms created for galleries, lounges, and branded interiors.",
    description:
      "AMO display art objects use magnetic levitation to turn visual storytelling into premium spatial focal points.",
    sortOrder: 30,
    seoTitle: "AMO Display Art Objects",
    seoDescription:
      "Floating display sculptures and levitating art objects for galleries, lounges, and brand environments.",
  },
  {
    slug: "oem-maglev-modules",
    name: "OEM Maglev Modules",
    shortDescription: "Integration-ready magnetic levitation modules for private-label and custom programs.",
    description:
      "AMO OEM maglev modules support custom display concepts, branded fixtures, and engineered levitation deployments.",
    sortOrder: 40,
    seoTitle: "AMO OEM Maglev Modules",
    seoDescription:
      "OEM magnetic levitation modules for custom displays, private-label products, and engineered integrations.",
  },
  {
    slug: "premium-gifts",
    name: "Premium Gifts",
    shortDescription: "Floating gift objects designed for commemorative launches and executive presentation.",
    description:
      "AMO premium gifts use levitation, material contrast, and refined silhouettes to create memorable branded keepsakes.",
    sortOrder: 50,
    seoTitle: "AMO Premium Floating Gifts",
    seoDescription:
      "Premium floating display gifts for executive presentation, commemorative launches, and luxury merchandising.",
  },
  {
    slug: "exhibition-displays",
    name: "Exhibition Displays",
    shortDescription: "Levitating showcase systems for hero products, launches, and public presentations.",
    description:
      "AMO exhibition displays frame branded objects with magnetic suspension, motion, and high-visibility stage presence.",
    sortOrder: 60,
    seoTitle: "AMO Levitating Exhibition Displays",
    seoDescription:
      "Floating product display systems for trade shows, launches, and immersive exhibition storytelling.",
  },
];

const DEFAULT_PRODUCT_DEFINITIONS = [
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a030d04bcbc819180d09982fe63baa5.png",
    name: "AMO Solstice Crest",
    categoryName: "Display Art Objects",
    series: "Nova Series",
    summary:
      "A radiant floating emblem designed to anchor ceremonial, hospitality, and flagship display environments.",
    philosophy:
      "AMO Solstice Crest turns suspended light into a formal gesture of arrival.",
    description:
      "Developed for luxury lobbies, exhibition centerpieces, and premium gifting programs, this magnetic levitation display pairs a luminous core, layered metallic fins, and a sculpted plinth to create a collectible focal point with immediate brand presence. The visual language is ready for B2B rollout while technical values, scale, lighting output, and motion behavior remain editable for OEM confirmation.",
    highlight:
      "A halo-like levitating sculpture built to command attention in launch reveals, branded interiors, and collector-grade installations.",
    features: [
      "Radiant multi-wing silhouette delivers long-distance visual impact.",
      "Floating illuminated core creates a premium focal point without visible support hardware.",
      "Stone plinth presentation suits hospitality, gallery, and ceremonial display programs.",
    ],
    applications: [
      "luxury hospitality lobbies",
      "exhibition centerpiece displays",
      "premium commemorative gifting",
    ],
    tags: [
      "magnetic levitation product",
      "levitating display",
      "premium floating display",
      "hospitality showcase",
      "ceremonial installation",
    ],
    rotation: "Suggested: 360° optional",
    finish: "Gloss white composite, polished gold-tone metal, and white marble-effect base",
    seoTitle: "AMO Solstice Crest | Floating Display Sculpture",
    seoDescription:
      "Magnetic levitation product for ceremonial displays, luxury interiors, and premium floating display programs.",
    altText:
      "Gold and white radiant levitating display sculpture with illuminated center on a marble base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a030f7d8ab881919d853e95ff1b538b.png",
    name: "AMO Sanctum Veil",
    categoryName: "Exhibition Displays",
    series: "Arc Series",
    summary:
      "An architectural floating showcase created for launch stages, museum reveals, and branded exhibition narratives.",
    philosophy:
      "AMO Sanctum Veil frames levitation as a ceremony rather than a mechanism.",
    description:
      "The arched profile, translucent draped surfaces, and centered luminous orb give this concept-ready display a strong stage presence for trade shows, hospitality installations, and immersive retail storytelling. It is positioned for B2B teams that need immediate visual credibility while keeping object size, finishes, lighting, and magnetic module specifications editable for final production.",
    highlight:
      "A cathedral-like levitating presentation form for hero objects, ceremonial launches, and immersive exhibition programs.",
    features: [
      "Architectural arch profile creates a formal reveal moment around the floating centerpiece.",
      "Translucent layered surfaces soften the structure for museum-grade and hospitality-grade staging.",
      "Vertical format supports branded hero objects, campaign reveals, and premium presentation zones.",
    ],
    applications: [
      "trade-show hero installations",
      "museum-style reveal displays",
      "brand launch environments",
    ],
    tags: [
      "floating product display",
      "magnetic levitation product",
      "exhibition display",
      "levitating display",
      "brand reveal staging",
    ],
    rotation: "Suggested: static hover or 360° optional",
    finish:
      "Translucent stone-look composite, polished champagne metal, and carved ivory stone-effect base",
    seoTitle: "AMO Sanctum Veil | Levitating Exhibition Display",
    seoDescription:
      "Floating product display for exhibitions, museum reveals, and branded launch environments with OEM magnetic levitation options.",
    altText:
      "Gothic arch levitating display with translucent draped panels and a floating luminous orb",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031b7963d0819190fffe6b5470855c.png",
    name: "AMO Vesper Reed Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A slender floating lamp concept that blends sculptural warmth with a disciplined hospitality-grade silhouette.",
    philosophy:
      "AMO Vesper Reed Lamp treats light as something held in tension, not fixed in place.",
    description:
      "Dark metallic reeds wrap a luminous central column to create a vertical statement suited to boutique hotels, executive desks, and premium display furniture. The product content is ready for immediate catalog launch, while power, load, levitation height, and final engineering values remain editable for commercial confirmation.",
    highlight:
      "A floating light sculpture designed for boutique hospitality, curated retail corners, and executive gifting programs.",
    features: [
      "Vertical reed cage balances a warm core light with a compact presentation footprint.",
      "Suspended central light column gives desks and side tables a premium conversation piece.",
      "Natural wood-look base pairs with hospitality and residential showroom palettes.",
    ],
    applications: [
      "boutique hotel suites",
      "executive desk styling",
      "luxury retail display",
    ],
    tags: [
      "magnetic levitation lamp",
      "floating product display",
      "levitating display",
      "premium floating display",
      "hospitality lighting",
    ],
    rotation: "Suggested: 360° / 720° optional",
    finish: "Bronze-tone metal rods, warm translucent light column, and walnut-look base",
    seoTitle: "AMO Vesper Reed Lamp | Magnetic Levitation Lamp",
    seoDescription:
      "Magnetic levitation lamp for hospitality, desks, and premium floating display programs with editable OEM specifications.",
    altText:
      "Bronze reed levitating lamp with a glowing central cylinder and walnut-look base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a030c067c0c8191a5db0c4b0fc57425.png",
    name: "AMO Aurelia Prism",
    categoryName: "Display Art Objects",
    series: "Nova Series",
    summary:
      "A floating bronze lattice sculpture built to spotlight luminous materials in premium interiors and exhibition zones.",
    philosophy:
      "AMO Aurelia Prism suspends light inside a protective shell of motion and symmetry.",
    description:
      "The open petal frame and glowing crystal center create a refined levitating object for gallery retail, private lounges, and collector-focused displays. It is positioned as a concept-ready AMO product entry that supports later refinement of dimensions, magnetic performance, finish selections, and compliance requirements.",
    highlight:
      "A suspended crystal centerpiece designed for premium brand storytelling, curated displays, and high-touch gifting moments.",
    features: [
      "Open bronze-toned frame gives the center crystal room to read from multiple viewing angles.",
      "Floating amber core introduces warmth suited to evening interiors and luxury showcases.",
      "Carved stone-look base adds weight and permanence to the display composition.",
    ],
    applications: [
      "gallery retail displays",
      "private lounge installations",
      "collector presentation gifting",
    ],
    tags: [
      "magnetic levitation product",
      "levitating display",
      "display art object",
      "crystal centerpiece",
      "premium floating display",
    ],
    rotation: "Suggested: 360° optional",
    finish: "Brushed bronze-tone metal, amber crystalline core, and carved limestone-effect base",
    seoTitle: "AMO Aurelia Prism | Floating Crystal Display",
    seoDescription:
      "Premium floating display with magnetic levitation styling for galleries, lounges, and branded collector presentations.",
    altText:
      "Bronze petal levitating display with a suspended amber crystal on a carved stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031a4cba9c8191accd087e068bfc2a.png",
    name: "AMO Nimbus Vessel",
    categoryName: "Premium Gifts",
    series: "Monolith Series",
    summary:
      "A serene floating vessel concept designed for refined gifting, wellness interiors, and collectible brand experiences.",
    philosophy:
      "AMO Nimbus Vessel makes stillness feel engineered.",
    description:
      "The minimal bowl silhouette and suspended opaline droplet create a quiet levitating composition suited to executive gifts, spa hospitality, and contemplative retail programs. The current listing publishes the visual concept immediately while keeping final dimensions, power behavior, and commercial specifications editable.",
    highlight:
      "A calm floating centerpiece for executive gifting, wellness hospitality, and premium tabletop display programs.",
    features: [
      "Minimal bowl geometry supports quiet luxury styling without visual clutter.",
      "Floating droplet accent creates a meditative focal point for reception and tabletop settings.",
      "Travertine-look base reinforces natural material cues preferred in wellness and gift environments.",
    ],
    applications: [
      "executive appreciation gifts",
      "wellness and spa reception decor",
      "premium tabletop merchandising",
    ],
    tags: [
      "magnetic levitation product",
      "premium floating display",
      "luxury gift object",
      "levitating display",
      "B2B levitation supplier",
    ],
    rotation: "Suggested: static hover",
    finish: "Matte ceramic-look vessel, opaline translucent accent, and travertine-effect stone base",
    seoTitle: "AMO Nimbus Vessel | Premium Floating Gift Object",
    seoDescription:
      "Premium floating display for gifting, wellness interiors, and quiet luxury merchandising with editable magnetic levitation specs.",
    altText:
      "Minimal stone-look levitating bowl above a travertine base with a floating opaline droplet",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031a950b10819189bb4e77740f48a8.png",
    name: "AMO Eclipse Cradle Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A crescent-framed floating lamp created for mood-rich hospitality, residential showrooms, and premium gift programs.",
    philosophy:
      "AMO Eclipse Cradle Lamp lets darkness frame the value of light.",
    description:
      "Its matte black crescent and glowing suspended core create an immediately legible silhouette for boutique hospitality, nighttime window presentations, and collectible desk displays. The listing is commercially presentable now while all engineering values marked TBD or Suggested remain open for AMO confirmation.",
    highlight:
      "A lunar floating lamp concept for intimate hospitality settings, seasonal showcases, and signature gifting.",
    features: [
      "Crescent shell creates a distinctive night-sky silhouette suited to hospitality and gift programs.",
      "Suspended core light adds warmth without exposing visible support hardware.",
      "Stone-look base supports shelf, desk, and boutique window deployment.",
    ],
    applications: [
      "boutique hospitality suites",
      "nighttime window displays",
      "signature executive gifts",
    ],
    tags: [
      "magnetic levitation lamp",
      "levitating display",
      "floating product display",
      "premium floating display",
      "hospitality lighting",
    ],
    rotation: "Suggested: static hover or 360° optional",
    finish: "Textured matte black composite, luminous opaline core, and pale stone base",
    seoTitle: "AMO Eclipse Cradle Lamp | Floating Halo Light",
    seoDescription:
      "Magnetic levitation lamp for boutique hospitality, showcase windows, and premium floating display programs.",
    altText:
      "Black crescent levitating lamp with a glowing egg-shaped core on a pale stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031c22d8c48191b6a51a9f5f48e949.png",
    name: "AMO Mirage Basin",
    categoryName: "Display Art Objects",
    series: "Monolith Series",
    summary:
      "A smoked-glass floating basin concept developed for gallery tables, quiet luxury retail, and sculptural presentation zones.",
    philosophy:
      "AMO Mirage Basin turns a surface into an event.",
    description:
      "The shallow dark-glass form and suspended droplet give this levitating object a restrained, high-design presence suited to tabletop installations, museum shops, and modern hospitality lounges. It is ready for catalog publication now, with final sizing, power, and motion choices reserved for later engineering confirmation.",
    highlight:
      "A minimal floating basin built for calm, high-design environments where levitation should feel effortless rather than theatrical.",
    features: [
      "Wide smoked-glass dish gives the floating droplet a strong mirrored stage.",
      "Low-profile geometry suits tables, counters, and retail plinths with limited vertical clearance.",
      "Dark stone-look base keeps the presentation sober and architectural.",
    ],
    applications: [
      "gallery tabletop installations",
      "quiet luxury retail displays",
      "modern hospitality lounges",
    ],
    tags: [
      "magnetic levitation product",
      "levitating display",
      "sculptural tabletop display",
      "premium floating display",
      "floating product display",
    ],
    rotation: "Suggested: static hover",
    finish: "Smoked glass dish, soft opaline accent, and dark basalt-look stone base",
    seoTitle: "AMO Mirage Basin | Sculptural Floating Display",
    seoDescription:
      "Levitating display for gallery tables, luxury retail, and calm hospitality settings with editable OEM magnetic levitation options.",
    altText:
      "Smoked-glass levitating basin with a floating white droplet on a dark stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a032e7d17a08191bc354ce8da2556a1.png",
    name: "AMO Auric Wishkeeper",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A character-led floating gift display designed for limited editions, branded collectibles, and imaginative launch campaigns.",
    philosophy:
      "AMO Auric Wishkeeper makes levitation playful without losing premium finish discipline.",
    description:
      "The polished gold upper shell and transparent vortex chamber give this concept-ready object strong appeal for festive retail, collectibles, and premium promotional gifting. It helps B2B teams publish a memorable product story immediately while keeping load, motion, power, and final commercial specifications editable.",
    highlight:
      "A whimsical floating collectible built for campaign gifts, limited-edition drops, and attention-rich retail storytelling.",
    features: [
      "Character-led form increases shelf recognition and campaign memorability.",
      "Transparent vortex chamber adds movement language without claiming fixed technical performance.",
      "Compact base and bright finish support premium gifting and seasonal merchandising.",
    ],
    applications: [
      "limited-edition brand gifts",
      "campaign launch collectibles",
      "premium holiday retail displays",
    ],
    tags: [
      "magnetic levitation product",
      "premium floating display",
      "collectible levitating gift",
      "floating product display",
      "B2B levitation supplier",
    ],
    rotation: "Suggested: 360° optional",
    finish: "Satin gold-tone shell, smoke-clear lower chamber, and pale stone base",
    seoTitle: "AMO Auric Wishkeeper | Premium Floating Gift",
    seoDescription:
      "Premium floating display for collectible gifts, campaign launches, and imaginative retail storytelling with OEM magnetic levitation.",
    altText:
      "Gold whimsical levitating gift display with a transparent vortex lower chamber on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a037aae8e248191b26d621efcd21d15.png",
    name: "AMO Rosaline Bloom",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A jewel-toned floating rose concept created for commemorative gifting, luxury beauty displays, and ceremonial presentation programs.",
    philosophy:
      "AMO Rosaline Bloom suspends sentiment with architectural precision.",
    description:
      "Rose-gold framing, crystal-set petal edges, and a luminous pearl center give this levitating object strong potential for collectible gifting, fragrance counters, and premium celebration campaigns. The listing is intentionally commercial in tone while all unverified technical specifications remain editable for final development.",
    highlight:
      "A floating floral icon for anniversary gifting, luxury beauty merchandising, and premium ceremonial displays.",
    features: [
      "Layered rose silhouette creates an instantly recognizable gifting and celebration motif.",
      "Pearl-like center and crystal trim support jewelry, beauty, and commemorative merchandising.",
      "Compact round plinth keeps the presentation compatible with counters, vitrines, and gifting desks.",
    ],
    applications: [
      "commemorative corporate gifts",
      "luxury beauty counters",
      "anniversary and ceremony displays",
    ],
    tags: [
      "magnetic levitation product",
      "premium floating display",
      "levitating gift object",
      "luxury merchandising",
      "floating product display",
    ],
    rotation: "Suggested: 360° optional",
    finish:
      "Rose-gold tone metal, blush enamel-like petals, crystal accents, and white marble-effect base",
    seoTitle: "AMO Rosaline Bloom | Levitating Gift Display",
    seoDescription:
      "Premium floating display for commemorative gifting, beauty merchandising, and ceremonial presentation with editable OEM specs.",
    altText:
      "Rose-gold levitating rose display with a pearl center and jeweled petals on a marble base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a037af7d0a881919125b857afc3000e.png",
    name: "AMO Eterna Hourglass",
    categoryName: "Levitating Clocks",
    series: "Orbit Series",
    summary:
      "A floating hourglass concept designed to bring time symbolism into luxury interiors, executive gifts, and signature counters.",
    philosophy:
      "AMO Eterna Hourglass lets time appear suspended, measured, and luminous at once.",
    description:
      "The crystal-filled hourglass chamber and polished silver framework create a refined levitating time object suited to executive lounges, jewelry counters, and prestige gifting programs. It is published as a concept-ready AMO product with all engineering figures that cannot be confirmed from the image clearly left editable.",
    highlight:
      "A levitating timepiece display for prestige retail, executive spaces, and collectible presentation programs.",
    features: [
      "Suspended hourglass chamber gives time symbolism a premium magnetic levitation presence.",
      "Clear faceted structure and metal frame suit jewelry, watch, and executive display contexts.",
      "Stable round plinth format supports counter presentation and gift-ready packaging programs.",
    ],
    applications: [
      "executive lounge decor",
      "fine jewelry merchandising",
      "prestige commemorative gifting",
    ],
    tags: [
      "magnetic levitation product",
      "levitating display",
      "floating product display",
      "premium floating display",
      "levitating clock",
    ],
    rotation: "Suggested: 360° / 720° optional",
    finish:
      "Polished silver-tone metal, faceted clear chamber, crystal accents, and travertine-effect base",
    seoTitle: "AMO Eterna Hourglass | Floating Timepiece Display",
    seoDescription:
      "Floating product display with timepiece symbolism for retail, gifting, and premium interiors using OEM magnetic levitation.",
    altText:
      "Silver levitating hourglass display with a crystal-filled clear chamber on a stone base",
  },
];

function parseDotEnv(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        return null;
      }

      return [key, value];
    })
    .filter(Boolean);

  return Object.fromEntries(entries);
}

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    throw new Error(`Missing .env.local at ${envPath}`);
  }

  const parsed = parseDotEnv(envPath);

  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function slugifyValue(value) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "product";
}

function clampText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength).trimEnd();
}

function uniqueTextList(values) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function ensureLocalImagesExist(productDefinitions) {
  for (const definition of productDefinitions) {
    if (!existsSync(definition.sourcePath)) {
      throw new Error(`Image file not found: ${definition.sourcePath}`);
    }
  }
}

async function ensureProductBucket(supabase) {
  const { data, error } = await supabase.storage.getBucket(PRODUCT_STORAGE_BUCKET);

  if (error) {
    const message = error.message.toLowerCase();
    const bucketMissing = message.includes("not found") || message.includes("does not exist");

    if (!bucketMissing) {
      throw new Error(`Unable to access product media bucket: ${error.message}`);
    }

    const { error: createError } = await supabase.storage.createBucket(PRODUCT_STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });

    if (createError) {
      throw new Error(`Unable to create product media bucket: ${createError.message}`);
    }

    return;
  }

  if (data?.public) {
    return;
  }

  const { error: updateError } = await supabase.storage.updateBucket(PRODUCT_STORAGE_BUCKET, {
    public: true,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  });

  if (updateError) {
    throw new Error(`Unable to update product media bucket: ${updateError.message}`);
  }
}

async function upsertCategories(supabase) {
  const now = new Date().toISOString();
  const categoryRows = CATEGORY_DEFINITIONS.map((category) => ({
    slug: category.slug,
    name: category.name,
    short_description: category.shortDescription,
    description: category.description,
    status: "published",
    sort_order: category.sortOrder,
    seo_title: category.seoTitle,
    seo_description: category.seoDescription,
    seo_keywords: DEFAULT_SEO_KEYWORDS,
    published_at: now,
  }));

  const { error: upsertError } = await supabase
    .from("categories")
    .upsert(categoryRows, { onConflict: "slug" });

  if (upsertError) {
    throw new Error(`Unable to upsert product categories: ${upsertError.message}`);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, sort_order")
    .in(
      "slug",
      CATEGORY_DEFINITIONS.map((category) => category.slug),
    );

  if (error) {
    throw new Error(`Unable to reload product categories: ${error.message}`);
  }

  return data ?? [];
}

async function fetchExistingProducts(supabase) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, sort_order, published_at, filter_attributes, product_images(id, storage_path, image_url, sort_order, is_primary)",
    );

  if (error) {
    throw new Error(`Unable to load existing products: ${error.message}`);
  }

  return data ?? [];
}

function findMatchingProduct(existingProducts, definition) {
  const sourceImage = basename(definition.sourcePath);

  const exactSourceMatch = existingProducts.find((product) => {
    const attributes = isObject(product.filter_attributes) ? product.filter_attributes : {};
    return attributes.import_source === sourceImage;
  });

  if (exactSourceMatch) {
    return exactSourceMatch;
  }

  return existingProducts.find((product) => product.name === definition.name) ?? null;
}

function resolveUniqueSlug(existingProducts, baseSlug, currentProductId) {
  const takenSlugs = new Set(
    existingProducts
      .filter((product) => product.id !== currentProductId)
      .map((product) => product.slug)
      .filter((value) => typeof value === "string" && value.length > 0),
  );

  if (!takenSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;

  while (takenSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

function buildDescription(definition) {
  return `${definition.philosophy}\n\n${definition.description}`;
}

function buildFaqItems(definition) {
  return [
    {
      question: `Can ${definition.name} be adapted for branded or OEM programs?`,
      answer:
        "Yes. Logo integration, finish changes, packaging adjustments, size tuning, and magnetic module refinement can be scoped for private-label or custom deployments.",
    },
    {
      question: "Are the listed specifications final?",
      answer:
        "No. Values marked TBD or Suggested are editable placeholders until AMO confirms object weight, motion behavior, power requirements, and commercial production targets.",
    },
  ];
}

function buildProductPayload({
  categoryId,
  definition,
  existingProduct,
  importBatch,
  publishedAt,
  slug,
  sortOrder,
}) {
  const existingFilterAttributes = isObject(existingProduct?.filter_attributes)
    ? existingProduct.filter_attributes
    : {};
  const sourceImage = basename(definition.sourcePath);

  return {
    category_id: categoryId,
    slug,
    sku: null,
    name: definition.name,
    series: definition.series,
    status: "published",
    featured: false,
    summary: definition.summary,
    description: buildDescription(definition),
    highlight: definition.highlight,
    lead_time_text: definition.leadTimeText ?? DEFAULT_LEAD_TIME,
    min_order_qty: definition.moq ?? DEFAULT_MOQ,
    min_order_unit: definition.moqUnit ?? DEFAULT_MOQ_UNIT,
    hero_metric: null,
    tags: uniqueTextList(definition.tags),
    applications: uniqueTextList(definition.applications),
    features: uniqueTextList(definition.features),
    specs: {
      "Levitation Height": definition.levitationHeight ?? DEFAULT_LEVITATION_HEIGHT,
      Rotation: definition.rotation ?? "TBD",
      Diameter: definition.diameter ?? DEFAULT_DIAMETER,
      "Load Capacity": definition.loadCapacity ?? DEFAULT_LOAD_CAPACITY,
      Power: definition.power ?? DEFAULT_POWER,
      Finish: definition.finish ?? "TBD",
      "Customization Options":
        definition.customizationOptions ?? DEFAULT_CUSTOMIZATION_OPTIONS,
    },
    filter_attributes: {
      ...existingFilterAttributes,
      managed_import: true,
      import_batch: importBatch,
      import_source: sourceImage,
      import_series: definition.series,
      editable_specs: true,
    },
    faq_items: buildFaqItems(definition),
    sort_order: sortOrder,
    seo_title: clampText(definition.seoTitle, 60),
    seo_description: clampText(definition.seoDescription, 160),
    seo_keywords: uniqueTextList([...DEFAULT_SEO_KEYWORDS, ...definition.tags]),
    canonical_url: null,
    og_image_url: null,
    published_at: publishedAt,
  };
}

async function uploadPrimaryImage(supabase, { definition, productId, slug }) {
  const sourcePath = definition.sourcePath;
  const fileBytes = readFileSync(sourcePath);
  const uploadedAsset = await uploadProductImageVariantSet(supabase, {
    productId,
    assetStem: buildProductImageAssetStem(`${slug}-primary`),
    inputBuffer: fileBytes,
    originalExtension: inferProductImageExtension({
      fileName: sourcePath,
    }),
    upsert: true,
  });
  const storagePath = uploadedAsset.paths.originalPath;
  const existingRowsResult = await supabase
    .from("product_images")
    .select("id, storage_path, image_url, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (existingRowsResult.error) {
    throw new Error(`Unable to load existing product images: ${existingRowsResult.error.message}`);
  }

  const existingRows = existingRowsResult.data ?? [];
  const publicUrl = uploadedAsset.urls.largeUrl;
  const targetRow = existingRows.find((row) => row.storage_path === storagePath) ?? null;
  let targetRowId = targetRow?.id ?? null;

  if (!targetRowId) {
    const nextSortOrder =
      existingRows.reduce((maximum, row) => Math.max(maximum, row.sort_order ?? 0), 0) + 10;
    const { data: insertedImage, error: insertImageError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: publicUrl,
        storage_path: storagePath,
        alt_text: definition.altText,
        sort_order: nextSortOrder,
        is_primary: false,
      })
      .select("id")
      .single();

    if (insertImageError || !insertedImage) {
      throw new Error(
        `Unable to save product image record: ${
          insertImageError?.message ?? "missing image insert response"
        }`,
      );
    }

    targetRowId = insertedImage.id;
  }

  const staleRows = existingRows.filter((row) => row.id !== targetRowId);

  if (staleRows.length > 0) {
    const { error: deleteRowsError } = await supabase
      .from("product_images")
      .delete()
      .in(
        "id",
        staleRows.map((row) => row.id),
      );

    if (deleteRowsError) {
      throw new Error(`Unable to delete stale product image records: ${deleteRowsError.message}`);
    }

    const stalePaths = staleRows
      .flatMap((row) => collectProductImageVariantStoragePaths(row.storage_path))
      .filter((path) => path.length > 0 && path !== storagePath);

    if (stalePaths.length > 0) {
      const { error: deleteStorageError } = await supabase.storage
        .from(PRODUCT_STORAGE_BUCKET)
        .remove(Array.from(new Set(stalePaths)));

      if (deleteStorageError) {
        throw new Error(`Unable to delete stale product images: ${deleteStorageError.message}`);
      }
    }
  }

  const { error: clearPrimaryError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (clearPrimaryError) {
    throw new Error(`Unable to clear previous primary image: ${clearPrimaryError.message}`);
  }

  const { error: finalizeImageError } = await supabase
    .from("product_images")
    .update({
      image_url: publicUrl,
      storage_path: storagePath,
      alt_text: definition.altText,
      sort_order: 10,
      is_primary: true,
    })
    .eq("id", targetRowId);

  if (finalizeImageError) {
    throw new Error(`Unable to finalize primary product image: ${finalizeImageError.message}`);
  }

  return publicUrl;
}

async function createOrUpdateProduct({
  categoryId,
  definition,
  existingProducts,
  importBatch,
  nextSortOrderRef,
  supabase,
}) {
  const matchingProduct = findMatchingProduct(existingProducts, definition);
  const publishedAt = matchingProduct?.published_at ?? new Date().toISOString();
  const baseSlug = slugifyValue(definition.name);
  const slug = resolveUniqueSlug(existingProducts, baseSlug, matchingProduct?.id);
  const sortOrder = matchingProduct?.sort_order ?? nextSortOrderRef.value + 10;
  const payload = buildProductPayload({
    categoryId,
    definition,
    existingProduct: matchingProduct,
    importBatch,
    publishedAt,
    slug,
    sortOrder,
  });
  let productId = matchingProduct?.id ?? null;
  const action = matchingProduct ? "updated" : "created";

  if (!matchingProduct) {
    const { data: createdProduct, error: createError } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (createError || !createdProduct) {
      throw new Error(
        `Unable to create product record: ${createError?.message ?? "missing create response"}`,
      );
    }

    productId = createdProduct.id;
    nextSortOrderRef.value = sortOrder;

    existingProducts.push({
      id: productId,
      slug,
      name: definition.name,
      sort_order: sortOrder,
      published_at: publishedAt,
      filter_attributes: payload.filter_attributes,
      product_images: [],
    });
  } else {
    const { error: updateError } = await supabase
      .from("products")
      .update(payload)
      .eq("id", matchingProduct.id);

    if (updateError) {
      throw new Error(`Unable to update product record: ${updateError.message}`);
    }

    matchingProduct.slug = slug;
    matchingProduct.name = definition.name;
    matchingProduct.sort_order = sortOrder;
    matchingProduct.published_at = publishedAt;
    matchingProduct.filter_attributes = payload.filter_attributes;
  }

  const imageUrl = await uploadPrimaryImage(supabase, {
    definition,
    productId,
    slug,
  });

  const { error: finalizeProductError } = await supabase
    .from("products")
    .update({
      og_image_url: imageUrl,
      slug,
      published_at: publishedAt,
      status: "published",
    })
    .eq("id", productId);

  if (finalizeProductError) {
    throw new Error(`Unable to finalize product record: ${finalizeProductError.message}`);
  }

  return {
    action,
    id: productId,
    imageUrl,
    name: definition.name,
    slug,
  };
}

export async function runImport({
  importBatch = DEFAULT_IMPORT_BATCH,
  productDefinitions = DEFAULT_PRODUCT_DEFINITIONS,
} = {}) {
  loadEnv();
  ensureLocalImagesExist(productDefinitions);

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  await ensureProductBucket(supabase);

  const categories = await upsertCategories(supabase);
  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));
  const existingProducts = await fetchExistingProducts(supabase);
  const nextSortOrderRef = {
    value: existingProducts.reduce(
      (maximum, product) => Math.max(maximum, product.sort_order ?? 0),
      0,
    ),
  };
  const results = [];

  for (const definition of productDefinitions) {
    const categoryId = categoryIdByName.get(definition.categoryName);

    if (!categoryId) {
      throw new Error(`Missing category id for ${definition.categoryName}`);
    }

    const result = await createOrUpdateProduct({
      categoryId,
      definition,
      existingProducts,
      importBatch,
      nextSortOrderRef,
      supabase,
    });

    results.push(result);
  }

  const importedProductIds = results.map((result) => result.id);
  const { data: finalRows, error: finalError } = await supabase
    .from("products")
    .select("id, slug, status, og_image_url, product_images(id)")
    .in("id", importedProductIds);

  if (finalError) {
    throw new Error(`Unable to run final product check: ${finalError.message}`);
  }

  const finalProducts = finalRows ?? [];
  const publishedCount = finalProducts.filter((product) => product.status === "published").length;
  const imageRecordCount = finalProducts.reduce(
    (count, product) => count + ((product.product_images ?? []).length || 0),
    0,
  );
  const missingImageCount = finalProducts.filter((product) => !product.og_image_url).length;

  return {
    importBatch,
    categoryCount: categories.length,
    productCount: results.length,
    publishedCount,
    imageRecordCount,
    missingImageCount,
    results,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const summary = await runImport();
  console.log(JSON.stringify(summary, null, 2));
}
