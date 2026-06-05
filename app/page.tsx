import { HomePageExperience } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, generateOrganizationJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Magnetic Levitation For Future Spaces",
  description:
    "AMO creates premium magnetic levitation products for retail, hospitality, gifting, exhibitions, and OEM display experiences.",
  path: "/",
  keywords: ["magnetic levitation", "levitating clocks", "levitating lamps", "OEM maglev modules", "floating display systems"],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateOrganizationJsonLd()} />
      <HomePageExperience />
    </>
  );
}
