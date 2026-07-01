import { HomeAboutPreview } from "@/components/home/home-about-preview";
import { HomeBlog } from "@/components/home/home-blog";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeHero } from "@/components/home/home-hero";
import { HomePhilosophy } from "@/components/home/home-philosophy";
import { HomeProcess } from "@/components/home/home-process";
import { HomeScenarios } from "@/components/home/home-scenarios";
import { HomeTechnical } from "@/components/home/home-technical";
import { FeaturedProductShowcaseSection } from "@/components/products/featured-product-showcase-section";
import { getPublishedBlogs } from "@/lib/supabase/blogs";
import { getProductsPageShowcaseCatalog } from "@/lib/supabase/products";
import type { ProductShowcaseProduct, PublicBlogRecord } from "@/types";
import applicationExhibition from "@/public/images/home/applications/exhibition.webp";
import applicationHotel from "@/public/images/home/applications/hotel.webp";
import applicationMuseum from "@/public/images/home/applications/museum.webp";
import applicationOffice from "@/public/images/home/applications/office.webp";
import applicationPremiumGifts from "@/public/images/home/applications/premium-gifts.webp";
import applicationRetail from "@/public/images/home/applications/retail.webp";
import futureArtObject from "@/public/images/home/future-objects/art-object.webp";
import futureBrandInstallation from "@/public/images/home/future-objects/brand-installation.webp";
import futureClock from "@/public/images/home/future-objects/clock.webp";
import futureDisplayBase from "@/public/images/home/future-objects/display-base.webp";
import futureLamp from "@/public/images/home/future-objects/lamp.webp";
import futureOemModule from "@/public/images/home/future-objects/oem-module.webp";

const categories = [
  {
    accent: "150 223 255",
    imageSrc: futureClock,
    idLabel: "01 / LEVITATING CLOCKS",
    title: "Levitating Clocks",
    description: "Time objects redesigned for modern spaces.",
    details: ["Desk Statements", "Reception Displays", "Luxury Gifting"],
  },
  {
    accent: "255 210 168",
    imageSrc: futureLamp,
    idLabel: "02 / LEVITATING LAMPS",
    title: "Levitating Lamps",
    description: "Floating light sculptures for premium interiors.",
    details: ["Ambient Glow", "Hospitality Suites", "Architectural Accent"],
  },
  {
    accent: "180 255 229",
    imageSrc: futureArtObject,
    idLabel: "03 / DISPLAY ART OBJECTS",
    title: "Display Art Objects",
    description: "Magnetic display systems for brands and exhibitions.",
    details: ["Brand Storytelling", "Launch Installations", "Window Displays"],
  },
  {
    accent: "196 198 255",
    imageSrc: futureOemModule,
    idLabel: "04 / OEM MAGLEV MODULES",
    title: "OEM Maglev Modules",
    description: "Custom levitation platforms for product development.",
    details: ["Controller Integration", "Load Tuning", "Private Label Programs"],
  },
  {
    accent: "226 252 170",
    imageSrc: futureDisplayBase,
    idLabel: "05 / DISPLAY BASES",
    title: "Levitating Display Bases",
    description: "Floating stages for premium product launches, showcases, and collector presentation.",
    details: ["Retail Fixtures", "Museum Pedestals", "Collector Editions"],
  },
  {
    accent: "255 189 224",
    imageSrc: futureBrandInstallation,
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
    imageSrc: applicationRetail,
    title: "Retail Stores",
    caption: "Immersive Merchandising",
    blurb: "Floating presentation turns a product display into a spatial focal point, ideal for premium retail counters, flagship windows, and launch zones.",
  },
  {
    accent: "204 232 255",
    imageSrc: applicationMuseum,
    title: "Museums",
    caption: "Curated Display",
    blurb: "Levitation adds distance, precision, and visual calm for collectible objects, historical replicas, and interpretive exhibition storytelling.",
  },
  {
    accent: "255 213 173",
    imageSrc: applicationHotel,
    title: "Hotels",
    caption: "Hospitality Atmosphere",
    blurb: "Lobbies, suites, and lounge environments benefit from floating lighting and kinetic objects that feel intentional rather than decorative.",
  },
  {
    accent: "201 255 233",
    imageSrc: applicationOffice,
    title: "Offices",
    caption: "Executive Presence",
    blurb: "Reception zones, boardrooms, and innovation centers can use levitation to express technology leadership and brand confidence.",
  },
  {
    accent: "229 230 255",
    imageSrc: applicationExhibition,
    title: "Exhibitions",
    caption: "Trade Show Impact",
    blurb: "Spatial drama and controlled motion help draw traffic, isolate hero products, and create memorable booth signatures.",
  },
  {
    accent: "255 214 230",
    imageSrc: applicationPremiumGifts,
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
  {
    slug: "oem-floating-display-projects",
    title: "OEM Floating Display Projects: From Brand Brief To Production",
    excerpt: "A practical look at how custom magnetic levitation display programs move from concept and sampling into production.",
    publishedAt: "2026-01-24",
    readTime: "5 min read",
  },
  {
    slug: "premium-magnetic-levitation-gifts",
    title: "Premium Magnetic Levitation Gifts For Brand Programs",
    excerpt: "How premium gifts, commemorative objects, and limited editions gain value through engineered floating presentation.",
    publishedAt: "2026-02-02",
    readTime: "5 min read",
  },
  {
    slug: "floating-displays-for-retail-and-hospitality",
    title: "Floating Displays For Retail, Hospitality, And Exhibition Spaces",
    excerpt: "Where floating display systems fit best across luxury retail, hotel interiors, exhibitions, and museum environments.",
    publishedAt: "2026-02-12",
    readTime: "4 min read",
  },
];

type HomeBlogSource = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  cover_image?: unknown;
  coverImage?: unknown;
  hero_image?: unknown;
  heroImage?: unknown;
  image_url?: unknown;
  imageUrl?: unknown;
  featured_image?: unknown;
  featuredImage?: unknown;
};

function isPlaceholderBlogImageUrl(url: string | null | undefined) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  const normalizedUrl = url.trim().toLowerCase();

  return normalizedUrl.includes("amo.example.com") || /https?:\/\/[^/]*example\.com\//.test(normalizedUrl);
}

function resolveHomeBlogImage(post: HomeBlogSource) {
  const candidates = [
    post.coverImage,
    post.cover_image,
    post.heroImage,
    post.hero_image,
    post.imageUrl,
    post.image_url,
    post.featuredImage,
    post.featured_image,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") {
      continue;
    }

    const normalizedUrl = candidate.trim();

    if (!normalizedUrl || isPlaceholderBlogImageUrl(normalizedUrl)) {
      continue;
    }

    return normalizedUrl;
  }

  return "";
}

function mapHomeBlogPost(post: HomeBlogSource) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    coverImage: resolveHomeBlogImage(post),
  };
}

function fallbackEditorialPosts() {
  return fallbackBlogPosts.map((post) => mapHomeBlogPost(post));
}

export async function HomePageExperience() {
  let editorialPosts = fallbackEditorialPosts();
  let showcaseProducts: ProductShowcaseProduct[] = [];

  const [blogsResult, showcaseResult] = await Promise.allSettled([
    getPublishedBlogs(),
    getProductsPageShowcaseCatalog(),
  ]);

  if (blogsResult.status === "fulfilled") {
    const blogs = blogsResult.value;
    if (blogs.length > 0) {
      editorialPosts = blogs.slice(0, 4).map((post: PublicBlogRecord) =>
        mapHomeBlogPost({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          coverImage: post.coverImage,
        }),
      );
    }
  }

  if (showcaseResult.status === "fulfilled") {
    showcaseProducts = showcaseResult.value.products;
  }

  return (
    <>
      <HomeHero />
      <HomePhilosophy />
      <HomeCategories categories={categories} />
      {showcaseProducts.length > 0 ? <FeaturedProductShowcaseSection products={showcaseProducts} /> : null}
      <HomeTechnical />
      <HomeProcess steps={processSteps} />
      <HomeScenarios scenarios={scenarios} />
      <HomeAboutPreview />
      <HomeBlog posts={editorialPosts} />
    </>
  );
}
