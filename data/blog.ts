import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "why-contactless-motion-matters-in-clean-manufacturing",
    title: "Why Contactless Motion Matters in Clean Manufacturing",
    category: "Manufacturing",
    excerpt:
      "Contactless motion changes more than maintenance schedules. It reshapes contamination control, line flexibility, and process repeatability.",
    publishedAt: "2026-04-12",
    author: "AMO Engineering",
    readTime: "6 min read",
    sections: [
      {
        heading: "Mechanical friction is a process variable",
        body:
          "In contamination-sensitive industries, rails, belts, and screws create wear, debris, and variability that become hidden process costs over time.",
      },
      {
        heading: "Software-defined routing improves flexibility",
        body:
          "Independent levitated carriers allow machine builders to re-route products, rebalance buffers, and add new workflows without replacing transport hardware.",
      },
      {
        heading: "OEM value comes from system architecture",
        body:
          "The strongest ROI appears when levitation is integrated early in the machine architecture rather than treated as a last-minute motion subsystem swap.",
      },
    ],
  },
  {
    slug: "how-to-spec-a-levitation-platform-for-oem-equipment",
    title: "How to Spec a Levitation Platform for OEM Equipment",
    category: "OEM Guide",
    excerpt:
      "A practical checklist for motion envelope, payload, fieldbus, environmental constraints, and commissioning scope.",
    publishedAt: "2026-03-20",
    author: "AMO Solutions",
    readTime: "7 min read",
    sections: [
      {
        heading: "Start from the process, not the axis count",
        body:
          "Payload behavior, settling requirements, contamination limits, and handoff logic should define the levitation architecture before hardware selection begins.",
      },
      {
        heading: "Specify integration boundaries clearly",
        body:
          "Mechanical interfaces, software ownership, safety boundaries, and acceptance criteria need to be documented early for OEM projects to scale cleanly.",
      },
      {
        heading: "Account for validation work",
        body:
          "The production launch plan should include motion tuning, sample part verification, cleanroom checks, and spare strategy planning.",
      },
    ],
  },
  {
    slug: "future-of-magnetic-levitation-in-flexible-factories",
    title: "The Future of Magnetic Levitation in Flexible Factories",
    category: "Industry",
    excerpt:
      "Levitation platforms are becoming digital production infrastructure, not just specialty motion modules.",
    publishedAt: "2026-02-08",
    author: "AMO Strategy",
    readTime: "5 min read",
    sections: [
      {
        heading: "Factories need reconfigurable transport",
        body:
          "Shorter product cycles are forcing equipment teams to abandon fixed conveyor assumptions and move toward software-driven transport topologies.",
      },
      {
        heading: "Data and motion are converging",
        body:
          "Carrier identity, route logic, inspection events, and quality data can be linked directly through levitation control systems.",
      },
      {
        heading: "B2B buyers expect platform thinking",
        body:
          "Manufacturers now buy transport systems as strategic platforms that must support future product variants, not just the first launch program.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

