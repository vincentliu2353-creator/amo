"use client";

import { useSearchParams } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { RfqForm, type RfqFormPrefills } from "@/components/rfq/rfq-form";
import { RfqQuoteList } from "@/components/rfq/rfq-quote-list";
import { SectionContainer } from "@/components/ui/SectionContainer";

function buildPrefills(searchParams: { get: (key: string) => string | null }): RfqFormPrefills {
  return {
    businessType: searchParams.get("project") ?? "",
    companyName: searchParams.get("company") ?? "",
    contactName: searchParams.get("contact") ?? "",
    country: searchParams.get("country") ?? "",
    customizationRequirements: searchParams.get("requirements") ?? "",
    email: searchParams.get("email") ?? "",
    estimatedQuantity: searchParams.get("volume") ?? "",
    message: searchParams.get("message") ?? "",
    phone: searchParams.get("phone") ?? "",
  };
}

export default function RFQClient() {
  const searchParams = useSearchParams();

  return (
    <InnerPageShell showHeader>
      <section className="bg-black text-white">
        <SectionContainer className="py-28 md:py-32">
          <div className="space-y-14 md:space-y-16">
            <RfqQuoteList />
            <RfqForm formKey={searchParams.toString()} prefills={buildPrefills(searchParams)} />
          </div>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
