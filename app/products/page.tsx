import { ProductsCatalogState } from "@/components/products/products-catalog-state";
import { ProductsPageExperience } from "@/components/products/products-page-experience";
import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getProductsPageShowcaseCatalog, getPublishedProductShowcaseCatalog } from "@/lib/supabase/products";

export const metadata = buildMetadata({
  title: "Floating Display Systems, Levitating Lamps & Premium Gifts | AMO",
  description:
    "Explore AMO floating display systems, levitating lamps, display art objects, and premium gifts for luxury retail, hospitality, exhibitions, and custom OEM projects.",
  path: "/products",
  keywords: [
    "floating display systems",
    "floating display manufacturer",
    "magnetic display stand",
    "levitating display stand",
    "floating display stand",
    "magnetic floating display",
    "magnetic levitation display stand",
    "levitating product presentation",
    "custom floating display",
    "ODM floating display",
    "levitating lamp manufacturer",
    "magnetic floating lamp",
    "levitating table lamp",
    "floating table lamp",
    "levitating light",
    "magnetic floating light",
    "floating LED lamp",
    "custom levitating lamp",
    "OEM levitating lamp",
    "ODM levitating lamp",
    "magnetic levitation lamp supplier",
    "magnetic levitation clock",
    "magnetic floating clock",
    "levitating desk clock",
    "floating desk clock",
    "premium levitating clock",
    "luxury levitating clock",
    "custom levitating clock",
    "OEM levitating clock",
    "ODM levitating clock",
    "levitating clock manufacturer",
    "magnetic levitation clock manufacturer",
    "levitating clock supplier",
    "floating clock supplier",
    "OEM levitating clock manufacturer",
    "premium magnetic levitation gifts",
    "magnetic floating gift",
    "executive levitating gift",
    "corporate levitating gift",
    "luxury floating gift",
    "OEM magnetic levitation gift",
    "branded floating gift",
    "private label levitating gift",
    "floating art object",
    "magnetic levitation art",
    "magnetic floating sculpture",
    "floating decorative object",
    "kinetic sculpture",
    "magnetic kinetic sculpture",
    "custom levitating sculpture",
    "floating installation art",
    "custom magnetic levitation products",
    "floating display for retail",
    "floating display for exhibitions",
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
