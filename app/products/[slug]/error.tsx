"use client";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { ProductsSiteHeader } from "@/components/products/products-site-header";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <ProductsSiteHeader />
      <main className="relative z-10">
        <section data-header-theme="dark" className="bg-black pb-20 pt-28 sm:pb-24 sm:pt-32">
          <Container>
            <ProductsErrorState
              title="This product detail hit an unexpected error."
              message={error.message || "AMO could not complete the product detail request."}
              backHref="/products"
              backLabel="Return to Products"
            />
          </Container>
        </section>
      </main>
      <ApprovedHomeFooter />
    </div>
  );
}
