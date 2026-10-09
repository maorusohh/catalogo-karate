"use client";

type CatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CatalogSearch({ value, onChange }: CatalogSearchProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-500">Buscar productos</span>

      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 text-neutral-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>

        <input
          type="search"
          value={value}
          onInput={(event) => onChange(event.currentTarget.value)}
          placeholder="Buscar por nombre, marca, categoría o SKU"
          className="min-h-13 w-full rounded-2xl border border-black/12 bg-white pr-4 pl-12 text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-950"
        />
      </span>
    </label>
  );
}
