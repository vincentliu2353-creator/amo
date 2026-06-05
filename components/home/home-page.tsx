import { HomeAboutPreview } from "@/components/home/home-about-preview";
import { HomeBlog } from "@/components/home/home-blog";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeHero } from "@/components/home/home-hero";
import { HomePhilosophy } from "@/components/home/home-philosophy";
import { HomeProcess } from "@/components/home/home-process";
import { HomeScenarios } from "@/components/home/home-scenarios";
import { HomeTechnical } from "@/components/home/home-technical";
import { blogPosts } from "@/data/blog";

const categories = [
  {
    accent: "150 223 255",
    idLabel: "01 / LEVITATING CLOCKS",
    title: "Levitating Clocks",
    description: "Time objects redesigned for modern spaces.",
    details: ["Desk Statements", "Reception Displays", "Luxury Gifting"],
  },
  {
    accent: "255 210 168",
    idLabel: "02 / LEVITATING LAMPS",
    title: "Levitating Lamps",
    description: "Floating light sculptures for premium interiors.",
    details: ["Ambient Glow", "Hospitality Suites", "Architectural Accent"],
  },
  {
    accent: "180 255 229",
    idLabel: "03 / DISPLAY ART OBJECTS",
    title: "Display Art Objects",
    description: "Magnetic display systems for brands and exhibitions.",
    details: ["Brand Storytelling", "Launch Installations", "Window Displays"],
  },
  {
    accent: "196 198 255",
    idLabel: "04 / OEM MAGLEV MODULES",
    title: "OEM Maglev Modules",
    description: "Custom levitation platforms for product development.",
    details: ["Controller Integration", "Load Tuning", "Private Label Programs"],
  },
  {
    accent: "226 252 170",
    idLabel: "05 / DISPLAY BASES",
    title: "Levitating Display Bases",
    description: "Floating stages for premium product launches, showcases, and collector presentation.",
    details: ["Retail Fixtures", "Museum Pedestals", "Collector Editions"],
  },
  {
    accent: "255 189 224",
    idLabel: "06 / BRAND INSTALLATIONS",
    title: "Custom Floating Installations",
    description: "Statement levitation pieces for hospitality lobbies, event spaces, and branded spatial design.",
    details: ["Lobby Centerpieces", "Event Activations", "Signature Commissions"],
  },
];

const processSteps = [
  {
    accent: "149 214 255",
    number: "01",
    label: "Concept Design",
    description: "Brief framing, visual direction, placement context, and object proportions are translated into a levitation-first concept.",
  },
  {
    accent: "255 201 160",
    number: "02",
    label: "Engineering",
    description: "Mechanical, electronic, and magnetic architecture are tuned around weight, balance, rotation, and long-term stability.",
  },
  {
    accent: "190 255 232",
    number: "03",
    label: "Prototype",
    description: "Rapid prototypes validate object geometry, floating behavior, lighting, and material integration before sampling.",
  },
  {
    accent: "228 233 255",
    number: "04",
    label: "Sampling",
    description: "Finished pre-production samples refine cosmetic details, packaging, and customer-facing presentation quality.",
  },
  {
    accent: "232 255 176",
    number: "05",
    label: "Mass Production",
    description: "Production processes are locked around consistency, component quality, assembly accuracy, and delivery planning.",
  },
  {
    accent: "255 210 228",
    number: "06",
    label: "Global Delivery",
    description: "Finished products move into branded packaging, export coordination, and rollout support for international programs.",
  },
];

const scenarios = [
  {
    accent: "145 212 255",
    title: "Retail Stores",
    caption: "Immersive Merchandising",
    blurb: "Floating presentation turns a product display into a spatial focal point, ideal for premium retail counters, flagship windows, and launch zones.",
  },
  {
    accent: "204 232 255",
    title: "Museums",
    caption: "Curated Display",
    blurb: "Levitation adds distance, precision, and visual calm for collectible objects, historical replicas, and interpretive exhibition storytelling.",
  },
  {
    accent: "255 213 173",
    title: "Hotels",
    caption: "Hospitality Atmosphere",
    blurb: "Lobbies, suites, and lounge environments benefit from floating lighting and kinetic objects that feel intentional rather than decorative.",
  },
  {
    accent: "201 255 233",
    title: "Offices",
    caption: "Executive Presence",
    blurb: "Reception zones, boardrooms, and innovation centers can use levitation to express technology leadership and brand confidence.",
  },
  {
    accent: "229 230 255",
    title: "Exhibitions",
    caption: "Trade Show Impact",
    blurb: "Spatial drama and controlled motion help draw traffic, isolate hero products, and create memorable booth signatures.",
  },
  {
    accent: "255 214 230",
    title: "Premium Gifts",
    caption: "Collector Packaging",
    blurb: "Gift editions, private-label launches, and commemorative objects gain perceived value when the presentation itself feels engineered.",
  },
];

const fallbackBlogPosts = [
  {
    slug: "future-display-storytelling",
    title: "How Floating Displays Change Brand Storytelling",
    excerpt: "Why levitation works as a spatial communication tool for premium launches, hospitality, and curated merchandising.",
    publishedAt: "2026-01-16",
    readTime: "4 min read",
  },
];

const editorialPosts = [...blogPosts, ...fallbackBlogPosts].slice(0, 4).map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  readTime: post.readTime,
}));

export function HomePageExperience() {
  return (
    <>
      <HomeHero />
      <HomePhilosophy />
      <HomeCategories categories={categories} />
      <HomeTechnical />
      <HomeProcess steps={processSteps} />
      <HomeScenarios scenarios={scenarios} />
      <HomeAboutPreview />
      <HomeBlog posts={editorialPosts} />
    </>
  );
}
