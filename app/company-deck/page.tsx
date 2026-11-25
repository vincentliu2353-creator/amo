import type { Metadata } from "next";

import { CompanyDeck } from "@/components/company-deck/CompanyDeck";

export const metadata: Metadata = {
  title: "AMO Company Profile Deck",
  robots: {
    follow: false,
    index: false,
  },
};

export default function CompanyDeckPage() {
  return (
    <main className="company-deck-page bg-[#020202] pb-8 text-white">
      <CompanyDeck />
    </main>
  );
}
