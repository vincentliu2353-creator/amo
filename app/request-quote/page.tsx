import { RequestQuoteInquiry } from "@/components/rfq/request-quote-inquiry";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata = buildMetadata({
  title: "Request Quote",
  description: "Tell us about your project. We'll respond with pricing, lead time, and development recommendations.",
  path: "/request-quote",
});

export default function RequestQuotePage() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-white text-black">
        <SectionContainer className="py-20 md:py-28">
          <RequestQuoteInquiry />
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
