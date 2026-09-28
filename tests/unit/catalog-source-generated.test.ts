import { expect, test } from "vitest";

import { catalogSourceGoogle } from "@/data/catalog-source.google.generated";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";

test("el snapshot generado desde Google Sheets produce un catálogo válido", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);

  expect(catalog.brands.length).toBeGreaterThan(0);

  expect(catalog.categories.length).toBeGreaterThan(0);

  expect(catalog.products.length).toBeGreaterThan(0);
});
