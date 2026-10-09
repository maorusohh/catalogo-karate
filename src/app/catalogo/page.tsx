import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog/catalog-client";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
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
          <div className="py-14 sm:py-18 lg:py-20">
            <SectionHeading
              eyebrow="Equipamiento"
              title="Explora el catálogo."
              description="Encuentra productos por nombre, marca, categoría o aprobación. La información comercial definitiva se confirma al momento de la consulta."
            />
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12 lg:py-14">
        <Container>
          <CatalogClient products={products} brands={brands} categories={categories} />
        </Container>
      </section>
    </main>
  );
}
