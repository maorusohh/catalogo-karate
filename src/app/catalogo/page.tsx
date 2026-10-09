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
          <div className="pt-12 pb-8 sm:pt-14 sm:pb-10 lg:pt-18 lg:pb-12">
            <SectionHeading
              eyebrow="Equipamiento"
              title="Explora el catálogo"
              description="Encuentra productos por nombre, marca, categoría o aprobación. La información comercial definitiva se confirma al momento de la consulta."
            />
          </div>
        </Container>
      </section>

      <section className="pt-5 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          <CatalogClient products={products} brands={brands} categories={categories} />
        </Container>
      </section>
    </main>
  );
}
