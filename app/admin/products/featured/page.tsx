import Link from "next/link";

import { AdminFeaturedProductsManager } from "@/components/admin/admin-featured-products-manager";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminFeaturedProductsData } from "@/lib/admin/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Featured Products",
  description: "Select up to 10 published products for the AMO Products page showcase.",
  path: "/admin/products/featured",
});

export const dynamic = "force-dynamic";

export default async function AdminFeaturedProductsPage() {
  await requireAdminPageSession("/admin/products/featured");

  try {
    const { products } = await getAdminFeaturedProductsData();

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="products"
              title="Featured Products"
              description="Manage the exact products and ordering used by the main Products page showcase without changing the public design or catalog editor."
              actions={
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    Back to Products
                  </Link>
                  <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
                    New Product
                  </Link>
                </div>
              }
            >
              <AdminFeaturedProductsManager products={products} />
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
              title="The featured products manager could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load published products from Supabase."}
              backHref="/admin/products"
              backLabel="Return to Products"
            />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
