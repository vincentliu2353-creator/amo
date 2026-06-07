import Link from "next/link";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { AdminShell } from "@/components/ui/AdminShell";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { caseStudies } from "@/data/cases";
import { blogPosts } from "@/data/blog";
import { getAdminProductDashboardData } from "@/lib/admin/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin",
  description: "Manage AMO products, content, and quote requests.",
  path: "/admin",
});

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let productCount = 0;

  try {
    const { products } = await getAdminProductDashboardData();
    productCount = products.length;
  } catch {
    productCount = 0;
  }

  const stats = [
    { label: "Products", value: productCount, caption: "Published products" },
    { label: "Cases", value: caseStudies.length, caption: "Published cases" },
    { label: "Blog", value: blogPosts.length, caption: "Published articles" },
    { label: "RFQs", value: 0, caption: "Pending requests" },
  ];

  return (
    <InnerPageShell showHeader>
      <section className="bg-black">
        <SectionContainer className="py-20 md:py-28">
          <AdminShell
            current="dashboard"
            title="Dashboard"
            description="Manage AMO products, content, and quote requests."
            actions={
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                  Open Products
                </Link>
                <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
                  New Product
                </Link>
              </div>
            }
          >
            <div className="divide-y divide-white/10 rounded-[1.75rem] border border-white/10">
              {stats.map((stat) => (
                <article key={stat.label} className="grid gap-4 px-6 py-5 md:grid-cols-[10rem_8rem_minmax(0,1fr)] md:items-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">{stat.label}</p>
                  <p className="text-4xl font-semibold tracking-tight text-white">{stat.value}</p>
                  <p className="text-sm leading-relaxed text-white/56">{stat.caption}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Products</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Catalog operations</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
                  Create, edit, publish, and review live product records without changing the public navigation or backend workflows.
                </p>
                <div className="mt-6">
                  <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      Manage Products
                    </Link>
                    <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
                      New Product
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Notes</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Safe fallback behavior</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
                  If live admin data is unavailable, the dashboard still renders with safe fallback counts and preserves the existing route structure.
                </p>
              </div>
            </div>
          </AdminShell>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
