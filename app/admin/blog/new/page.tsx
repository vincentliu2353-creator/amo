import Link from "next/link";

import { AdminBlogForm } from "@/components/admin/admin-blog-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buttonStyles } from "@/components/ui/button";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "New Blog Post",
  description: "Create a new AMO blog post for the public journal.",
  path: "/admin/blog/new",
});

export const dynamic = "force-dynamic";

export default async function AdminNewBlogPage() {
  await requireAdminPageSession("/admin/blog/new");

  return (
    <InnerPageShell showHeader>
      <section className="bg-black">
        <SectionContainer className="py-20 md:py-28">
          <AdminShell
            current="blog"
            title="New Blog Post"
            description="Draft, optimize, and publish a new blog entry to the public `/blog` index."
            actions={
              <Link href="/admin/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back to Blog
              </Link>
            }
          >
            <AdminBlogForm mode="create" blog={null} />
          </AdminShell>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
