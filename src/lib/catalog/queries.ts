import { getCategoryTreeIds } from "@/lib/catalog/scoped";
import type { ApprovalLevel, Category, Product } from "@/types/catalog";

export type CatalogSort = "featured" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

export type CatalogFilters = {
  search: string;
  brandId: string;
  categoryId: string;
  approval: ApprovalLevel | "ALL";
};

type CatalogReferenceMap = Record<string, string>;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
  brandNames: CatalogReferenceMap,
  categoryNames: CatalogReferenceMap,
  categories: Category[],
): Product[] {
  const normalizedSearch = normalize(filters.search);
  const selectedCategoryIds =
    filters.categoryId === "ALL"
      ? null
      : new Set(
          getCategoryTreeIds(
            filters.categoryId,
            categories.filter((category) => category.active),
          ),
        );

  return products.filter((product) => {
    if (!product.active) {
      return false;
    }

    if (filters.brandId !== "ALL" && product.brandId !== filters.brandId) {
      return false;
    }

    if (selectedCategoryIds && !selectedCategoryIds.has(product.categoryId)) {
      return false;
    }

    if (filters.approval !== "ALL" && product.approval !== filters.approval) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = normalize(
      [
        product.name,
        product.sku,
        product.shortDescription,
        product.description,
        ...product.features,
        brandNames[product.brandId] ?? "",
        categoryNames[product.categoryId] ?? "",
      ].join(" "),
    );

    return searchableText.includes(normalizedSearch);
  });
}

export function getComparablePrice(product: Product): number | null {
  const fixedPrice = product.prices.find((price) => price.amount !== null);

  return fixedPrice?.amount ?? null;
}

export function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) =>
        a.name.localeCompare(b.name, "es", {
          sensitivity: "base",
        }),
      );

    case "name-desc":
      return sorted.sort((a, b) =>
        b.name.localeCompare(a.name, "es", {
          sensitivity: "base",
        }),
      );

    case "price-asc":
      return sorted.sort((a, b) => {
        const priceA = getComparablePrice(a);
        const priceB = getComparablePrice(b);

        if (priceA === null && priceB === null) {
          return a.name.localeCompare(b.name, "es");
        }

        if (priceA === null) {
          return 1;
        }

        if (priceB === null) {
          return -1;
        }

        return priceA - priceB;
      });

    case "price-desc":
      return sorted.sort((a, b) => {
        const priceA = getComparablePrice(a);
        const priceB = getComparablePrice(b);

        if (priceA === null && priceB === null) {
          return a.name.localeCompare(b.name, "es");
        }

        if (priceA === null) {
          return 1;
        }

        if (priceB === null) {
          return -1;
        }

        return priceB - priceA;
      });

    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) {
          return Number(b.featured) - Number(a.featured);
        }

        return a.name.localeCompare(b.name, "es");
      });
  }
}
