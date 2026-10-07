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

  const activeBrands = useMemo(() => brands.filter((brand) => brand.active), [brands]);
  const activeCategories = useMemo(
    () => categories.filter((category) => category.active),
    [categories],
  );
  const activeProducts = useMemo(() => products.filter((product) => product.active), [products]);

  const brandNames = useMemo(
    () => Object.fromEntries(activeBrands.map((brand) => [brand.id, brand.name])),
    [activeBrands],
  );

  const categoryNames = useMemo(
    () => Object.fromEntries(activeCategories.map((category) => [category.id, category.name])),
    [activeCategories],
  );

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(
      activeProducts,
      filters,
      brandNames,
      categoryNames,
      activeCategories,
    );

    return sortProducts(filtered, sort);
  }, [activeProducts, filters, sort, brandNames, categoryNames, activeCategories]);

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
    <section>
      <div className="rounded-[1.75rem] border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-5">
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
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">
              Resultados
            </span>
            <span className="h-4 w-px bg-black/10" />
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-neutral-950">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}
            </p>
          </div>

          {(filters.search || activeFilterCount > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-[var(--ck-red)] transition-colors hover:text-[var(--ck-red-dark)]"
            >
              Restablecer búsqueda
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <details className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.03)]">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
            <span>Filtros</span>
            <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[11px] text-white tabular-nums">
              {activeFilterCount}
            </span>
          </summary>

          <div className="max-h-[70vh] overflow-y-scroll border-t border-black/10 p-4 [scrollbar-gutter:stable]">
            <CatalogFilters
              filters={filters}
              brands={activeBrands}
              categories={activeCategories}
              products={activeProducts}
              onChange={setFilters}
              onReset={clearFilters}
            />
          </div>
        </details>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-scroll overscroll-contain pr-2 [scrollbar-gutter:stable]">
            <CatalogFilters
              filters={filters}
              brands={activeBrands}
              categories={activeCategories}
              products={activeProducts}
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
