import { CasesPageExperience } from "@/components/cases/cases-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Floating Display Case Studies for Retail, Hospitality & Exhibitions | AMO",
  description:
    "See how AMO magnetic levitation systems are used in retail displays, hotel lobbies, museums, exhibitions, and premium gifting programs.",
  path: "/cases",
  keywords: [
    "magnetic levitation case studies",
    "floating display case study",
    "floating display for retail",
    "floating display for exhibitions",
    "floating display for museums",
    "magnetic levitation retail display",
    "levitating product display for stores",
    "premium retail display",
    "floating display for luxury brands",
    "floating display for cosmetics",
    "floating display for perfume",
    "floating display for jewelry",
    "floating display for watches",
    "floating display for electronics",
    "magnetic levitation exhibition display",
    "trade show floating display",
    "levitating display for exhibitions",
    "event display system",
    "floating product display for trade shows",
    "magnetic levitation booth display",
    "exhibition product presentation",
    "floating display for product launch",
    "museum display technology",
    "magnetic levitation museum display",
    "floating artifact display",
    "museum showcase display",
    "interactive museum display",
    "levitating museum installation",
    "floating display for galleries",
    "floating lobby installation",
    "luxury lobby display",
    "hotel art installation",
    "floating hotel display",
    "magnetic levitation hotel installation",
    "floating sculpture for hotels",
    "premium lobby art object",
    "levitating decorative display",
    "floating office display",
    "executive office display",
    "premium office art object",
    "magnetic levitation office decor",
    "levitating desk object",
    "floating corporate display",
    "luxury office installation",
  ],
});

export default function CasesPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cases", path: "/cases" },
        ])}
      />
      <ProductsPageLayout className="overflow-x-hidden bg-white text-black">
        <CasesPageExperience />
      </ProductsPageLayout>
    </>
  );
}
