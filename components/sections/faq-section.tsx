import { Container } from "@/components/ui/container";
import { NexusPanel } from "@/components/ui/nexus-panel";
import type { FaqItem } from "@/types";

export function FaqSection({
  items,
  eyebrow = "Buyer FAQ",
  title = "Commercial and engineering questions we expect from serious buyers",
  description = "FAQ content is intentionally written for B2B sourcing teams, technical buyers, and OEM integration leads.",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container className="space-y-4">
        <NexusPanel tone="hero" padding="lg">
          <div className="relative">
            <p className="text-[12px] font-medium uppercase leading-4 tracking-normal text-[#A3A3A3]">{eyebrow}</p>
            <h2 className="mt-6 max-w-4xl font-sans text-[34px] font-medium leading-[34px] tracking-[-0.025em] text-white sm:text-[44px] sm:leading-[44px]">
              {title}
            </h2>
            <p className="mt-5 max-w-3xl text-[14px] leading-[22.75px] text-[#A3A3A3]">{description}</p>
          </div>
        </NexusPanel>

        <div className="grid gap-3">
        {items.map((item) => (
          <NexusPanel key={item.question} as="article" tone="subtle" padding="md">
            <div className="relative">
              <h3 className="font-sans text-[24px] font-medium leading-[28px] tracking-[-0.025em] text-white">{item.question}</h3>
              <p className="mt-4 text-[14px] leading-[22.75px] text-[#A3A3A3]">{item.answer}</p>
            </div>
          </NexusPanel>
        ))}
        </div>
      </Container>
    </section>
  );
}
