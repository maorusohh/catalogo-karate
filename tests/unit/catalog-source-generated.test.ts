import { expect, test } from "vitest";

import { catalogSourceGoogle } from "@/data/catalog-source.google.generated";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";

test("el snapshot generado desde Google Sheets produce un catálogo válido", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);

  expect(catalog.brands.length).toBeGreaterThan(0);
  expect(catalog.categories.length).toBeGreaterThan(0);
  expect(catalog.products.length).toBeGreaterThan(0);
});

test("el snapshot conserva la primera tanda de variantes verificadas", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);
  const variants = catalog.products.flatMap((product) => product.variants);

  expect(variants).toHaveLength(59);

  const gloves = catalog.products.find((product) => product.id === "mallems-guantes-karate-do-07");
  const beltPack = catalog.products.find(
    (product) => product.id === "mallems-cinturones-competencia-2-pack-19",
  );

  expect(gloves?.variants).toHaveLength(10);
  expect(gloves?.variants[0]).toMatchObject({
    id: "m07-xs-ao",
    label: "XS · Ao (Azul)",
    available: true,
    options: [
      { name: "Talla", value: "XS" },
      { name: "Color", value: "Ao" },
    ],
  });

  expect(beltPack?.variants).toHaveLength(5);
  expect(beltPack?.variants[0]).toMatchObject({
    id: "m19-240",
    label: "2.40 m",
    options: [{ name: "Longitud", value: "2.40 m" }],
  });
});
