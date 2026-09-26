type CatalogEmptyStateProps = {
  onClear: () => void;
};

export function CatalogEmptyState({ onClear }: CatalogEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <p className="text-sm font-semibold tracking-[0.16em] text-neutral-400 uppercase">
        Sin resultados
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
        No encontramos productos con esos criterios.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600">
        Prueba cambiando la búsqueda o quitando alguno de los filtros aplicados.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 min-h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b31322]"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
