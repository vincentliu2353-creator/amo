import { ProductsPageLayout } from "@/components/products/products-page-layout";
import { ProductsLoadingShell } from "@/components/products/products-loading-shell";

export default function Loading() {
  return (
    <ProductsPageLayout>
      <ProductsLoadingShell />
    </ProductsPageLayout>
  );
}
