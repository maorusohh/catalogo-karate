import { describe, expect, it } from "vitest";

import { filterProducts, type CatalogFilters } from "@/lib/catalog/queries";
import type { Category, Product } from "@/types/catalog";

const categories: Category[] = [
  {
    id: "protecciones",
    slug: "protecciones",
    name: "Protecciones",
    description: "",
    parentId: null,
    active: true,
  },
  {
    id: "guantines",
    slug: "guantines",
    name: "Guantines",
    description: "",
    parentId: "protecciones",
    active: true,
  },
  {
    id: "karategis",
    slug: "karategis",
    name: "Karategis",
    description: "",
    parentId: null,
    active: true,
  },
];

function makeProduct(id: string, categoryId: string, approval: Product["approval"]): Product {
  return {
    id,
    sku: id.toUpperCase(),
    slug: id,
    name: id,
    brandId: "brand-a",
    categoryId,
    shortDescription: "",
    description: "",
    features: [],
    approval,
    variants: [],
    prices: [],
    images: [],
    availability: "CONSULT",
    featured: false,
    active: true,
  };
}

const brandNames = {
  "brand-a": "Marca A",
};

const categoryNames = Object.fromEntries(categories.map((category) => [category.id, category.name]));

const baseFilters: CatalogFilters = {
  search: "",
  brandId: "ALL",
  categoryId: "ALL",
  approval: "ALL",
};

describe("filterProducts", () => {
  it("incluye productos de subcategorías cuando se filtra por una categoría padre", () => {
    const products = [
      makeProduct("guante-wkf", "guantines", "WKF"),
      makeProduct("karategi", "karategis", "UNSPECIFIED"),
    ];

    const result = filterProducts(
      products,
      {
        ...baseFilters,
        categoryId: "protecciones",
      },
      brandNames,
      categoryNames,
      categories,
    );

    expect(result.map((product) => product.id)).toEqual(["guante-wkf"]);
  });

  it("mantiene el filtro de homologación dentro del árbol de categorías", () => {
    const products = [
      makeProduct("guante-wkf", "guantines", "WKF"),
      makeProduct("guante-nacional", "guantines", "NATIONAL"),
    ];

    const result = filterProducts(
      products,
      {
        ...baseFilters,
        categoryId: "protecciones",
        approval: "NATIONAL",
      },
      brandNames,
      categoryNames,
      categories,
    );

    expect(result.map((product) => product.id)).toEqual(["guante-nacional"]);
  });
});
