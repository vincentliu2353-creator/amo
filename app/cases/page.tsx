import { CasesPageExperience } from "@/components/cases/cases-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { buildMetadata } from "@/lib/seo";

const casesBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://amolevitation.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Cases",
      item: "https://amolevitation.com/cases",
    },
  ],
};

export const metadata = buildMetadata({
  title: "Magnetic Levitation Case Studies | AMO",
  description:
    "See how AMO magnetic levitation products are applied in retail displays, hospitality spaces, exhibitions, museums, and premium gifting environments.",
  path: "/cases",
  keywords: ["magnetic levitation case studies", "floating display case study", "levitating product applications"],
});

export default function CasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(casesBreadcrumbJsonLd),
        }}
      />
      <ProductsPageLayout className="overflow-x-hidden bg-white text-black">
        <CasesPageExperience />
      </ProductsPageLayout>
    </>
  );
}
