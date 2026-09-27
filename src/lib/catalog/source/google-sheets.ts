import type { CatalogSourceTables, SourceCell } from "@/lib/catalog/source/types";

export const CATALOG_SOURCE_TAB_NAMES = [
  "meta",
  "brands",
  "categories",
  "products",
  "variants",
  "variant_options",
  "prices",
  "images",
  "features",
] as const;

export type CatalogSourceTabName = (typeof CATALOG_SOURCE_TAB_NAMES)[number];

export const CATALOG_SOURCE_RANGES = CATALOG_SOURCE_TAB_NAMES.map((tabName) => `${tabName}!A:ZZ`);

export interface GoogleSheetsValueRange {
  range?: string | null;
  values?: readonly (readonly unknown[])[] | null | undefined;
}

export interface GoogleSheetsBatchGetResponse {
  valueRanges?: readonly GoogleSheetsValueRange[] | null | undefined;
}

function getSheetNameFromRange(range: string | null | undefined): string | null {
  if (!range) {
    return null;
  }

  const bangIndex = range.indexOf("!");

  if (bangIndex <= 0) {
    return null;
  }

  const rawSheetName = range.slice(0, bangIndex);

  if (rawSheetName.startsWith("'") && rawSheetName.endsWith("'")) {
    return rawSheetName.slice(1, -1).replace(/''/g, "'");
  }

  return rawSheetName;
}

function normalizeCell(
  value: unknown,
  tabName: string,
  rowIndex: number,
  columnIndex: number,
): SourceCell {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  throw new Error(
    `Google Sheets source "${tabName}", row ${rowIndex + 1}, column ${
      columnIndex + 1
    }: unsupported cell type "${typeof value}".`,
  );
}

export function catalogSourceTablesFromBatchGet(
  response: GoogleSheetsBatchGetResponse,
): CatalogSourceTables {
  const valueRanges = response.valueRanges ?? [];

  if (valueRanges.length !== CATALOG_SOURCE_TAB_NAMES.length) {
    throw new Error(
      `Expected ${CATALOG_SOURCE_TAB_NAMES.length} Google Sheets ranges, received ${valueRanges.length}.`,
    );
  }

  const tables = {} as Record<CatalogSourceTabName, readonly (readonly SourceCell[])[]>;

  CATALOG_SOURCE_TAB_NAMES.forEach((tabName, index) => {
    const valueRange = valueRanges[index];

    const actualSheetName = getSheetNameFromRange(valueRange.range);

    if (actualSheetName !== tabName) {
      throw new Error(
        `Google Sheets range ${index + 1} must belong to sheet "${tabName}", received "${actualSheetName ?? "unknown"}".`,
      );
    }

    const rows = valueRange.values ?? [];

    tables[tabName] = rows.map((row, rowIndex) =>
      row.map((value, columnIndex) => normalizeCell(value, tabName, rowIndex, columnIndex)),
    );
  });

  return tables;
}
