export type ProductCategory = string;
export type ContentStatus = "draft" | "published";

export interface SpecItem {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  series: string;
  category: ProductCategory;
  productImage: string;
  summary: string;
  description: string;
  highlight: string;
  leadTime: string;
  minOrderQty: string;
  heroMetric: string;
  tags: string[];
  applications: string[];
  features: string[];
  specs: SpecItem[];
  faqs: FaqItem[];
  featured?: boolean;
  caseStudySlugs: string[];
}

export interface ProductShowcaseImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductShowcaseProduct extends Product {
  galleryImages: ProductShowcaseImage[];
}

export interface ProductRelatedCase {
  slug: string;
  title: string;
  sector: string;
  summary: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: SpecItem[];
  featuredProductSlugs: string[];
}

export interface BlogSection {
  heading: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  readTime: string;
  sections: BlogSection[];
}

export interface PublicBlogRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  readTime: string;
  sections: BlogSection[];
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface QuoteItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image: string;
  quantity: number;
  notes: string;
}

export interface AdminCategoryOption {
  id: string;
  slug: string;
  name: string;
  status: ContentStatus;
}

export interface AdminProductImage {
  id: string;
  imageUrl: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AdminProductRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  slug: string;
  sku: string;
  name: string;
  series: string;
  status: ContentStatus;
  featured: boolean;
  summary: string;
  description: string;
  highlight: string;
  leadTimeText: string;
  minOrderQty: number | null;
  minOrderUnit: string;
  heroMetric: string;
  tags: string[];
  applications: string[];
  features: string[];
  specs: Record<string, string>;
  filterAttributes: Record<string, string | number | boolean>;
  faqItems: FaqItem[];
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  canonicalUrl: string;
  ogImageUrl: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: AdminProductImage[];
}

export interface AdminBlogRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: ContentStatus;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminRfqStatus = "new" | "reviewing" | "quoted" | "won" | "lost";

export interface AdminRfqItemRecord {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  requestedQty: number;
  notes: string;
}

export interface AdminRfqRecord {
  id: string;
  requestNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  projectStage: string;
  annualVolume: string;
  message: string;
  source: string;
  status: AdminRfqStatus;
  createdAt: string;
  updatedAt: string;
  requirements: Record<string, unknown>;
  items: AdminRfqItemRecord[];
  adminNotes: string;
}
