import type { Metadata } from "next";
import Link from "next/link";

import { CatalogClient } from "@/components/catalog/catalog-client";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora equipamiento de Karate-Do por producto, marca, categoría y aprobación.",
};

export default function CatalogoPage() {
  const products = catalogRepository.getProducts();
  const brands = catalogRepository.getBrands();
  const categories = catalogRepository.getCategories();

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#b31322] uppercase">
          Equipamiento
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-5xl">
          Explora el catálogo.
        </h1>

        <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">
          Encuentra productos por nombre, marca, categoría o aprobación. La información comercial
          definitiva se confirma al momento de la consulta.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/marca"
            className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
          >
            Ver marcas
          </Link>

          <Link
            href="/categoria"
            className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
          >
            Ver categorías
          </Link>
        </div>
      </div>

      <CatalogClient products={products} brands={brands} categories={categories} />
    </main>
  );
}
