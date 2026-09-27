import { catalogSchema } from "@/lib/validation/catalog.schema";
import { validateCatalogIntegrity } from "@/lib/catalog/integrity";
import type {
  ApprovalLevel,
  AvailabilityStatus,
  Catalog,
  PriceBasis,
  PriceCurrency,
  Product,
  ProductImage,
  ProductPrice,
  ProductVariant,
  VariantOption,
} from "@/types/catalog";

import type { CatalogSourceTables, SourceCell, SourceTable } from "@/lib/catalog/source/types";

type SourceRecord = Record<string, string>;

type RowContext = {
  sheet: string;
  row: number;
};

type Ordered<T> = {
  sortOrder: number;
  value: T;
};

function cellToText(value: SourceCell | undefined): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  return String(value).trim();
}

function normalizeHeader(value: SourceCell): string {
  return cellToText(value)
    .replace(/^\uFEFF/, "")
    .trim();
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: "${value}"`);
    }

    seen.add(value);
  }
}

function createContext(sheet: string, rowIndex: number): RowContext {
  return {
    sheet,
    row: rowIndex,
  };
}

function formatContext(context: RowContext): string {
  return `${context.sheet}, row ${context.row}`;
}

function tableToRecords(
  sheet: string,
  table: SourceTable,
  requiredColumns: readonly string[],
): SourceRecord[] {
  if (table.length === 0) {
    throw new Error(`Sheet "${sheet}" is empty and has no header row.`);
  }

  const [headerRow, ...dataRows] = table;

  const headers = headerRow.map(normalizeHeader);

  if (headers.some((header) => !header)) {
    throw new Error(`Sheet "${sheet}" contains an empty header.`);
  }

  assertUnique(headers, `column in sheet ${sheet}`);

  for (const requiredColumn of requiredColumns) {
    if (!headers.includes(requiredColumn)) {
      throw new Error(`Sheet "${sheet}" is missing required column "${requiredColumn}".`);
    }
  }

  return dataRows
    .map((row) =>
      headers.reduce<SourceRecord>((record, header, index) => {
        record[header] = cellToText(row[index]);
        return record;
      }, {}),
    )
    .filter((record) => Object.values(record).some((value) => value !== ""));
}

function requiredText(record: SourceRecord, field: string, context: RowContext): string {
  const value = record[field]?.trim() ?? "";

  if (!value) {
    throw new Error(`${formatContext(context)}: required field "${field}" is empty.`);
  }

  return value;
}

function optionalText(record: SourceRecord, field: string): string | undefined {
  const value = record[field]?.trim() ?? "";

  return value || undefined;
}

function parseBoolean(record: SourceRecord, field: string, context: RowContext): boolean {
  const value = requiredText(record, field, context).toUpperCase();

  if (value === "TRUE") {
    return true;
  }

  if (value === "FALSE") {
    return false;
  }

  throw new Error(`${formatContext(context)}: field "${field}" must be TRUE or FALSE.`);
}

function parseInteger(record: SourceRecord, field: string, context: RowContext): number {
  const value = requiredText(record, field, context);

  if (!/^\d+$/.test(value)) {
    throw new Error(`${formatContext(context)}: field "${field}" must be an integer.`);
  }

  return Number(value);
}

function parsePositiveNumber(record: SourceRecord, field: string, context: RowContext): number {
  const value = requiredText(record, field, context);

  if (!/^\d+(?:\.\d+)?$/.test(value)) {
    throw new Error(`${formatContext(context)}: field "${field}" must be a positive number.`);
  }

  const numberValue = Number(value);

  if (numberValue <= 0) {
    throw new Error(`${formatContext(context)}: field "${field}" must be greater than zero.`);
  }

  return numberValue;
}

function parseEnum<T extends string>(
  record: SourceRecord,
  field: string,
  allowed: readonly T[],
  context: RowContext,
): T {
  const value = requiredText(record, field, context);

  if (!allowed.includes(value as T)) {
    throw new Error(
      `${formatContext(context)}: invalid value "${value}" for "${field}". Allowed: ${allowed.join(", ")}.`,
    );
  }

  return value as T;
}

function buildMeta(table: SourceTable): Map<string, string> {
  const records = tableToRecords("meta", table, ["key", "value"]);

  const entries = records.map((record, index) => {
    const context = createContext("meta", index + 2);

    return [requiredText(record, "key", context), requiredText(record, "value", context)] as const;
  });

  assertUnique(
    entries.map(([key]) => key),
    "meta key",
  );

  return new Map(entries);
}

function assertSupportedSchemaVersion(meta: Map<string, string>): void {
  const version = meta.get("schema_version");

  if (!version) {
    throw new Error('Missing required meta key "schema_version".');
  }

  if (version !== "1") {
    throw new Error(`Unsupported catalog source schema version "${version}". Expected "1".`);
  }
}

function assertCategoryHierarchy(categories: Catalog["categories"]): void {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  for (const category of categories) {
    if (!category.parentId) {
      continue;
    }

    if (category.parentId === category.id) {
      throw new Error(`Category "${category.id}" cannot reference itself as parent.`);
    }

    if (!categoriesById.has(category.parentId)) {
      throw new Error(
        `Category "${category.id}" references unknown parent category "${category.parentId}".`,
      );
    }
  }

  for (const category of categories) {
    const visited = new Set<string>();
    let current: string | null = category.id;

    while (current) {
      if (visited.has(current)) {
        throw new Error(`Category hierarchy cycle detected at "${current}".`);
      }

      visited.add(current);

      current = categoriesById.get(current)?.parentId ?? null;
    }
  }
}

function assertReference(
  value: string,
  knownIds: Set<string>,
  entity: string,
  field: string,
  context: RowContext,
): void {
  if (!knownIds.has(value)) {
    throw new Error(
      `${formatContext(context)}: ${entity} field "${field}" references unknown id "${value}".`,
    );
  }
}

function assignOrderedValues<T>(target: T[], ordered: Ordered<T>[]): void {
  target.push(...ordered.sort((a, b) => a.sortOrder - b.sortOrder).map((entry) => entry.value));
}

export function buildCatalogFromTables(source: CatalogSourceTables): Catalog {
  const meta = buildMeta(source.meta);

  assertSupportedSchemaVersion(meta);

  const brandRecords = tableToRecords("brands", source.brands, [
    "id",
    "slug",
    "name",
    "description",
    "logo",
    "active",
  ]);

  const brands = brandRecords.map((record, index) => {
    const context = createContext("brands", index + 2);

    return {
      id: requiredText(record, "id", context),
      slug: requiredText(record, "slug", context),
      name: requiredText(record, "name", context),
      description: record.description?.trim() ?? "",
      logo: optionalText(record, "logo"),
      active: parseBoolean(record, "active", context),
    };
  });

  assertUnique(
    brands.map((brand) => brand.id),
    "brand id",
  );

  assertUnique(
    brands.map((brand) => brand.slug),
    "brand slug",
  );

  const categoryRecords = tableToRecords("categories", source.categories, [
    "id",
    "slug",
    "name",
    "description",
    "parent_id",
    "active",
  ]);

  const categories = categoryRecords.map((record, index) => {
    const context = createContext("categories", index + 2);

    return {
      id: requiredText(record, "id", context),
      slug: requiredText(record, "slug", context),
      name: requiredText(record, "name", context),
      description: record.description?.trim() ?? "",
      parentId: optionalText(record, "parent_id") ?? null,
      active: parseBoolean(record, "active", context),
    };
  });

  assertUnique(
    categories.map((category) => category.id),
    "category id",
  );

  assertUnique(
    categories.map((category) => category.slug),
    "category slug",
  );

  assertCategoryHierarchy(categories);

  const brandIds = new Set(brands.map((brand) => brand.id));

  const categoryIds = new Set(categories.map((category) => category.id));

  const productRecords = tableToRecords("products", source.products, [
    "id",
    "sku",
    "slug",
    "name",
    "brand_id",
    "category_id",
    "short_description",
    "description",
    "approval",
    "approval_note",
    "availability",
    "featured",
    "active",
  ]);

  const products: Product[] = productRecords.map((record, index) => {
    const context = createContext("products", index + 2);

    const brandId = requiredText(record, "brand_id", context);

    const categoryId = requiredText(record, "category_id", context);

    assertReference(brandId, brandIds, "Product", "brand_id", context);

    assertReference(categoryId, categoryIds, "Product", "category_id", context);

    return {
      id: requiredText(record, "id", context),
      sku: requiredText(record, "sku", context),
      slug: requiredText(record, "slug", context),
      name: requiredText(record, "name", context),
      brandId,
      categoryId,
      shortDescription: requiredText(record, "short_description", context),
      description: requiredText(record, "description", context),
      features: [],
      approval: parseEnum<ApprovalLevel>(
        record,
        "approval",
        ["WKF", "NATIONAL", "NON_APPROVED", "UNSPECIFIED"],
        context,
      ),
      approvalNote: optionalText(record, "approval_note"),
      variants: [],
      prices: [],
      images: [],
      availability: parseEnum<AvailabilityStatus>(
        record,
        "availability",
        ["AVAILABLE", "CONSULT", "OUT_OF_STOCK", "COMING_SOON"],
        context,
      ),
      featured: parseBoolean(record, "featured", context),
      active: parseBoolean(record, "active", context),
    };
  });

  assertUnique(
    products.map((product) => product.id),
    "product id",
  );

  assertUnique(
    products.map((product) => product.sku),
    "product sku",
  );

  assertUnique(
    products.map((product) => product.slug),
    "product slug",
  );

  const productById = new Map(products.map((product) => [product.id, product]));

  const variantRecords = tableToRecords("variants", source.variants, [
    "id",
    "product_id",
    "label",
    "available",
  ]);

  const variantIds: string[] = [];
  const variantById = new Map<string, ProductVariant>();

  for (let index = 0; index < variantRecords.length; index += 1) {
    const record = variantRecords[index];

    const context = createContext("variants", index + 2);

    const variantId = requiredText(record, "id", context);

    const productId = requiredText(record, "product_id", context);

    assertReference(productId, new Set(productById.keys()), "Variant", "product_id", context);

    if (variantById.has(variantId)) {
      throw new Error(`${formatContext(context)}: duplicate variant id "${variantId}".`);
    }

    const variant: ProductVariant = {
      id: variantId,
      label: requiredText(record, "label", context),
      options: [],
      available: parseBoolean(record, "available", context),
    };

    variantIds.push(variantId);
    variantById.set(variantId, variant);

    productById.get(productId)?.variants.push(variant);
  }

  assertUnique(variantIds, "variant id");

  const variantOptionRecords = tableToRecords("variant_options", source.variant_options, [
    "variant_id",
    "name",
    "value",
    "sort_order",
  ]);

  const optionsByVariant = new Map<string, Ordered<VariantOption>[]>();

  for (let index = 0; index < variantOptionRecords.length; index += 1) {
    const record = variantOptionRecords[index];

    const context = createContext("variant_options", index + 2);

    const variantId = requiredText(record, "variant_id", context);

    if (!variantById.has(variantId)) {
      throw new Error(
        `${formatContext(context)}: variant_options references unknown variant "${variantId}".`,
      );
    }

    const option: VariantOption = {
      name: requiredText(record, "name", context),
      value: requiredText(record, "value", context),
    };

    const sortOrder = parseInteger(record, "sort_order", context);

    const existing = optionsByVariant.get(variantId) ?? [];

    existing.push({
      sortOrder,
      value: option,
    });

    optionsByVariant.set(variantId, existing);
  }

  for (const [variantId, orderedOptions] of optionsByVariant) {
    const variant = variantById.get(variantId);

    if (!variant) {
      continue;
    }

    assignOrderedValues(variant.options, orderedOptions);
  }

  const priceRecords = tableToRecords("prices", source.prices, [
    "product_id",
    "amount",
    "currency",
    "basis",
    "label",
    "note",
    "sort_order",
  ]);

  const pricesByProduct = new Map<string, Ordered<ProductPrice>[]>();

  for (let index = 0; index < priceRecords.length; index += 1) {
    const record = priceRecords[index];

    const context = createContext("prices", index + 2);

    const productId = requiredText(record, "product_id", context);

    if (!productById.has(productId)) {
      throw new Error(
        `${formatContext(context)}: prices references unknown product "${productId}".`,
      );
    }

    const basis = parseEnum<PriceBasis>(
      record,
      "basis",
      ["DIRECT_USD", "BCV_RATE_USD", "EURO_RATE_USD", "USDT", "CONSULT"],
      context,
    );

    const amountText = record.amount?.trim() ?? "";

    const currencyText = record.currency?.trim() ?? "";

    const label = requiredText(record, "label", context);

    const sortOrder = parseInteger(record, "sort_order", context);

    let price: ProductPrice;

    if (basis === "CONSULT") {
      if (amountText || currencyText) {
        throw new Error(
          `${formatContext(context)}: CONSULT price must have empty amount and currency.`,
        );
      }

      price = {
        amount: null,
        currency: null,
        basis: "CONSULT",
        label,
        note: optionalText(record, "note"),
      };
    } else {
      const amount = parsePositiveNumber(record, "amount", context);

      if (currencyText !== "USD" && currencyText !== "USDT") {
        throw new Error(`${formatContext(context)}: invalid currency "${currencyText}".`);
      }

      const currency = currencyText as PriceCurrency;

      if (basis === "USDT" && currency !== "USDT") {
        throw new Error(`${formatContext(context)}: USDT basis requires USDT currency.`);
      }

      if (basis !== "USDT" && currency !== "USD") {
        throw new Error(`${formatContext(context)}: ${basis} basis requires USD currency.`);
      }

      price = {
        amount,
        currency,
        basis,
        label,
        note: optionalText(record, "note"),
      };
    }

    const existing = pricesByProduct.get(productId) ?? [];

    existing.push({
      sortOrder,
      value: price,
    });

    pricesByProduct.set(productId, existing);
  }

  for (const [productId, orderedPrices] of pricesByProduct) {
    const product = productById.get(productId);

    if (!product) {
      continue;
    }

    assignOrderedValues(product.prices, orderedPrices);
  }

  const imageRecords = tableToRecords("images", source.images, [
    "product_id",
    "src",
    "alt",
    "source_type",
    "source_url",
    "sort_order",
  ]);

  const imagesByProduct = new Map<string, Ordered<ProductImage>[]>();

  for (let index = 0; index < imageRecords.length; index += 1) {
    const record = imageRecords[index];

    const context = createContext("images", index + 2);

    const productId = requiredText(record, "product_id", context);

    if (!productById.has(productId)) {
      throw new Error(
        `${formatContext(context)}: images references unknown product "${productId}".`,
      );
    }

    const image: ProductImage = {
      src: requiredText(record, "src", context),
      alt: requiredText(record, "alt", context),
      sourceType: parseEnum(
        record,
        "source_type",
        ["OWN", "MANUFACTURER", "PROVIDER", "OTHER"] as const,
        context,
      ),
      sourceUrl: optionalText(record, "source_url"),
    };

    const sortOrder = parseInteger(record, "sort_order", context);

    const existing = imagesByProduct.get(productId) ?? [];

    existing.push({
      sortOrder,
      value: image,
    });

    imagesByProduct.set(productId, existing);
  }

  for (const [productId, orderedImages] of imagesByProduct) {
    const product = productById.get(productId);

    if (!product) {
      continue;
    }

    assignOrderedValues(product.images, orderedImages);
  }

  const featureRecords = tableToRecords("features", source.features, [
    "product_id",
    "feature",
    "sort_order",
  ]);

  const featuresByProduct = new Map<string, Ordered<string>[]>();

  for (let index = 0; index < featureRecords.length; index += 1) {
    const record = featureRecords[index];

    const context = createContext("features", index + 2);

    const productId = requiredText(record, "product_id", context);

    if (!productById.has(productId)) {
      throw new Error(
        `${formatContext(context)}: features references unknown product "${productId}".`,
      );
    }

    const feature = requiredText(record, "feature", context);

    const sortOrder = parseInteger(record, "sort_order", context);

    const existing = featuresByProduct.get(productId) ?? [];

    existing.push({
      sortOrder,
      value: feature,
    });

    featuresByProduct.set(productId, existing);
  }

  for (const [productId, orderedFeatures] of featuresByProduct) {
    const product = productById.get(productId);

    if (!product) {
      continue;
    }

    assignOrderedValues(product.features, orderedFeatures);
  }

  const finalCatalog = catalogSchema.parse({
    brands,
    categories,
    products,
  });

  validateCatalogIntegrity(finalCatalog);

  return finalCatalog;
}
