import { Suspense } from "react";

import { buildMetadata } from "@/lib/seo";

import RFQClient from "./RFQClient";

export const metadata = buildMetadata({
  title: "Request a Quote for Custom Magnetic Levitation Products | AMO",
  description:
    "Use AMO to request magnetic levitation quote details for floating displays, levitating lamps, premium gifts, MOQ evaluation, sampling, bulk magnetic levitation products, and OEM magnetic levitation product development.",
  path: "/rfq",
  keywords: [
    "magnetic levitation RFQ",
    "custom magnetic levitation products",
    "magnetic levitation wholesale",
    "magnetic levitation products wholesale",
    "MOQ magnetic levitation products",
    "magnetic levitation lead time",
    "magnetic levitation sample validation",
    "magnetic levitation export readiness",
    "B2B magnetic levitation sourcing",
    "magnetic levitation sourcing checklist",
    "magnetic levitation supplier China",
    "magnetic levitation manufacturer China",
    "custom levitating products supplier",
    "request magnetic levitation quote",
    "bulk magnetic levitation products",
    "magnetic levitation products for brands",
    "floating display manufacturer",
    "levitating lamp manufacturer",
    "OEM magnetic levitation products",
  ],
});

export default function RfqPage() {
  return (
    <>
      <Suspense fallback={<main className="min-h-screen bg-black p-10 text-white">Loading RFQ...</main>}>
        <RFQClient />
      </Suspense>
    </>
  );
}
