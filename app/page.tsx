import { HomePageExperience } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateWebsiteJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AMO | Magnetic Levitation Manufacturer for Floating Displays, Lamps & Premium Gifts",
  description:
    "AMO is a magnetic levitation products manufacturer creating floating displays, levitating lamps, premium gifts, and OEM/ODM product development for future retail, hospitality, gifting, and custom brand display experiences.",
  path: "/",
  keywords: [
    "magnetic levitation manufacturer",
    "magnetic levitation products manufacturer",
    "magnetic levitation factory",
    "magnetic levitation company",
    "magnetic levitation solution provider",
    "magnetic levitation product supplier",
    "magnetic levitation device manufacturer",
    "floating display manufacturer",
    "levitating lamp manufacturer",
    "floating display systems",
    "magnetic levitation corporate gifts",
    "custom magnetic levitation products",
    "OEM magnetic levitation products",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateWebsiteJsonLd()} />
      <HomePageExperience />
    </>
  );
}
