import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

const homeFooterNav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cases", label: "Cases" },
  { href: "/oem-odm", label: "OEM&ODM" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const homeUtilityNav = [
  { href: "/favorites", label: "Favorites" },
  { href: "/rfq", label: "RFQ" },
];

export function ApprovedHomeFooter() {
  return (
    <footer data-header-theme="dark" className="relative min-h-[92vh] overflow-hidden border-t border-white/8 bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,229,255,0.12),transparent_22%),linear-gradient(180deg,#040404_0%,#0a0a0b_100%)]" />
      <Container className="relative z-10 flex min-h-[92vh] flex-col justify-between py-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Image src="/amo-logo-white.png" alt="AMO" width={37} height={17} className="h-[28px] w-auto" />
            <p className="mt-8 max-w-2xl font-sans text-[14px] leading-[22.75px] text-[#A3A3A3]">
              AMO creates magnetic levitation products for future retail, hospitality, gifting, and custom brand display
              experiences.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-500">Sitemap</p>
                <div className="mt-4 space-y-3">
                  {homeFooterNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-300 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-500">Platform</p>
                <div className="mt-4 space-y-3">
                  {homeUtilityNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-300 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-2 font-sans text-[14px] leading-[22.75px] text-slate-400">
              <div>
                {siteConfig.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p>Phone: {siteConfig.phone}</p>
              <p>Email: {siteConfig.email}</p>
            </div>
          </div>

          <form
            action="/rfq"
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur sm:p-6 xl:p-7"
          >
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-50/28 to-transparent" />
            <div aria-hidden className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-200/10 blur-3xl" />

            <div className="relative">
              <p className="font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-cyan-50/56">Compact Quote Form</p>
              <h2 className="mt-4 font-sans text-[28px] font-medium uppercase leading-[32px] tracking-normal text-white sm:text-[36px] sm:leading-[40px]">
                Start The RFQ Flow.
              </h2>
              <p className="mt-4 max-w-xl font-sans text-[14px] leading-[22.75px] text-[#A3A3A3]">
                Share the first project details here. We carry them into the existing RFQ page, where your product shortlist can be
                finalized next.
              </p>

              <div className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <label className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-400">
                  <span className="block">Company</span>
                  <input
                    name="company"
                    className="mt-2 w-full border-0 border-b border-white/14 bg-transparent px-0 py-3 font-sans text-[14px] leading-[22.75px] text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/52"
                    placeholder="Company name"
                  />
                </label>
                <label className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-400">
                  <span className="block">Email</span>
                  <input
                    name="email"
                    type="email"
                    className="mt-2 w-full border-0 border-b border-white/14 bg-transparent px-0 py-3 font-sans text-[14px] leading-[22.75px] text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/52"
                    placeholder="name@company.com"
                  />
                </label>
                <label className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-400">
                  <span className="block">Project Type</span>
                  <select
                    name="project"
                    defaultValue=""
                    className="mt-2 w-full border-0 border-b border-white/14 bg-transparent px-0 py-3 font-sans text-[14px] leading-[22.75px] text-white outline-none transition focus:border-cyan-300/52"
                  >
                    <option value="" disabled>
                      Select project type
                    </option>
                    <option value="OEM">OEM</option>
                    <option value="ODM">ODM</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Brand Owner">Brand Owner</option>
                  </select>
                </label>
                <label className="block font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-400 sm:col-span-2">
                  <span className="block">Project Notes</span>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-3 w-full resize-none rounded-[20px] border border-white/12 bg-white/[0.035] px-4 py-3 font-sans text-[14px] leading-[22.75px] text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/52 focus:bg-white/[0.055]"
                    placeholder="Product direction, environment, quantity intent, or customization scope."
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white px-5 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-black transition hover:bg-cyan-50"
                >
                  Continue to RFQ
                </button>
                <Link
                  href="/products"
                  className="inline-flex min-h-10 items-center justify-center px-2 py-2 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3] transition hover:text-white"
                >
                  View Products
                </Link>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-6 font-sans text-[12px] font-medium uppercase leading-4 tracking-normal text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>(C) 2026 AMO. Magnetic levitation products and OEM display systems.</p>
          <p>All website imagery and visual assets are protected intellectual property of AMO.</p>
        </div>
      </Container>
    </footer>
  );
}
