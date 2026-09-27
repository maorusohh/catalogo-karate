import { expect, test } from "vitest";

import { catalogSourceFixture } from "@/data/catalog-source.fixture";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";
import type { CatalogSourceTables } from "@/lib/catalog/source/types";

function createSourceFixture(): CatalogSourceTables {
  return structuredClone(catalogSourceFixture);
}

test("construye un catálogo válido desde tablas", () => {
  const catalog = buildCatalogFromTables(createSourceFixture());

  expect(catalog.brands).toHaveLength(2);
  expect(catalog.categories).toHaveLength(6);
  expect(catalog.products).toHaveLength(3);

  expect(catalog.products.map((product) => product.id)).toEqual([
    "demo-product-001",
    "demo-product-002",
    "demo-product-003",
  ]);
});

test("reconstruye correctamente las variantes y sus opciones", () => {
  const catalog = buildCatalogFromTables(createSourceFixture());

  const product = catalog.products.find((item) => item.id === "demo-product-002");

  expect(product).toBeDefined();

  expect(product?.variants).toHaveLength(3);

  expect(product?.variants[0]).toMatchObject({
    id: "demo-product-002-v1",
    label: "Rojo · S",
    available: true,
    options: [
      {
        name: "Color",
        value: "Rojo",
      },
      {
        name: "Talla",
        value: "S",
      },
    ],
  });

  expect(product?.variants[2]).toMatchObject({
    id: "demo-product-002-v3",
    label: "Azul · M",
    options: [
      {
        name: "Color",
        value: "Azul",
      },
      {
        name: "Talla",
        value: "M",
      },
    ],
  });
});

test("aplica sort_order a opciones, precios, imágenes y características", () => {
  const source = createSourceFixture();

  source.variant_options = [
    ["variant_id", "name", "value", "sort_order"],
    ["demo-product-001-v1", "Material", "Algodón", "2"],
    ["demo-product-001-v1", "Talla", "Demo", "1"],
  ];

  source.prices = [
    ["product_id", "amount", "currency", "basis", "label", "note", "sort_order"],
    ["demo-product-001", "", "", "CONSULT", "Consultar precio", "", "2"],
    ["demo-product-001", "25", "USD", "DIRECT_USD", "USD directo", "", "1"],
  ];

  source.images = [
    ["product_id", "src", "alt", "source_type", "source_url", "sort_order"],
    [
      "demo-product-001",
      "https://example.com/second.jpg",
      "Segunda imagen",
      "PROVIDER",
      "https://example.com/source-2",
      "2",
    ],
    [
      "demo-product-001",
      "https://example.com/first.jpg",
      "Primera imagen",
      "PROVIDER",
      "https://example.com/source-1",
      "1",
    ],
  ];

  source.features = [
    ["product_id", "feature", "sort_order"],
    ["demo-product-001", "Característica B", "2"],
    ["demo-product-001", "Característica A", "1"],
  ];

  const catalog = buildCatalogFromTables(source);

  const product = catalog.products.find((item) => item.id === "demo-product-001");

  expect(product).toBeDefined();

  expect(product?.variants[0].options).toEqual([
    {
      name: "Talla",
      value: "Demo",
    },
    {
      name: "Material",
      value: "Algodón",
    },
  ]);

  expect(product?.prices).toMatchObject([
    {
      amount: 25,
      currency: "USD",
      basis: "DIRECT_USD",
    },
    {
      amount: null,
      currency: null,
      basis: "CONSULT",
    },
  ]);

  expect(product?.images).toMatchObject([
    {
      src: "https://example.com/first.jpg",
      alt: "Primera imagen",
    },
    {
      src: "https://example.com/second.jpg",
      alt: "Segunda imagen",
    },
  ]);

  expect(product?.features).toEqual(["Característica A", "Característica B"]);
});

test("rechaza una versión de fuente no soportada", () => {
  const source = createSourceFixture();

  source.meta = [
    ["key", "value"],
    ["schema_version", "2"],
  ];

  expect(() => buildCatalogFromTables(source)).toThrow(
    'Unsupported catalog source schema version "2". Expected "1".',
  );
});

test("rechaza booleanos ambiguos", () => {
  const source = createSourceFixture();

  source.brands = [
    ...source.brands.slice(0, 2),
    ["demo-brand-invalid", "marca-invalida", "Marca inválida", "Registro inválido", "", "YES"],
  ];

  expect(() => buildCatalogFromTables(source)).toThrow(
    'brands, row 3: field "active" must be TRUE or FALSE.',
  );
});

test("rechaza referencias de producto inexistentes", () => {
  const source = createSourceFixture();

  const productHeader = source.products[0];

  const idIndex = productHeader.indexOf("id");
  const categoryIdIndex = productHeader.indexOf("category_id");

  expect(idIndex).toBeGreaterThanOrEqual(0);
  expect(categoryIdIndex).toBeGreaterThanOrEqual(0);

  const targetRowIndex = source.products.findIndex(
    (row, index) => index > 0 && row[idIndex] === "demo-product-003",
  );

  expect(targetRowIndex).toBeGreaterThan(0);

  source.products = source.products.map((row, index) => {
    if (index !== targetRowIndex) {
      return row;
    }

    const updatedRow = [...row];
    updatedRow[categoryIdIndex] = "categoria-inexistente";

    return updatedRow;
  });

  expect(() => buildCatalogFromTables(source)).toThrow(
    'Product field "category_id" references unknown id "categoria-inexistente".',
  );
});

test("rechaza precios DIRECT_USD con moneda USDT", () => {
  const source = createSourceFixture();

  source.prices = [
    source.prices[0],
    ["demo-product-001", "25", "USDT", "DIRECT_USD", "Precio inválido", "", "1"],
  ];

  expect(() => buildCatalogFromTables(source)).toThrow("DIRECT_USD basis requires USD currency.");
});

test("rechaza precios CONSULT con monto o moneda", () => {
  const source = createSourceFixture();

  source.prices = [
    source.prices[0],
    ["demo-product-001", "25", "", "CONSULT", "Consulta inválida", "", "1"],
  ];

  expect(() => buildCatalogFromTables(source)).toThrow(
    "CONSULT price must have empty amount and currency.",
  );
});
