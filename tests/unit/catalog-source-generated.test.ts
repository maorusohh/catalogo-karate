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

  expect(variants.length).toBeGreaterThanOrEqual(170);

  const gloves = catalog.products.find((product) => product.id === "mallems-guantes-karate-do-07");
  const gradeBeltsLabel = catalog.products.find(
    (product) => product.id === "mallems-cinturones-grado-etiqueta-16",
  );
  const gradeBeltsEmbroidery = catalog.products.find(
    (product) => product.id === "mallems-cinturones-grado-bordado-17",
  );
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

  expect(gradeBeltsLabel?.variants).toHaveLength(6);
  expect(gradeBeltsLabel?.variants.map((variant) => variant.label)).toEqual([
    "Amarillo",
    "Naranja",
    "Verde",
    "Azul",
    "Marrón",
    "Otro color a consultar",
  ]);

  expect(gradeBeltsEmbroidery?.variants).toHaveLength(6);
  expect(gradeBeltsEmbroidery?.variants.map((variant) => variant.label)).toEqual([
    "Amarillo",
    "Naranja",
    "Verde",
    "Azul",
    "Marrón",
    "Otro color a consultar",
  ]);

  expect(beltPack?.variants).toHaveLength(5);
  expect(beltPack?.variants[0]).toMatchObject({
    id: "m19-240",
    label: "2.40m",
    options: [{ name: "Longitud", value: "2.40m" }],
  });

  expect(trainingGi?.variants).toHaveLength(9);
  expect(trainingGi?.variants[4]).toMatchObject({
    id: "m21-t4",
    label: "Talla 4 · 1.40m - 1.45m",
    options: [{ name: "Talla", value: "Talla 4 · 1.40m - 1.45m" }],
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

test("el snapshot conserva K220 DNA, mantiene K200E y no reintroduce K200 DNA", () => {
  const catalog = buildCatalogFromTables(catalogSourceGoogle);
  const k220 = catalog.products.find((product) => product.id === "adidas-k220dnakit");
  const k200e = catalog.products.find((product) => product.id === "adidas-k200e");
  const legacyK200 = catalog.products.find((product) => product.id === "adidas-k200dnakit");

  expect(legacyK200).toBeUndefined();

  expect(k220?.variants).toHaveLength(11);
  expect(k220?.variants.map((variant) => variant.label)).toEqual([
    "1.40m",
    "1.45m",
    "1.50m",
    "1.55m",
    "1.60m",
    "1.65m",
    "1.70m",
    "1.75m",
    "1.80m",
    "1.85m",
    "1.90m",
  ]);

  expect(k200e?.variants).toHaveLength(6);
  expect(k200e?.variants.map((variant) => variant.label)).toEqual([
    "1.00m - 1.10m",
    "1.10m - 1.20m",
    "1.20m - 1.30m",
    "1.30m - 1.40m",
    "1.40m - 1.50m",
    "1.50m - 1.60m",
  ]);
});
