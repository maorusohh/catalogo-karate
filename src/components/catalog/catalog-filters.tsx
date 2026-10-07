"use client";

import type { ApprovalLevel, Brand, Category } from "@/types/catalog";

import type { CatalogFilters as CatalogFiltersState } from "@/lib/catalog/queries";

type CatalogFiltersProps = {
  filters: CatalogFiltersState;
  brands: Brand[];
  categories: Category[];
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
    detail: "Aprobación nacional",
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

export function CatalogFilters({
  filters,
  brands,
  categories,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const topLevelCategories = categories
    .filter((category) => category.active && category.parentId === null)
    .sort((a, b) => {
      const orderDifference = getCategoryOrder(a) - getCategoryOrder(b);

      return orderDifference || a.name.localeCompare(b.name, "es");
    });

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold tracking-[0.16em] text-neutral-950 uppercase">
          Filtros
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-neutral-500 transition-colors hover:text-[#b31322]"
        >
          Limpiar
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <label className="block">
          <span className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Marca
          </span>

          <select
            value={filters.brandId}
            onChange={(event) =>
              onChange({
                ...filters,
                brandId: event.target.value,
              })
            }
            className="mt-2 min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-950"
          >
            <option value="ALL">Todas las marcas</option>

            {brands
              .filter((brand) => brand.active)
              .sort((a, b) => a.name.localeCompare(b.name, "es"))
              .map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Categoría
          </legend>

          <div className="mt-3 space-y-2">
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
              const children = categories
                .filter((category) => category.active && category.parentId === parent.id)
                .sort((a, b) => a.name.localeCompare(b.name, "es"));
              const selectedInGroup =
                filters.categoryId === parent.id ||
                children.some((child) => child.id === filters.categoryId);

              return (
                <details
                  key={`${parent.id}:${selectedInGroup ? "selected" : "idle"}`}
                  className="overflow-hidden rounded-xl border border-black/8 bg-white"
                  open={selectedInGroup}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{parent.name}</span>
                    <span aria-hidden="true" className="text-neutral-400">
                      +
                    </span>
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
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Aprobación
          </legend>

          <div className="mt-3 grid gap-2">
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
                  className={`min-h-10 rounded-xl px-3 py-2 text-left transition-colors ${
                    selected
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  {option.detail ? (
                    <span
                      className={`mt-0.5 block text-[11px] ${
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
        </fieldset>

        <p className="rounded-2xl bg-neutral-50 px-3 py-3 text-xs leading-5 text-neutral-500">
          La disponibilidad se confirma al momento de la consulta por WhatsApp.
        </p>
      </div>
    </div>
  );
}
