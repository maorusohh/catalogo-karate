import type { CatalogSort } from "@/lib/catalog/queries";

type CatalogSortProps = {
  value: CatalogSort;
  onChange: (value: CatalogSort) => void;
};

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  return (
    <label className="flex min-w-0 items-center gap-3 text-sm">
      <span className="shrink-0 font-medium text-neutral-500">Ordenar</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CatalogSort)}
        className="min-h-11 min-w-0 rounded-full border border-black/10 bg-white px-4 text-sm font-medium text-neutral-950 outline-none focus:border-neutral-950"
      >
        <option value="featured">Destacados</option>
        <option value="name-asc">Nombre A-Z</option>
        <option value="name-desc">Nombre Z-A</option>
        <option value="price-asc">Precio menor a mayor</option>
        <option value="price-desc">Precio mayor a menor</option>
      </select>
    </label>
  );
}
