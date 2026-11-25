import type { ReactNode } from "react";

import Image from "@/components/ui/responsive-image";

import { DeckSlide } from "@/components/company-deck/DeckSlide";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const TOTAL_SLIDES = 30;

const businessModelItems = [
  {
    copy: "Finished magnetic levitation products ready for distributors and commercial buyers who want a premium category already resolved.",
    imageSrc: "/images/home/future-objects/clock.webp",
    title: "Finished Products",
  },
  {
    copy: "OEM customization based on existing AMO product platforms, tuned around branding, packaging, finish, lighting, and use case.",
    imageSrc: "/images/oem/optimized/custom-branding.webp",
    title: "OEM Development",
  },
  {
    copy: "ODM collaboration for new floating concepts that need product definition, engineering logic, prototype validation, and manufacturing planning.",
    imageSrc: "/images/home/future-objects/oem-module.webp",
    title: "ODM Collaboration",
  },
] as const;

const audienceList = [
  "Brands",
  "Design Studios",
  "Retail Display Partners",
  "Event & Exhibition Agencies",
  "Premium Gift Companies",
  "Distributors",
] as const;

const choicePoints = [
  "Design-led presentation",
  "Stable magnetic architecture",
  "OEM / ODM customization",
  "Prototype and sampling support",
  "Production and delivery coordination",
] as const;

const systemCallouts = [
  { body: "The floating object is tuned as part of the field, not treated as decoration added later.", title: "Object" },
  { body: "The base controls lift, balance, power behavior, and surface language at the same time.", title: "Base" },
  { body: "Electronics and magnetic control define how calm, stable, and repeatable the motion feels.", title: "Control" },
  { body: "Presentation intent shapes height, rotation, proportion, and the way attention is directed.", title: "Presentation" },
] as const;

const processSteps = ["Brief", "Concept", "Engineering", "Prototype", "Sampling", "Production", "Delivery"] as const;

const panoramaProducts = [
  { imageSrc: "/images/home/future-objects/display-base.webp", title: "Floating Display Bases" },
  { imageSrc: "/images/home/future-objects/clock.webp", title: "Levitating Clocks" },
  { imageSrc: "/images/home/future-objects/lamp.webp", title: "Levitating Lamps" },
  { imageSrc: "/images/home/future-objects/art-object.webp", title: "Display Art Objects" },
  { imageSrc: "/images/home/future-objects/oem-module.webp", title: "OEM Maglev Modules" },
  { imageSrc: "/images/home/applications/premium-gifts.webp", title: "Premium Gifts" },
  { imageSrc: "/images/home/future-objects/brand-installation.webp", title: "Custom Installations" },
] as const;

const ctaChecklist = [
  "Object type",
  "Quantity target",
  "Application scenario",
  "Customization needs",
  "Timeline",
  "Target market",
  "Reference images or concept notes",
] as const;

function Eyebrow({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return <p className={cn("text-[11px] uppercase tracking-[0.38em]", tone === "dark" ? "text-white/42" : "text-black/42")}>{children}</p>;
}

function SlideTitle({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <h2
      className={cn(
        "text-[clamp(3rem,4.9vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.07em]",
        tone === "dark" ? "text-white" : "text-black",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function SlideSubtitle({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p className={cn("text-[1.2rem] leading-8 tracking-[-0.02em]", tone === "dark" ? "text-white/70" : "text-black/66", className)}>
      {children}
    </p>
  );
}

function SlideBody({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return <p className={cn("text-[0.98rem] leading-7", tone === "dark" ? "text-white/60" : "text-black/62", className)}>{children}</p>;
}

function DeckChip({
  children,
  tone = "dark",
  accent = false,
}: {
  accent?: boolean;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1.5 text-[10px] uppercase tracking-[0.28em]",
        tone === "dark"
          ? accent
            ? "border-[#c8a96a]/40 bg-[#c8a96a]/10 text-[#e9d2a1]"
            : "border-white/12 bg-white/[0.04] text-white/64"
          : accent
            ? "border-[#c8a96a]/50 bg-[#c8a96a]/10 text-[#8a6734]"
            : "border-black/10 bg-white/50 text-black/60",
      )}
    >
      {children}
    </span>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/36">{label}</p>
      <p className="mt-2 text-[1.05rem] leading-7 text-white/78">{value}</p>
    </div>
  );
}

function FramedImage({
  alt,
  className,
  position = "center center",
  priority = false,
  src,
}: {
  alt: string;
  className?: string;
  position?: string;
  priority?: boolean;
  src: string;
}) {
  return (
    <div className={cn("relative overflow-hidden border border-white/10 bg-black/30", className)}>
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        quality={80}
        sizes="(min-width: 1280px) 40vw, 100vw"
        src={src}
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.66)_100%)]" />
    </div>
  );
}

export function CompanyDeck() {
  return (
    <div className="company-deck-root bg-[linear-gradient(180deg,#020202_0%,#090909_40%,#020202_100%)]" data-company-deck-ready="true">
      <DeckSlide pageNumber={1} showBrandBar={false} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="relative h-16 w-48">
            <Image alt="AMO logo" className="object-contain" fill priority sizes="192px" src="/amo-logo-white.png" />
          </div>
          <p className="mt-10 text-[18px] uppercase tracking-[0.58em] text-white/52">Magnetic Levitation</p>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={2} priority totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(40rem,1.08fr)] lg:items-center">
          <div className="max-w-[35rem]">
            <Eyebrow>Opening</Eyebrow>
            <SlideTitle className="mt-5">Magnetic Levitation for Future Spaces</SlideTitle>
            <SlideSubtitle className="mt-5">
              Custom floating display systems for premium retail, hospitality, gifting, exhibitions, and OEM product development.
            </SlideSubtitle>
            <SlideBody className="mt-6 max-w-[30rem]">
              AMO creates magnetic levitation products that turn ordinary objects into spatial focal points.
            </SlideBody>
            <div className="mt-9 flex flex-wrap gap-3">
              {["Retail", "Hospitality", "Premium Gifts", "Exhibitions", "OEM Development"].map((item) => (
                <DeckChip key={item}>{item}</DeckChip>
              ))}
            </div>
          </div>

          <div className="grid h-full grid-cols-[minmax(0,1fr)_7rem] gap-4">
            <FramedImage
              alt="Floating luxury display product in a dark premium environment."
              className="min-h-[32rem]"
              position="center center"
              priority
              src="/images/blog/heroes/floating-display-for-perfume-brands.webp"
            />
            <div className="relative overflow-hidden border border-white/10 bg-[#111111]">
              <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-16 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={3} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(36rem,1.22fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Problem Insight</Eyebrow>
              <SlideTitle className="mt-5 max-w-[24rem]">The Problem with Static Display</SlideTitle>
              <SlideSubtitle className="mt-5 max-w-[28rem]">
                Premium products are often presented in the same way as ordinary products.
              </SlideSubtitle>
              <SlideBody className="mt-6 max-w-[29rem]">
                Shelves, counters, and standard stands show the object, but they rarely create a moment. In crowded retail,
                exhibitions, and launch environments, attention disappears quickly.
              </SlideBody>
            </div>

            <div className="max-w-[25rem] border-l border-white/10 pl-5">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/36">Commercial Reality</p>
              <p className="mt-3 text-[1rem] leading-7 text-white/64">
                Visibility is not the same as presence. A product can be seen and still remain forgettable.
              </p>
            </div>
          </div>

          <div className="grid h-full grid-rows-[minmax(0,1fr)_8rem] gap-4">
            <FramedImage
              alt="Standard static retail display used to represent ordinary product presentation."
              className="min-h-[33rem]"
              position="center center"
              src="/images/cases/before-standard-display.webp"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 bg-[#111111] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/36">Typical Scene</p>
                <p className="mt-3 text-[0.92rem] leading-6 text-white/62">Standard shelf, standard counter, standard sightline.</p>
              </div>
              <div className="border border-white/10 bg-[#111111] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/36">Result</p>
                <p className="mt-3 text-[0.92rem] leading-6 text-white/62">The object is present, but the brand moment never happens.</p>
              </div>
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Floating luxury display for a premium retail presentation."
        backgroundPosition="center center"
        backgroundSrc="/images/cases/featured-case-retail.webp"
        pageNumber={4}
        totalPages={TOTAL_SLIDES}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="max-w-[34rem]">
            <Eyebrow>Attention</Eyebrow>
            <SlideTitle className="mt-5">A New Way to Hold Attention</SlideTitle>
            <SlideSubtitle className="mt-5">Levitation adds movement, silence, distance, and focus.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[28rem]">
              When an object floats, people stop. The display becomes less like a stand and more like a controlled brand
              moment.
            </SlideBody>
          </div>

          <div className="flex items-end justify-between gap-10">
            <div className="w-44 border-t border-white/20 pt-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/42">Visual Effect</p>
              <p className="mt-2 text-[0.92rem] leading-6 text-white/66">One object. One field of focus. Less noise around it.</p>
            </div>
            <div className="w-44 border-t border-white/20 pt-4 text-right">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/42">Brand Impact</p>
              <p className="mt-2 text-[0.92rem] leading-6 text-white/66">The presentation becomes part of the value perception.</p>
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={5} totalPages={TOTAL_SLIDES}>
        <div className="absolute inset-0 opacity-30">
          <Image alt="Abstract magnetic field pattern." className="object-cover" fill quality={80} sizes="100vw" src="/images/about/about-ch05-magnetic-field.webp" />
          <div className="absolute inset-0 bg-black/78" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-center">
          <Eyebrow>Positioning</Eyebrow>
          <h2 className="mt-5 max-w-[54rem] text-[clamp(4rem,6.8vw,6.6rem)] font-medium leading-[0.88] tracking-[-0.08em] text-white">
            Levitation is not a feature.
            <span className="mt-3 block text-[#c8a96a]">It is a new way to present value.</span>
          </h2>
          <p className="mt-8 max-w-[37rem] text-[1.08rem] leading-8 text-white/62">
            AMO uses magnetic levitation as a design language for future retail, premium gifting, and spatial brand experiences.
          </p>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={6} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Company Profile</Eyebrow>
              <SlideTitle className="mt-5">AMO is a B2B magnetic levitation product and OEM / ODM solution company.</SlideTitle>
              <SlideBody className="mt-7 max-w-[30rem]">
                We design and manufacture floating display products, levitating lamps, magnetic display bases, OEM modules,
                premium gifts, and custom levitation systems for commercial environments.
              </SlideBody>
            </div>

            <div className="grid gap-4">
              <StatLine label="Business Role" value="Manufacturer-direct support for buyers, studios, distributors, and commercial project teams." />
              <StatLine label="Project Lens" value="Presentation logic, engineering stability, and delivery readiness are developed together." />
            </div>
          </div>

          <div className="grid h-full grid-cols-[minmax(0,1fr)_18rem] gap-4">
            <FramedImage
              alt="Floating display hero product on a white studio background."
              className="min-h-[33rem]"
              position="center center"
              src="/products/rendered/floating-display-sculpture-hero.png"
            />
            <div className="grid grid-rows-2 gap-4">
              <FramedImage
                alt="Precision edge macro detail."
                className="min-h-[16rem]"
                position="center center"
                src="/images/about/about-ch04-precision-edge.webp"
              />
              <FramedImage
                alt="Magnetic motion path reference."
                className="min-h-[16rem]"
                position="center center"
                src="/images/about/about-ch05-motion-path.webp"
              />
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={7} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col justify-between">
          <div className="max-w-[38rem]">
            <Eyebrow>Business Structure</Eyebrow>
            <SlideTitle className="mt-5">Global Business Structure</SlideTitle>
            <SlideSubtitle className="mt-5">
              Business liaison in Hong Kong. Production capability in Shenzhen. Service for international B2B projects.
            </SlideSubtitle>
            <SlideBody className="mt-6 max-w-[34rem]">
              AMO supports global brands, distributors, design studios, retail display partners, and project-based buyers with
              design, engineering, sampling, production, and delivery coordination.
            </SlideBody>
          </div>

          <div className="relative mt-10 flex-1">
            <div className="absolute left-[16%] right-[14%] top-[40%] h-px bg-white/10" />
            <div className="absolute left-[13%] right-[11%] top-[50%] h-px bg-white/18" />
            <div className="absolute left-[19%] right-[18%] top-[60%] h-px bg-white/10" />
            <div className="grid h-full grid-cols-3 items-center gap-8 pt-10">
              {[
                { blurb: "Commercial contact, international communication, and project coordination.", title: "Hong Kong" },
                { blurb: "Engineering follow-through, production planning, assembly control, and manufacturing execution.", title: "Shenzhen" },
                { blurb: "Sampling, packaging, export coordination, and delivery support for international programs.", title: "Global Delivery" },
              ].map((item, index) => (
                <div key={item.title} className="relative flex h-full min-h-[18rem] flex-col items-center justify-center px-6 py-8 text-center">
                  <div className="absolute top-[48%] h-3 w-3 -translate-y-1/2 rounded-full border border-[#c8a96a] bg-[#c8a96a]" />
                  <div className="absolute top-[32%] h-12 w-px bg-white/16" />
                  <p className="text-[10px] uppercase tracking-[0.34em] text-white/34">0{index + 1}</p>
                  <p className="mt-5 text-[2rem] font-semibold tracking-[-0.05em] text-white">{item.title}</p>
                  <p className="mt-5 max-w-[17rem] text-[0.96rem] leading-7 text-white/60">{item.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={8} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col">
          <div className="max-w-[40rem]">
            <Eyebrow>Cooperation Model</Eyebrow>
            <SlideTitle className="mt-5">Business Model</SlideTitle>
            <SlideSubtitle className="mt-5">Finished Products. OEM Development. ODM Collaboration.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[33rem]">AMO supports three levels of cooperation for buyers with different timing, complexity, and customization depth.</SlideBody>
          </div>

          <div className="mt-10 grid flex-1 grid-cols-3 gap-5">
            {businessModelItems.map((item) => (
              <div key={item.title} className="grid grid-rows-[7rem_minmax(0,1fr)_14rem] border border-white/10 bg-[#101010]">
                <div className="px-6 pt-6">
                  <p className="text-[1.7rem] font-medium tracking-[-0.05em] text-white">{item.title}</p>
                </div>
                <div className="px-6">
                  <p className="max-w-[17rem] text-[0.95rem] leading-7 text-white/60">{item.copy}</p>
                </div>
                <FramedImage alt={item.title} className="min-h-[14rem] border-0" position="center center" src={item.imageSrc} />
              </div>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Luxury retail environment used as a backdrop for AMO target audience."
        backgroundPosition="center center"
        backgroundSrc="/images/cases/space-retail-store.webp"
        pageNumber={9}
        totalPages={TOTAL_SLIDES}
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Audience</Eyebrow>
              <SlideTitle className="mt-5">Who We Serve</SlideTitle>
              <SlideSubtitle className="mt-5 max-w-[26rem]">Built for partners who need premium product presentation.</SlideSubtitle>
            </div>

            <div className="max-w-[24rem] border-l border-white/16 pl-5">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">Commercial Context</p>
              <p className="mt-3 text-[0.96rem] leading-7 text-white/64">
                Buyers come to AMO when the object needs to feel more visible, more valuable, and more intentional inside a
                space.
              </p>
            </div>
          </div>

          <div className="grid content-center gap-4">
            {audienceList.map((item) => (
              <div key={item} className="border-b border-white/14 pb-3">
                <p className="text-[2.2rem] font-medium tracking-[-0.05em] text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={10} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
          <div className="max-w-[28rem]">
            <Eyebrow>Trust Signal</Eyebrow>
            <SlideTitle className="mt-5">Why Clients Choose AMO</SlideTitle>
            <SlideSubtitle className="mt-5">Design presence, engineering stability, and commercial readiness.</SlideSubtitle>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[36rem] w-[36rem] rounded-full border border-white/8" />
            </div>
            <div className="absolute inset-x-20 top-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-x-20 bottom-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="relative h-[28rem] w-[28rem]">
              <Image alt="Levitating display base product" className="object-contain" fill quality={80} sizes="448px" src="/images/home/future-objects/display-base.webp" />
            </div>
            {choicePoints.map((item, index) => {
              const positions = [
                "left-4 top-12",
                "right-8 top-20",
                "left-0 bottom-24",
                "right-2 bottom-16",
                "left-1/2 top-1/2 -translate-x-1/2 translate-y-40",
              ];

              return (
                <div key={item} className={cn("absolute w-48 border border-white/12 bg-[#111111]/92 px-4 py-4", positions[index])}>
                  <p className="text-[0.9rem] leading-6 text-white/72">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={11} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-7 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div>
            <Eyebrow>Technical Capability</Eyebrow>
            <SlideTitle className="mt-5">Magnetic Levitation System</SlideTitle>
            <SlideSubtitle className="mt-5">A complete system of object, base, magnetic field, electronics, balance, and presentation.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[31rem]">
              AMO does not simply place an object above a base. We design the floating behavior, visual rhythm, structure,
              surface, and commercial use case as one system.
            </SlideBody>
          </div>

          <div className="grid grid-rows-[minmax(0,1fr)_11rem] gap-4">
            <FramedImage
              alt="Technical levitation system close-up."
              className="min-h-[29rem]"
              position="center center"
              src="/images/home/future-objects/oem-module.webp"
            />
            <div className="grid grid-cols-4 gap-4">
              {systemCallouts.map((item) => (
                <div key={item.title} className="border border-white/10 bg-[#111111] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">{item.title}</p>
                  <p className="mt-3 text-[0.82rem] leading-6 text-white/58">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={12} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center">
          <FramedImage
            alt="Stable floating object close-up."
            className="min-h-[35rem]"
            position="center center"
            src="/images/oem/optimized/oem-hero.webp"
          />

          <div className="flex flex-col justify-center">
            <Eyebrow>Engineering Detail</Eyebrow>
            <SlideTitle className="mt-5">Stable Levitation</SlideTitle>
            <SlideSubtitle className="mt-5">Controlled balance for long-term visual presentation.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[30rem]">
              Stability depends on magnetic tuning, object weight, center of gravity, base structure, and environmental use.
              AMO evaluates these factors during engineering and prototype development.
            </SlideBody>

            <div className="mt-10 grid gap-4">
              {[
                ["Balance", "How the object sits inside the field without wandering or visual tension."],
                ["Center of Gravity", "Where weight is carried and how that influences the floating attitude."],
                ["Magnetic Control", "How electronics and field tuning keep the experience calm and repeatable."],
              ].map(([title, body]) => (
                <div key={title} className="border-l border-[#c8a96a]/40 pl-5">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#d9c190]">{title}</p>
                  <p className="mt-2 max-w-[27rem] text-[0.92rem] leading-6 text-white/60">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={13} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center">
          <div>
            <Eyebrow>Motion</Eyebrow>
            <SlideTitle className="mt-5">360° - 720° Rotation</SlideTitle>
            <SlideSubtitle className="mt-5">Movement helps the object become visible from every angle.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[30rem]">
              Rotation is useful for retail counters, exhibitions, windows, and product launch displays where the object needs
              to be seen continuously without manual interaction.
            </SlideBody>
          </div>

          <div className="relative flex h-full min-h-[35rem] items-center justify-center overflow-hidden border border-white/10 bg-[#0b0b0b]">
            <div className="absolute h-[30rem] w-[30rem] rounded-full border border-white/12" />
            <div className="absolute h-[22rem] w-[22rem] rounded-full border border-white/7" />
            <div className="absolute h-[34rem] w-[34rem] rounded-full border border-[#c8a96a]/18 [mask-image:linear-gradient(transparent,black_18%,black_82%,transparent)]" />
            <div className="relative h-[19rem] w-[19rem]">
              <Image alt="Levitating clock with rotational presence." className="object-contain" fill quality={80} sizes="304px" src="/images/home/future-objects/clock.webp" />
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Warm hospitality interior with floating object."
        backgroundPosition="center center"
        backgroundSrc="/images/home/applications/hotel.webp"
        pageNumber={14}
        totalPages={TOTAL_SLIDES}
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Atmosphere</Eyebrow>
              <SlideTitle className="mt-5">Silent Operation</SlideTitle>
              <SlideSubtitle className="mt-5 max-w-[26rem]">Designed for spaces where technology should feel calm.</SlideSubtitle>
              <SlideBody className="mt-6 max-w-[29rem]">
                AMO products are suitable for premium spaces where the display must attract attention without mechanical noise
                or visual distraction.
              </SlideBody>
            </div>

            <div className="w-60 border-t border-white/18 pt-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">Best Context</p>
              <p className="mt-3 text-[0.92rem] leading-6 text-white/62">Hotels, showrooms, suites, lounges, and executive interiors.</p>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <div className="w-64 border border-white/14 bg-black/42 px-5 py-5 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/42">Operational Mood</p>
              <p className="mt-3 text-[0.94rem] leading-7 text-white/68">
                The technology stays in service of the space. Calm acoustics are part of the luxury impression.
              </p>
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={15} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="relative flex h-full min-h-[34rem] items-center justify-center border border-white/10 bg-[#111111]">
            <div className="absolute inset-x-12 top-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-y-12 left-16 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="relative h-[24rem] w-[24rem]">
              <Image
                alt="OEM maglev platform product render."
                className="object-contain"
                fill
                quality={80}
                sizes="384px"
                src="/products/rendered/oem-maglev-platform-hero.png"
              />
            </div>
          </div>

          <div>
            <Eyebrow>Load Logic</Eyebrow>
            <SlideTitle className="mt-5">Load &amp; Balance Engineering</SlideTitle>
            <SlideSubtitle className="mt-5">Every floating object needs its own magnetic logic.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[30rem]">
              Weight, volume, shell material, center of gravity, base geometry, and viewing angle all affect the final
              system. AMO evaluates these variables before prototype development.
            </SlideBody>

            <div className="mt-10 grid gap-5">
              {[
                ["Weight", "The field is tuned around the real object, not a nominal estimate."],
                ["Center of Gravity", "Object geometry changes how stable the float feels from different angles."],
                ["Viewing Intent", "The final system must support the display distance, product height, and presentation rhythm."],
              ].map(([label, body]) => (
                <div key={label} className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">{label}</p>
                  <p className="text-[0.92rem] leading-6 text-white/60">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={16} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="grid grid-rows-[auto_minmax(0,1fr)] gap-5">
            <div>
              <Eyebrow>Repeatability</Eyebrow>
              <SlideTitle className="mt-5">Commercial Reliability</SlideTitle>
              <SlideSubtitle className="mt-5">From visual effect to repeatable use.</SlideSubtitle>
              <SlideBody className="mt-6 max-w-[32rem]">
                Commercial projects require more than a successful demo. AMO focuses on stable performance, component
                selection, assembly consistency, packaging protection, and quality control before delivery.
              </SlideBody>
            </div>
            <FramedImage
              alt="Macro production surface with refined industrial detail."
              className="min-h-[28rem]"
              position="center center"
              src="/images/about/about-ch04-metal-surface.webp"
            />
          </div>

          <div className="grid grid-rows-4 gap-4">
            {["Components", "Assembly", "QC", "Packaging"].map((item) => (
              <div key={item} className="flex items-center border border-white/10 bg-[#111111] px-6">
                <p className="text-[1.35rem] font-medium tracking-[-0.04em] text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={17} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col">
          <div className="max-w-[40rem]">
            <Eyebrow>OEM Capability</Eyebrow>
            <SlideTitle className="mt-5">OEM / ODM Development</SlideTitle>
            <SlideSubtitle className="mt-5">From concept to floating product.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[32rem]">
              AMO supports custom projects from first idea to production-ready product through design, engineering, prototype,
              sampling, and manufacturing coordination.
            </SlideBody>
          </div>

          <div className="relative mt-12 flex flex-1 items-center">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/22 to-transparent" />
            <div className="grid w-full grid-cols-7 gap-4">
              {processSteps.map((step, index) => (
                <div key={step} className="relative flex min-h-[14rem] flex-col justify-end border border-white/10 bg-[#111111] px-4 py-5">
                  <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c8a96a]/50 bg-[#050505]" />
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/34">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-4 text-[1.05rem] font-medium tracking-[-0.03em] text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={18} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <Eyebrow>Validation</Eyebrow>
            <SlideTitle className="mt-5">Prototype &amp; Sampling</SlideTitle>
            <SlideSubtitle className="mt-5">Before production, the floating behavior must be proven.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[29rem]">
              The prototype stage validates levitation stability, rotation rhythm, visual proportion, material direction,
              lighting, user experience, and packaging readiness.
            </SlideBody>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_17rem] gap-4">
            <FramedImage
              alt="Development capability product scene."
              className="min-h-[34rem]"
              position="center center"
              src="/images/oem/optimized/development-capability.webp"
            />
            <div className="grid grid-rows-2 gap-4">
              <FramedImage
                alt="Custom product shape prototype detail."
                className="min-h-[16.5rem]"
                position="center center"
                src="/images/oem/optimized/custom-product-shape.webp"
              />
              <FramedImage
                alt="Custom branding sample detail."
                className="min-h-[16.5rem]"
                position="center center"
                src="/images/oem/optimized/custom-branding.webp"
              />
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={19} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div>
            <Eyebrow>Customization</Eyebrow>
            <SlideTitle className="mt-5">Customization System</SlideTitle>
            <SlideSubtitle className="mt-5">Designed around the brand, object, and application.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[29rem]">
              Customizable elements include object shape, base form, material, finish, logo, lighting, levitation height,
              rotation, packaging, and OEM module integration.
            </SlideBody>
          </div>

          <div className="relative flex min-h-[35rem] items-center justify-center overflow-hidden border border-white/10 bg-[#0d0d0d]">
            <div className="relative h-[27rem] w-[27rem]">
              <Image alt="Levitating display product render." className="object-contain" fill quality={80} sizes="432px" src="/products/rendered/floating-display-sculpture-hero.png" />
            </div>
            {[
              ["Object", "left-10 top-14", "left-28 top-[7.4rem] w-24"],
              ["Base", "left-10 top-40", "left-24 top-[13.9rem] w-28"],
              ["Finish", "left-10 top-[19.5rem]", "left-28 top-[20rem] w-24"],
              ["Lighting", "right-10 top-12", "right-28 top-[6.8rem] w-20"],
              ["Logo", "right-10 top-36", "right-24 top-[11.7rem] w-24"],
              ["Packaging", "right-10 top-[18rem]", "right-28 top-[18.5rem] w-28"],
              ["Module", "right-10 top-[24rem]", "right-24 top-[24.5rem] w-28"],
            ].map(([label, position, linePosition]) => (
              <div key={label}>
                <p className={cn("absolute text-[10px] font-semibold uppercase tracking-[0.32em] text-white/68", position)}>{label}</p>
                <div className={cn("absolute h-px bg-[#c8a96a]/80", linePosition)} />
              </div>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={20} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col">
          <div className="max-w-[40rem]">
            <Eyebrow>Product Matrix</Eyebrow>
            <SlideTitle className="mt-5">Product Range Overview</SlideTitle>
            <SlideSubtitle className="mt-5">A complete magnetic levitation product ecosystem.</SlideSubtitle>
          </div>

          <div className="mt-10 grid flex-1 grid-cols-[1.06fr_1.94fr] gap-5">
            <div className="relative overflow-hidden border border-white/10 bg-[#111111]">
              <Image alt={panoramaProducts[0].title} className="object-cover" fill quality={80} sizes="40vw" src={panoramaProducts[0].imageSrc} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.78)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[1.22rem] font-semibold tracking-[-0.03em] text-white">{panoramaProducts[0].title}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 grid-rows-2 gap-5">
              {panoramaProducts.slice(1).map((item) => (
                <div key={item.title} className="relative overflow-hidden border border-white/10 bg-[#111111]">
                  <Image alt={item.title} className="object-cover" fill quality={80} sizes="20vw" src={item.imageSrc} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.8)_100%)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[1rem] font-semibold leading-5 tracking-[-0.03em] text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={21} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>Category 01</Eyebrow>
            <SlideTitle className="mt-5">Floating Display Bases</SlideTitle>
            <SlideSubtitle className="mt-5">For hero products, limited editions, retail counters, and exhibition presentation.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[31rem]">
              Display bases help brands isolate one object and make it the visual center of a counter, window, booth, or
              presentation table.
            </SlideBody>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Watches", "Jewelry", "Fragrance", "Collectibles", "Awards", "Limited Editions"].map((item) => (
                <DeckChip key={item}>{item}</DeckChip>
              ))}
            </div>

            <FramedImage
              alt="Floating display base hero scene."
              className="mt-8 min-h-[22rem]"
              position="center center"
              src="/images/home/future-objects/display-base.webp"
            />
          </div>

          <div className="grid grid-rows-3 gap-4">
            <FramedImage
              alt="Retail floating display crop."
              className="min-h-[10rem]"
              position="center center"
              src="/images/cases/featured-case-retail.webp"
            />
            <FramedImage
              alt="Retail environment crop for floating display bases."
              className="min-h-[10rem]"
              position="center center"
              src="/images/home/applications/retail.webp"
            />
            <FramedImage
              alt="Floating display product render detail."
              className="min-h-[10rem]"
              position="center center"
              src="/products/rendered/floating-display-sculpture-hero.png"
            />
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Levitating lamp in a warm premium interior."
        backgroundPosition="center center"
        backgroundSrc="/images/home/future-objects/lamp.webp"
        pageNumber={22}
        totalPages={TOTAL_SLIDES}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="max-w-[31rem]">
            <Eyebrow>Category 02</Eyebrow>
            <SlideTitle className="mt-5">Levitating Lamps</SlideTitle>
            <SlideSubtitle className="mt-5">Floating light objects for hospitality, interiors, and signature spaces.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[28rem]">
              AMO levitating lamps combine light, balance, and movement to create a quiet technological atmosphere in premium
              environments.
            </SlideBody>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Hotels", "Lounges", "Suites", "Showrooms", "Offices"].map((item) => (
              <DeckChip key={item} accent>
                {item}
              </DeckChip>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={23} tone="light" totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center">
          <div>
            <Eyebrow tone="light">Category 03</Eyebrow>
            <SlideTitle className="mt-5 max-w-[26rem]" tone="light">
              Levitating Clocks
            </SlideTitle>
            <SlideSubtitle className="mt-5 max-w-[28rem]" tone="light">
              Functional objects with a floating visual identity.
            </SlideSubtitle>
            <SlideBody className="mt-6 max-w-[29rem]" tone="light">
              Levitating clocks bring time, motion, and spatial presence together for premium interiors, offices, gifts, and
              design-led product collections.
            </SlideBody>
            <div className="mt-9 flex flex-wrap gap-3">
              {["Executive gifts", "Office interiors", "Design stores", "Collector products"].map((item) => (
                <DeckChip key={item} tone="light">
                  {item}
                </DeckChip>
              ))}
            </div>
          </div>

          <div className="relative flex h-full min-h-[35rem] items-center justify-center overflow-hidden border border-black/10 bg-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(200,169,106,0.16),transparent_18%)]" />
            <div className="relative h-[31rem] w-[31rem]">
              <Image alt="Levitating clock product render." className="object-contain" fill quality={80} sizes="496px" src="/products/rendered/levitating-clock-hero.png" />
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Display art object in a dark gallery-like environment."
        backgroundPosition="center center"
        backgroundSrc="/images/home/future-objects/art-object.webp"
        pageNumber={24}
        totalPages={TOTAL_SLIDES}
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div />
          <div className="flex flex-col justify-center">
            <Eyebrow>Category 04</Eyebrow>
            <SlideTitle className="mt-5">Display Art Objects</SlideTitle>
            <SlideSubtitle className="mt-5">Floating objects as sculptural brand language.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[27rem]">
              Suspended objects can become symbolic displays for exhibitions, museums, retail environments, collector spaces,
              and future-facing brand storytelling.
            </SlideBody>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={25} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <Eyebrow>Category 05</Eyebrow>
            <SlideTitle className="mt-5">OEM Maglev Modules</SlideTitle>
            <SlideSubtitle className="mt-5">Magnetic systems for private-label and product development programs.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[29rem]">
              AMO can support module-based development for partners who need levitation platforms, custom bases, embedded
              electronics, object integration, or branded product lines.
            </SlideBody>
          </div>

          <div className="relative flex min-h-[35rem] items-center justify-center overflow-hidden border border-white/10 bg-[#111111]">
            <div className="absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="relative h-[28rem] w-[32rem]">
              <Image alt="OEM maglev module exploded visual." className="object-contain" fill quality={80} sizes="512px" src="/images/home/future-objects/oem-module.webp" />
            </div>
            <div className="absolute left-8 top-10 w-52 border border-white/10 bg-black/76 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">Levitation Platform</p>
              <p className="mt-3 text-[0.84rem] leading-6 text-white/58">Base architecture, field planning, and presentation scale.</p>
            </div>
            <div className="absolute right-8 top-20 w-52 border border-white/10 bg-black/76 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">Control Electronics</p>
              <p className="mt-3 text-[0.84rem] leading-6 text-white/58">Power behavior, load tuning, and motion logic.</p>
            </div>
            <div className="absolute right-12 bottom-16 w-52 border border-white/10 bg-black/76 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">Object Integration</p>
              <p className="mt-3 text-[0.84rem] leading-6 text-white/58">Shell structure, material selection, and brand adaptation.</p>
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={26} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-center">
          <FramedImage
            alt="Premium floating gift presentation."
            className="min-h-[35rem]"
            position="center center"
            src="/images/home/applications/premium-gifts.webp"
          />

          <div>
            <Eyebrow>Category 06</Eyebrow>
            <SlideTitle className="mt-5">Premium Gifts</SlideTitle>
            <SlideSubtitle className="mt-5">Make the gift display-worthy.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[29rem]">
              A floating branded object can become a VIP gift, commemorative product, executive award, collector edition, or
              launch souvenir that continues to live on a desk, shelf, or display surface.
            </SlideBody>
            <div className="mt-8 flex flex-wrap gap-3">
              {["VIP gifts", "Executive awards", "Collector editions", "Launch souvenirs"].map((item) => (
                <DeckChip key={item} accent>
                  {item}
                </DeckChip>
              ))}
            </div>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Luxury retail environment with a floating display pause point."
        backgroundPosition="center center"
        backgroundSrc="/images/home/applications/retail.webp"
        pageNumber={27}
        totalPages={TOTAL_SLIDES}
      >
        <div className="flex h-full items-end">
          <div className="max-w-[35rem] border border-white/14 bg-black/48 px-6 py-6 backdrop-blur-sm">
            <Eyebrow>Application 01</Eyebrow>
            <SlideTitle className="mt-4">Retail &amp; Visual Merchandising</SlideTitle>
            <SlideSubtitle className="mt-4">Create a premium pause point inside retail space.</SlideSubtitle>
            <SlideBody className="mt-5 max-w-[29rem]">
              For boutique counters, flagship stores, launch zones, and window displays, levitation helps one product stand
              apart from the surrounding visual noise.
            </SlideBody>
          </div>
        </div>
      </DeckSlide>

      <DeckSlide
        backgroundAlt="Exhibition space with a floating activation centerpiece."
        backgroundPosition="center center"
        backgroundSrc="/images/cases/space-exhibition.webp"
        pageNumber={28}
        totalPages={TOTAL_SLIDES}
      >
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Application 02</Eyebrow>
              <SlideTitle className="mt-5">Exhibitions &amp; Brand Activations</SlideTitle>
              <SlideSubtitle className="mt-5">Movement attracts attention in crowded environments.</SlideSubtitle>
              <SlideBody className="mt-6 max-w-[30rem]">
                Trade shows, pop-ups, and product launches need a clear visual hook. A floating object creates curiosity,
                filming moments, and a memorable booth signature.
              </SlideBody>
            </div>

            <div className="flex flex-wrap gap-3">
              {["Curiosity", "Filming moments", "Booth signature"].map((item) => (
                <DeckChip key={item}>{item}</DeckChip>
              ))}
            </div>
          </div>
          <div />
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={29} totalPages={TOTAL_SLIDES}>
        <div className="flex h-full flex-col">
          <div className="max-w-[38rem]">
            <Eyebrow>Application 03</Eyebrow>
            <SlideTitle className="mt-5">Hospitality, Museums &amp; Offices</SlideTitle>
            <SlideSubtitle className="mt-5">Quiet technology for premium spaces.</SlideSubtitle>
            <SlideBody className="mt-6 max-w-[33rem]">
              AMO products can support hotel lobbies, lounges, suites, CEO offices, museums, collector rooms, and future-facing
              interiors where the object needs presence without noise.
            </SlideBody>
          </div>

          <div className="mt-10 grid flex-1 grid-cols-3 gap-5">
            {[
              { src: "/images/home/applications/hotel.webp", title: "Hospitality" },
              { src: "/images/home/applications/museum.webp", title: "Museums" },
              { src: "/images/home/applications/office.webp", title: "Offices" },
            ].map((item) => (
              <div key={item.title} className="relative overflow-hidden border border-white/10 bg-[#111111]">
                <Image alt={item.title} className="object-cover" fill quality={80} sizes="33vw" src={item.src} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.78)_100%)]" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[1.2rem] font-medium tracking-[-0.03em] text-white">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DeckSlide>

      <DeckSlide pageNumber={30} totalPages={TOTAL_SLIDES}>
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-between">
            <div>
              <Eyebrow>Call To Action</Eyebrow>
              <SlideTitle className="mt-5">Start Your Floating Display Project</SlideTitle>
              <SlideSubtitle className="mt-5">Send us the object, the use case, and the launch goal.</SlideSubtitle>
              <div className="mt-8 grid gap-y-3">
                {ctaChecklist.map((item, index) => (
                  <p key={item} className="text-[0.94rem] leading-6 text-white/62">
                    {index + 1}. {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <StatLine label="RFQ" value="https://amolevitation.com/rfq" />
              <StatLine label="Email" value={siteConfig.email} />
              <StatLine label="WhatsApp / Phone" value={siteConfig.phone} />
              <StatLine label="Website" value={siteConfig.url} />
            </div>
          </div>

          <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-5">
            <div className="grid grid-cols-[minmax(0,1fr)_16rem] gap-5 border border-white/10 bg-[#111111] p-6">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="relative h-10 w-28">
                    <Image alt="AMO logo" className="object-contain object-left" fill sizes="112px" src="/amo-logo-white.png" />
                  </div>
                  <p className="mt-6 max-w-[24rem] text-[0.98rem] leading-7 text-white/62">
                    Business Liaison:
                    <br />
                    {siteConfig.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="border-l border-[#c8a96a]/34 pl-5">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#d9c190]">WhatsApp Inquiry</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-white/62">Scan to open the direct conversation channel.</p>
                </div>
              </div>

              <div className="relative overflow-hidden border border-white/10 bg-white p-4">
                <Image alt="WhatsApp QR code for AMO inquiries." className="object-contain" fill sizes="256px" src="/downloads/amo-whatsapp-qr.png" />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5">
              <DeckChip accent>https://wa.me/85269429864</DeckChip>
              <p className="text-[10px] uppercase tracking-[0.34em] text-white/40">AMO Company Profile Deck</p>
            </div>
          </div>
        </div>
      </DeckSlide>
    </div>
  );
}
