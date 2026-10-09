import { describe, expect, it } from "vitest";

import { filterProducts, sortProducts, type CatalogFilters } from "@/lib/catalog/queries";
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
    id: "espinilleras-empeineras",
    slug: "espinilleras-empeineras",
    name: "Espinilleras y empeineras",
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

function makeProduct(
  id: string,
  categoryId: string,
  approval: Product["approval"],
  overrides: Partial<Product> = {},
): Product {
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
    ...overrides,
  };
}

const brandNames = {
  "brand-a": "Marca A",
};

const categoryNames = Object.fromEntries(
  categories.map((category) => [category.id, category.name]),
);

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

  it("mantiene el filtro de aprobación dentro del árbol de categorías", () => {
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

  it("trata NONE como estado neutro sin restringir el catálogo", () => {
    const products = [
      makeProduct("guante-wkf", "guantines", "WKF"),
      makeProduct("karategi", "karategis", "UNSPECIFIED"),
    ];

    const result = filterProducts(
      products,
      {
        search: "",
        brandId: "NONE",
        categoryId: "NONE",
        approval: "NONE",
      },
      brandNames,
      categoryNames,
      categories,
    );

    expect(result.map((product) => product.id)).toEqual(["guante-wkf", "karategi"]);
  });

  it("resuelve equivalencias controladas sin exigir el término exacto del catálogo", () => {
    const products = [
      makeProduct("guantin-wkf", "guantines", "WKF", {
        name: "Guantines de competición",
      }),
      makeProduct("karategi-entrenamiento", "karategis", "UNSPECIFIED", {
        name: "Karategi de entrenamiento",
      }),
    ];

    const gloves = filterProducts(
      products,
      { ...baseFilters, search: "guantes" },
      brandNames,
      categoryNames,
      categories,
    );
    const uniform = filterProducts(
      products,
      { ...baseFilters, search: "kimono" },
      brandNames,
      categoryNames,
      categories,
    );

    expect(gloves.map((product) => product.id)).toEqual(["guantin-wkf"]);
    expect(uniform.map((product) => product.id)).toEqual(["karategi-entrenamiento"]);
  });

  it("trata karategi y karategui como la misma intención de búsqueda", () => {
    const products = [
      makeProduct("karategi-entrenamiento", "karategis", "UNSPECIFIED", {
        name: "Karategi de entrenamiento",
      }),
      makeProduct("karategui-kumite", "karategis", "WKF", {
        name: "Karategui de kumite",
      }),
      makeProduct("uniforme-iniciacion", "karategis", "UNSPECIFIED", {
        name: "Uniforme de iniciación",
      }),
    ];

    const withoutU = filterProducts(
      products,
      { ...baseFilters, search: "karategi" },
      brandNames,
      categoryNames,
      categories,
    );
    const withU = filterProducts(
      products,
      { ...baseFilters, search: "karategui" },
      brandNames,
      categoryNames,
      categories,
    );

    expect(withoutU.map((product) => product.id)).toEqual([
      "karategi-entrenamiento",
      "karategui-kumite",
      "uniforme-iniciacion",
    ]);
    expect(withU.map((product) => product.id)).toEqual(withoutU.map((product) => product.id));
  });

  it("encuentra la espinillera Adidas al buscar canilleras o canille", () => {
    const products = [
      makeProduct("canillera", "espinilleras-empeineras", "WKF", {
        name: "Canilleras de competición",
      }),
      makeProduct("adidas-661-35-20", "espinilleras-empeineras", "WKF", {
        name: "Protector de Empeine y Espinillera Removible de Karate",
      }),
      makeProduct("guantin", "guantines", "WKF", {
        name: "Guantines",
      }),
    ];

    const fullTerm = filterProducts(
      products,
      { ...baseFilters, search: "canilleras" },
      brandNames,
      categoryNames,
      categories,
    );
    const prefix = filterProducts(
      products,
      { ...baseFilters, search: "canille" },
      brandNames,
      categoryNames,
      categories,
    );

    expect(fullTerm.map((product) => product.id)).toEqual(["canillera", "adidas-661-35-20"]);
    expect(prefix.map((product) => product.id)).toEqual(fullTerm.map((product) => product.id));
  });

  it("combina sinónimos con atributos reales de variantes", () => {
    const products = [
      makeProduct("guantin-azul", "guantines", "WKF", {
        name: "Guantines de competición",
        variants: [
          {
            id: "guantin-azul-s",
            label: "Talla S · Azul",
            available: true,
            options: [
              { name: "Talla", value: "S" },
              { name: "Color", value: "Azul" },
            ],
          },
        ],
      }),
      makeProduct("guantin-rojo", "guantines", "WKF", {
        name: "Guantines de entrenamiento",
        variants: [
          {
            id: "guantin-rojo-s",
            label: "Talla S · Rojo",
            available: true,
            options: [
              { name: "Talla", value: "S" },
              { name: "Color", value: "Rojo" },
            ],
          },
        ],
      }),
    ];

    const result = filterProducts(
      products,
      { ...baseFilters, search: "guantes azul" },
      brandNames,
      categoryNames,
      categories,
    );

    expect(result.map((product) => product.id)).toEqual(["guantin-azul"]);
  });
});

describe("sortProducts", () => {
  it("preserva el orden de origen cuando no se selecciona criterio", () => {
    const products = [
      makeProduct("producto-b", "karategis", "UNSPECIFIED"),
      makeProduct("producto-a", "karategis", "UNSPECIFIED"),
    ];

    expect(sortProducts(products, "none").map((product) => product.id)).toEqual([
      "producto-b",
      "producto-a",
    ]);
  });
});
