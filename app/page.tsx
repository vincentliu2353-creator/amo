import { HomePageExperience } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateFaqJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/types";

const homeFaqs: FaqItem[] = [
  {
    question: "What products does AMO manufacture?",
    answer:
      "AMO manufactures levitating clocks, levitating lamps, floating display systems, levitating display bases, and custom magnetic levitation products for B2B customers.",
  },
  {
    question: "Does AMO support OEM and ODM projects?",
    answer:
      "Yes. AMO supports OEM and ODM programs including custom development, prototyping, branding, packaging, and production planning.",
  },
  {
    question: "Which industries use AMO magnetic levitation products?",
    answer:
      "AMO products are used in retail, luxury gifting, exhibitions, museums, hospitality, interior design, and premium product display environments.",
  },
];

export const metadata = buildMetadata({
  title: "AMO | Magnetic Levitation Products Manufacturer & OEM Solutions",
  description:
    "Premium magnetic levitation products for retail displays, gifts, lighting, and custom OEM projects. Manufacturer-direct solutions from AMO.",
  path: "/",
  keywords: [
    "levitating clocks",
    "levitating lamps",
    "floating display systems",
    "custom magnetic levitation products",
    "magnetic levitation OEM",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateFaqJsonLd(homeFaqs)} />
      <HomePageExperience />
    </>
  );
}
