import { calculateBlogReadTimeFromSections } from "@/lib/blogs";
import type { BlogSection, PublicBlogRecord } from "@/types";

interface BlogArticleRefreshConfig {
  excerpt: string;
  introBody: string;
  seoDescription: string;
  seoTitle: string;
  appendSections?: BlogSection[];
  title?: string;
}

interface BlogFaqItem {
  question: string;
  answer: string;
}

const STANDARD_CTA_SECTION: BlogSection = {
  heading: "Call To Action",
  body: [
    "Continue with one of these next steps:",
    "- [View Products](/products)",
    "- [Discuss OEM Project](/oem-odm)",
    "- [Request Quote](/rfq)",
  ].join("\n\n"),
};

function buildBlogFaqSection(items: BlogFaqItem[]): BlogSection {
  return {
    heading: "Buyer FAQ",
    body: items.map((item) => [`### ${item.question}`, item.answer].join("\n")).join("\n\n"),
  };
}

const BLOG_ARTICLE_REFRESH_BY_SLUG: Record<string, BlogArticleRefreshConfig> = {
  "oem-magnetic-levitation-products-from-concept-to-production": {
    seoTitle: "OEM and ODM Magnetic Levitation Products: From Design Brief To Prototype, Sampling, and Production",
    seoDescription:
      "See how a magnetic levitation OEM manufacturer or magnetic levitation ODM supplier moves OEM magnetic levitation products and private label magnetic levitation products from design brief through prototype validation, sampling, mass production, and delivery.",
    excerpt:
      "OEM magnetic levitation products move faster when the design brief, prototype plan, sampling milestones, and production approvals stay aligned from the first RFQ.",
    introBody: [
      "If you are sourcing OEM magnetic levitation products, the first procurement step is not price. It is a usable design brief covering the object type, operating environment, target quantity, approval path, and launch timing. That information lets the manufacturer judge feasibility, MOQ, and customization scope through the right [OEM & ODM workflow](/oem-odm) and against the most relevant reference options in the [product collection](/products).",
      "The next question is how prototype validation, sampling, and mass production will be staged. Buyers should ask when a working sample will be reviewed, who signs off on revisions, how lead time changes after engineering updates, and what has to be approved before production starts. A structured [RFQ](/rfq) reduces ambiguity around quantities, branding, and delivery windows before development cost begins to rise.",
    ].join("\n\n"),
    appendSections: [
      buildBlogFaqSection([
        {
          question: "What should an OEM magnetic levitation design brief include?",
          answer:
            "A usable brief should define the product type, target application, size, quantity, branding scope, operating environment, and launch timing. That gives the [OEM & ODM page](/oem-odm) enough context to frame feasibility against the current [product range](/products).",
        },
        {
          question: "How should prototype validation be handled?",
          answer:
            "Prototype validation should happen before packaging approval or mass-production planning. Buyers usually check levitation stability, finish quality, sound level, rotation behavior, and visible presentation, then use the [RFQ page](/rfq) to document revision scope and schedule impact.",
        },
        {
          question: "When should sampling and mass production begin?",
          answer:
            "Sampling should begin after the working prototype is approved and the commercial assumptions are clear. Mass production should wait until quantity, MOQ, lead time, packaging, and delivery timing are aligned through the [RFQ process](/rfq) or direct [project discussion](/contact).",
        },
      ]),
    ],
  },
  "how-to-choose-a-magnetic-levitation-manufacturer": {
    seoTitle: "How To Choose A Custom Magnetic Levitation Manufacturer: Supplier Checklist For B2B Buyers",
    seoDescription:
      "Use this supplier checklist to compare a magnetic levitation company, magnetic levitation factory, magnetic levitation solution provider, or magnetic levitation device manufacturer on quality control, MOQ magnetic levitation products, lead time, sample validation, and export readiness.",
    excerpt:
      "Choosing a magnetic levitation manufacturer means checking more than a demo. B2B buyers need supplier discipline around MOQ, lead time, QC, sampling, and export readiness.",
    introBody: [
      "If you are choosing a magnetic levitation manufacturer, the first questions are practical: can the supplier explain MOQ, define lead time, validate samples, and support export-ready delivery? A visually strong sample is not enough if the factory cannot show a disciplined quality process or support [OEM & ODM development](/oem-odm) without losing consistency.",
      "Procurement teams should also ask how prototype validation works, what triggers a new sample round, how packaging is tested, and whether export readiness is documented before production. If those answers stay vague, it is better to move the conversation into a detailed [quote request](/rfq) or direct [contact](/contact) before committing budget.",
    ].join("\n\n"),
    appendSections: [
      buildBlogFaqSection([
        {
          question: "How should buyers compare MOQ across suppliers?",
          answer:
            "Ask whether MOQ changes by finish, packaging, electronics, or branding requirements. A serious supplier should explain how MOQ affects prototype cost, sampling, and production planning before you move deeper into [OEM & ODM review](/oem-odm).",
        },
        {
          question: "What lead-time questions matter before placing an order?",
          answer:
            "Buyers should separate prototype lead time, sample approval lead time, and mass-production lead time. Those timelines belong in the [RFQ](/rfq) because engineering changes, packaging revisions, and export documentation can change the schedule materially.",
        },
        {
          question: "Why is sample validation more important than a good demo?",
          answer:
            "A demo shows visual effect, but sample validation tests repeatability, finish control, packaging protection, and whether the product still performs after shipping or handling. That is why reference [products](/products) and approved samples both matter before a PO is issued.",
        },
        {
          question: "What proves export readiness?",
          answer:
            "Export readiness usually means the supplier can define packaging protection, labeling, documentation, and commercial coordination clearly enough for shipment planning. If that process is unclear, use [contact](/contact) or the [RFQ page](/rfq) to press for specifics before approving production.",
        },
      ]),
    ],
  },
  "the-complete-b2b-sourcing-guide-for-magnetic-levitation-products": {
    title: "The Complete B2B Sourcing Guide For Choosing A Magnetic Levitation Supplier",
    seoTitle: "Magnetic Levitation Supplier China Guide: RFQ, Magnetic Levitation Products Wholesale, and Production Readiness",
    seoDescription:
      "Learn how to compare a magnetic levitation manufacturer China or custom levitating products supplier before you request magnetic levitation quote details for magnetic levitation wholesale, bulk magnetic levitation products, MOQ magnetic levitation products, and magnetic levitation products for brands.",
    excerpt:
      "A strong magnetic levitation supplier is evaluated on sourcing clarity, prototype risk, production readiness, and the completeness of the RFQ, not price alone.",
    introBody: [
      "When comparing a magnetic levitation supplier, buyers should ask five things before focusing on price: what is the realistic MOQ, what is the lead time, how is sample validation handled, how export-ready is the supplier, and how much prototype risk remains? Those answers usually matter more than a low first quote. Reviewing the current [product range](/products) and the available [OEM & ODM capabilities](/oem-odm) helps frame the sourcing brief around real deliverables.",
      "A serious sourcing decision also depends on the RFQ itself. The brief should define object size, application, quantity, branding, packaging, certification expectations, and launch timing so the supplier can judge prototype validation and mass-production readiness. Using the [RFQ page](/rfq) early reduces rework and makes supplier comparison more objective.",
    ].join("\n\n"),
    appendSections: [
      buildBlogFaqSection([
        {
          question: "What should a magnetic levitation RFQ include?",
          answer:
            "A useful RFQ should cover product type, dimensions, application, quantity, branding scope, packaging expectations, approval flow, and launch timing. That gives the supplier enough detail to compare the request against current [products](/products) and custom [OEM & ODM options](/oem-odm).",
        },
        {
          question: "How should buyers evaluate prototype risk?",
          answer:
            "Prototype risk usually sits in stability, visible balance, electronics, finish quality, and shipping protection. Buyers should ask how those risks will be tested during sample validation and confirm the review path through the [RFQ process](/rfq) before moving into production planning.",
        },
        {
          question: "When is a supplier ready for mass production?",
          answer:
            "A supplier is closer to production-ready when prototype validation is complete, quantities are aligned with MOQ, lead time is defined, packaging is approved, and export coordination is understood. If any of those points are unclear, use direct [contact](/contact) before treating the quote as final.",
        },
      ]),
    ],
  },
  "why-luxury-retail-stores-use-floating-product-displays": {
    seoTitle: "Why Luxury Retail Stores Use Floating Product Displays, Floating Display Stand Systems, and Magnetic Floating Display Concepts",
    seoDescription:
      "Learn why a magnetic display stand, levitating display stand, or magnetic levitation display stand can improve hero-product focus and levitating product presentation.",
    excerpt:
      "Floating product displays help luxury retail brands create stronger focus, premium contrast, and better retail product presentation without cluttering the store.",
    introBody: [
      "If you are evaluating floating product displays for luxury retail, the short answer is that brands use them to isolate one hero product and increase perceived value without adding visual clutter. That makes them useful for launch tables, window moments, and flagship showcases, and AMO's [product collection](/products) helps buyers compare which floating display formats support that type of retail product presentation.",
      "The next procurement question is whether the display can match brand finish, object weight, and rollout scale across boutique, campaign, or flagship settings. Reviewing relevant [case studies](/cases) and then sending an [RFQ](/rfq) for quantity, finish, and deployment scope helps turn a luxury retail display idea into an operational project.",
    ].join("\n\n"),
  },
  "museum-displays-creating-distance-focus-and-curiosity": {
    title: "Floating Museum Display: Creating Distance, Focus And Curiosity",
    seoTitle: "Floating Museum Display: Museum Display Technology, Magnetic Levitation Museum Display, and Artifact Display Systems",
    seoDescription:
      "See how museum display technology, a magnetic levitation museum display, floating artifact display methods, museum showcase display systems, interactive museum display ideas, and levitating museum installation concepts fit future-facing galleries.",
    excerpt:
      "A floating museum display helps curators create distance, focus, and curiosity around artifacts, models, and exhibition reveal pieces without heavy visual clutter.",
    introBody: [
      "If you are evaluating a floating museum display, the main value is clearer artifact focus without bulky hardware or distracting scenography. That makes magnetic levitation relevant for future-facing galleries, artifact display systems, and exhibition reveal moments where the object needs to feel precise, protected, and conceptually elevated. Relevant [case studies](/cases) can help exhibition teams judge where this approach fits best.",
      "The next procurement question is whether object size, sightlines, maintenance needs, and installation constraints can be handled safely. Comparing those limits against available [products](/products) and then moving into direct [contact](/contact) is the fastest way to judge whether a museum or exhibition brief is technically realistic.",
    ].join("\n\n"),
  },
  "corporate-gifts-that-people-actually-remember": {
    title: "Magnetic Levitation Corporate Gifts That People Actually Remember",
    seoTitle: "Magnetic Levitation Corporate Gifts, Magnetic Floating Gift Systems, and Executive Levitating Gift Programs",
    seoDescription:
      "See how a magnetic floating gift, executive levitating gift, corporate levitating gift, luxury floating gift, OEM magnetic levitation gift, branded floating gift, or private label levitating gift can support premium B2B programs.",
    excerpt:
      "Magnetic levitation corporate gifts stand out when the object, packaging, and floating presentation are designed as one premium B2B gifting system.",
    introBody: [
      "If you are sourcing magnetic levitation corporate gifts, the strongest programs pair the object, packaging, and brand story as one premium system rather than treating the item as novelty merchandise. For executive gifting, commemorative programs, and premium client kits, buyers usually start by comparing reference options in the [product collection](/products) to judge what level of customization is realistic.",
      "The next commercial question is how much customization is needed and whether the planned volume justifies OEM development. When branding, packaging, or form factor move beyond stock options, the project becomes an [OEM & ODM](/oem-odm) conversation, and a detailed [RFQ](/rfq) helps align quantity, approvals, and delivery timing before development begins.",
    ].join("\n\n"),
  },
  "2026-retail-display-trends-how-brands-create-attention-without-more-advertising": {
    seoTitle: "2026 Retail Display Trends: Magnetic Levitation Retail Display, Premium Retail Display, and Product Launch Presentation",
    seoDescription:
      "Explore magnetic levitation retail display trends for 2026, including levitating product display for stores, premium retail display, floating display for luxury brands, floating display for cosmetics, perfume, jewelry, watches, and electronics.",
    excerpt:
      "Floating retail display is becoming a stronger answer to retail attention design as brands look for better hero-product focus without spending more on media.",
    introBody: [
      "If you are deciding whether floating retail display is worth budget in 2026, the short answer is yes when the goal is to create hero-product focus without buying more attention through media. Retail teams are investing in display systems that slow shoppers down, sharpen visual hierarchy, and create cleaner in-store memory, and the current [product collection](/products) shows the practical formats behind that shift.",
      "The next rollout question is where the effect will work best: flagship windows, launch tables, boutique counters, or temporary activations. The most useful comparison happens when merchandising teams look at real [case studies](/cases) alongside AMO's thinking on [why luxury retail stores use floating product displays](/blog/why-luxury-retail-stores-use-floating-product-displays).",
    ].join("\n\n"),
  },
  "the-future-of-floating-objects-why-magnetic-levitation-is-changing-product-presentation": {
    seoTitle: "Custom Floating Display and ODM Floating Display: Why Magnetic Levitation Is Changing Product Presentation",
    seoDescription:
      "Understand how custom floating display and ODM floating display programs use electromagnetic levitation, magnetic suspension technology, active magnetic levitation, magnetic balance systems, magnetic control systems, and levitation engineering to change product presentation.",
    excerpt:
      "Magnetic levitation display systems are changing floating product presentation because they create cleaner focus, stronger memory, and better commercial differentiation.",
    introBody: [
      "If you are asking why magnetic levitation is changing product presentation, the short answer is that it creates a cleaner pause around one object than many conventional fixtures. For brands, retailers, and exhibition teams, floating product presentation can create premium focus without adding more visual noise, and the current [product range](/products) shows how contactless display technology can be adapted for multiple commercial environments.",
      "The next buyer question is whether the technology can be sourced, customized, and validated reliably enough for a real program. Reviewing [OEM & ODM](/oem-odm) options and the supplier checklist in [how to choose a magnetic levitation manufacturer](/blog/how-to-choose-a-magnetic-levitation-manufacturer) helps turn a levitating product display idea into a more realistic sourcing path.",
    ].join("\n\n"),
  },
};

function buildRefreshedSections(sections: BlogSection[], introBody: string, appendSections: BlogSection[] = []) {
  const introHeading = sections[0]?.heading || "Introduction";
  const remainingSections = sections.filter((section, index) => {
    if (index === 0) {
      return false;
    }

    const normalized = section.heading.trim().toLowerCase();
    return (
      normalized !== "call to action" &&
      normalized !== "cta" &&
      normalized !== "buyer faq" &&
      normalized !== "faq" &&
      normalized !== "frequently asked questions"
    );
  });

  return [{ heading: introHeading, body: introBody }, ...remainingSections, ...appendSections, STANDARD_CTA_SECTION];
}

export function applyBlogArticleRefresh(post: PublicBlogRecord): PublicBlogRecord {
  const refresh = BLOG_ARTICLE_REFRESH_BY_SLUG[post.slug];

  if (!refresh) {
    return post;
  }

  const sections = buildRefreshedSections(post.sections, refresh.introBody, refresh.appendSections);

  return {
    ...post,
    title: refresh.title ?? post.title,
    excerpt: refresh.excerpt,
    seoTitle: refresh.seoTitle,
    seoDescription: refresh.seoDescription,
    sections,
    readTime: calculateBlogReadTimeFromSections(sections),
  };
}
