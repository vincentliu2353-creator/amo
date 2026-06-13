import { AboutPageExperience } from "@/components/about/about-page-experience";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsSiteHeader } from "@/components/products/products-site-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About AMO | Magnetic Levitation Technology Company",
  description:
    "Learn about AMO, a manufacturer focused on premium magnetic levitation products, custom solutions, and innovative display systems.",
  path: "/about",
  keywords: ["about AMO", "magnetic levitation company", "magnetic levitation manufacturer"],
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
