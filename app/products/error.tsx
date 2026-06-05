"use client";

import { SharedSiteNav } from "@/components/layout/shared-site-nav";
import { ProductsCatalogState } from "@/components/products/products-catalog-state";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-[#111111]">
      <SharedSiteNav theme="light" />
      <ProductsCatalogState
        className="relative z-10 pb-0 pt-24"
        title="The product showcase hit an unexpected error."
        message={error.message || "AMO could not complete the product request."}
        actionHref="/rfq"
        actionLabel="Open RFQ"
      />
    </div>
  );
}
