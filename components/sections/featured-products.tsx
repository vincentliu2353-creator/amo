import { ProductCard } from "@/components/products/product-card";
import { SectionShell } from "@/components/ui/section-shell";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <SectionShell
      eyebrow="Flagship Systems"
      title="Levitation products for premium industrial equipment programs"
      description="The initial catalog is structured around transport, stabilization, and OEM integration packages."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </SectionShell>
  );
}

