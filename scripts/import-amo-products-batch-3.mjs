import { runImport } from "./import-amo-products-from-images.mjs";

const RAW_PRODUCT_DEFINITIONS = [
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a032338db68819198e0cef955bc1ea2.png",
    name: "AMO Cloister Automaton",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A contemplative floating collectible designed for luxury gifting, wellness interiors, and futuristic devotional display concepts.",
    philosophy:
      "AMO Cloister Automaton brings stillness and intelligence into the same levitating silhouette.",
    description:
      "The hooded robe form, soft metallic face, and subtle integrated lighting give this object strong appeal for collectible gifting, meditative hospitality corners, and premium desktop presentation. The product entry is ready for immediate publication, while all visually inferred engineering values remain clearly labeled as suggested and editable.",
    highlight:
      "A floating robotic icon for contemplative gifting, hospitality styling, and collector-grade presentation.",
    features: [
      "Hooded silhouette creates an immediate emotional and narrative hook.",
      "Integrated face lighting supports premium display value without visible support hardware.",
      "Compact round stone base makes the object counter-ready and gift-ready.",
    ],
    applications: [
      "collector gift programs",
      "wellness hospitality decor",
      "premium desktop display",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "collectible display",
      "floating product display",
    ],
    levitationHeight: "Suggested: 14-18 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 170-200 mm base figure width",
    loadCapacity: "Suggested: illuminated collectible shell up to 0.7 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Warm bronze-tone metal, soft ivory stone-composite robe, and subtle integrated light accents",
    moq: 80,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Cloister Automaton | Floating Collectible Gift",
    seoDescription:
      "Premium floating display for collectible gifting, wellness interiors, and futuristic levitating decor concepts.",
    altText:
      "Hooded robotic levitating collectible with bronze face and ivory robe on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03484f177881918daaf1a6e2804b8f.png",
    name: "AMO Amethyst Reliquary",
    categoryName: "Display Art Objects",
    series: "Nova Series",
    summary:
      "A cathedral-like floating crystal composition developed for prestige interiors, gallery installations, and ceremonial display programs.",
    philosophy:
      "AMO Amethyst Reliquary turns faceted light into an architectural presence.",
    description:
      "Tall amethyst-like spires, jeweled arches, and a luminous central crystal create a commanding levitating object for luxury lounges, exhibition feature zones, and collector interiors. The record is structured for immediate commercial use, while size, weight, power, and motion values remain suggested rather than certified.",
    highlight:
      "A levitating crystal shrine for gallery styling, ceremonial interiors, and premium collector display.",
    features: [
      "Multi-spire silhouette delivers strong vertical drama and long-distance presence.",
      "Luminous center crystal intensifies the visual hierarchy of the surrounding structure.",
      "Round stone base keeps the object suitable for plinths, vitrines, and counters.",
    ],
    applications: [
      "gallery installations",
      "ceremonial interior displays",
      "collector presentation zones",
    ],
    tags: [
      "display art object",
      "magnetic levitation product",
      "levitating display",
      "premium floating display",
      "crystal centerpiece",
    ],
    levitationHeight: "Suggested: 12-18 mm visual gap",
    rotation: "Suggested: slow 360 deg optional",
    diameter: "Suggested: 180-220 mm overall width",
    loadCapacity: "Suggested: composite crystal assembly up to 1.1 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Amethyst-look faceted crystal, polished silver-tone structure, and inset crystal detailing",
    moq: 20,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 40-50 days (editable)",
    seoTitle: "AMO Amethyst Reliquary | Floating Crystal Sculpture",
    seoDescription:
      "Levitating crystal display sculpture for luxury interiors, gallery installations, and premium showcase programs.",
    altText:
      "Purple crystal cathedral-like levitating sculpture with silver framework on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03778a35ac81918d0cfaa73d7bcede.png",
    name: "AMO Aureate Heart Lock",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating jeweled lock emblem designed for commemorative gifting, luxury counters, and symbolic retail storytelling.",
    philosophy:
      "AMO Aureate Heart Lock makes affection feel engineered into a collectible object.",
    description:
      "The heart-cut yellow centerpiece, pavé crystal surface, and polished gold framing give this levitating object strong premium gifting appeal for anniversaries, jewelry counters, and ceremonial launch moments. All technical specifications are visually inferred and intentionally marked as suggested.",
    highlight:
      "A levitating heart-lock icon for symbolic gifting, jewelry merchandising, and premium celebration display.",
    features: [
      "Heart-centered lock silhouette gives the object immediate symbolic value.",
      "High-brightness crystal paving supports prestige counter presentation.",
      "Compact round base keeps the display easy to deploy in vitrines and gifting desks.",
    ],
    applications: [
      "commemorative gift programs",
      "jewelry counter displays",
      "celebration merchandising",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "jewelry showcase",
      "floating product display",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 160-190 mm overall face width",
    loadCapacity: "Suggested: jeweled emblem up to 0.45 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Polished gold-tone metal, clear crystal pavé, and faceted yellow heart centerpiece",
    moq: 60,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Aureate Heart Lock | Floating Gift Display",
    seoDescription:
      "Premium floating display for jewelry counters, celebration gifts, and symbolic levitating collector programs.",
    altText:
      "Gold jeweled lock-shaped levitating gift display with a yellow heart gemstone on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03784cf34881919a48ed9fd7bdbbed.png",
    name: "AMO Panthera Crest",
    categoryName: "Premium Gifts",
    series: "Monolith Series",
    summary:
      "A floating feline insignia developed for prestige gifting, luxury club displays, and statement brand collectibles.",
    philosophy:
      "AMO Panthera Crest distills power, polish, and watchful tension into one suspended form.",
    description:
      "Black enamel-like panels, bright crystal trim, and emerald focal stones position this product for executive gifting, prestige retail presentation, and collector-led brand merchandise. The product is catalog-ready now, with suggested specifications clearly separated from confirmed engineering data.",
    highlight:
      "A levitating panther emblem for executive gifting, prestige retail, and collector-grade brand display.",
    features: [
      "Predatory feline face creates instant visual authority and memorability.",
      "Green center stone and eyes build strong contrast against the black-and-gold body.",
      "Oval emblem format supports display in vitrines, desks, and ceremonial presentation boxes.",
    ],
    applications: [
      "executive prestige gifts",
      "luxury retail display",
      "brand collectible programs",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "luxury merchandising",
      "collector presentation",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 170-210 mm overall emblem height",
    loadCapacity: "Suggested: jeweled composite emblem up to 0.65 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Gloss black enamel effect, polished gold-tone frame, clear crystal detailing, and emerald-look stones",
    moq: 50,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Panthera Crest | Floating Luxury Emblem",
    seoDescription:
      "Premium floating display for executive gifting, prestige retail, and levitating luxury emblem programs.",
    altText:
      "Black and gold panther-shaped levitating emblem with green gemstone center on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031544efd88191b7b4ae1235744f5c.png",
    name: "AMO Obsidian Cairn Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating stacked-stone lamp designed for wellness interiors, architectural desks, and quiet luxury hospitality.",
    philosophy:
      "AMO Obsidian Cairn Lamp uses suspended weight to make light feel grounded.",
    description:
      "Dark river-stone forms, narrow light seams, and a rectilinear stone base give this lamp a calm but high-contrast presence suited to spa lounges, premium workspaces, and gallery-style hospitality. Suggested values are visually inferred and remain editable for production review.",
    highlight:
      "A levitating stone lamp for wellness styling, quiet luxury desks, and hospitality showcase programs.",
    features: [
      "Stacked dark-stone silhouette gives the lamp a grounded, meditative identity.",
      "Thin integrated light seams create atmosphere without visible bulb hardware.",
      "Rectangular base supports clean placement in modern architectural settings.",
    ],
    applications: [
      "wellness hospitality interiors",
      "architectural desk styling",
      "quiet luxury retail displays",
    ],
    tags: [
      "magnetic levitation lamp",
      "premium floating display",
      "levitating display",
      "floating product display",
      "wellness lighting object",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 180-230 mm widest stone",
    loadCapacity: "Suggested: stone-look composite assembly up to 1.3 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Matte obsidian stone effect with warm integrated seam lighting and travertine-look base",
    moq: 25,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 40-50 days (editable)",
    seoTitle: "AMO Obsidian Cairn Lamp | Floating Stone Light",
    seoDescription:
      "Magnetic levitation lamp for wellness interiors, quiet luxury desks, and premium floating lighting displays.",
    altText:
      "Stacked black stone levitating lamp with warm light seams above a rectangular stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a030945cdf0819192338852375d665d.png",
    name: "AMO Codex Prism Display",
    categoryName: "Exhibition Displays",
    series: "Arc Series",
    summary:
      "A floating open-book display created for heritage storytelling, premium exhibitions, and ceremonial brand presentation.",
    philosophy:
      "AMO Codex Prism Display stages knowledge itself as the suspended centerpiece.",
    description:
      "Layered ivory pages, a crystalline illuminated spine, and a grounded wood plinth give this concept-ready display a rich editorial presence for museums, hotels, and symbolic launch environments. Visually inferred technical values are marked as suggested to preserve factual accuracy.",
    highlight:
      "A levitating book-and-crystal display for exhibition storytelling, heritage interiors, and ceremonial reveal programs.",
    features: [
      "Open-book silhouette gives the object an immediate narrative and cultural cue.",
      "Luminous central crystal acts as the suspended focal point between the two page blocks.",
      "Dark wood pedestal broadens compatibility with interiors, stages, and vitrines.",
    ],
    applications: [
      "museum exhibition styling",
      "heritage hospitality displays",
      "ceremonial brand reveal staging",
    ],
    tags: [
      "floating product display",
      "magnetic levitation product",
      "exhibition display",
      "levitating display",
      "heritage showcase",
    ],
    levitationHeight: "Suggested: 16-22 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 240-300 mm open book span",
    loadCapacity: "Suggested: composite book-and-crystal assembly up to 1.4 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Ivory stone-composite page blocks, etched crystal core, and dark walnut-look pedestal",
    moq: 20,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 40-55 days (editable)",
    seoTitle: "AMO Codex Prism Display | Floating Exhibition Piece",
    seoDescription:
      "Floating exhibition display for heritage storytelling, ceremonial staging, and premium levitating showcase programs.",
    altText:
      "Open book levitating exhibition display with a glowing crystal spine on a dark wood base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a032338db68819198e0cef955bc1ea2.png",
    name: "AMO Cloister Automaton",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A contemplative floating collectible designed for luxury gifting, wellness interiors, and futuristic devotional display concepts.",
    philosophy:
      "AMO Cloister Automaton brings stillness and intelligence into the same levitating silhouette.",
    description:
      "The hooded robe form, soft metallic face, and subtle integrated lighting give this object strong appeal for collectible gifting, meditative hospitality corners, and premium desktop presentation. The product entry is ready for immediate publication, while all visually inferred engineering values remain clearly labeled as suggested and editable.",
    highlight:
      "A floating robotic icon for contemplative gifting, hospitality styling, and collector-grade presentation.",
    features: [
      "Hooded silhouette creates an immediate emotional and narrative hook.",
      "Integrated face lighting supports premium display value without visible support hardware.",
      "Compact round stone base makes the object counter-ready and gift-ready.",
    ],
    applications: [
      "collector gift programs",
      "wellness hospitality decor",
      "premium desktop display",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "collectible display",
      "floating product display",
    ],
    levitationHeight: "Suggested: 14-18 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 170-200 mm base figure width",
    loadCapacity: "Suggested: illuminated collectible shell up to 0.7 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Warm bronze-tone metal, soft ivory stone-composite robe, and subtle integrated light accents",
    moq: 80,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Cloister Automaton | Floating Collectible Gift",
    seoDescription:
      "Premium floating display for collectible gifting, wellness interiors, and futuristic levitating decor concepts.",
    altText:
      "Hooded robotic levitating collectible with bronze face and ivory robe on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a034910bc2c8191931d7213646698e9.png",
    name: "AMO Pearl Shell Icon",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating shell-and-pearl collectible developed for beauty gifting, bridal presentation, and luxury counter display.",
    philosophy:
      "AMO Pearl Shell Icon turns a familiar symbol of rarity into a suspended object of ceremony.",
    description:
      "Rose-gold trim, nacre-like shell halves, and a floating pearl center create a polished gift object suited to premium beauty counters, bridal keepsakes, and feminine luxury merchandising. Suggested technical values are visually inferred and remain editable for final product engineering.",
    highlight:
      "A levitating pearl-shell display for bridal gifting, luxury beauty counters, and celebration merchandising.",
    features: [
      "Open shell silhouette frames the pearl center as the emotional focal point.",
      "Rose-gold detailing softens the object for beauty and bridal environments.",
      "Compact round base keeps the display compatible with counters, vitrines, and gift desks.",
    ],
    applications: [
      "bridal gift programs",
      "luxury beauty counters",
      "celebration display merchandising",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "luxury merchandising",
    ],
    levitationHeight: "Suggested: 12-16 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 180-220 mm shell width",
    loadCapacity: "Suggested: decorative pearl assembly up to 0.55 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Nacre-effect shell surface, rose-gold trim, and pearl-look centerpiece",
    moq: 60,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Pearl Shell Icon | Floating Gift Display",
    seoDescription:
      "Premium floating display for bridal gifting, luxury beauty counters, and levitating celebration showcases.",
    altText:
      "Open shell levitating gift display with a pearl center and rose-gold trim on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03171368b481918162afa2e47fd3a6.png",
    name: "AMO Sentinel Lantern Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating industrial lantern lamp designed for hospitality mood lighting, gallery corners, and premium desk display.",
    philosophy:
      "AMO Sentinel Lantern Lamp makes the suspended crystal feel protected rather than exposed.",
    description:
      "The dark cylindrical housing, cutaway front opening, and hanging crystal light core position this lamp for moody hospitality, gallery interiors, and giftable desk objects. The listing is commercially ready, with suggested specifications clearly marked as editable placeholders.",
    highlight:
      "A levitating lantern lamp for moody hospitality, gallery display, and collector-grade desk styling.",
    features: [
      "Cylindrical protective shell gives the lamp an architectural and industrial identity.",
      "Suspended crystal light core creates warm depth inside the open housing.",
      "Round stone base supports clean placement in hospitality and residential settings.",
    ],
    applications: [
      "boutique hospitality lighting",
      "gallery corner styling",
      "premium desk display",
    ],
    tags: [
      "magnetic levitation lamp",
      "floating product display",
      "premium floating display",
      "levitating display",
      "architectural lighting object",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 140-170 mm lantern body width",
    loadCapacity: "Suggested: integrated lantern module up to 0.9 kg",
    power: "Suggested: DC 12V / 20W adapter",
    finish:
      "Dark aged bronze-tone metal, suspended clear crystal core, and travertine-look base",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Sentinel Lantern Lamp | Floating Crystal Light",
    seoDescription:
      "Magnetic levitation lamp for boutique hospitality, gallery corners, and premium floating lantern display.",
    altText:
      "Dark cylindrical levitating lantern lamp with a glowing hanging crystal core on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03720433c8819196ed045eeb276d85.png",
    name: "AMO Opaline Orbit Globe",
    categoryName: "Display Art Objects",
    series: "Orbit Series",
    summary:
      "A floating orbital globe created for prestige interiors, collector displays, and science-inspired luxury merchandising.",
    philosophy:
      "AMO Opaline Orbit Globe treats planetary motion as a jewel object rather than a diagram.",
    description:
      "An opalescent blue globe wrapped in crystal-set orbital rings gives this levitating display a strong collectible identity for hotel lounges, executive gifts, and astronomical storytelling. Suggested specifications are visually inferred and intentionally left editable for engineering confirmation.",
    highlight:
      "A levitating orbital globe for prestige interiors, collector presentation, and premium science-inspired display.",
    features: [
      "Orbital ring structure adds dynamic complexity from every viewing angle.",
      "Opalescent blue sphere delivers strong color presence within neutral interiors.",
      "Compact round base keeps the object easy to stage in lounges, desks, and vitrines.",
    ],
    applications: [
      "collector display interiors",
      "executive scientific gifts",
      "premium hotel lounge styling",
    ],
    tags: [
      "display art object",
      "magnetic levitation product",
      "levitating display",
      "premium floating display",
      "floating product display",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 180-220 mm globe width including rings",
    loadCapacity: "Suggested: orb-and-ring assembly up to 0.8 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Opalescent blue globe, polished silver-tone orbital rings, and crystal detailing",
    moq: 40,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Opaline Orbit Globe | Floating Orbital Display",
    seoDescription:
      "Levitating display globe for prestige interiors, collector gifts, and premium science-inspired merchandising.",
    altText:
      "Blue opalescent levitating globe with jeweled silver orbital rings on a stone base",
  },
];

function dedupeBySourcePath(definitions) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];

  for (const definition of definitions) {
    if (seen.has(definition.sourcePath)) {
      duplicates.push(definition.sourcePath);
      continue;
    }

    seen.add(definition.sourcePath);
    unique.push(definition);
  }

  return {
    unique,
    duplicates,
  };
}

const { unique, duplicates } = dedupeBySourcePath(RAW_PRODUCT_DEFINITIONS);

const summary = await runImport({
  importBatch: "amo-image-import-2026-06-12-batch-3",
  productDefinitions: unique,
});

console.log(
  JSON.stringify(
    {
      inputCount: RAW_PRODUCT_DEFINITIONS.length,
      duplicateInputsSkipped: duplicates.length,
      duplicateSourcePaths: duplicates,
      ...summary,
    },
    null,
    2,
  ),
);
