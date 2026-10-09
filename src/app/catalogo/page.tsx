import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog/catalog-client";
import { Container } from "@/components/ui/container";
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
    <main>
      <section className="border-b border-black/5">
        <Container>
          <div className="pt-12 pb-9 sm:pt-14 sm:pb-11 lg:pt-16 lg:pb-12">
            <div className="max-w-2xl">
              <p className="eyebrow">Equipamiento</p>

              <h1 className="heading-section mt-6">Explora el catálogo</h1>

              <p className="text-lead mt-7">
                Encuentra productos por nombre, marca, categoría o aprobación. La información
                comercial definitiva se confirma al momento de la consulta.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-7 pb-10 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-14">
        <Container>
          <CatalogClient products={products} brands={brands} categories={categories} />
        </Container>
      </section>
    </main>
  );
}
