import { ProductDetailLoadingShell } from "@/components/products/product-detail-loading-shell";
import { ProductsSiteHeader } from "@/components/products/products-site-header";

export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-[#111111]">
      <ProductsSiteHeader />
      <ProductDetailLoadingShell />
    </div>
  );
}
