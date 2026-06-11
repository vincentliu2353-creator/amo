import { AdminProductsConsole } from "@/components/admin/admin-products-console";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { buildMetadata } from "@/lib/seo";
import { getAdminProductDashboardData } from "@/lib/admin/products";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Admin Products",
  description: "Internal product manager for creating, editing, publishing, and deleting catalog records.",
  path: "/admin/products",
});

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    updated?: string;
  }>;
}

function getAdminProductsNotice(params: Awaited<AdminProductsPageProps["searchParams"]>) {
  if (params.created === "1") {
    return { message: "Product created successfully.", tone: "success" as const };
  }

  if (params.updated === "1") {
    return { message: "Product updated successfully.", tone: "success" as const };
  }

  if (params.deleted === "1") {
    return { message: "Product deleted successfully.", tone: "success" as const };
  }

  return null;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdminPageSession("/admin/products");

  try {
    const [{ products }, params] = await Promise.all([
      getAdminProductDashboardData(),
      searchParams,
    ]);

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="products"
              title="Products"
              description="Manage catalog records, open the dedicated upload flow, and review which products are published to the public catalog."
              actions={
                <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
                  New Product
                </Link>
              }
            >
              <AdminProductsConsole products={products} notice={getAdminProductsNotice(params)} />
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
