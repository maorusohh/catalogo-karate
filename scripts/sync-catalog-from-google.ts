import path from "node:path";
import process from "node:process";
import { mkdir, writeFile } from "node:fs/promises";

import { google } from "googleapis";

import {
  CATALOG_SOURCE_RANGES,
  catalogSourceTablesFromBatchGet,
} from "../src/lib/catalog/source/google-sheets";
import { buildCatalogFromTables } from "../src/lib/catalog/source/tabular";

const READONLY_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

const OUTPUT_PATH = path.resolve(process.cwd(), "src/data/catalog-source.google.generated.ts");

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable "${name}".`);
  }

  return value;
}

function parseServiceAccountCredentials(value: string): ServiceAccountCredentials {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON does not contain valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must contain a JSON object.");
  }

  const record = parsed as Record<string, unknown>;

  if (typeof record.client_email !== "string" || !record.client_email) {
    throw new Error('Google service account JSON is missing a valid "client_email".');
  }

  if (typeof record.private_key !== "string" || !record.private_key) {
    throw new Error('Google service account JSON is missing a valid "private_key".');
  }

  return {
    client_email: record.client_email,
    private_key: record.private_key,
  };
}

function renderGeneratedSource(source: unknown): string {
  return `import type { CatalogSourceTables } from "@/lib/catalog/source/types";

export const catalogSourceGoogle =
  ${JSON.stringify(source, null, 2)} as const satisfies CatalogSourceTables;
`;
}

async function main(): Promise<void> {
  const spreadsheetId = requireEnvironmentVariable("GOOGLE_SHEETS_SPREADSHEET_ID");

  const serviceAccountJson = requireEnvironmentVariable("GOOGLE_SERVICE_ACCOUNT_JSON");

  const credentials = parseServiceAccountCredentials(serviceAccountJson);

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [READONLY_SCOPE],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const result = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: CATALOG_SOURCE_RANGES,
    majorDimension: "ROWS",
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const source = catalogSourceTablesFromBatchGet(result.data);

  const catalog = buildCatalogFromTables(source);

  await mkdir(path.dirname(OUTPUT_PATH), {
    recursive: true,
  });

  await writeFile(OUTPUT_PATH, renderGeneratedSource(source), "utf8");

  console.log("Google Sheets catalog synchronized successfully.");

  console.log(`Brands: ${catalog.brands.length}`);

  console.log(`Categories: ${catalog.categories.length}`);

  console.log(`Products: ${catalog.products.length}`);

  console.log(`Generated source: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`Google Sheets catalog sync failed: ${message}`);

  process.exitCode = 1;
});
