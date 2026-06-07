import Link from "next/link";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getAdminProductEditorData } from "@/lib/admin/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Edit Product",
  description: "Edit an AMO product record, update its images, and sync the public catalog.",
  path: "/admin/products",
});

export const dynamic = "force-dynamic";

interface AdminEditProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
  }>;
}

function getEditorNotice(params: Awaited<AdminEditProductPageProps["searchParams"]>) {
  if (params.created === "1") {
    return { message: "Product created successfully.", tone: "success" as const };
  }

  if (params.updated === "1") {
    return { message: "Product updated successfully.", tone: "success" as const };
  }

  return null;
}

export default async function AdminEditProductPage({
  params,
  searchParams,
}: AdminEditProductPageProps) {
  try {
    const [{ id }, query] = await Promise.all([params, searchParams]);
    const { categories, product } = await getAdminProductEditorData(id);

    if (!product) {
      return (
        <InnerPageShell showHeader>
          <section className="bg-black">
            <SectionContainer className="py-20 md:py-28">
              <ProductsErrorState
                title="This product could not be found."
                message="The requested admin product record does not exist or is no longer available."
                backHref="/admin/products"
                backLabel="Return to Products"
              />
            </SectionContainer>
          </section>
          <ApprovedHomeFooter />
        </InnerPageShell>
      );
    }

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="products"
              title="Edit Product"
              description="Update product content, swap gallery images, and keep the admin record aligned with the public Products pages."
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
              <AdminProductForm
                categories={categories}
                mode="edit"
                notice={getEditorNotice(query)}
                product={product}
              />
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
              title="The admin product editor could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load the requested admin product from Supabase."}
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
