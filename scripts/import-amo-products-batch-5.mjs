import { runImport } from "./import-amo-products-from-images.mjs";

const PRODUCT_DEFINITIONS = [
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a030c8250cc81918b5cee5554c401e7.png",
    name: "AMO Mantra Spindle",
    categoryName: "Display Art Objects",
    series: "Arc Series",
    summary:
      "A floating ritual-inspired spindle designed for premium interiors, collector programs, and ceremonial display storytelling.",
    philosophy:
      "AMO Mantra Spindle turns rotational symbolism into a suspended object of calm precision.",
    description:
      "The engraved bronze-toned cylinder, crystal-like axial core, and carved architectural base give this levitating object a strong presence for hospitality lounges, cultural gifting, and gallery-grade brand installations. The product entry is ready for publication now, while dimensional and electrical figures remain visually inferred and clearly marked as suggested for later engineering confirmation.",
    highlight:
      "A levitating ceremonial display object for refined hospitality, cultural gifting, and immersive exhibition environments.",
    features: [
      "Layered bronze drum profile creates immediate visual depth and collector appeal.",
      "Clear crystal-like vertical core adds light transmission and a premium suspended focal point.",
      "Carved stone-look base supports placement in vitrines, reception counters, and feature plinths.",
    ],
    applications: [
      "luxury hospitality lounges",
      "cultural commemorative gifting",
      "gallery-style display programs",
    ],
    tags: [
      "magnetic levitation product",
      "levitating display",
      "display art object",
      "premium floating display",
      "ceremonial showcase",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: 360 deg / 720 deg optional",
    diameter: "Suggested: 150-190 mm body diameter",
    loadCapacity: "Suggested: illuminated spindle assembly up to 1.0 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Antique bronze-tone metal, clear crystal-like axial element, and carved ivory stone-effect base",
    customizationOptions:
      "logo plaque, finish tone, crystal color, packaging, magnetic module, base detailing",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Mantra Spindle | Floating Ritual Display",
    seoDescription:
      "Premium floating display object for ceremonial interiors, gallery presentation, and OEM magnetic levitation programs.",
    altText:
      "Bronze ritual spindle levitating above a carved stone base with a crystal-like vertical core",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a037bceccec8191a5cb6a463788c7d2.png",
    name: "AMO Amber Sutra Reliquary",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating amber-toned reliquary object created for contemplative gifting, collector presentation, and prestige counter display.",
    philosophy:
      "AMO Amber Sutra Reliquary frames stillness as a premium suspended experience.",
    description:
      "Its amber-like capsule body, seated figure centerpiece, and jeweled silver-toned framing make this levitating object suitable for commemorative gifts, boutique counters, and collector-focused merchandising. The listing is commercially ready now, while technical values that cannot be verified from the image remain editable and clearly marked as suggested.",
    highlight:
      "A floating contemplative gift object for prestige merchandising, collector display, and ceremonial presentation.",
    features: [
      "Amber-toned body creates warmth and depth from near and far viewing distances.",
      "Encased central figure adds narrative value for gifting and collector-led merchandising.",
      "Jewel-set frame sharpens the product's premium positioning for display and presentation use.",
    ],
    applications: [
      "commemorative executive gifts",
      "collector display counters",
      "ceremonial retail presentation",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "collector presentation",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 110-140 mm body width",
    loadCapacity: "Suggested: jeweled capsule assembly up to 0.75 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Amber-like translucent body, polished silver-tone frame, clear crystal accents, and white marble-effect base",
    customizationOptions:
      "logo, stone color, figure motif, packaging, base finish, magnetic module",
    moq: 40,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Amber Sutra Reliquary | Floating Gift Object",
    seoDescription:
      "Premium floating gift object for collector presentation, ceremonial display, and OEM magnetic levitation merchandising.",
    altText:
      "Amber-toned levitating reliquary capsule with a seated figure centerpiece on a marble-look base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0317ed7f008191acb1f3a865c63261.png",
    name: "AMO Ember Lattice Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating wood-and-stone lamp designed for boutique hospitality, executive desks, and warm architectural interiors.",
    philosophy:
      "AMO Ember Lattice Lamp uses suspension to make material warmth feel lighter and more deliberate.",
    description:
      "Dark slatted framing and a glowing alabaster-like inner column give this levitating lamp a disciplined vertical silhouette suited to boutique suites, reception consoles, and premium desk styling. The product data is ready for immediate publication, with all inferred engineering values intentionally presented as suggested placeholders for later confirmation.",
    highlight:
      "A levitating architectural lamp for hospitality, executive workspaces, and warm modern interior styling.",
    features: [
      "Vertical slat structure gives the lamp strong architectural rhythm without visual bulk.",
      "Warm inner diffuser creates a soft hospitality-grade glow with a sculptural floating effect.",
      "Round stone-look base keeps the presentation stable for desks, consoles, and side tables.",
    ],
    applications: [
      "boutique hotel suites",
      "executive desk lighting",
      "premium residential staging",
    ],
    tags: [
      "magnetic levitation lamp",
      "levitating display",
      "floating product display",
      "premium floating display",
      "architectural lighting object",
    ],
    levitationHeight: "Suggested: 18-22 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 110-140 mm body width",
    loadCapacity: "Suggested: lamp assembly up to 0.8 kg",
    power: "Suggested: DC 12V / 16W adapter",
    finish:
      "Charred oak-look slats, warm alabaster-like illuminated core, and travertine-effect base",
    customizationOptions:
      "wood stain, light temperature, logo, packaging, magnetic module, base finish",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Ember Lattice Lamp | Floating Wood Light",
    seoDescription:
      "Magnetic levitation lamp for hospitality, desks, and warm architectural interiors with editable OEM specifications.",
    altText:
      "Dark wood slat levitating lamp with a glowing stone-like inner column on a round stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0323d236548191b58d76b642a19614.png",
    name: "AMO Citrine Fox Totem",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating fox collectible designed for premium gifting, playful luxury merchandising, and limited-edition brand stories.",
    philosophy:
      "AMO Citrine Fox Totem balances charm and polish without reducing levitation to novelty.",
    description:
      "The ivory-toned body, faceted amber-like ears and tail, and gold accents give this levitating figure a strong premium collectible profile for gift programs, family-focused hospitality, and boutique merchandising. It is ready to publish now, while all technical figures remain clearly marked as suggested for later product engineering alignment.",
    highlight:
      "A floating character collectible for premium gifts, boutique counters, and campaign-led display programs.",
    features: [
      "Character-led silhouette improves memorability for gifting and retail storytelling.",
      "Faceted amber-like tail and ears introduce gemstone cues without overcomplicating the form.",
      "Compact circular base supports easy placement in gift vitrines and checkout displays.",
    ],
    applications: [
      "limited-edition premium gifts",
      "boutique retail counters",
      "family hospitality merchandising",
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
    diameter: "Suggested: 140-170 mm overall figure width",
    loadCapacity: "Suggested: character collectible up to 0.45 kg",
    power: "Suggested: DC 12V / 10W adapter",
    finish:
      "Matte ivory composite, faceted amber-like crystal details, and polished gold-tone accent points",
    customizationOptions:
      "logo, colorway, gemstone tone, packaging, magnetic module, size adjustment",
    moq: 80,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 25-35 days (editable)",
    seoTitle: "AMO Citrine Fox Totem | Floating Gift Collectible",
    seoDescription:
      "Premium floating collectible for gifting, boutique merchandising, and playful luxury display with OEM magnetic levitation.",
    altText:
      "Ivory fox levitating collectible with amber crystal ears and tail above a stone-look base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0325d940e08191a39ac916970abb05.png",
    name: "AMO Nova Cadet",
    categoryName: "Premium Gifts",
    series: "Orbit Series",
    summary:
      "A floating astronaut companion designed for campaign gifting, collector drops, and future-themed retail presentation.",
    philosophy:
      "AMO Nova Cadet gives levitation a friendly face while keeping the object premium and display-ready.",
    description:
      "Its clean ivory shell, amber visor, and illuminated star core make this levitating character suitable for launches, technology gifting, and curated lifestyle merchandising. The product entry is ready for upload now, with all unverified mechanical and electrical values intentionally presented as suggested placeholders for later editing.",
    highlight:
      "A floating space-age collectible for campaign gifting, tech showcases, and premium lifestyle merchandising.",
    features: [
      "Rounded astronaut silhouette increases shelf recognition and broadens gifting appeal.",
      "Integrated star-shaped chest light creates a strong visual focal point in low-light displays.",
      "Compact base format suits desktop merchandising, vitrines, and premium packaging programs.",
    ],
    applications: [
      "technology launch gifts",
      "collector merchandise drops",
      "lifestyle retail displays",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "tech gift collectible",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 120-150 mm body width",
    loadCapacity: "Suggested: illuminated character body up to 0.65 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Gloss ivory shell, amber visor, warm integrated chest light, and pale travertine-effect base",
    customizationOptions:
      "logo, visor color, light motif, packaging, magnetic module, size adjustment",
    moq: 60,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 28-38 days (editable)",
    seoTitle: "AMO Nova Cadet | Floating Space Gift Display",
    seoDescription:
      "Premium floating display for tech gifting, collector drops, and futuristic merchandising with OEM magnetic levitation.",
    altText:
      "Ivory astronaut levitating collectible with an amber visor and glowing star chest on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03730b3ce08191ab605e8d1644058b.png",
    name: "AMO Malachite Scarab",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating jeweled scarab developed for collector gifting, prestige merchandising, and symbolic luxury display.",
    philosophy:
      "AMO Malachite Scarab lets ornament feel alive through symmetry, suspension, and polished material contrast.",
    description:
      "The green stone-like wings, crystal-set crown, and gold structure give this levitating collectible a strong premium identity for luxury counters, limited-edition campaigns, and collector-driven product stories. The item is ready for publication now, while all technical data remains visually inferred and marked as suggested for later editing.",
    highlight:
      "A floating scarab collectible for symbolic gifting, collector display, and luxury counter presentation.",
    features: [
      "Distinct insect silhouette creates immediate collector recognition and campaign recall.",
      "Malachite-like wing surfaces add rich color contrast against the polished gold framework.",
      "Compact plinth footprint fits vitrines, jewelry counters, and premium gift displays.",
    ],
    applications: [
      "collector premium gifts",
      "luxury counter merchandising",
      "limited-edition campaign displays",
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
    diameter: "Suggested: 150-190 mm overall scarab height",
    loadCapacity: "Suggested: jeweled scarab assembly up to 0.55 kg",
    power: "Suggested: DC 12V / 10W adapter",
    finish:
      "Polished gold-tone metal, malachite-look wing panels, emerald-tone centerpiece, and crystal accents",
    customizationOptions:
      "logo, stone color, finish tone, packaging, magnetic module, size adjustment",
    moq: 60,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Malachite Scarab | Floating Collectible Gift",
    seoDescription:
      "Premium floating collectible for luxury counters, symbolic gifting, and OEM magnetic levitation display programs.",
    altText:
      "Gold and green scarab levitating collectible with malachite-like wings on a pale stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0340b088b881919588ebb2150b2755.png",
    name: "AMO Opaline Flutter Crest",
    categoryName: "Premium Gifts",
    series: "Halo Series",
    summary:
      "A floating butterfly emblem designed for beauty counters, commemorative gifting, and collector-led luxury presentation.",
    philosophy:
      "AMO Opaline Flutter Crest turns lightness into a controlled suspended gesture.",
    description:
      "Rose-gold framing, crystal-lined wings, and an opal-like center body give this levitating butterfly a refined visual language for beauty merchandising, wedding gifting, and celebratory retail programs. The listing is ready for publication now, while all engineering details remain editable and clearly labeled as suggested values.",
    highlight:
      "A floating butterfly display for premium gifting, beauty merchandising, and elegant campaign storytelling.",
    features: [
      "Open wing geometry creates a light, premium profile from multiple viewing angles.",
      "Opal-like body introduces soft chromatic play that suits beauty and jewelry presentation.",
      "Compact round plinth keeps the object easy to deploy across vitrines and counters.",
    ],
    applications: [
      "luxury beauty counters",
      "commemorative gifting programs",
      "celebration retail displays",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "beauty counter display",
    ],
    levitationHeight: "Suggested: 10-14 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 170-210 mm wingspan",
    loadCapacity: "Suggested: butterfly emblem up to 0.4 kg",
    power: "Suggested: DC 12V / 8W adapter",
    finish:
      "Rose-gold tone metal, opal-like center stone, clear crystal pavé, and white marble-effect base",
    customizationOptions:
      "logo, finish tone, center stone color, packaging, magnetic module, size adjustment",
    moq: 70,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 25-35 days (editable)",
    seoTitle: "AMO Opaline Flutter Crest | Floating Gift Display",
    seoDescription:
      "Premium floating butterfly display for beauty counters, gifting, and luxury OEM magnetic levitation programs.",
    altText:
      "Rose-gold butterfly levitating emblem with crystal wings and an opal-like body on a marble base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a031405420c8191b7099311a51d4b8e.png",
    name: "AMO Strata Glow Monolith",
    categoryName: "Display Art Objects",
    series: "Monolith Series",
    summary:
      "A floating stacked-block sculpture created for executive interiors, gallery styling, and architectural display programs.",
    philosophy:
      "AMO Strata Glow Monolith uses interruption, weight, and light to make suspension feel intentional.",
    description:
      "Solid walnut-like blocks and a luminous mineral center create a disciplined levitating composition suited to executive lounges, design galleries, and premium real-estate showrooms. The product entry is ready for upload now, while technical specifications remain clearly marked as suggested placeholders for later engineering confirmation.",
    highlight:
      "A floating stacked sculpture for executive interiors, architectural styling, and high-design display environments.",
    features: [
      "Stacked block composition creates strong visual rhythm and material contrast.",
      "Illuminated center slab introduces a restrained glow without compromising the sculptural form.",
      "Square wood-look base supports deployment on consoles, sideboards, and presentation plinths.",
    ],
    applications: [
      "executive lounge interiors",
      "gallery-style design displays",
      "premium real-estate staging",
    ],
    tags: [
      "display art object",
      "magnetic levitation product",
      "levitating display",
      "premium floating display",
      "architectural sculpture",
    ],
    levitationHeight: "Suggested: 16-22 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 160-210 mm overall block span",
    loadCapacity: "Suggested: stacked wood composite assembly up to 1.2 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Walnut-look solid blocks, translucent calcite-like illuminated center, and walnut-finished square base",
    customizationOptions:
      "logo, wood species, light temperature, packaging, magnetic module, scale adjustment",
    moq: 25,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Strata Glow Monolith | Floating Wood Sculpture",
    seoDescription:
      "Architectural floating display sculpture for executive interiors and gallery styling with OEM magnetic levitation.",
    altText:
      "Stacked walnut-look levitating sculpture with a glowing stone-like center above a square wood base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03174756d081919cbd3278e199dfc0.png",
    name: "AMO Rift Core Lamp",
    categoryName: "Levitating Lamps",
    series: "Monolith Series",
    summary:
      "A floating split-stone lamp designed for quiet hospitality, sculptural side tables, and minimal luxury interiors.",
    philosophy:
      "AMO Rift Core Lamp makes light feel discovered rather than exposed.",
    description:
      "The dark stone-like shell, narrow illuminated seam, and calm oval profile position this levitating lamp for spa lounges, premium residences, and restrained retail installations. The listing is ready to publish now, while all engineering values that cannot be confirmed from the image are intentionally left as suggested and editable.",
    highlight:
      "A levitating seam-lit stone lamp for calm hospitality, minimal interiors, and sculptural presentation zones.",
    features: [
      "Split oval geometry creates a strong monolithic silhouette with a controlled light reveal.",
      "Warm central seam supports ambient use without visually over-lighting the object.",
      "Round stone-look base keeps the lamp compatible with side tables, consoles, and shelves.",
    ],
    applications: [
      "spa and wellness lounges",
      "minimal luxury residences",
      "sculptural retail staging",
    ],
    tags: [
      "magnetic levitation lamp",
      "levitating display",
      "premium floating display",
      "floating product display",
      "minimal ambient light",
    ],
    levitationHeight: "Suggested: 14-20 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 130-160 mm oval body width",
    loadCapacity: "Suggested: stone-look lamp shell up to 0.9 kg",
    power: "Suggested: DC 12V / 14W adapter",
    finish:
      "Matte basalt-like exterior, warm linear internal light channel, and pale travertine-effect base",
    customizationOptions:
      "logo, stone texture, light temperature, packaging, magnetic module, size adjustment",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Rift Core Lamp | Floating Stone Light",
    seoDescription:
      "Magnetic levitation lamp for wellness lounges, minimal interiors, and premium floating lighting displays.",
    altText:
      "Dark stone-look levitating lamp split by a warm illuminated seam above a pale stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0301507e388191b836fd09e8a7b482.png",
    name: "AMO Pavilion Lantern",
    categoryName: "Levitating Lamps",
    series: "Arc Series",
    summary:
      "A floating architectural lantern developed for tea lounges, boutique hospitality, and serene premium interiors.",
    philosophy:
      "AMO Pavilion Lantern lets structure hold the atmosphere while levitation carries the surprise.",
    description:
      "Its wood-frame pavilion silhouette and warm fiber-like diffuser create a calm levitating lamp concept suited to hospitality suites, wellness reception areas, and culturally inspired interiors. The product entry is ready for immediate upload, while all technical figures remain clearly marked as suggested placeholders for later confirmation.",
    highlight:
      "A floating lantern for hospitality, wellness interiors, and architectural mood-lighting programs.",
    features: [
      "Open-frame pavilion form delivers a recognizable architectural identity without visual heaviness.",
      "Warm inner diffuser provides hospitality-friendly ambient light with a clean floating effect.",
      "Stepped stone-look base gives the object suitable presence for sideboards, reception desks, and display plinths.",
    ],
    applications: [
      "tea lounge interiors",
      "boutique hospitality suites",
      "wellness reception lighting",
    ],
    tags: [
      "magnetic levitation lamp",
      "levitating display",
      "floating product display",
      "premium floating display",
      "architectural lantern",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 150-190 mm body width",
    loadCapacity: "Suggested: framed lantern assembly up to 1.1 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Natural oak-look frame, warm fiber-paper-like illuminated core, and carved limestone-effect base",
    customizationOptions:
      "logo, wood stain, light temperature, packaging, magnetic module, frame proportion",
    moq: 25,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Pavilion Lantern | Floating Architectural Lamp",
    seoDescription:
      "Magnetic levitation lamp for tea lounges, hospitality, and serene architectural interiors with OEM customization.",
    altText:
      "Wood-frame levitating lantern with a warm illuminated paper-like core above a stone-look base",
  },
];

const summary = await runImport({
  importBatch: "amo-image-import-2026-06-12-batch-5",
  productDefinitions: PRODUCT_DEFINITIONS,
});

console.log(JSON.stringify(summary, null, 2));
