import type { Category, Product } from "@/types/catalog";

export function getCategoryTreeIds(categoryId: string, categories: Category[]): string[] {
  const descendants = new Set<string>([categoryId]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (
        category.parentId &&
        descendants.has(category.parentId) &&
        !descendants.has(category.id)
      ) {
        descendants.add(category.id);
        changed = true;
      }
    }
  }

  return [...descendants];
}

export function getProductsByCategory(
  products: Product[],
  categoryId: string,
  categories: Category[],
): Product[] {
  const categoryIds = new Set(getCategoryTreeIds(categoryId, categories));

  return products.filter((product) => product.active && categoryIds.has(product.categoryId));
}

export function getProductsByBrand(products: Product[], brandId: string): Product[] {
  return products.filter((product) => product.active && product.brandId === brandId);
}
