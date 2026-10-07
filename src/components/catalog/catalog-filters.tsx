"use client";

import type { ApprovalLevel, Brand, Category, Product } from "@/types/catalog";

import type { CatalogFilters as CatalogFiltersState } from "@/lib/catalog/queries";

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
  {
    value: "ALL",
    label: "Todas",
  },
  {
    value: "WKF",
    label: "WKF",
    detail: "World Karate Federation",
  },
  {
    value: "NATIONAL",
    label: "FVKD",
    detail: "Federación Venezolana de Karate Do",
  },
  {
    value: "NON_APPROVED",
    label: "No aprobado",
  },
  {
    value: "UNSPECIFIED",
    label: "Sin aprobación especificada",
  },
];

const categoryOrder = ["karategis", "protecciones", "cinturones", "accesorios"];

function getCategoryOrder(category: Category): number {
  const index = categoryOrder.indexOf(category.id);

  return index === -1 ? categoryOrder.length : index;
}

function getApprovalLabel(value: ApprovalLevel | "ALL"): string {
  return approvalOptions.find((option) => option.value === value)?.label ?? "Todas";
}

function FilterSection({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">
            {title}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-neutral-950">{value}</p>
        </div>

        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>

      <div className="border-t border-black/8 p-2.5">{children}</div>
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
  const activeBrands = brands
    .filter((brand) => brand.active)
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
      : activeBrands.find((brand) => brand.id === filters.brandId)?.name ?? "Todas las marcas";

  const selectedCategoryName =
    filters.categoryId === "ALL"
      ? "Todo el equipamiento"
      : activeCategories.find((category) => category.id === filters.categoryId)?.name ??
        "Todo el equipamiento";

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-sm font-semibold tracking-[0.14em] text-neutral-950 uppercase">
            Filtros
          </h2>
          <p className="mt-1 text-xs text-neutral-400">Combina criterios para afinar tu búsqueda.</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-xs font-semibold text-neutral-500 transition-colors hover:text-[#b31322]"
        >
          Limpiar
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        <FilterSection title="Marca" value={selectedBrandName}>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  brandId: "ALL",
                })
              }
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                filters.brandId === "ALL"
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
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
                  className="overflow-hidden rounded-xl border border-black/8 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{brand.name}</span>
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${
                        brandSelected ? "bg-[#b31322]" : "bg-neutral-200"
                      }`}
                    />
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...filters,
                          brandId: brand.id,
                          categoryId: "ALL",
                        })
                      }
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

        <FilterSection title="Categoría" value={selectedCategoryName}>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  categoryId: "ALL",
                })
              }
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                filters.categoryId === "ALL"
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
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
                  className="overflow-hidden rounded-xl border border-black/8 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{parent.name}</span>
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${
                        selectedInGroup ? "bg-[#b31322]" : "bg-neutral-200"
                      }`}
                    />
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...filters,
                          categoryId: parent.id,
                        })
                      }
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
                        onClick={() =>
                          onChange({
                            ...filters,
                            categoryId: child.id,
                          })
                        }
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
          <div className="grid gap-1.5">
            {approvalOptions.map((option) => {
              const selected = filters.approval === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      approval: option.value,
                    })
                  }
                  className={`rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  {option.detail ? (
                    <span
                      className={`mt-0.5 block text-[11px] leading-4 ${
                        selected ? "text-white/60" : "text-neutral-400"
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

        <p className="rounded-2xl bg-neutral-50 px-3 py-3 text-xs leading-5 text-neutral-500">
          La disponibilidad se confirma al momento de la consulta por WhatsApp.
        </p>
      </div>
    </div>
  );
}
