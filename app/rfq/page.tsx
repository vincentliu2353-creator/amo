import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { RfqForm } from "@/components/rfq/rfq-form";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata = buildMetadata({
  title: "RFQ",
  description: "Review selected products and send your project details.",
  path: "/rfq",
});

export default function RfqPage() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-white text-black">
        <SectionContainer className="py-20 md:py-28">
          <PageHeader
            eyebrow="Request For Quotation"
            title="Request For Quotation"
            description="Review selected products and send your project details."
          />

          <div className="mt-14">
            <RfqForm />
          </div>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
