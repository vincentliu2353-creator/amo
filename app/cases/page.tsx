import { CasesPageExperience } from "@/components/cases/cases-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cases",
  description: "See how AMO magnetic levitation products create floating experiences in retail, hospitality, exhibitions, offices, and premium gifting.",
  path: "/cases",
});

export default function CasesPage() {
  return (
    <ProductsPageLayout className="overflow-x-hidden bg-white text-black">
      <CasesPageExperience />
    </ProductsPageLayout>
  );
}
