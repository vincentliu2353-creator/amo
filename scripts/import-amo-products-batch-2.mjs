import { runImport } from "./import-amo-products-from-images.mjs";

const PRODUCT_DEFINITIONS = [
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03051f356c8191a2a83529550f670c.png",
    name: "AMO Abbey Halo Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A cathedral-inspired floating lamp designed for ceremonial interiors, boutique hospitality, and prestige display programs.",
    philosophy:
      "AMO Abbey Halo Lamp turns suspended light into an architectural moment of calm authority.",
    description:
      "The pointed arch frame, carved stone expression, and levitating orb create a product-ready lighting statement for premium lobbies, sacred-inspired installations, and collectible presentation zones. This listing is prepared for immediate catalog use, while visually inferred engineering values remain clearly marked as suggested and editable for production confirmation.",
    highlight:
      "A floating architectural lamp for hospitality entrances, ceremonial staging, and collector-grade interiors.",
    features: [
      "Gothic-inspired frame gives the floating orb a formal architectural setting.",
      "Warm luminous globe introduces a premium focal point without visible support structure.",
      "Stone-effect pedestal supports lobby, showroom, and exhibition deployment.",
    ],
    applications: [
      "boutique hospitality lobbies",
      "ceremonial interior staging",
      "premium collector displays",
    ],
    tags: [
      "magnetic levitation lamp",
      "levitating display",
      "floating product display",
      "hospitality lighting",
      "premium floating display",
    ],
    levitationHeight: "Suggested: 20-25 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 220-260 mm illuminated orb",
    loadCapacity: "Suggested: integrated light module up to 0.8 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Carved ivory stone effect, polished gold-tone metal, and opaline illuminated orb",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Abbey Halo Lamp | Floating Architectural Light",
    seoDescription:
      "Magnetic levitation lamp for ceremonial interiors, boutique hospitality, and premium floating display programs.",
    altText:
      "Gothic arch levitating lamp with a glowing orb and carved stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0326ed42808191b4a23d60b4116949.png",
    name: "AMO Bloomcap Icon Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A character-led floating lamp created for collectible gifting, playful retail storytelling, and family-friendly hospitality displays.",
    philosophy:
      "AMO Bloomcap Icon Lamp makes levitation feel gentle, bright, and instantly memorable.",
    description:
      "The rounded character body, coral mushroom cap, and illuminated center chamber position this product for themed retail, premium gift campaigns, and hospitality zones that need a softer emotional tone. The content is commercial-ready now, with suggested specifications clearly marked for later engineering approval.",
    highlight:
      "A floating character lamp for collectible programs, gifting drops, and cheerful branded environments.",
    features: [
      "Recognizable mushroom-cap silhouette improves shelf recall and campaign memorability.",
      "Warm illuminated center creates a premium toy-art and gifting presentation.",
      "Compact round base supports counter, shelf, and window deployment.",
    ],
    applications: [
      "collectible retail displays",
      "campaign gift programs",
      "family-oriented hospitality decor",
    ],
    tags: [
      "magnetic levitation lamp",
      "floating product display",
      "premium floating display",
      "collectible display",
      "levitating gift object",
    ],
    levitationHeight: "Suggested: 12-18 mm visual gap",
    rotation: "Suggested: static hover or 360 deg optional",
    diameter: "Suggested: 200-230 mm cap width",
    loadCapacity: "Suggested: integrated light object up to 0.5 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Gloss coral cap, soft-touch ivory body, and crystalline warm light core",
    moq: 100,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Bloomcap Icon Lamp | Floating Collectible Light",
    seoDescription:
      "Levitating lamp for collectible gifting, playful retail storytelling, and premium floating display concepts.",
    altText:
      "Cute mushroom character levitating lamp with a glowing center on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0347f943c48191b17e5f33d125f13b.png",
    name: "AMO Celadon Lock Charm",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating charm display developed for luxury gifting, jewelry counters, and ceremonial keepsake programs.",
    philosophy:
      "AMO Celadon Lock Charm suspends ornament with the precision of a showcase object.",
    description:
      "Celadon surfaces, crystal-set borders, and a suspended drop centerpiece give this product a high-jewelry presentation suited to collectible gifting and prestige retail counters. The record is ready for publishing now, with visually inferred specifications intentionally marked as suggested rather than certified.",
    highlight:
      "A levitating ornament display for jewelry merchandising, commemorative gifts, and collector presentation.",
    features: [
      "Lock-inspired outline communicates symbolism, security, and keepsake value.",
      "Crystal detailing and drop centerpiece support prestige retail storytelling.",
      "Marble-look base keeps the display formal and gift-ready.",
    ],
    applications: [
      "fine jewelry counters",
      "commemorative executive gifts",
      "collector display vitrines",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "jewelry showcase",
      "floating product display",
    ],
    levitationHeight: "Suggested: 10-15 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 190-220 mm overall face width",
    loadCapacity: "Suggested: display charm up to 0.6 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Celadon stone effect, polished silver-tone metal, and crystal accents",
    moq: 50,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Celadon Lock Charm | Levitating Gift Display",
    seoDescription:
      "Premium floating display for jewelry counters, ceremonial keepsakes, and collectible gift presentations.",
    altText:
      "Celadon lock-shaped levitating charm display with crystal edging and hanging drop centerpiece",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0372d1795c8191ac0e1be986211e53.png",
    name: "AMO Clover Signet Display",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A floating clover emblem created for celebration gifting, premium counter displays, and symbolic brand programs.",
    philosophy:
      "AMO Clover Signet Display makes luck and refinement feel engineered into one gesture.",
    description:
      "The four-leaf silhouette, polished gold framing, and crystal center make this concept-ready display a strong fit for commemorative gifts, jewelry-inspired merchandising, and campaign collectibles. Technical values are visually inferred and clearly marked as suggested for later confirmation.",
    highlight:
      "A levitating clover icon for symbolic gifting, beauty counters, and collector-led premium displays.",
    features: [
      "Clover silhouette gives the object immediate symbolic recognition.",
      "Crystal center creates a premium focal point for countertop presentation.",
      "Stone-look base pairs cleanly with gifting desks and luxury vitrines.",
    ],
    applications: [
      "celebration gift programs",
      "luxury counter merchandising",
      "symbolic brand collectibles",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "floating product display",
      "collector presentation",
    ],
    levitationHeight: "Suggested: 10-15 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 180-200 mm overall face width",
    loadCapacity: "Suggested: decorative emblem up to 0.45 kg",
    power: "Suggested: DC 12V / 12W adapter",
    finish:
      "Polished gold-tone metal, pearl-white enamel surface, and clear center crystal",
    moq: 50,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Clover Signet Display | Floating Gift Icon",
    seoDescription:
      "Premium floating display for celebration gifting, symbolic merchandise, and levitating collector programs.",
    altText:
      "Gold clover levitating display with pearl-white fill and crystal center on a stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03009a19108191bff7e3e06173e3f6.png",
    name: "AMO Cairn Light Totem",
    categoryName: "Display Art Objects",
    series: "Monolith Series",
    summary:
      "A floating zen-inspired stone totem designed for wellness interiors, gallery styling, and meditative retail display.",
    philosophy:
      "AMO Cairn Light Totem treats balance as the product, not just the effect.",
    description:
      "Stacked stone forms and a warm illuminated center create a calm sculptural object for spas, quiet hospitality lounges, and collectible interior programs. The listing is production-ready in tone, while inferred specifications remain marked as suggested and editable.",
    highlight:
      "A levitating stone totem for wellness, gallery styling, and calm premium interiors.",
    features: [
      "Stacked stone silhouette communicates balance and slow visual rhythm.",
      "Central illuminated sphere adds warmth without disturbing the restrained palette.",
      "Wide round base supports spa, gallery, and interior display placement.",
    ],
    applications: [
      "wellness hospitality decor",
      "gallery interior styling",
      "meditative retail displays",
    ],
    tags: [
      "display art object",
      "magnetic levitation product",
      "premium floating display",
      "levitating display",
      "wellness interior object",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover or slow 360 deg optional",
    diameter: "Suggested: 260-320 mm widest stone",
    loadCapacity: "Suggested: lightweight composite stack up to 1.2 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Sand-tone stone effect and warm opaline illuminated sphere",
    moq: 20,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 40-50 days (editable)",
    seoTitle: "AMO Cairn Light Totem | Floating Stone Sculpture",
    seoDescription:
      "Levitating display sculpture for wellness interiors, galleries, and calm premium floating display programs.",
    altText:
      "Zen stone stack levitating sculpture with a glowing center sphere above a circular stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0306fa82a081919739f1b96ade0567.png",
    name: "AMO Pagoda Ember Lamp",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating lantern display built for ceremonial hospitality, cultural interiors, and prestige exhibition moments.",
    philosophy:
      "AMO Pagoda Ember Lamp lets suspended light feel storied rather than technical.",
    description:
      "With its tiered plinth, etched glass chamber, and tapered gold spire, this concept-ready lamp suits ceremonial spaces, themed hospitality, and collectible lighting programs. Visually inferred specifications are labeled as suggested to preserve accuracy while still shipping a polished product record now.",
    highlight:
      "A levitating lantern concept for ceremonial display, cultural hospitality, and collector lighting programs.",
    features: [
      "Tiered pedestal composition gives the light object strong ceremonial presence.",
      "Etched glass chamber softens the lamp into a warm hospitality-grade glow.",
      "Gold spire silhouette extends vertical drama for showcase and altar-like settings.",
    ],
    applications: [
      "ceremonial hospitality displays",
      "cultural interior styling",
      "prestige exhibition lighting",
    ],
    tags: [
      "magnetic levitation lamp",
      "floating product display",
      "levitating display",
      "premium floating display",
      "architectural lighting object",
    ],
    levitationHeight: "Suggested: 18-22 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 160-190 mm lantern body",
    loadCapacity: "Suggested: integrated light module up to 0.9 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Etched clear glass, satin gold-tone metal, and carved limestone-effect base",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Pagoda Ember Lamp | Floating Lantern Display",
    seoDescription:
      "Magnetic levitation lamp for ceremonial hospitality, cultural interiors, and prestige exhibition lighting.",
    altText:
      "Floating lantern-style levitation lamp with etched glass chamber and tiered stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0309c32f8c8191ad7885c90b30e0d7.png",
    name: "AMO Nacre Flame Reliquary",
    categoryName: "Levitating Lamps",
    series: "Halo Series",
    summary:
      "A floating shell lamp concept created for luxury hospitality, sacred-inspired interiors, and premium showcase lighting.",
    philosophy:
      "AMO Nacre Flame Reliquary frames a suspended flame as an object of reverence.",
    description:
      "Layered nacre-like panels, gold trim, and a luminous ribbed centerpiece give this object a refined silhouette suited to boutique hotel suites, ceremonial corners, and collector display programs. Suggested specifications are intentionally marked as editable placeholders for production-stage review.",
    highlight:
      "A levitating shell lamp for sacred-inspired styling, boutique hospitality, and collector-grade presentation.",
    features: [
      "Layered nacre shell profile adds iridescent depth from multiple viewing angles.",
      "Suspended ribbed light core delivers a premium focal point inside the open chamber.",
      "Compact stone pedestal supports shelf, side table, and vitrine placement.",
    ],
    applications: [
      "luxury hospitality suites",
      "sacred-inspired interior styling",
      "collector lighting displays",
    ],
    tags: [
      "magnetic levitation lamp",
      "premium floating display",
      "levitating display",
      "floating product display",
      "iridescent lighting object",
    ],
    levitationHeight: "Suggested: 20-25 mm visual gap",
    rotation: "Suggested: slow 360 deg optional",
    diameter: "Suggested: 220-260 mm outer shell width",
    loadCapacity: "Suggested: integrated light module up to 0.9 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Iridescent nacre-effect panels, polished gold-tone trim, and ribbed illuminated core",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Nacre Flame Reliquary | Floating Shell Lamp",
    seoDescription:
      "Levitating lamp for luxury hospitality, sacred-inspired interiors, and premium floating showcase lighting.",
    altText:
      "Iridescent shell-shaped levitating lamp with a glowing ribbed center on a stone pedestal",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0314a6871c819197086cde154c5963.png",
    name: "AMO Helix Stone Lamp",
    categoryName: "Display Art Objects",
    series: "Monolith Series",
    summary:
      "A floating spiral monolith that blends sculptural stone language with concealed interior light.",
    philosophy:
      "AMO Helix Stone Lamp gives a solid material the illusion of internal breath.",
    description:
      "Its twisted shell form and warm inner glow position this product for modern gallery interiors, architectural deskscapes, and premium residential showrooms. The entry is designed for immediate publishing, while the technical values remain clearly presented as suggested and editable.",
    highlight:
      "A levitating illuminated monolith for modern interiors, gallery desktops, and premium design showrooms.",
    features: [
      "Twisted shell geometry creates movement even when the object remains still.",
      "Concealed inner glow adds atmosphere without requiring visible exposed light hardware.",
      "Low rectangular base supports display in architectural and minimalist environments.",
    ],
    applications: [
      "architectural desk styling",
      "modern gallery interiors",
      "premium design showrooms",
    ],
    tags: [
      "display art object",
      "magnetic levitation product",
      "levitating display",
      "premium floating display",
      "illuminated sculpture",
    ],
    levitationHeight: "Suggested: 20-30 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 150-180 mm object width",
    loadCapacity: "Suggested: lightweight composite shell up to 0.7 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Warm stone-composite shell with indirect interior illumination and travertine-effect base",
    moq: 30,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 35-45 days (editable)",
    seoTitle: "AMO Helix Stone Lamp | Floating Sculptural Light",
    seoDescription:
      "Floating sculptural light for modern interiors, gallery styling, and premium levitating display programs.",
    altText:
      "Twisted stone-like levitating illuminated sculpture above a rectangular stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a0318bdf5c8819188d1034bd58e3c44.png",
    name: "AMO Zenith Pagoda Display",
    categoryName: "Exhibition Displays",
    series: "Arc Series",
    summary:
      "A floating pagoda-inspired showcase created for cultural exhibitions, hospitality staging, and architectural storytelling.",
    philosophy:
      "AMO Zenith Pagoda Display treats levitation as a form of layered spatial rhythm.",
    description:
      "Tiered roof planes, a suspended luminous ring, and a carved square base give this concept-ready display strong exhibition presence for hospitality, museum retail, and cultural storytelling programs. Suggested specifications are visually inferred and remain editable for engineering confirmation.",
    highlight:
      "A levitating architectural display for exhibition storytelling, museum retail, and cultural hospitality moments.",
    features: [
      "Tiered pagoda silhouette delivers immediate architectural recognition.",
      "Floating light ring creates a clean visual pause between the upper structure and lower plinth.",
      "Square base geometry supports installation in exhibit cases and premium tabletop settings.",
    ],
    applications: [
      "cultural exhibition staging",
      "museum retail installations",
      "architectural hospitality displays",
    ],
    tags: [
      "exhibition display",
      "magnetic levitation product",
      "floating product display",
      "levitating display",
      "architectural showcase",
    ],
    levitationHeight: "Suggested: 18-24 mm visual gap",
    rotation: "Suggested: static hover",
    diameter: "Suggested: 260-300 mm roof span",
    loadCapacity: "Suggested: lightweight architectural composite up to 1.5 kg",
    power: "Suggested: DC 12V / 24W adapter",
    finish:
      "Sandstone-effect composite with warm diffused light ring and travertine-look base",
    moq: 20,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 40-50 days (editable)",
    seoTitle: "AMO Zenith Pagoda Display | Floating Exhibition Form",
    seoDescription:
      "Floating product display for cultural exhibitions, hospitality staging, and architectural showcase programs.",
    altText:
      "Pagoda-inspired levitating exhibition display with a glowing ring above a square stone base",
  },
  {
    sourcePath:
      "/Users/qmbook/Desktop/UT/整理后的全部图片/未命名文件夹/ig_05d9d7ce30dd6459016a03226bc4048191a6669149e6ca815f.png",
    name: "AMO Blush Specter Icon",
    categoryName: "Premium Gifts",
    series: "Nova Series",
    summary:
      "A translucent floating collectible designed for youth-oriented gifting, pop-luxury retail, and campaign-led display drops.",
    philosophy:
      "AMO Blush Specter Icon shows that playful forms can still be merchandised with premium control.",
    description:
      "The horned silhouette, translucent blush shell, and glittering suspended core make this product well suited to collectible launches, premium seasonal gifts, and attention-rich retail storytelling. The current entry is ready for publishing now, with suggested technical values clearly marked as editable placeholders.",
    highlight:
      "A levitating collectible icon for campaign gifting, pop-luxury merchandising, and premium display drops.",
    features: [
      "Translucent shell and glitter core create strong shelf impact under retail lighting.",
      "Compact character silhouette suits campaign collectibles and limited-edition gifts.",
      "Clean round marble-look base supports counter, vitrine, and desktop presentation.",
    ],
    applications: [
      "seasonal gift campaigns",
      "pop-luxury retail displays",
      "limited-edition collectibles",
    ],
    tags: [
      "premium floating display",
      "magnetic levitation product",
      "levitating gift object",
      "collectible display",
      "floating product display",
    ],
    levitationHeight: "Suggested: 12-18 mm visual gap",
    rotation: "Suggested: 360 deg optional",
    diameter: "Suggested: 170-200 mm body width",
    loadCapacity: "Suggested: resin collectible shell up to 0.5 kg",
    power: "Suggested: DC 12V / 18W adapter",
    finish:
      "Translucent blush resin, suspended glitter core, and marble-effect base",
    moq: 100,
    moqUnit: "units (editable)",
    leadTimeText: "Suggested: 30-40 days (editable)",
    seoTitle: "AMO Blush Specter Icon | Floating Collectible Gift",
    seoDescription:
      "Premium floating display for collectible gifting, seasonal campaigns, and pop-luxury retail storytelling.",
    altText:
      "Pink translucent levitating collectible figure with horns and glitter core on a marble base",
  },
];

const summary = await runImport({
  importBatch: "amo-image-import-2026-06-12-batch-2",
  productDefinitions: PRODUCT_DEFINITIONS,
});

console.log(JSON.stringify(summary, null, 2));
