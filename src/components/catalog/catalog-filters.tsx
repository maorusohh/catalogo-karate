"use client";

import type { ReactNode } from "react";

import type { CatalogFilters as CatalogFiltersState } from "@/lib/catalog/queries";
import type { ApprovalLevel, Brand, Category, Product } from "@/types/catalog";

type CatalogFiltersProps = {
  filters: CatalogFiltersState;
  brands: Brand[];
  categories: Category[];
  products: Product[];
  onChange: (filters: CatalogFiltersState) => void;
  onReset: () => void;
};

type ApprovalOption = {
  value: ApprovalLevel | "ALL";
  label: string;
  detail?: string;
};

const approvalOptions: ApprovalOption[] = [
  { value: "ALL", label: "Todas" },
  { value: "WKF", label: "WKF", detail: "World Karate Federation" },
  {
    value: "NATIONAL",
    label: "FVKD",
    detail: "Federación Venezolana de Karate Do · Nacional",
  },
  { value: "NON_APPROVED", label: "No aprobado" },
  { value: "UNSPECIFIED", label: "Sin aprobación especificada" },
];

const categoryOrder = ["karategis", "protecciones", "cinturones", "accesorios"];

function getCategoryOrder(category: Category): number {
  const index = categoryOrder.indexOf(category.id);

  return index === -1 ? categoryOrder.length : index;
}

function getApprovalLabel(value: ApprovalLevel | "ALL"): string {
  return approvalOptions.find((option) => option.value === value)?.label ?? "Todas";
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function FilterSection({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            {title}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-neutral-950">{value}</p>
        </div>

        <ChevronIcon className="size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="border-t border-black/10 bg-neutral-50/70 p-2.5">{children}</div>
    </details>
  );
}

export function CatalogFilters({
  filters,
  brands,
  categories,
  products,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const activeProductBrandIds = new Set(
    products.filter((product) => product.active).map((product) => product.brandId),
  );

  const activeBrands = brands
    .filter((brand) => brand.active && activeProductBrandIds.has(brand.id))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const activeCategories = categories.filter((category) => category.active);

  const topLevelCategories = activeCategories
    .filter((category) => category.parentId === null)
    .sort((a, b) => {
      const orderDifference = getCategoryOrder(a) - getCategoryOrder(b);
      return orderDifference || a.name.localeCompare(b.name, "es");
    });

  const selectedBrandName =
    filters.brandId === "ALL"
      ? "Todas las marcas"
      : (activeBrands.find((brand) => brand.id === filters.brandId)?.name ?? "Todas las marcas");

  const selectedCategoryName =
    filters.categoryId === "ALL"
      ? "Todo el equipamiento"
      : (activeCategories.find((category) => category.id === filters.categoryId)?.name ??
        "Todo el equipamiento");

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <div className="border-b border-black/8 pb-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950">
            Filtrar productos
          </h2>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-neutral-500 transition-colors hover:text-[#b31322]"
          >
            Limpiar
          </button>
        </div>

        <p className="mt-1 text-xs leading-5 text-neutral-500">Marca, categoría y aprobación.</p>
      </div>

      <div className="mt-4 space-y-3">
        <FilterSection title="Marcas" value={selectedBrandName}>
          <div className="space-y-2">
            <button
              type="button"
              aria-pressed={filters.brandId === "ALL"}
              onClick={() => onChange({ ...filters, brandId: "ALL" })}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                filters.brandId === "ALL"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Todas las marcas
            </button>

            {activeBrands.map((brand) => {
              const categoryIds = new Set(
                products
                  .filter((product) => product.active && product.brandId === brand.id)
                  .map((product) => product.categoryId),
              );

              const brandCategories = activeCategories
                .filter((category) => categoryIds.has(category.id))
                .sort((a, b) => a.name.localeCompare(b.name, "es"));

              const brandSelected = filters.brandId === brand.id;

              return (
                <details
                  key={brand.id}
                  className="group/brand overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{brand.name}</span>
                    <ChevronIcon
                      className={`size-4 transition-transform duration-200 group-open/brand:rotate-180 ${
                        brandSelected ? "text-[#b31322]" : "text-neutral-400"
                      }`}
                    />
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      aria-pressed={brandSelected && filters.categoryId === "ALL"}
                      onClick={() => onChange({ ...filters, brandId: brand.id, categoryId: "ALL" })}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        brandSelected && filters.categoryId === "ALL"
                          ? "bg-neutral-950 font-semibold text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                      }`}
                    >
                      Todos los productos
                    </button>

                    {brandCategories.map((category) => {
                      const selected = brandSelected && filters.categoryId === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              brandId: brand.id,
                              categoryId: category.id,
                            })
                          }
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            selected
                              ? "bg-neutral-950 font-semibold text-white"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                          }`}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Categorías" value={selectedCategoryName}>
          <div className="space-y-2">
            <button
              type="button"
              aria-pressed={filters.categoryId === "ALL"}
              onClick={() => onChange({ ...filters, categoryId: "ALL" })}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                filters.categoryId === "ALL"
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Todo el equipamiento
            </button>

            {topLevelCategories.map((parent) => {
              const children = activeCategories
                .filter((category) => category.parentId === parent.id)
                .sort((a, b) => a.name.localeCompare(b.name, "es"));

              const selectedInGroup =
                filters.categoryId === parent.id ||
                children.some((child) => child.id === filters.categoryId);

              return (
                <details
                  key={parent.id}
                  className="group/category overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{parent.name}</span>
                    <ChevronIcon
                      className={`size-4 transition-transform duration-200 group-open/category:rotate-180 ${
                        selectedInGroup ? "text-[#b31322]" : "text-neutral-400"
                      }`}
                    />
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      aria-pressed={filters.categoryId === parent.id}
                      onClick={() => onChange({ ...filters, categoryId: parent.id })}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        filters.categoryId === parent.id
                          ? "bg-neutral-950 font-semibold text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                      }`}
                    >
                      Todos
                    </button>

                    {children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        aria-pressed={filters.categoryId === child.id}
                        onClick={() => onChange({ ...filters, categoryId: child.id })}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          filters.categoryId === child.id
                            ? "bg-neutral-950 font-semibold text-white"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                        }`}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Aprobación" value={getApprovalLabel(filters.approval)}>
          <div className="grid gap-2">
            {approvalOptions.map((option) => {
              const selected = filters.approval === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ ...filters, approval: option.value })}
                  className={`rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-neutral-950 text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  {option.detail ? (
                    <span
                      className={`mt-0.5 block text-[11px] leading-4 ${
                        selected ? "text-white/65" : "text-neutral-500"
                      }`}
                    >
                      {option.detail}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
          <p className="text-xs font-semibold text-amber-900">Disponibilidad por confirmar</p>
          <p className="mt-1 text-xs leading-5 text-amber-800/80">
            Se valida al momento de realizar la consulta por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
