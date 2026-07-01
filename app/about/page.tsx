import { AboutPageExperience } from "@/components/about/about-page-experience";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsSiteHeader } from "@/components/products/products-site-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About AMO | Magnetic Levitation Products for Future Spaces",
  description:
    "Learn about AMO, a design-led magnetic levitation brand creating floating displays, levitating lamps, premium gifts, and custom OEM experiences.",
  path: "/about",
  keywords: [
    "about AMO",
    "magnetic levitation manufacturer",
    "floating display manufacturer",
    "OEM magnetic levitation products",
    "display art object",
    "floating art object",
    "magnetic levitation art",
    "magnetic floating sculpture",
    "floating decorative object",
    "levitating decorative object",
    "kinetic sculpture",
    "magnetic kinetic sculpture",
    "custom levitating sculpture",
    "floating installation art",
    "floating office display",
    "executive office display",
    "premium office art object",
    "magnetic levitation office decor",
    "levitating desk object",
    "floating corporate display",
    "luxury office installation",
  ],
});

export default function AboutPage() {
  return (
    <InnerPageShell>
      <ProductsSiteHeader />
      <AboutPageExperience />
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
