import Link from "next/link";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminProductEditorData } from "@/lib/admin/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "New Product",
  description: "Create a new AMO product and upload gallery images into Supabase Storage.",
  path: "/admin/products/new",
});

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  await requireAdminPageSession("/admin/products/new");

  try {
    const { categories } = await getAdminProductEditorData();

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="products"
              title="New Product"
              description="Create a dedicated catalog record, upload product images, and publish the result to the public Products experience."
              actions={
                <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                  Back to Products
                </Link>
              }
            >
              <AdminProductForm categories={categories} mode="create" product={null} />
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
              title="The admin product upload page could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load admin product setup data from Supabase."}
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
