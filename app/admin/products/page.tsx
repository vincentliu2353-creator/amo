import { AdminProductsConsole } from "@/components/admin/admin-products-console";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buildMetadata } from "@/lib/seo";
import { getAdminProductDashboardData } from "@/lib/admin/products";

export const metadata = buildMetadata({
  title: "Admin Products",
  description: "Internal product manager for creating, editing, publishing, and deleting catalog records.",
  path: "/admin/products",
});

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  try {
    const { categories, products } = await getAdminProductDashboardData();

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="products"
              title="Products"
              description="Manage catalog records, product imagery, and public product details inside the existing admin workflow."
            >
              <AdminProductsConsole categories={categories} products={products} />
            </AdminShell>
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  } catch (error) {
    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <ProductsErrorState
              title="The admin product manager could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load admin catalog data from Supabase."}
              backHref="/admin"
              backLabel="Return to Admin"
            />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
