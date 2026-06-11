import { AdminRfqsConsole } from "@/components/admin/admin-rfqs-console";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminRfqs } from "@/lib/admin/rfqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin RFQs",
  description: "Review AMO RFQ submissions and update quote pipeline status.",
  path: "/admin/rfqs",
});

export const dynamic = "force-dynamic";

export default async function AdminRfqsPage() {
  await requireAdminPageSession("/admin/rfqs");

  try {
    const rfqs = await getAdminRfqs();

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="rfqs"
              title="RFQs"
              description="Review quote requests, general inquiries, selected products, and live RFQ status updates."
            >
              <AdminRfqsConsole rfqs={rfqs} />
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
              title="The RFQ manager could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load RFQ data from Supabase."}
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
