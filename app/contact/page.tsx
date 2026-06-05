import { ContactForm } from "@/components/contact/contact-form";
import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Have a project in mind? Let's discuss how magnetic levitation can create a unique experience.",
  path: "/contact",
});

const contactItems = [
  { label: "Email", value: "hello@amo.com" },
  { label: "WhatsApp", value: "+86 XXX XXXX XXXX" },
  { label: "Location", value: "Shenzhen, China" },
  { label: "Business", value: "OEM / ODM / Distribution / Custom Projects" },
];

export default function ContactPage() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-white text-black">
        <SectionContainer className="py-20 md:py-28">
          <div className="overflow-hidden rounded-[2.25rem] border border-black/10">
            <div className="grid lg:grid-cols-[0.4fr_0.6fr]">
              <div className="bg-black px-6 py-10 text-white md:px-10 md:py-14">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Contact</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">Contact</h1>
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/72 md:text-lg">
                  Have a project in mind?
                  <br />
                  Let&apos;s discuss how magnetic levitation can create a unique experience.
                </p>

                <div className="mt-12 space-y-8">
                  {contactItems.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/38">{item.label}</p>
                      <p className="mt-3 text-lg leading-relaxed text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white px-6 py-10 md:px-10 md:py-14">
                <ContactForm />
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
      <ApprovedHomeFooter />
    </InnerPageShell>
  );
}
