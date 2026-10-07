import { expect, test } from "vitest";

import { catalogSourceGoogle } from "@/data/catalog-source.google.generated";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";

test("el snapshot generado desde Google Sheets produce un catálogo válido", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);

  expect(catalog.brands.length).toBeGreaterThan(0);
  expect(catalog.categories.length).toBeGreaterThan(0);
  expect(catalog.products.length).toBeGreaterThan(0);
});

test("el snapshot conserva las variantes verificadas del catálogo", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);
  const variants = catalog.products.flatMap((product) => product.variants);

  expect(variants).toHaveLength(158);

  const gloves = catalog.products.find((product) => product.id === "mallems-guantes-karate-do-07");
  const beltPack = catalog.products.find(
    (product) => product.id === "mallems-cinturones-competencia-2-pack-19",
  );
  const trainingGi = catalog.products.find(
    (product) => product.id === "mallems-karategi-liviano-entrenamiento-21",
  );
  const bestSportShinGuards = catalog.products.find(
    (product) => product.id === "best-sport-canilleras-karate-aprobadas-wkf-1128wkf",
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

  expect(trainingGi?.variants).toHaveLength(9);
  expect(trainingGi?.variants[4]).toMatchObject({
    id: "m21-t4",
    label: "Talla 4 · 1.40–1.45 m",
    options: [{ name: "Talla", value: "Talla 4 · 1.40–1.45 m" }],
  });

  expect(bestSportShinGuards?.variants).toHaveLength(8);
  expect(bestSportShinGuards?.variants[0]).toMatchObject({
    id: "bs1128-xs-ao",
    label: "XS · Ao (Azul)",
    options: [
      { name: "Talla", value: "XS" },
      { name: "Color", value: "Ao" },
    ],
  });
});
