import { runImport } from "./import-amo-products-from-images.mjs";

const PRODUCT_DEFINITIONS = [
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a034741044c8191945d2c5c8618580d.png",
    name: "AMO Helios Star Emblem",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating solar emblem designed for ceremonial gifting, prestige counters, and collector-grade brand presentation.",
    philosophy:
      "AMO Helios Star Emblem treats radiance as a suspended object rather than a flat symbol.",
    description:
      "The faceted amber center, crystal-set rays, and gold-toned frame give this levitating object a strong premium gifting profile for anniversaries, executive presentation, and luxury display merchandising. The listing is ready for publication now, while the technical values below remain visually inferred and clearly marked as suggested for later engineering confirmation.",
    highlight:
      "A levitating starburst icon for symbolic gifting, prestige merchandising, and collector presentation.",
    features: [
      "Sunburst silhouette creates immediate ceremonial and celebratory recognition.",
      "Amber-like central stone builds warmth and visual hierarchy from a distance.",
      "Round stone base supports clean placement in vitrines, counters, and gift desks.",
    ],
    applications: [
      "executive commemorative gifts",
      "prestige counter merchandising",
      "collector display programs",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "symbolic luxury display",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 180-220 mm overall starburst width",
    loadCapacity: "Suggested: jeweled emblem up to 0.5 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Polished gold-tone metal, amber-like faceted centerpiece, and clear crystal pavé rays",
    moq: 50,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Helios Star Emblem | Floating Gift Display",
    seoDescription:
      "Premium floating display for ceremonial gifting, prestige counters, and levitating collector presentation.",
    altText:
      "Gold starburst levitating emblem with an amber gemstone center on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03713424148191883c1ede5e3a5d05.png",
    name: "AMO Ruby Scarab Crest",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating jeweled scarab created for collector gifting, luxury display stories, and symbolic premium merchandise.",
    philosophy:
      "AMO Ruby Scarab Crest makes ornament feel alive through suspension, symmetry, and light.",
    description:
      "Its ruby-toned wings, heart-cut central gem, and gold skeletal structure give this levitating collectible a strong visual identity for limited-edition gifts, luxury counters, and brand narrative display programs. The product entry is commercially ready now, with the specifications intentionally presented as suggested values rather than verified lab data.",
    highlight:
      "A levitating scarab collectible for symbolic gifting, prestige merchandising, and luxury counter display.",
    features: [
      "Insect silhouette gives the object immediate collector appeal and narrative character.",
      "Heart-shaped ruby center creates a high-contrast focal point against the dark body.",
      "Lightweight emblem presentation suits vitrines, gifting desks, and prestige retail counters.",
    ],
    applications: [
      "limited-edition collector gifts",
      "luxury retail counters",
      "symbolic brand merchandise",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "collector display",
      "floating product display",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 170-210 mm overall scarab height",
    loadCapacity: "Suggested: jeweled composite emblem up to 0.55 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Polished gold-tone metal, black enamel-effect shell, ruby-look faceted wings, and clear crystal accents",
    moq: 60,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Ruby Scarab Crest | Floating Collectible Gift",
    seoDescription:
      "Premium floating display for collectible gifting, luxury counters, and symbolic levitating merchandise.",
    altText:
      "Jeweled scarab levitating collectible with ruby wings and a heart-shaped gemstone center",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_0330d098fe9150a7016a02e0a58d648191b55e8f89d6212864.png",
    name: "AMO Noctis Crescent Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating crescent lamp designed for moody hospitality, luxury residential styling, and collector lighting programs.",
    philosophy:
      "AMO Noctis Crescent Lamp lets darkness carry the light instead of hiding it.",
    description:
      "The faceted smoky crescent form, warm inner glow, and black marble-look base give this levitating lamp a refined nocturnal identity suited to hotel suites, lounge corners, and premium display lighting. The product entry is ready for immediate publication, while all technical specifications remain visually inferred and marked as suggested for later confirmation.",
    highlight:
      "A levitating crescent lamp for moody interiors, hospitality styling, and premium collectible lighting.",
    features: [
      "Faceted crescent profile creates a sculptural silhouette even when the lamp is unlit.",
      "Warm internal glow adds atmosphere without exposing visible lamp hardware.",
      "Dark marble-look base broadens compatibility with luxury and high-contrast interiors.",
    ],
    applications: [
      "boutique hotel suites",
      "luxury residential styling",
      "collector lighting displays",
    ],
    tags: [
      "magnetic levitation lamp",
      "premium floating display",
      "levitating display",
      "floating product display",
      "mood lighting object",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover or slow 360 deg optional",
    diameter: "Suggested: 220-260 mm overall crescent span",
    loadCapacity: "Suggested: illuminated composite shell up to 0.9 kg",
    power: "Suggested: DC 12V / 20W adapter",
    finish:
      "Faceted smoky crystal-effect surface, warm integrated internal light, and black marble-effect base with gold-tone accents",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Noctis Crescent Lamp | Floating Crescent Light",
    seoDescription:
      "Magnetic levitation lamp for moody hospitality, luxury residential styling, and premium floating lighting displays.",
    altText:
      "Dark faceted crescent levitating lamp with a warm inner glow on a black marble-look base",
  },
];

const summary = await runImport({
  importBatch: "amo-image-import-2026-06-12-batch-4",
  productDefinitions: PRODUCT_DEFINITIONS,
});

console.log(JSON.stringify(summary, null, 2));
