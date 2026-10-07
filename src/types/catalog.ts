export type ApprovalLevel = "WKF" | "NATIONAL" | "NON_APPROVED" | "UNSPECIFIED";

export type AvailabilityStatus = "AVAILABLE" | "CONSULT" | "OUT_OF_STOCK" | "COMING_SOON";

export type PriceBasis = "DIRECT_USD" | "BCV_RATE_USD" | "EURO_RATE_USD" | "USDT" | "CONSULT";

export type PriceCurrency = "USD" | "USDT";

export type ImageSourceType = "OWN" | "MANUFACTURER" | "PROVIDER" | "OTHER";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo?: string;
  active: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId: string | null;
  active: boolean;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  options: VariantOption[];
  available: boolean;
}

export interface ProductPrice {
  amount: number | null;
  currency: PriceCurrency | null;
  basis: PriceBasis;
  label: string;
  note?: string;
  variantId?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  sourceType: ImageSourceType;
  sourceUrl?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  features: string[];
  approval: ApprovalLevel;
  approvalNote?: string;
  variants: ProductVariant[];
  prices: ProductPrice[];
  images: ProductImage[];
  availability: AvailabilityStatus;
  featured: boolean;
  active: boolean;
}

export interface Catalog {
  brands: Brand[];
  categories: Category[];
  products: Product[];
}
