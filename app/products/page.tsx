import { ProductsCatalogState } from "@/components/products/products-catalog-state";
import { ProductsPageExperience } from "@/components/products/products-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { buildMetadata } from "@/lib/seo";
import { getPublishedProductShowcaseCatalog } from "@/lib/supabase/products";

export const metadata = buildMetadata({
  title: "Products",
  description: "Browse AMO planar motors, levitation stages, transfer modules, and OEM magnetic levitation platforms.",
  path: "/products",
  keywords: ["planar motor supplier", "levitation stage", "OEM levitation platform"],
});

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  try {
    const { products } = await getPublishedProductShowcaseCatalog();

    return (
      <ProductsPageLayout>
        {products.length > 0 ? (
          <ProductsPageExperience products={products} />
        ) : (
          <ProductsCatalogState
            title="The product showcase is being prepared."
            message="Published Supabase products are not available yet. Use the RFQ flow for an assisted recommendation while the catalog is updated."
          />
        )}
      </ProductsPageLayout>
    );
  } catch (error) {
    return (
      <ProductsPageLayout>
        <ProductsCatalogState
          title="The product showcase is temporarily unavailable."
          message={error instanceof Error ? error.message : "AMO could not load published products from Supabase."}
          actionLabel="Open RFQ"
          actionHref="/rfq"
          secondaryLabel="Return Home"
          secondaryHref="/"
        />
      </ProductsPageLayout>
    );
  }
}
