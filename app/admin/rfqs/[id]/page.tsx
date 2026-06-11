import { AdminRfqDetail } from "@/components/admin/admin-rfq-detail";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminRfqById } from "@/lib/admin/rfqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "RFQ Detail",
  description: "View a full AMO RFQ submission and update its status.",
  path: "/admin/rfqs",
});

export const dynamic = "force-dynamic";

interface AdminRfqDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRfqDetailPage({ params }: AdminRfqDetailPageProps) {
  const { id } = await params;
  await requireAdminPageSession(`/admin/rfqs/${id}`);

  try {
    const rfq = await getAdminRfqById(id);

    if (!rfq) {
      return (
        <InnerPageShell showHeader>
          <section className="bg-black">
            <SectionContainer className="py-20 md:py-28">
              <ProductsErrorState
                title="This RFQ could not be found."
                message="The requested RFQ record does not exist or is no longer available."
                backHref="/admin/rfqs"
                backLabel="Return to RFQs"
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
              current="rfqs"
              title={rfq.requestNumber}
              description="Inspect the full customer submission, requested products, and internal follow-up notes."
            >
              <AdminRfqDetail rfq={rfq} />
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
              title="The RFQ detail page could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load the requested RFQ."}
              backHref="/admin/rfqs"
              backLabel="Return to RFQs"
            />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
