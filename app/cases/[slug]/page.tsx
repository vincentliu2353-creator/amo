import Link from "next/link";
import { notFound } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { PageShell } from "@/components/layout/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { NexusPanel } from "@/components/ui/nexus-panel";
import { caseStudies, getCaseStudyBySlug } from "@/data/cases";
import { getProductBySlug } from "@/data/products";
import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((entry) => ({
    slug: entry.slug,
  }));
}

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);

  if (!entry) {
    return buildMetadata({
      title: "Case Study",
      description: "AMO project reference.",
      path: "/cases",
    });
  }

  return buildMetadata({
    title: entry.title,
    description: entry.summary,
    path: `/cases/${entry.slug}`,
  });
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);

  if (!entry) {
    notFound();
  }

  const linkedProducts = entry.featuredProductSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cases", path: "/cases" },
          { name: entry.title, path: `/cases/${entry.slug}` },
        ])}
      />

      <InnerPageShell showHeader>
        <PageShell width="wide" contentClassName="space-y-3 sm:space-y-4">
          <section className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr]">
            <NexusPanel tone="hero" padding="lg">
              <div className="relative">
                <Link href="/cases" className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3] transition hover:text-white">
                  Back to Cases
                </Link>
                <p className="mt-6 text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">{entry.sector}</p>
                <h1 className="mt-6 max-w-4xl font-sans text-[44px] font-medium leading-[44px] tracking-[-0.025em] text-white sm:text-[60px] sm:leading-[60px] xl:text-[72px] xl:leading-[72px]">
                  {entry.title}
                </h1>
                <p className="mt-6 max-w-3xl text-[14px] leading-[22.75px] text-[#A3A3A3]">{entry.summary}</p>
              </div>
            </NexusPanel>

            <NexusPanel tone="default" padding="md">
              <div className="relative">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Outcome Snapshot</p>
                <div className="mt-6 divide-y divide-white/8">
                  {entry.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between gap-4 py-4 text-[14px] leading-[22.75px]">
                      <span className="text-[#A3A3A3]">{metric.label}</span>
                      <span className="text-white">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </NexusPanel>
          </section>

          <section className="grid gap-3 lg:grid-cols-2">
            <NexusPanel tone="default" padding="md">
              <div className="relative">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Challenge</p>
                <p className="mt-4 text-[14px] leading-[22.75px] text-[#A3A3A3]">{entry.challenge}</p>
              </div>
            </NexusPanel>
            <NexusPanel tone="default" padding="md">
              <div className="relative">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Solution</p>
                <p className="mt-4 text-[14px] leading-[22.75px] text-[#A3A3A3]">{entry.solution}</p>
              </div>
            </NexusPanel>
          </section>

          <section className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <NexusPanel tone="default" padding="md">
              <div className="relative">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Measured Results</p>
                <div className="mt-6 space-y-3">
                  {entry.results.map((result) => (
                    <div key={result} className="rounded-[24px] border border-white/8 bg-black/28 p-4 text-[14px] leading-[22.75px] text-[#A3A3A3]">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </NexusPanel>

            <NexusPanel tone="default" padding="md">
              <div className="relative">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">Products Used</p>
                <div className="mt-6 space-y-3">
                  {linkedProducts.map((product) => (
                    <Link key={product.slug} href={`/products/${product.slug}`} className="block">
                      <NexusPanel tone="subtle" padding="sm" outerClassName="hover:opacity-95 transition">
                        <div className="relative">
                          <p className="font-sans text-[24px] font-medium leading-[28px] tracking-[-0.025em] text-white">{product.name}</p>
                          <p className="mt-3 text-[14px] leading-[22.75px] text-[#A3A3A3]">{product.summary}</p>
                        </div>
                      </NexusPanel>
                    </Link>
                  ))}
                </div>
              </div>
            </NexusPanel>
          </section>
        </PageShell>
        <ApprovedHomeFooter />
      </InnerPageShell>
    </>
  );
}
