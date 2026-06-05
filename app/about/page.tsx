import { AboutPageExperience } from "@/components/about/about-page-experience";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsSiteHeader } from "@/components/products/products-site-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "Explore why AMO exists, why levitation matters, and how design, engineering, and gravity meet inside future floating experiences.",
  path: "/about",
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
