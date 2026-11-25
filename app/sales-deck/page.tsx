import type { Metadata } from "next";

import { SalesDeck } from "@/components/sales-deck/SalesDeck";

export const metadata: Metadata = {
  title: "AMO B2B Sales Deck",
  robots: {
    follow: false,
    index: false,
  },
};

export default function SalesDeckPage() {
  return (
    <main className="sales-deck-page bg-[#020304] pb-8 text-white">
      <SalesDeck />
    </main>
  );
}
