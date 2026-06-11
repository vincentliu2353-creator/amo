import Link from "next/link";

import { AdminBlogForm } from "@/components/admin/admin-blog-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { AdminShell } from "@/components/ui/AdminShell";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buttonStyles } from "@/components/ui/button";
import { requireAdminPageSession } from "@/lib/admin/auth";
import { getAdminBlogEditorData } from "@/lib/admin/blogs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Edit Blog Post",
  description: "Edit an AMO blog post and update its publish status.",
  path: "/admin/blog",
});

export const dynamic = "force-dynamic";

interface AdminEditBlogPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
  }>;
}

function getEditorNotice(params: Awaited<AdminEditBlogPageProps["searchParams"]>) {
  if (params.created === "1") {
    return { message: "Blog post created successfully.", tone: "success" as const };
  }

  if (params.updated === "1") {
    return { message: "Blog post updated successfully.", tone: "success" as const };
  }

  return null;
}

export default async function AdminEditBlogPage({
  params,
  searchParams,
}: AdminEditBlogPageProps) {
  const { id } = await params;
  await requireAdminPageSession(`/admin/blog/${id}/edit`);

  try {
    const [blog, query] = await Promise.all([getAdminBlogEditorData(id), searchParams]);

    if (!blog) {
      return (
        <InnerPageShell showHeader>
          <section className="bg-black">
            <SectionContainer className="py-20 md:py-28">
              <ProductsErrorState
                title="This blog post could not be found."
                message="The requested admin blog record does not exist or is no longer available."
                backHref="/admin/blog"
                backLabel="Return to Blog"
              />
            </SectionContainer>
          </section>
          <ApprovedHomeFooter />
        </InnerPageShell>
      );
    }

    return (
      <InnerPageShell showHeader>
        <section className="bg-black">
          <SectionContainer className="py-20 md:py-28">
            <AdminShell
              current="blog"
              title="Edit Blog Post"
              description="Update article content, cover image, metadata, and publish state."
              actions={
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/blog" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    Back to Blog
                  </Link>
                  <Link href="/admin/blog/new" className={buttonStyles({ size: "sm" })}>
                    New Post
                  </Link>
                </div>
              }
            >
              <AdminBlogForm mode="edit" blog={blog} notice={getEditorNotice(query)} />
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
              title="The admin blog editor could not be loaded."
              message={error instanceof Error ? error.message : "AMO could not load the requested blog post."}
              backHref="/admin/blog"
              backLabel="Return to Blog"
            />
          </SectionContainer>
        </section>
        <ApprovedHomeFooter />
      </InnerPageShell>
    );
  }
}
