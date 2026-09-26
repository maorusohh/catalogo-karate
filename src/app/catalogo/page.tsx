import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog/catalog-client";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora equipamiento de Karate-Do por producto, marca, categoría, aprobación y disponibilidad.",
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
          Encuentra productos por nombre, marca, categoría, aprobación o disponibilidad. La
          información comercial definitiva se confirma al momento de la consulta.
        </p>
      </div>

      <CatalogClient products={products} brands={brands} categories={categories} />
    </main>
  );
}
