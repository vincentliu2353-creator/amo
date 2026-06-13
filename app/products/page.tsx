import { ProductsCatalogState } from "@/components/products/products-catalog-state";
import { ProductsPageExperience } from "@/components/products/products-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getProductsPageShowcaseCatalog, getPublishedProductShowcaseCatalog } from "@/lib/supabase/products";

export const metadata = buildMetadata({
  title: "Magnetic Levitation Products | AMO",
  description:
    "Explore premium magnetic levitation clocks, lamps, display systems, and custom floating products engineered for commercial and OEM applications.",
  path: "/products",
  keywords: [
    "magnetic levitation products",
    "levitating clock manufacturer",
    "levitating lamp manufacturer",
    "floating display systems",
    "custom magnetic levitation products",
  ],
});

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  try {
    const [{ products: showcaseProducts }, { products: catalogProducts }] = await Promise.all([
      getProductsPageShowcaseCatalog(),
      getPublishedProductShowcaseCatalog(),
    ]);

    return (
      <>
        <JsonLd
          data={generateBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ])}
        />
        <ProductsPageLayout>
          {showcaseProducts.length > 0 ? (
            <ProductsPageExperience showcaseProducts={showcaseProducts} catalogProducts={catalogProducts} />
          ) : (
            <ProductsCatalogState
              title="The product showcase is being prepared."
              message="Published Supabase products are not available yet. Use the RFQ flow for an assisted recommendation while the catalog is updated."
            />
          )}
        </ProductsPageLayout>
      </>
    );
  } catch (error) {
    return (
      <>
        <JsonLd
          data={generateBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ])}
        />
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
      </>
    );
  }
}
