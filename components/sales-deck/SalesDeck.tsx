import type { ReactNode } from "react";

import Image from "@/components/ui/responsive-image";

import { SalesDeckSlide } from "@/components/sales-deck/SalesDeckSlide";
import {
  SALES_DECK_TOTAL_SLIDES,
  bestFitApplications,
  contactChecklist,
  contactDetails,
  customizationOptions,
  exampleDirections,
  heroTags,
  oemProcessSteps,
  referenceProjectTypes,
  rfqChecklist,
  salesDeckLinks,
  timelineGuidance,
  whatWeMakeItems,
} from "@/components/sales-deck/sales-deck-content";

function DeckEyebrow({ children }: { children: string }) {
  return <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">{children}</p>;
}

function DeckTag({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-white/68">
      {children}
    </span>
  );
}

function DeckPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SalesDeck() {
  return (
    <div className="sales-deck-root bg-[radial-gradient(circle_at_top,rgba(166,232,255,0.08),transparent_20%),linear-gradient(180deg,#020304_0%,#05070a_44%,#020304_100%)]" data-sales-deck-ready="true">
      <SalesDeckSlide
        backgroundAlt="Premium floating display presentation used as the opening hero image for the AMO sales deck."
        backgroundPosition="center center"
        backgroundSrc="/images/blog/heroes/floating-display-for-perfume-brands.webp"
        contentClassName="justify-between"
        pageNumber={1}
        priority
        totalPages={SALES_DECK_TOTAL_SLIDES}
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end">
          <div className="max-w-[44rem] self-end">
            <DeckEyebrow>Magnetic Levitation Sales Deck</DeckEyebrow>
            <h1 className="mt-5 max-w-[40rem] text-[clamp(2.35rem,5.5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
              AMO - Magnetic Levitation Displays for Premium Brand Moments
            </h1>
            <p className="mt-5 max-w-[32rem] text-[1rem] leading-7 text-white/72">
              Custom floating display systems for retail, exhibitions, hospitality, branded gifts, and OEM product development.
            </p>
            <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-7 text-white/60">
              AMO creates magnetic levitation experiences that transform ordinary objects into moments of curiosity, movement, and commercial attention.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {heroTags.map((tag) => (
                <DeckTag key={tag}>{tag}</DeckTag>
              ))}
            </div>
          </div>

          <DeckPanel className="self-end">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/42">Best Fit</p>
            <p className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">
              For brands, studios, distributors, and display partners.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Built for premium product presentation, OEM display development, and spatial brand experiences that need commercial attention without visual noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center rounded-full border border-white/16 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-white/10"
                href={salesDeckLinks.rfq}
              >
                Start an RFQ
              </a>
              <a
                className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-white/72 transition hover:border-white/18 hover:text-white"
                href={salesDeckLinks.email}
              >
                Email AMO
              </a>
            </div>
          </DeckPanel>
        </div>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={2} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 02</DeckEyebrow>
        <div className="mt-4 max-w-[42rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">What We Make</h2>
          <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-7 text-white/64">
            Magnetic levitation systems for objects that need to become the center of attention.
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3">
          {whatWeMakeItems.map((item, index) => (
            <DeckPanel key={item.title} className="flex min-h-0 flex-col overflow-hidden p-0">
              <div className="relative h-40 overflow-hidden border-b border-white/10">
                <Image alt={item.imageAlt} className="object-cover" fill quality={80} sizes="33vw" src={item.imageSrc} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-transparent" />
                <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.3em] text-white/44">
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-3 text-[0.84rem] leading-6 text-white/58">{item.description}</p>
              </div>
            </DeckPanel>
          ))}
        </div>

        <p className="mt-5 max-w-[52rem] text-sm leading-7 text-white/56">
          From object design to magnetic architecture, AMO supports both finished product development and custom OEM/ODM programs.
        </p>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={3} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 03</DeckEyebrow>
        <div className="mt-4 max-w-[46rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">Best-fit Applications</h2>
          <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-white/64">
            AMO is built for spaces where one object needs to stop people, hold attention, and feel more valuable.
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3">
          {bestFitApplications.map((item) => (
            <DeckPanel key={item.title} className="flex min-h-0 flex-col overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden border-b border-white/10">
                <Image alt={item.imageAlt} className="object-cover" fill quality={75} sizes="33vw" src={item.imageSrc} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-3 text-[0.82rem] leading-6 text-white/58">{item.description}</p>
              </div>
            </DeckPanel>
          ))}
        </div>

        <p className="mt-5 max-w-[56rem] text-sm leading-7 text-white/56">
          Best for watches, jewelry, fragrance, beauty, collectibles, electronics, awards, art objects, and branded hero products.
        </p>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={4} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 04</DeckEyebrow>
        <div className="mt-4 max-w-[46rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">OEM / ODM Process</h2>
          <p className="mt-4 max-w-[36rem] text-[0.98rem] leading-7 text-white/64">
            From idea to levitation. From first brief to commercial delivery.
          </p>
        </div>

        <div className="mt-7 grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
          <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5">
            <div className="absolute left-5 right-5 top-[2.55rem] hidden h-px bg-gradient-to-r from-white/12 via-white/6 to-transparent md:block" />
            <div className="grid gap-4 md:grid-cols-2">
              {oemProcessSteps.map((step, index) => (
                <DeckPanel key={step.title} className={index === oemProcessSteps.length - 1 ? "md:col-span-2" : ""}>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/36">{step.title}</p>
                  <p className="mt-3 text-[0.95rem] leading-6 text-white/76">{step.summary}</p>
                  <div className="mt-4 rounded-2xl border border-white/8 bg-black/24 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">{step.detailLabel}</p>
                    <p className="mt-2 text-[0.78rem] leading-6 text-white/52">{step.detailText}</p>
                  </div>
                </DeckPanel>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DeckPanel className="relative flex-1 overflow-hidden p-0">
              <div className="relative h-full min-h-[19rem]">
                <Image
                  alt="Exploded engineering visual used to represent AMO OEM development."
                  className="object-cover"
                  fill
                  quality={75}
                  sizes="28vw"
                  src="/images/blog/heroes/oem-magnetic-levitation-products-from-concept-to-production.webp"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.78)_100%)]" />
                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Engineering Lens</p>
                  <p className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">
                    The strongest project outcomes happen when levitation architecture is considered during concept planning, not after the form is frozen.
                  </p>
                </div>
              </div>
            </DeckPanel>

            <DeckPanel>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/36">Program Traits</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Brief clarity", "Prototype validation", "Sampling discipline", "QC readiness", "Export support"].map((trait) => (
                  <DeckTag key={trait}>{trait}</DeckTag>
                ))}
              </div>
            </DeckPanel>
          </div>
        </div>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={5} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 05</DeckEyebrow>
        <div className="mt-4 max-w-[46rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">Customization Options</h2>
          <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-white/64">
            Every visible and functional element can be planned around the object, brand, and commercial use case.
          </p>
        </div>

        <div className="mt-7 grid flex-1 gap-5 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
          <div className="grid gap-4">
            <DeckPanel className="relative min-h-[18rem] overflow-hidden p-0">
              <Image
                alt="Development capability visual showing a magnetic levitation product system."
                className="object-cover"
                fill
                quality={75}
                sizes="32vw"
                src="/images/oem/optimized/development-capability.webp"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.8)_100%)]" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">System View</p>
                <p className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">
                  AMO designs the object, base, magnetic behavior, and presentation logic as one complete system.
                </p>
              </div>
            </DeckPanel>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { alt: "Custom product shape reference for AMO OEM programs.", src: "/images/oem/optimized/custom-product-shape.webp", title: "Form" },
                { alt: "Custom branding detail for AMO OEM programs.", src: "/images/oem/optimized/custom-branding.webp", title: "Branding" },
                { alt: "Custom lighting detail for AMO OEM programs.", src: "/images/oem/optimized/custom-lighting.webp", title: "Lighting" },
              ].map((detail) => (
                <DeckPanel key={detail.title} className="relative min-h-[8.5rem] overflow-hidden p-0">
                  <Image alt={detail.alt} className="object-cover" fill quality={75} sizes="18vw" src={detail.src} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.28em] text-white/52">{detail.title}</p>
                </DeckPanel>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {customizationOptions.map((option, index) => (
              <DeckPanel key={option.title} className={index === customizationOptions.length - 1 ? "md:col-span-2" : ""}>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1rem] font-semibold tracking-[-0.03em] text-white">{option.title}</h3>
                <p className="mt-3 text-[0.8rem] leading-6 text-white/56">{option.description}</p>
              </DeckPanel>
            ))}
          </div>
        </div>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={6} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 06</DeckEyebrow>
        <div className="mt-4 max-w-[48rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">Example Visual Directions</h2>
          <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-white/64">
            Four directions a brand, studio, or display partner can develop with AMO.
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 md:grid-cols-2">
          {exampleDirections.map((direction, index) => (
            <div key={direction.title} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30">
              <div className="absolute inset-0">
                <Image alt={direction.imageAlt} className="object-cover" fill quality={80} sizes="50vw" src={direction.imageSrc} />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.84)_100%)]" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/46">
                  Application Direction {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{direction.title}</h3>
                <p className="mt-3 max-w-[28rem] text-[0.88rem] leading-6 text-white/64">{direction.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {direction.bestFor.map((item) => (
                    <DeckTag key={item}>{item}</DeckTag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-[56rem] text-sm leading-7 text-white/56">
          If the object needs to feel more valuable, more visible, and more memorable, levitation can become part of the brand experience.
        </p>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={7} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 07</DeckEyebrow>
        <div className="mt-4 max-w-[48rem]">
          <h2 className="text-[clamp(2.1rem,4.8vw,4.1rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-white">Lead Time / MOQ Logic</h2>
          <p className="mt-4 max-w-[40rem] text-[0.98rem] leading-7 text-white/64">
            Lead time and MOQ depend on customization depth, engineering risk, object complexity, and production readiness.
          </p>
        </div>

        <div className="mt-7 grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <div className="grid gap-4">
            {referenceProjectTypes.map((project) => (
              <DeckPanel key={project.title}>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">{project.title}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/32">Best For</p>
                    <p className="mt-2 text-[0.8rem] leading-6 text-white/58">{project.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/32">Typical Path</p>
                    <p className="mt-2 text-[0.8rem] leading-6 text-white/58">{project.path}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/32">MOQ Logic</p>
                    <p className="mt-2 text-[0.8rem] leading-6 text-white/58">{project.moqLogic}</p>
                  </div>
                </div>
              </DeckPanel>
            ))}
          </div>

          <div className="grid gap-4">
            <DeckPanel className="relative min-h-[12rem] overflow-hidden p-0">
              <Image
                alt="Lead-time and sampling visual used for AMO project planning."
                className="object-cover"
                fill
                quality={75}
                sizes="32vw"
                src="/images/blog/heroes/moq-sampling-lead-time-magnetic-levitation-products.webp"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Reference Logic</p>
                <p className="mt-3 text-[0.92rem] leading-6 text-white/64">
                  Existing and semi-custom programs may use 45-60 days after sample approval as a reference pattern. Final timing still depends on object, customization, quantity, and delivery scope.
                </p>
              </div>
            </DeckPanel>

            <DeckPanel>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">Timeline Guidance</p>
              <div className="mt-4 space-y-2">
                {timelineGuidance.map((item) => (
                  <p key={item} className="text-[0.82rem] leading-6 text-white/58">
                    {item}
                  </p>
                ))}
              </div>
            </DeckPanel>

            <DeckPanel>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">RFQ Checklist</p>
              <div className="mt-4 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {rfqChecklist.map((item) => (
                  <p key={item} className="text-[0.8rem] leading-6 text-white/56">
                    {item}
                  </p>
                ))}
              </div>
            </DeckPanel>
          </div>
        </div>

        <p className="mt-5 max-w-[56rem] text-sm leading-7 text-white/56">
          AMO quotes projects based on commercial readiness, not only unit price. The goal is to reduce risk before production.
        </p>
      </SalesDeckSlide>

      <SalesDeckSlide pageNumber={8} totalPages={SALES_DECK_TOTAL_SLIDES}>
        <DeckEyebrow>Page 08</DeckEyebrow>
        <div className="mt-4 grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
          <div className="flex flex-col">
            <h2 className="max-w-[34rem] text-[clamp(2.35rem,5.4vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
              Start Your Floating Display Project
            </h2>
            <p className="mt-5 max-w-[34rem] text-[1rem] leading-7 text-white/66">
              Send us the object, the use case, and the launch goal. We will help define the right magnetic levitation direction.
            </p>

            <DeckPanel className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">To Start, Send</p>
              <div className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {contactChecklist.map((item, index) => (
                  <p key={item} className="text-[0.88rem] leading-6 text-white/60">
                    {index + 1}. {item}
                  </p>
                ))}
              </div>
            </DeckPanel>

        <p className="mt-auto max-w-[38rem] text-sm leading-7 text-white/56">
          AMO creates magnetic levitation products for future retail, hospitality, gifting, and custom brand display experiences.
        </p>
          </div>

          <DeckPanel className="flex flex-col">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/36">Direct Contact</p>
                <p className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">RFQ, email, WhatsApp, or direct business liaison.</p>
              </div>

              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[1.25rem] border border-white/12 bg-white p-3">
                <Image alt="WhatsApp QR code for AMO sales deck inquiries." className="object-contain" fill sizes="128px" src="/downloads/amo-whatsapp-qr.png" />
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {contactDetails.map((item) => (
                <div key={item.label} className="border-t border-white/8 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/32">{item.label}</p>
                  <p className="mt-2 text-[0.95rem] leading-6 text-white/74">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center rounded-full border border-white/16 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-white/10"
                href={salesDeckLinks.rfq}
              >
                Request a Quote
              </a>
              <a
                className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-white/72 transition hover:border-white/18 hover:text-white"
                href={salesDeckLinks.whatsapp}
              >
                WhatsApp
              </a>
            </div>
          </DeckPanel>
        </div>
      </SalesDeckSlide>
    </div>
  );
}
