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

  const activeProductCount = products.filter((product) => product.active).length;
  const activeBrandCount = brands.filter((brand) => brand.active).length;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/8 bg-[#151515] text-white">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(255_255_255_/_0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.07)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_95%)] [background-size:44px_44px] opacity-16" />

        <Container>
          <div className="relative grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-14">
            <div className="max-w-3xl">
              <p className="eyebrow text-[#ef5a68]">Catálogo — Equipamiento</p>

              <h1 className="mt-5 max-w-3xl text-4xl leading-[1.03] font-semibold tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
                Encuentra el equipo adecuado para tu práctica.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
                Explora por marca, categoría y aprobación. Selecciona lo que necesitas y prepara tu
                consulta con la información comercial disponible.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-4 text-sm lg:max-w-sm lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <div>
                <p className="font-semibold text-white tabular-nums">{activeProductCount}</p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.13em] text-white/36 uppercase">
                  Productos
                </p>
              </div>

              <div>
                <p className="font-semibold text-white tabular-nums">{activeBrandCount}</p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.13em] text-white/36 uppercase">
                  Marcas
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">WhatsApp</p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.13em] text-white/36 uppercase">
                  Consulta
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="site-section-tight">
        <Container>
          <CatalogClient products={products} brands={brands} categories={categories} />
        </Container>
      </section>
    </main>
  );
}
