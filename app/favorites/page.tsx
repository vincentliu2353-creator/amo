import { FavoritesPage } from "@/components/favorites/favorites-page";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buildMetadata } from "@/lib/seo";
import { getPublishedProductCatalog } from "@/lib/supabase/products";

export const metadata = buildMetadata({
  title: "Favorites",
  description: "Review saved AMO products before moving them into the quote request flow.",
  path: "/favorites",
});

export const dynamic = "force-dynamic";

export default async function FavoritesRoute() {
  try {
    const { products } = await getPublishedProductCatalog();

    return (
      <InnerPageShell showHeader>
        <section className="bg-white text-black">
          <SectionContainer className="py-20 md:py-28">
            <PageHeader
              eyebrow="Saved Products"
              title="Saved Products"
              description="Products you&apos;ve selected for future reference."
            />

            <div className="mt-14">
              <FavoritesPage products={products} />
            </div>
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  } catch (error) {
    return (
      <InnerPageShell showHeader>
        <section className="bg-white text-black">
          <SectionContainer className="py-20 md:py-28">
          <ProductsErrorState
            title="The favorites catalog is temporarily unavailable."
            message={
              error instanceof Error ? error.message : "AMO could not load published products for the favorites shortlist."
            }
            backHref="/products"
            backLabel="Return to Products"
          />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
