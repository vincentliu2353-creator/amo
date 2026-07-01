import { notFound } from "next/navigation";

import { ApprovedHomeFooter } from "@/components/layout/approved-home-footer";
import { ProductDetailExperience } from "@/components/products/product-detail-experience";
import { ProductsErrorState } from "@/components/products/products-error-state";
import { ProductsSiteHeader } from "@/components/products/products-site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { buildMetadata, buildNoIndexMetadata, buildProductSeoKeywords, generateBreadcrumbJsonLd, generateProductJsonLd } from "@/lib/seo";
import { getPublishedProductBySlug, getPublishedProductShowcaseCatalog } from "@/lib/supabase/products";
import type { Product, ProductShowcaseProduct } from "@/types";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getOverlapScore(base: string[], candidate: string[]) {
  const lookup = new Set(base.map((entry) => entry.toLowerCase()));

  return candidate.reduce((score, value) => {
    return lookup.has(value.toLowerCase()) ? score + 1 : score;
  }, 0);
}

function getRelatedProductScore(product: Product, candidate: ProductShowcaseProduct) {
  let score = 0;

  if (candidate.category === product.category) {
    score += 4;
  }

  score += getOverlapScore(product.applications, candidate.applications) * 3;
  score += getOverlapScore(product.tags, candidate.tags) * 2;
  score += getOverlapScore(product.features, candidate.features);

  if (candidate.featured) {
    score += 0.5;
  }

  return score;
}

function buildProductMetaDescription(product: Product) {
  return product.summary || product.highlight || product.description || "AMO magnetic levitation product detail.";
}

function buildProductMetaTitle(product: Product) {
  return `${product.name} | ${product.category} | AMO`;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  try {
    const detail = await getPublishedProductBySlug(slug);
    const product = detail?.product;

    if (!product) {
      return buildNoIndexMetadata({
        title: "Product Not Found | AMO",
        description: "The requested AMO product page is unavailable.",
        path: `/products/${slug}`,
      });
    }

    return buildMetadata({
      title: buildProductMetaTitle(product),
      description: buildProductMetaDescription(product),
      path: `/products/${product.slug}`,
      keywords: buildProductSeoKeywords(product),
      image: product.productImage,
    });
  } catch {
    return buildNoIndexMetadata({
      title: "Product Unavailable | AMO",
      description: "The requested AMO product page could not be loaded.",
      path: `/products/${slug}`,
    });
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  let detail: Awaited<ReturnType<typeof getPublishedProductBySlug>> = null;

  try {
    detail = await getPublishedProductBySlug(slug);
  } catch (error) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
        <ProductsSiteHeader />
        <main className="relative z-10">
          <section data-header-theme="dark" className="bg-black pb-20 pt-28 sm:pb-24 sm:pt-32">
            <Container>
              <ProductsErrorState
                title="This product detail could not be loaded."
                message={error instanceof Error ? error.message : "AMO could not load the requested product from Supabase."}
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

  if (!detail) {
    notFound();
  }

  const { product } = detail;
  let relatedProducts: ProductShowcaseProduct[] = [];

  try {
    const { products } = await getPublishedProductShowcaseCatalog();

    relatedProducts = products
      .filter((entry) => entry.slug !== product.slug)
      .sort((left, right) => getRelatedProductScore(product, right) - getRelatedProductScore(product, left))
      .slice(0, 4);
  } catch {
    relatedProducts = [];
  }

  return (
    <>
      <JsonLd data={generateProductJsonLd(product)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />

      <div className="relative min-h-screen overflow-x-hidden bg-white text-[#111111]">
        <ProductsSiteHeader />
        <main className="relative z-10">
          <ProductDetailExperience product={product} images={detail.images} relatedProducts={relatedProducts} />
        </main>
        <ApprovedHomeFooter />
      </div>
    </>
  );
}
