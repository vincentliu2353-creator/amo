import { ContactForm } from "@/components/contact/contact-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata = buildMetadata({
  title: "Contact AMO | Magnetic Levitation Manufacturer",
  description:
    "Contact AMO for OEM inquiries, product information, and magnetic levitation project collaboration.",
  path: "/contact",
  keywords: ["contact AMO", "magnetic levitation manufacturer contact", "OEM inquiry"],
});

const contactItems = [
  {
    label: "Email",
    value: "hello@amolevitation.com",
    detail: "Project briefs, OEM inquiries, and commercial discussions.",
  },
  {
    label: "WhatsApp",
    value: "+852 6942 9864",
    detail: "Fast contact for active projects, samples, and timing questions.",
  },
  {
    label: "WeChat",
    value: "vincent-mofan",
    detail: "Preferred for direct coordination with teams operating in China.",
  },
  {
    label: "Location",
    value: "Shenzhen, China",
    detail: "Manufacturing, prototyping, and supply chain coordination base.",
  },
];

export default function ContactPage() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-black text-white">
        <SectionContainer className="py-20 md:py-28">
          <div className="space-y-20 md:space-y-24">
            <div className="border-b border-white/12 pb-16">
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Contact</p>
              <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                LET&apos;S TALK ABOUT
                <br />
                FLOATING IDEAS.
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/68 md:text-lg">
                Contact AMO for OEM development, custom levitation products, branded installations, and commercial evaluations.
              </p>
            </div>

            <div>
              <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/12 bg-white/12 md:grid-cols-2">
                {contactItems.map((item) => (
                  <article key={item.label} className="bg-black p-8 md:p-10">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">{item.label}</p>
                    <p className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">{item.value}</p>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-white/62">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.09),transparent_18%),radial-gradient(circle_at_75%_38%,rgba(255,255,255,0.07),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-8 md:p-12">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Global Coordination</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Engineering in Shenzhen, projects across markets.</h2>
                  <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/66">
                    AMO supports product teams, distributors, and installation partners with direct communication, prototyping alignment, and export-ready commercial coordination.
                  </p>

                  <div className="relative mt-12 min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_34%,rgba(255,255,255,0.08),transparent_7%),radial-gradient(circle_at_52%_30%,rgba(255,255,255,0.08),transparent_7%),radial-gradient(circle_at_80%_38%,rgba(255,255,255,0.08),transparent_7%),radial-gradient(circle_at_28%_72%,rgba(255,255,255,0.08),transparent_8%),radial-gradient(circle_at_68%_68%,rgba(255,255,255,0.08),transparent_8%)]" />
                    <div className="absolute left-[16%] top-[30%] rounded-full border border-white/14 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62">
                      Europe
                    </div>
                    <div className="absolute left-[44%] top-[26%] rounded-full border border-white/14 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62">
                      Middle East
                    </div>
                    <div className="absolute right-[12%] top-[34%] rounded-full border border-white/14 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62">
                      East Asia
                    </div>
                    <div className="absolute left-[24%] bottom-[18%] rounded-full border border-white/14 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62">
                      North America
                    </div>
                    <div className="absolute right-[22%] bottom-[18%] rounded-full border border-white/14 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62">
                      Southeast Asia
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-white/12 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">Response Window</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-white">24-48h</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/62">For serious product and OEM inquiries.</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">Project Types</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-white">OEM / ODM</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/62">Also retail display, gifting, and exhibition work.</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">Business Liaison</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-white">Hong Kong</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/62">
                      Mainly responsible for business liaison, creative and design.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">Production Factory</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-white">Shenzhen</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/62">Close to prototyping, supply chain, and export coordination.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-white/[0.03] p-8 md:p-12">
              <ContactForm />
            </div>
          </div>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
