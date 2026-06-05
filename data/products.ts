import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "prd_aircore_x1",
    slug: "aircore-planar-x1",
    name: "AirCore Planar X1",
    series: "X Series",
    category: "Planar Motor",
    productImage: "https://amo.example.com/media/products/aircore-planar-x1/hero.jpg",
    summary:
      "High-throughput planar transport system for semiconductor, optics, and precision assembly lines.",
    description:
      "AirCore Planar X1 combines frictionless transport, sub-micron repeatability, and modular tile expansion for manufacturing cells that need both speed and contamination control.",
    highlight: "Up to 6 independent movers on one deck with no mechanical contact.",
    leadTime: "8-10 weeks",
    minOrderQty: "1 line",
    heroMetric: "2.4 g dynamic acceleration",
    tags: ["Cleanroom", "High-speed", "Semiconductor"],
    applications: ["Wafer handling", "Optical alignment", "Advanced electronics assembly"],
    features: [
      "Contactless planar motion with programmable mover paths",
      "Compact tile architecture for scalable OEM layouts",
      "Integrated position feedback for closed-loop precision control",
    ],
    specs: [
      { label: "Payload per mover", value: "2.5 kg" },
      { label: "Repeatability", value: "+/- 5 um" },
      { label: "Deck size", value: "Up to 2400 x 1200 mm" },
      { label: "Cleanroom class", value: "ISO Class 5 compatible" },
    ],
    faqs: [
      {
        question: "Can the deck geometry be customized for existing equipment frames?",
        answer:
          "Yes. Tile count, mover size, cable exit, and mechanical interface can be adapted for OEM integration.",
      },
      {
        question: "Does it support synchronized multi-mover workflows?",
        answer:
          "Yes. Motion profiles can coordinate multiple movers for handoff, buffering, or parallel work zones.",
      },
    ],
    featured: true,
    caseStudySlugs: ["wafer-inspection-cell"],
  },
  {
    id: "prd_halo_m200",
    slug: "halo-stage-m200",
    name: "Halo Stage M200",
    series: "Halo",
    category: "Levitation Stage",
    productImage: "https://amo.example.com/media/products/halo-stage-m200/hero.jpg",
    summary:
      "Six-degree-of-freedom magnetic levitation stage for metrology, laser processing, and inspection tools.",
    description:
      "Halo Stage M200 is engineered for ultra-smooth motion, zero-wear positioning, and vibration isolation in high-value industrial processes.",
    highlight: "Fine stabilization platform for precision optics and metrology payloads.",
    leadTime: "6-8 weeks",
    minOrderQty: "2 units",
    heroMetric: "0.2 um settling precision",
    tags: ["Metrology", "Laser processing", "Six-DOF"],
    applications: ["Optical inspection", "Laser cutting", "Precision dispensing"],
    features: [
      "Six-degree-of-freedom active stabilization",
      "No particle generation from ball screws or rails",
      "High bandwidth control for dynamic process compensation",
    ],
    specs: [
      { label: "Travel", value: "200 x 200 x 50 mm" },
      { label: "Angular correction", value: "±3 deg" },
      { label: "Settling time", value: "< 12 ms" },
      { label: "Max payload", value: "8 kg" },
    ],
    faqs: [
      {
        question: "Can AMO tune the controller around our process tool dynamics?",
        answer:
          "Yes. Controller gains, payload models, and fieldbus mappings are tuned jointly during commissioning.",
      },
      {
        question: "Is cleanroom validation available?",
        answer:
          "Validation packages can be supplied for cleanroom-oriented builds and process qualification plans.",
      },
    ],
    featured: true,
    caseStudySlugs: ["optical-module-assembly"],
  },
  {
    id: "prd_vector_lt",
    slug: "vector-loop-lt",
    name: "Vector Loop LT",
    series: "Vector",
    category: "Transfer Module",
    productImage: "https://amo.example.com/media/products/vector-loop-lt/hero.jpg",
    summary:
      "Closed-loop levitation conveyor for buffer-free transfer between process stations and test cells.",
    description:
      "Vector Loop LT replaces belts, pallets, and stop stations with independent magnetic carriers that route parts with deterministic timing and zero contact wear.",
    highlight: "Continuous routing for flexible factories and short-cycle production.",
    leadTime: "10-12 weeks",
    minOrderQty: "1 line",
    heroMetric: "120 ppm carrier throughput",
    tags: ["Flexible factory", "Carrier routing", "High uptime"],
    applications: ["Battery module transfer", "E-motor assembly", "Inline testing"],
    features: [
      "Independent carrier routing without mechanical switching",
      "Low maintenance transfer path for 24/7 production",
      "Fast format changes through software recipes",
    ],
    specs: [
      { label: "Carrier count", value: "Up to 48 per loop" },
      { label: "Top speed", value: "4.2 m/s" },
      { label: "Positioning accuracy", value: "+/- 20 um" },
      { label: "Ingress protection", value: "Up to IP54 enclosure" },
    ],
    faqs: [
      {
        question: "Can the loop be built in straight and curved sections?",
        answer:
          "Yes. Standard loop modules support mixed geometry for compact and high-throughput layouts.",
      },
      {
        question: "How is carrier identification handled?",
        answer:
          "Each carrier can be mapped to a digital identity for traceability, routing logic, and recipe assignment.",
      },
    ],
    featured: true,
    caseStudySlugs: ["battery-sortation-line"],
  },
  {
    id: "prd_aperture_s90",
    slug: "aperture-sorter-s90",
    name: "Aperture Sorter S90",
    series: "Aperture",
    category: "Transfer Module",
    productImage: "https://amo.example.com/media/products/aperture-sorter-s90/hero.jpg",
    summary:
      "Compact levitation sortation unit for fragile parts, medical consumables, and cosmetic packaging.",
    description:
      "Aperture Sorter S90 uses precision magnetic movers to separate, inspect, and distribute delicate products without impact or scuffing.",
    highlight: "Small-footprint sorting for lines where conventional stops damage parts.",
    leadTime: "6 weeks",
    minOrderQty: "4 modules",
    heroMetric: "0 mechanical contact points",
    tags: ["Fragile parts", "Medical", "Low vibration"],
    applications: ["Medical disposables", "Cosmetic filling", "Inspection bypass"],
    features: [
      "Soft-routing for scratch-sensitive products",
      "Compact module for retrofit cells",
      "Programmable reject and bypass paths",
    ],
    specs: [
      { label: "Module footprint", value: "900 x 450 mm" },
      { label: "Payload", value: "0.5 kg" },
      { label: "Speed", value: "2.0 m/s" },
      { label: "I/O interface", value: "EtherCAT / Profinet" },
    ],
    faqs: [
      {
        question: "Can this be added to a non-AMO line?",
        answer:
          "Yes. The module is designed for retrofit projects with standard fieldbus and machine safety handshakes.",
      },
      {
        question: "Is custom tooling included?",
        answer:
          "Carrier nests and product-contact features can be co-designed as part of an OEM package.",
      },
    ],
    caseStudySlugs: [],
  },
  {
    id: "prd_zenith_c300",
    slug: "zenith-cleanroom-lift",
    name: "Zenith Cleanroom Lift",
    series: "Zenith",
    category: "Levitation Stage",
    productImage: "https://amo.example.com/media/products/zenith-cleanroom-lift/hero.jpg",
    summary:
      "Vertical magnetic lift platform for contamination-sensitive process moves and inspection transitions.",
    description:
      "Zenith Cleanroom Lift is a compact vertical transport axis with contactless levitation control for reducing wear, backlash, and particle generation.",
    highlight: "Vertical motion without screw-driven contamination risks.",
    leadTime: "8 weeks",
    minOrderQty: "2 units",
    heroMetric: "300 mm vertical travel",
    tags: ["Vertical transport", "Cleanroom", "Backlash-free"],
    applications: ["Inspection transfer", "Tray elevation", "Microelectronics assembly"],
    features: [
      "Backlash-free vertical positioning",
      "Compact safety enclosure options",
      "Low-particle motion path for critical environments",
    ],
    specs: [
      { label: "Travel", value: "300 mm" },
      { label: "Repeatability", value: "+/- 8 um" },
      { label: "Payload", value: "4 kg" },
      { label: "Control cycle", value: "1 kHz" },
    ],
    faqs: [
      {
        question: "Does the platform hold position during power events?",
        answer:
          "Failsafe holding and controlled parking strategies are configured based on the machine risk assessment.",
      },
      {
        question: "Can it operate in enclosed vacuum-adjacent modules?",
        answer:
          "The design can be adapted for specialized enclosures and process-adjacent clean environments after review.",
      },
    ],
    caseStudySlugs: [],
  },
  {
    id: "prd_flux_oem",
    slug: "flux-drive-oem-kit",
    name: "Flux Drive OEM Kit",
    series: "Flux",
    category: "OEM Platform",
    productImage: "https://amo.example.com/media/products/flux-drive-oem-kit/hero.jpg",
    summary:
      "Developer kit for machine builders that need AMO levitation motion embedded inside their own equipment.",
    description:
      "Flux Drive OEM Kit packages coils, movers, controller, reference mechanics, and application engineering support for rapid OEM integration.",
    highlight: "Fastest path for partners building proprietary levitation equipment around AMO motion cores.",
    leadTime: "4-6 weeks",
    minOrderQty: "1 kit",
    heroMetric: "12-week OEM launch path",
    tags: ["OEM", "Integration", "Development kit"],
    applications: ["Custom tools", "R&D platforms", "Pilot production systems"],
    features: [
      "Reference hardware for fast proof-of-concept work",
      "Controller APIs for machine software teams",
      "Joint engineering workshops for OEM deployment",
    ],
    specs: [
      { label: "Kit contents", value: "Controller, movers, coils, cable set" },
      { label: "Software", value: "SDK + sample recipes" },
      { label: "Support window", value: "90-day engineering package" },
      { label: "Mounting", value: "Reference frame included" },
    ],
    faqs: [
      {
        question: "Can AMO support DFM and field deployment after prototyping?",
        answer:
          "Yes. The OEM program extends from concept validation through pilot builds and scaled production handoff.",
      },
      {
        question: "Is white-label manufacturing available?",
        answer:
          "Yes. OEM, ODM, and private-label programs are available depending on volume and geography.",
      },
    ],
    caseStudySlugs: ["optical-module-assembly", "wafer-inspection-cell"],
  },
];

export const productCategories = ["All", "Planar Motor", "Levitation Stage", "Transfer Module", "OEM Platform"] as const;

export const productApplications = [
  "All",
  "Wafer handling",
  "Optical alignment",
  "Advanced electronics assembly",
  "Optical inspection",
  "Laser cutting",
  "Battery module transfer",
  "Inline testing",
  "Medical disposables",
  "R&D platforms",
] as const;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
