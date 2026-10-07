import { expect, test } from "vitest";

import { catalogSourceFixture } from "@/data/catalog-source.fixture";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";
import type { CatalogSourceTables } from "@/lib/catalog/source/types";

function createSourceFixture(): CatalogSourceTables {
  return structuredClone(catalogSourceFixture);
}

test("asocia un precio a una variante del mismo producto", () => {
  const source = createSourceFixture();

  source.prices = [
    ["product_id", "amount", "currency", "basis", "label", "note", "sort_order", "variant_id"],
    [
      "demo-product-002",
      "25",
      "USD",
      "DIRECT_USD",
      "25 USD / Divisas",
      "",
      "1",
      "demo-product-002-v1",
    ],
  ];

  const catalog = buildCatalogFromTables(source);
  const product = catalog.products.find((item) => item.id === "demo-product-002");

  expect(product?.prices).toEqual([
    {
      amount: 25,
      currency: "USD",
      basis: "DIRECT_USD",
      label: "25 USD / Divisas",
      note: undefined,
      variantId: "demo-product-002-v1",
    },
  ]);
});

test("rechaza un precio asociado a una variante de otro producto", () => {
  const source = createSourceFixture();

  source.prices = [
    ["product_id", "amount", "currency", "basis", "label", "note", "sort_order", "variant_id"],
    [
      "demo-product-001",
      "25",
      "USD",
      "DIRECT_USD",
      "Precio inválido",
      "",
      "1",
      "demo-product-002-v1",
    ],
  ];

  expect(() => buildCatalogFromTables(source)).toThrow(
    'prices, row 2: variant "demo-product-002-v1" does not belong to product "demo-product-001".',
  );
});
