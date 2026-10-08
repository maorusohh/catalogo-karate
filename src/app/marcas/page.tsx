import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/catalog/brand-logo";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Marcas",
  description:
    "Explora las marcas disponibles en el Catálogo Karate-Do y consulta sus productos, variantes y disponibilidad.",
};

export default function BrandsPage() {
  const brands = catalogRepository.getBrands();
  const products = catalogRepository.getProducts();

  const brandCards = brands
    .map((brand) => ({
      ...brand,
      productCount: products.filter((product) => product.brandId === brand.id).length,
    }))
    .filter((brand) => brand.productCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <main>
      <section className="border-b border-black/5">
        <Container>
          <div className="py-14 sm:py-18 lg:py-20">
            <SectionHeading
              eyebrow="Marcas"
              title="Explora el catálogo por marca."
              description="Accede directamente a cada marca disponible y revisa sus productos activos en un solo lugar."
            />
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brandCards.map((brand) => (
              <Link key={brand.id} href={`/marcas/${brand.slug}`} className="group">
                <Surface className="relative h-full overflow-hidden p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--ck-shadow-md)] sm:p-7">
                  <div className="flex min-h-28 items-center justify-between gap-5">
                    {brand.logo ? (
                      <BrandLogo
                        src={brand.logo}
                        name={brand.name}
                        className="h-20 w-40 rounded-2xl border border-black/8"
                        sizes="160px"
                      />
                    ) : (
                      <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-black/8 bg-neutral-50 px-4 text-center text-lg font-semibold tracking-tight text-neutral-700">
                        {brand.name}
                      </div>
                    )}

                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all duration-200 group-hover:border-[var(--ck-red)] group-hover:bg-[var(--ck-red)] group-hover:text-white"
                    >
                      →
                    </span>
                  </div>

                  <div className="mt-8 border-t border-black/7 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                          {brand.name}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-neutral-500">
                          {brand.description || `Productos disponibles de ${brand.name}.`}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-semibold text-neutral-600">
                        {brand.productCount} {brand.productCount === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
