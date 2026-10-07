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

const approvalOptions: Array<{
  value: ApprovalLevel | "ALL";
  label: string;
}> = [
  {
    value: "ALL",
    label: "Todas las homologaciones",
  },
  {
    value: "WKF",
    label: "WKF · World Karate Federation",
  },
  {
    value: "NATIONAL",
    label: "FVKD · Aprobación nacional",
  },
  {
    value: "NON_APPROVED",
    label: "No aprobado",
  },
  {
    value: "UNSPECIFIED",
    label: "Sin homologación especificada",
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

        <label className="block">
          <span className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Categoría
          </span>

          <select
            value={filters.categoryId}
            onChange={(event) =>
              onChange({
                ...filters,
                categoryId: event.target.value,
              })
            }
            className="mt-2 min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-950"
          >
            <option value="ALL">Todo el equipamiento</option>

            {topLevelCategories.map((parent) => {
              const children = categories
                .filter((category) => category.active && category.parentId === parent.id)
                .sort((a, b) => a.name.localeCompare(b.name, "es"));

              return (
                <optgroup key={parent.id} label={parent.name}>
                  <option value={parent.id}>Todos: {parent.name}</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        <fieldset>
          <legend className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Homologación
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
                  className={`min-h-10 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                    selected
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {option.label}
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
