"use client";

import { startTransition, useState } from "react";

import { ProductShowcase } from "@/components/products/product-showcase";
import type { ProductShowcaseProduct } from "@/types";

interface FeaturedProductShowcaseSectionProps {
  products: ProductShowcaseProduct[];
}

export function FeaturedProductShowcaseSection({ products }: FeaturedProductShowcaseSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductShowcase
      products={products}
      activeIndex={activeIndex}
      onSelect={(index) =>
        startTransition(() => {
          setActiveIndex(index);
        })
      }
    />
  );
}
