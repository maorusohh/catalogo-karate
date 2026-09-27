import { expect, test } from "vitest";

import { catalogSourceFixture } from "@/data/catalog-source.fixture";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";
import {
  CATALOG_SOURCE_RANGES,
  CATALOG_SOURCE_TAB_NAMES,
  catalogSourceTablesFromBatchGet,
} from "@/lib/catalog/source/google-sheets";

function createBatchGetResponse() {
  return {
    valueRanges: CATALOG_SOURCE_TAB_NAMES.map((tabName) => ({
      range: `${tabName}!A:ZZ`,
      values: catalogSourceFixture[tabName],
    })),
  };
}

test("convierte una respuesta batchGet en las tablas del catálogo", () => {
  const source = catalogSourceTablesFromBatchGet(createBatchGetResponse());

  expect(source.meta).toEqual(catalogSourceFixture.meta);

  expect(source.brands).toEqual(catalogSourceFixture.brands);

  expect(source.products).toEqual(catalogSourceFixture.products);

  expect(source.variant_options).toEqual(catalogSourceFixture.variant_options);
});

test("las nueve hojas se solicitan en el orden contractual", () => {
  expect(CATALOG_SOURCE_RANGES).toEqual([
    "meta!A:ZZ",
    "brands!A:ZZ",
    "categories!A:ZZ",
    "products!A:ZZ",
    "variants!A:ZZ",
    "variant_options!A:ZZ",
    "prices!A:ZZ",
    "images!A:ZZ",
    "features!A:ZZ",
  ]);
});

test("la fuente reconstruida sigue siendo compatible con el adapter principal", () => {
  const source = catalogSourceTablesFromBatchGet(createBatchGetResponse());

  const catalog = buildCatalogFromTables(source);

  expect(catalog.brands).toHaveLength(2);

  expect(catalog.categories).toHaveLength(6);

  expect(catalog.products).toHaveLength(3);
});

test("rechaza una respuesta con una cantidad incorrecta de hojas", () => {
  const response = {
    valueRanges: CATALOG_SOURCE_TAB_NAMES.slice(0, 8).map((tabName) => ({
      range: `${tabName}!A:ZZ`,
      values: [],
    })),
  };

  expect(() => catalogSourceTablesFromBatchGet(response)).toThrow(
    "Expected 9 Google Sheets ranges, received 8.",
  );
});

test("rechaza una hoja fuera del orden contractual", () => {
  const valueRanges = CATALOG_SOURCE_TAB_NAMES.map((tabName) => ({
    range: `${tabName}!A:ZZ`,
    values: [],
  }));

  valueRanges[0] = {
    range: "brands!A:ZZ",
    values: [],
  };

  expect(() =>
    catalogSourceTablesFromBatchGet({
      valueRanges,
    }),
  ).toThrow('Google Sheets range 1 must belong to sheet "meta", received "brands".');
});

test("rechaza tipos de celda no soportados", () => {
  const valueRanges = CATALOG_SOURCE_TAB_NAMES.map((tabName) => ({
    range: `${tabName}!A:ZZ`,
    values: catalogSourceFixture[tabName].map((row) => [...row] as unknown[]),
  }));

  const brandsValues = [...valueRanges[1].values!].map((row) => [...row]);

  brandsValues[1][5] = {
    invalid: true,
  };

  valueRanges[1] = {
    range: "brands!A:ZZ",
    values: brandsValues,
  };

  expect(() =>
    catalogSourceTablesFromBatchGet({
      valueRanges,
    }),
  ).toThrow('Google Sheets source "brands", row 2, column 6: unsupported cell type "object".');
});
