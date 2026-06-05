import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "wafer-inspection-cell",
    title: "Wafer Inspection Cell with Contactless Part Routing",
    sector: "Semiconductor",
    summary:
      "AMO replaced belt and shuttle transport with a planar levitation deck to reduce particles and improve takt-time stability.",
    challenge:
      "The customer needed cleaner transport, more compact buffering, and faster handoff between inspection stations without adding manual maintenance.",
    solution:
      "AirCore Planar X1 was integrated as a programmable routing layer with independent movers and software-defined queues for each inspection path.",
    results: [
      "Particle-related rejects reduced by 31 percent",
      "Buffer footprint reduced by 42 percent",
      "Recipe changeovers moved from hardware change to software selection",
    ],
    metrics: [
      { label: "Yield gain", value: "+2.8%" },
      { label: "Footprint reduction", value: "-42%" },
      { label: "Commissioning window", value: "5 weeks" },
    ],
    featuredProductSlugs: ["aircore-planar-x1", "flux-drive-oem-kit"],
  },
  {
    slug: "optical-module-assembly",
    title: "Optical Module Assembly with Active Levitation Alignment",
    sector: "Photonics",
    summary:
      "A photonics OEM used AMO levitation stages to stabilize high-value alignment during bonding and inspection.",
    challenge:
      "The assembly process suffered from vibration and wear-related drift that reduced alignment consistency during continuous production runs.",
    solution:
      "Halo Stage M200 and Flux Drive OEM Kit were tuned around the bonding head dynamics, providing fine positioning and active disturbance rejection.",
    results: [
      "Process capability improved across three optical alignment steps",
      "Maintenance intervals extended because no rail or screw wear was introduced",
      "Machine builder shipped a differentiated premium tool to end customers",
    ],
    metrics: [
      { label: "Alignment yield", value: "+6.2%" },
      { label: "Settling improvement", value: "-38%" },
      { label: "Field uptime", value: "99.2%" },
    ],
    featuredProductSlugs: ["halo-stage-m200", "flux-drive-oem-kit"],
  },
  {
    slug: "battery-sortation-line",
    title: "Battery Sortation Line with Dynamic Carrier Routing",
    sector: "New Energy",
    summary:
      "AMO modernized a battery pack line using levitated carriers to eliminate mechanical switching and improve line adaptability.",
    challenge:
      "The line required frequent format changes and suffered downtime from mechanical diverters, pallet wear, and buffer congestion.",
    solution:
      "Vector Loop LT was deployed as a deterministic routing backbone with recipe-driven carrier paths and digital traceability at station level.",
    results: [
      "Changeovers reduced from hours to recipe-level configuration",
      "Mechanical maintenance events dropped substantially after conveyor removal",
      "Operators gained more transparent route-level production control",
    ],
    metrics: [
      { label: "Throughput gain", value: "+18%" },
      { label: "Downtime reduction", value: "-27%" },
      { label: "Format change time", value: "< 10 min" },
    ],
    featuredProductSlugs: ["vector-loop-lt"],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((entry) => entry.slug === slug);
}

