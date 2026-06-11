"use client";

import Link from "next/link";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminBlogRecord, ContentStatus } from "@/types";

type StatusFilter = "all" | ContentStatus;

interface AdminBlogsConsoleProps {
  blogs: AdminBlogRecord[];
  notice?: {
    message: string;
    tone: "success" | "error";
  } | null;
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return "Draft";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusBadgeClass(status: ContentStatus) {
  return status === "published"
    ? "border-white/16 bg-white/[0.08] text-white"
    : "border-white/12 bg-transparent text-white/58";
}

export function AdminBlogsConsole({ blogs, notice }: AdminBlogsConsoleProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredBlogs = blogs.filter((blog) => {
    const matchesQuery =
      query.trim().length === 0 ||
      [blog.title, blog.slug, blog.category, blog.excerpt]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const publishedCount = blogs.filter((blog) => blog.status === "published").length;

  return (
    <div className="space-y-8">
      {notice ? (
        <div
          className={cn(
            "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
            notice.tone === "success"
              ? "border-white/16 bg-white/[0.08] text-white"
              : "border-red-400/24 bg-red-500/10 text-red-200",
          )}
        >
          {notice.message}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Editorial Control</p>
              <h2 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">Blog</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                Draft, publish, revise, and delete article records without changing the public AMO page styling.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, slug, category, or excerpt"
              />

              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>

              <Link href="/admin/blog/new" className={buttonStyles({ size: "sm" })}>
                New Post
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Posts</p>
              <p className="mt-3 font-display text-2xl font-semibold text-white">{blogs.length}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Published</p>
              <p className="mt-3 font-display text-2xl font-semibold text-white">{publishedCount}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Drafts</p>
              <p className="mt-3 font-display text-2xl font-semibold text-white">{blogs.length - publishedCount}</p>
            </div>
          </div>

          <div className="divide-y divide-white/10 rounded-[20px] border border-white/10">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="grid gap-5 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_10rem_9rem_auto] md:items-center"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{blog.category}</p>
                    <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-[1.08] text-white">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/42">{blog.slug}</p>
                    <p className="mt-3 text-sm leading-6 text-white/56">{blog.excerpt}</p>
                  </div>

                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                    {formatDateLabel(blog.publishedAt)}
                  </div>

                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                    Updated {formatDateLabel(blog.updatedAt)}
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]",
                        statusBadgeClass(blog.status),
                      )}
                    >
                      {blog.status}
                    </span>
                    <Link href={`/admin/blog/${blog.id}/edit`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      Edit
                    </Link>
                    {blog.status === "published" ? (
                      <Link href={`/blog/${blog.slug}`} className={buttonStyles({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
                No blog posts match the current admin filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
