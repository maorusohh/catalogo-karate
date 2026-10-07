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
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgb(255_255_255_/_0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

        <Container>
          <div className="relative grid gap-10 py-14 sm:py-18 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end lg:py-20">
            <div className="max-w-4xl">
              <p className="eyebrow text-[#ef5a68]">Catálogo · Equipamiento</p>

              <h1 className="heading-display heading-display-on-dark mt-6 max-w-4xl">
                Encuentra el equipo adecuado para tu práctica.
              </h1>

              <p className="text-lead text-lead-on-dark mt-7 max-w-2xl">
                Explora por marca, categoría y aprobación. Selecciona lo que necesitas y prepara tu
                consulta con la información comercial disponible.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-black/20">
              <div className="bg-[#191919]/95 px-4 py-5 sm:px-5">
                <p className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                  {activeProductCount}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/38 uppercase">
                  Productos
                </p>
              </div>

              <div className="bg-[#191919]/95 px-4 py-5 sm:px-5">
                <p className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                  {activeBrandCount}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/38 uppercase">
                  Marcas
                </p>
              </div>

              <div className="bg-[#191919]/95 px-4 py-5 sm:px-5">
                <p className="text-2xl font-semibold tracking-tight text-white">WA</p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/38 uppercase">
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
