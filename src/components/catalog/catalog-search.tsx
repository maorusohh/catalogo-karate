"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/catalog";

type CatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions: Product[];
  brandNames: Record<string, string>;
  totalMatches: number;
};

export function CatalogSearch({
  value,
  onChange,
  suggestions,
  brandNames,
  totalMatches,
}: CatalogSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showSuggestions = isOpen && value.trim().length >= 2 && suggestions.length > 0;

  return (
    <div
      className="relative"
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;

        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <label htmlFor="catalog-search" className="mb-2 block text-sm font-medium text-neutral-500">
        Buscar productos
      </label>

      <div className="relative">
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
          id="catalog-search"
          type="search"
          value={value}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          onInput={(event) => {
            onChange(event.currentTarget.value);
            setIsOpen(true);
          }}
          placeholder="Buscar por nombre, marca, categoría o SKU"
          aria-describedby="catalog-search-help"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? "catalog-search-suggestions" : undefined}
          className="min-h-13 w-full rounded-2xl border border-black/12 bg-white pr-4 pl-12 text-sm text-neutral-950 transition-colors outline-none placeholder:text-neutral-500 focus:border-neutral-950"
        />
      </div>

      <span id="catalog-search-help" className="sr-only">
        Escribe al menos dos caracteres para ver sugerencias de productos.
      </span>

      {showSuggestions ? (
        <div
          id="catalog-search-suggestions"
          data-testid="catalog-search-suggestions"
          aria-label="Sugerencias de productos"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[var(--ck-shadow-md)]"
        >
          <div className="divide-y divide-black/6">
            {suggestions.map((product) => {
              const image = product.images[0];

              return (
                <Link
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-black/8 bg-[var(--ck-surface-soft)]">
                    {image ? (
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] font-black tracking-tight text-neutral-500">
                        KD
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm leading-5 font-semibold text-neutral-950">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
                      {brandNames[product.brandId] ?? "Marca"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {totalMatches > suggestions.length ? (
            <p className="border-t border-black/6 px-3 py-2 text-xs text-neutral-500">
              Mostrando {suggestions.length} de {totalMatches} productos encontrados.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
