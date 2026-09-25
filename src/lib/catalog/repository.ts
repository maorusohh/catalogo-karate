import type { Brand, Category, Catalog, Product } from "@/types/catalog";

export interface CatalogRepository {
  getCatalog(): Catalog;

  getProducts(): Product[];

  getProductBySlug(slug: string): Product | undefined;

  getBrands(): Brand[];

  getBrandBySlug(slug: string): Brand | undefined;

  getCategories(): Category[];

  getCategoryBySlug(slug: string): Category | undefined;
}
