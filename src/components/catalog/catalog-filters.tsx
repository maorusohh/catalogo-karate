"use client";

import type { ApprovalLevel, AvailabilityStatus, Brand, Category } from "@/types/catalog";

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
    label: "Todas",
  },
  {
    value: "WKF",
    label: "WKF",
  },
  {
    value: "NATIONAL",
    label: "Nacional",
  },
  {
    value: "NON_APPROVED",
    label: "No aprobado",
  },
  {
    value: "UNSPECIFIED",
    label: "Por confirmar",
  },
];

const availabilityOptions: Array<{
  value: AvailabilityStatus | "ALL";
  label: string;
}> = [
  {
    value: "ALL",
    label: "Todas",
  },
  {
    value: "AVAILABLE",
    label: "Disponible",
  },
  {
    value: "CONSULT",
    label: "Consultar",
  },
  {
    value: "OUT_OF_STOCK",
    label: "Agotado",
  },
  {
    value: "COMING_SOON",
    label: "Próximamente",
  },
];

export function CatalogFilters({
  filters,
  brands,
  categories,
  onChange,
  onReset,
}: CatalogFiltersProps) {
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

            {brands.map((brand) => (
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
            <option value="ALL">Todas las categorías</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

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
                  className={`min-h-10 rounded-xl px-3 text-left text-sm font-medium transition-colors ${
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

        <fieldset>
          <legend className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            Disponibilidad
          </legend>

          <div className="mt-3 grid gap-2">
            {availabilityOptions.map((option) => {
              const selected = filters.availability === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      availability: option.value,
                    })
                  }
                  className={`min-h-10 rounded-xl px-3 text-left text-sm font-medium transition-colors ${
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
      </div>
    </div>
  );
}
