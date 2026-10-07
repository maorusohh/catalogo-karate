import type { Product } from "@/types/catalog";

import { ProductCard } from "@/components/catalog/product-card";

type ProductGridProps = {
  products: Product[];
  brandNames: Record<string, string>;
  categoryNames: Record<string, string>;
};

export function ProductGrid({ products, brandNames, categoryNames }: ProductGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          brandName={brandNames[product.brandId] ?? "Marca"}
          categoryName={categoryNames[product.categoryId] ?? "Categoría"}
        />
      ))}
    </div>
  );
}
