import { redirect } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { Input } from "@/components/ui/input";
import { buttonStyles } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buildMetadata } from "@/lib/seo";
import { getAdminSession, getSafeAdminRedirectPath } from "@/lib/admin/auth";

export const metadata = buildMetadata({
  title: "Admin Login",
  description: "Sign in to manage AMO products, blog posts, and RFQs.",
  path: "/admin/login",
});

export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<{
    email?: string;
    error?: string;
    next?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [session, params] = await Promise.all([getAdminSession(), searchParams]);
  const nextPath = getSafeAdminRedirectPath(params.next);

  if (session) {
    redirect(nextPath);
  }

  return (
    <InnerPageShell showHeader>
      <section className="bg-black text-white">
        <SectionContainer className="py-24 md:py-32">
          <div className="mx-auto max-w-[36rem] rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.34)] md:p-8">
            <div className="border-b border-white/10 pb-8">
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">AMO Admin</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Login
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/62">
                Sign in to manage protected AMO admin routes. Supabase Auth is used when available;
                otherwise the temporary environment-based admin credentials apply.
              </p>
            </div>

            <form action="/api/admin/auth/login" method="post" className="mt-8 space-y-5">
              <input type="hidden" name="next" value={nextPath} />

              <div>
                <label htmlFor="admin-email" className="text-xs uppercase tracking-[0.24em] text-white/42">
                  Email
                </label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  defaultValue={params.email ?? ""}
                  required
                  className="mt-3"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="text-xs uppercase tracking-[0.24em] text-white/42">
                  Password
                </label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  className="mt-3"
                />
              </div>

              {params.error ? (
                <div className="rounded-[1.5rem] border border-red-400/24 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
                  {params.error}
                </div>
              ) : null}

              <button type="submit" className={buttonStyles({ size: "lg", fullWidth: true })}>
                Sign In
              </button>
            </form>
          </div>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
