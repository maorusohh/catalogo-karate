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

  const hasActiveQuery = filters.search.trim().length > 0 || activeFilterCount > 0;

  let resultLabel = products.length === 1 ? "producto total" : "productos totales";

  if (hasActiveQuery) {
    resultLabel = filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados";
  }

  function clearFilters() {
    setFilters(initialFilters);
    setSort("featured");
  }

  return (
    <section>
      <div className="rounded-3xl border border-black/8 bg-white p-4 shadow-[var(--ck-shadow-sm)] sm:p-5">
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/6 pt-4">
          <p data-testid="catalog-result-count" className="text-sm text-neutral-500">
            <span className="font-semibold text-neutral-950">{filteredProducts.length}</span>{" "}
            {resultLabel}
          </p>

          {hasActiveQuery && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[var(--ck-red)] transition-colors hover:text-[var(--ck-red-dark)]"
            >
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <details className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[var(--ck-shadow-sm)]">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-neutral-950">
            Filtros
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </summary>

          <div className="border-t border-black/8 p-4">
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
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-scroll overscroll-contain pr-2 [scrollbar-gutter:stable]">
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
