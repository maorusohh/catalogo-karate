import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/catalog/brand-logo";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Explora las marcas disponibles en el catálogo de Karate-Do.",
};

export default function BrandsPage() {
  const brands = catalogRepository.getBrands().filter((brand) => brand.active);
  const products = catalogRepository.getProducts().filter((product) => product.active);

  return (
    <main>
      <section className="border-b border-black/5">
        <Container>
          <div className="py-14 sm:py-18 lg:py-20">
            <SectionHeading
              eyebrow="Marcas"
              title="Marcas del catálogo"
              description="Explora cada marca y revisa sus productos disponibles en el catálogo."
            />
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => {
              const productCount = products.filter((product) => product.brandId === brand.id).length;

              return (
                <Link key={brand.id} href={`/marca/${brand.slug}`} className="group block">
                  <article className="h-full rounded-3xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-transform duration-200 group-hover:-translate-y-1">
                    <div className="flex min-h-36 items-center justify-center rounded-2xl bg-neutral-50 px-5 py-6">
                      {brand.logo ? (
                        <BrandLogo
                          src={brand.logo}
                          name={brand.name}
                          className="h-24 w-full max-w-[280px]"
                          sizes="280px"
                        />
                      ) : (
                        <span className="text-2xl font-semibold tracking-tight text-neutral-950">
                          {brand.name}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                          Marca
                        </p>

                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                          {brand.name}
                        </h2>
                      </div>

                      <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                        {productCount} {productCount === 1 ? "producto" : "productos"}
                      </span>
                    </div>

                    {brand.description ? (
                      <p className="mt-3 text-sm leading-6 text-neutral-500">{brand.description}</p>
                    ) : null}
                  </article>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
