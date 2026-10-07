import { ProductCard } from "@/components/catalog/product-card";
import type { Product } from "@/types/catalog";

type ScopedProductGridProps = {
  products: Product[];
  brandNames: Record<string, string>;
  categoryNames: Record<string, string>;
};

export function ScopedProductGrid({ products, brandNames, categoryNames }: ScopedProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-14 text-center">
        <p className="text-sm font-semibold text-neutral-950">
          Todavía no hay productos publicados aquí.
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
          Esta sección ya está preparada para recibir referencias reales cuando incorporemos el
          catálogo definitivo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
