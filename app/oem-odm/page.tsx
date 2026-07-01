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
  title: "OEM & ODM Magnetic Levitation Manufacturing | AMO",
  description:
    "Work with AMO on OEM and ODM magnetic levitation projects, including ODM magnetic levitation products, private label magnetic levitation products, floating displays, levitating lamps, premium gifts, design brief review, prototype validation, sampling, mass production, and delivery planning.",
  path: "/oem-odm",
  keywords: [
    "OEM magnetic levitation products",
    "magnetic levitation ODM",
    "ODM magnetic levitation products",
    "custom magnetic levitation products",
    "custom magnetic levitation manufacturer",
    "private label magnetic levitation products",
    "magnetic levitation OEM manufacturer",
    "magnetic levitation ODM supplier",
    "custom floating products manufacturer",
    "floating display manufacturer",
    "levitating lamp manufacturer",
    "design brief for OEM magnetic levitation products",
    "magnetic levitation prototype validation",
    "OEM magnetic levitation sampling",
    "magnetic levitation mass production",
    "OEM floating display development",
  ],
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
