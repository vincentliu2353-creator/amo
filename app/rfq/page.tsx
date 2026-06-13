import { Suspense } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateFaqJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/types";

import RFQClient from "./RFQClient";

const rfqFaqs: FaqItem[] = [
  {
    question: "What should I include in an AMO RFQ?",
    answer:
      "Include product interest, quantity, application, customization needs, branding requirements, and any timeline or packaging constraints.",
  },
  {
    question: "Can I use the RFQ form for OEM and ODM projects?",
    answer:
      "Yes. The RFQ route supports standard product inquiries as well as custom magnetic levitation OEM and ODM development requests.",
  },
  {
    question: "Do I need to select products before submitting an RFQ?",
    answer:
      "No. You can submit an RFQ without preselected items, but including products or reference requirements helps AMO respond more precisely.",
  },
];

export const metadata = buildMetadata({
  title: "Request for Quote | AMO Magnetic Levitation Manufacturer",
  description:
    "Submit product, OEM, or custom magnetic levitation RFQs to AMO. Share quantity, application, and customization needs for a response from the team.",
  path: "/rfq",
  keywords: ["magnetic levitation RFQ", "OEM magnetic levitation quote", "custom magnetic levitation inquiry"],
});

export default function RfqPage() {
  return (
    <>
      <JsonLd data={generateFaqJsonLd(rfqFaqs)} />
      <Suspense fallback={<main className="min-h-screen bg-black p-10 text-white">Loading RFQ...</main>}>
        <RFQClient />
      </Suspense>
    </>
  );
}
