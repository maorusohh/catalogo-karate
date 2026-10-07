import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/catalog/brand-logo";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getProductsByBrand } from "@/lib/catalog/scoped";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Explora las marcas disponibles en el catálogo de equipamiento de Karate-Do.",
};

export default function BrandsPage() {
  const brands = catalogRepository.getBrands();
  const products = catalogRepository.getProducts();

  return (
    <main>
      <section className="border-b border-black/5">
        <Container>
          <div className="py-14 sm:py-18 lg:py-20">
            <Link
              href="/catalogo"
              className="inline-flex text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase transition-colors hover:text-neutral-950"
            >
              ← Volver al catálogo
            </Link>

            <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="Marcas"
                title="Explora por marca."
                description="Accede directamente al equipamiento disponible de cada marca activa en el catálogo."
              />

              <div className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-600">
                {brands.length} {brands.length === 1 ? "marca" : "marcas"}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => {
              const brandProducts = getProductsByBrand(products, brand.id);

              return (
                <Link key={brand.id} href={`/marca/${brand.slug}`} className="group block h-full">
                  <Surface className="flex h-full flex-col p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--ck-shadow-md)] sm:p-7">
                    {brand.logo ? (
                      <BrandLogo
                        src={brand.logo}
                        name={brand.name}
                        className="h-20 w-40 rounded-2xl border border-black/8"
                        sizes="160px"
                      />
                    ) : (
                      <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-black/8 bg-neutral-50 px-4 text-center text-sm font-semibold text-neutral-500">
                        {brand.name}
                      </div>
                    )}

                    <div className="mt-8 flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                          {brand.name}
                        </h2>

                        <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all duration-200 group-hover:border-[var(--ck-red)] group-hover:bg-[var(--ck-red)] group-hover:text-white"
                        >
                          ↗
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
                        {brand.description || `Explora productos disponibles de ${brand.name}.`}
                      </p>

                      <p className="mt-auto pt-7 text-xs font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                        {brandProducts.length}{" "}
                        {brandProducts.length === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                  </Surface>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
