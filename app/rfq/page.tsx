import { Suspense } from "react";
import RFQClient from "./RFQClient";

export default function RfqPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black text-white p-10">Loading RFQ...</main>}>
      <RFQClient />
    </Suspense>
  );
}
