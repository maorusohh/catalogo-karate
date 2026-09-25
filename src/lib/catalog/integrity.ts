import type { Catalog } from "@/types/catalog";

function assertUnique(values: string[], label: string): void {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];

    throw new Error(`Duplicate ${label}: ${uniqueDuplicates.join(", ")}`);
  }
}

export function validateCatalogIntegrity(catalog: Catalog): void {
  assertUnique(
    catalog.brands.map((brand) => brand.id),
    "brand id",
  );

  assertUnique(
    catalog.brands.map((brand) => brand.slug),
    "brand slug",
  );

  assertUnique(
    catalog.categories.map((category) => category.id),
    "category id",
  );

  assertUnique(
    catalog.categories.map((category) => category.slug),
    "category slug",
  );

  assertUnique(
    catalog.products.map((product) => product.id),
    "product id",
  );

  assertUnique(
    catalog.products.map((product) => product.sku),
    "product sku",
  );

  assertUnique(
    catalog.products.map((product) => product.slug),
    "product slug",
  );

  const brandIds = new Set(catalog.brands.map((brand) => brand.id));
  const categoryIds = new Set(catalog.categories.map((category) => category.id));

  for (const product of catalog.products) {
    if (!brandIds.has(product.brandId)) {
      throw new Error(`Product "${product.id}" references unknown brand "${product.brandId}"`);
    }

    if (!categoryIds.has(product.categoryId)) {
      throw new Error(
        `Product "${product.id}" references unknown category "${product.categoryId}"`,
      );
    }

    assertUnique(
      product.variants.map((variant) => variant.id),
      `variant id in product ${product.id}`,
    );
  }
}
