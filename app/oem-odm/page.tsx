import { OemOdmPageExperience } from "@/components/oem/oem-odm-page-experience";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateFaqJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/types";

const oemFaqs: FaqItem[] = [
  {
    question: "Do you support white-label and private-label manufacturing?",
    answer:
      "Yes. Private-label supply, co-branded modules, and ODM-style delivery are available when the program scope and annual demand support them.",
  },
  {
    question: "How early should AMO be involved in machine design?",
    answer:
      "The strongest project outcomes happen when levitation architecture is considered during concept planning rather than after mechanical transport is already frozen.",
  },
  {
    question: "Can AMO ship a reference kit before full custom development starts?",
    answer:
      "Yes. Reference modules and OEM kits can shorten proof-of-concept work and reduce architecture risk before the final platform is locked.",
  },
];

export const metadata = buildMetadata({
  title: "OEM & ODM",
  description: "See how AMO supports OEM and ODM levitation motion programs from concept framing to white-label production.",
  path: "/oem-odm",
});

export default function OemOdmPage() {
  return (
    <>
      <JsonLd data={generateFaqJsonLd(oemFaqs)} />

      <InnerPageShell showHeader>
        <OemOdmPageExperience faqs={oemFaqs} />
      </InnerPageShell>
    </>
  );
}
