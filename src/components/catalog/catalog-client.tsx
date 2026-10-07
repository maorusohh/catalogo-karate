"use client";

import { useMemo, useState } from "react";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CatalogSort as CatalogSortSelect } from "@/components/catalog/catalog-sort";
import { ProductGrid } from "@/components/catalog/product-grid";
import {
  filterProducts,
  sortProducts,
  type CatalogFilters as CatalogFiltersState,
  type CatalogSort,
} from "@/lib/catalog/queries";
import type { Brand, Category, Product } from "@/types/catalog";

type CatalogClientProps = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
};

const initialFilters: CatalogFiltersState = {
  search: "",
  brandId: "ALL",
  categoryId: "ALL",
  approval: "ALL",
};

export function CatalogClient({ products, brands, categories }: CatalogClientProps) {
  const [filters, setFilters] = useState<CatalogFiltersState>(initialFilters);
  const [sort, setSort] = useState<CatalogSort>("featured");

  const brandNames = useMemo(
    () => Object.fromEntries(brands.map((brand) => [brand.id, brand.name])),
    [brands],
  );

  const brandLogos = useMemo(
    () => Object.fromEntries(brands.map((brand) => [brand.id, brand.logo])),
    [brands],
  );

  const categoryNames = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, filters, brandNames, categoryNames, categories);

    return sortProducts(filtered, sort);
  }, [products, filters, sort, brandNames, categoryNames, categories]);

  const activeFilterCount = [
    filters.brandId !== "ALL",
    filters.categoryId !== "ALL",
    filters.approval !== "ALL",
  ].filter(Boolean).length;

  function clearFilters() {
    setFilters(initialFilters);
    setSort("featured");
  }

  return (
    <section className="mt-10">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <CatalogSearch
          value={filters.search}
          onChange={(search) =>
            setFilters({
              ...filters,
              search,
            })
          }
        />

        <CatalogSortSelect value={sort} onChange={setSort} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-950">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {(filters.search || activeFilterCount > 0) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[#b31322]"
          >
            Limpiar búsqueda y filtros
          </button>
        )}
      </div>

      <div className="mt-8 lg:hidden">
        <details className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-neutral-950">
            Filtros
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </summary>

          <div className="border-t border-black/10 p-4">
            <CatalogFilters
              filters={filters}
              brands={brands}
              categories={categories}
              products={products}
              onChange={setFilters}
              onReset={clearFilters}
            />
          </div>
        </details>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CatalogFilters
              filters={filters}
              brands={brands}
              categories={categories}
              products={products}
              onChange={setFilters}
              onReset={clearFilters}
            />
          </div>
        </aside>

        <div className="min-w-0">
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              brandNames={brandNames}
              brandLogos={brandLogos}
              categoryNames={categoryNames}
            />
          ) : (
            <CatalogEmptyState onClear={clearFilters} />
          )}
        </div>
      </div>
    </section>
  );
}
