import type { CatalogSort } from "@/lib/catalog/queries";

type CatalogSortProps = {
  value: CatalogSort;
  onChange: (value: CatalogSort) => void;
};

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-medium text-neutral-500">Ordenar por</span>

      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as CatalogSort)}
          className="min-h-13 w-full appearance-none rounded-2xl border border-black/12 bg-white pr-11 pl-4 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-950 lg:min-w-56"
        >
          <option value="featured">Destacados</option>
          <option value="name-asc">Nombre: A–Z</option>
          <option value="name-desc">Nombre: Z–A</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </span>
      </span>
    </label>
  );
}
