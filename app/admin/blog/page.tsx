import Link from "next/link";

import { AdminBlogsConsole } from "@/components/admin/admin-blogs-console";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buttonStyles } from "@/components/ui/button";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminBlogDashboardData } from "@/lib/admin/blogs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin Blog",
  description: "Create, edit, publish, and delete AMO blog posts.",
  path: "/admin/blog",
});

export const dynamic = "force-dynamic";

interface AdminBlogPageProps {
  searchParams: Promise<{
    deleted?: string;
  }>;
}

function getAdminBlogNotice(params: Awaited<AdminBlogPageProps["searchParams"]>) {
  if (params.deleted === "1") {
    return { message: "Blog post deleted successfully.", tone: "success" as const };
  }

  return null;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  await requireAdminPageSession("/admin/blog");

  try {
    const [blogs, params] = await Promise.all([getAdminBlogDashboardData(), searchParams]);

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="blog"
              title="Blog"
              description="Manage draft and published AMO blog content without changing the public journal styling."
              actions={
                <Link href="/admin/blog/new" className={buttonStyles({ size: "sm" })}>
                  New Post
                </Link>
              }
            >
              <AdminBlogsConsole blogs={blogs} notice={getAdminBlogNotice(params)} />
            </AdminShell>
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  } catch (error) {
    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <ProductsErrorState
              title="The admin blog manager could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load blog data from Supabase."}
              backHref="/admin"
              backLabel="Return to Admin"
            />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
