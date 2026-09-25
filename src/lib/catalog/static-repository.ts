import { catalog } from "@/data/catalog";
import type { CatalogRepository } from "@/lib/catalog/repository";
import type { Brand, Category, Product } from "@/types/catalog";

function getProducts(): Product[] {
  return catalog.products.filter((product) => product.active);
}

function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

function getBrands(): Brand[] {
  return catalog.brands.filter((brand) => brand.active);
}

function getBrandBySlug(slug: string): Brand | undefined {
  return getBrands().find((brand) => brand.slug === slug);
}

function getCategories(): Category[] {
  return catalog.categories.filter((category) => category.active);
}

function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((category) => category.slug === slug);
}

export const catalogRepository: CatalogRepository = {
  getCatalog: () => catalog,
  getProducts,
  getProductBySlug,
  getBrands,
  getBrandBySlug,
  getCategories,
  getCategoryBySlug,
};
