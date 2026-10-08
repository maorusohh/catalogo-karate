import Link from "next/link";

import { BrandLogo } from "@/components/catalog/brand-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { Brand, Product } from "@/types/catalog";

type HomeBrandsSectionProps = {
  brands: Brand[];
  products: Product[];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function HomeBrandsSection({ brands, products }: HomeBrandsSectionProps) {
  const brandsWithProducts = brands
    .map((brand) => ({
      brand,
      productCount: products.filter((product) => product.brandId === brand.id).length,
    }))
    .filter((item) => item.productCount > 0)
    .sort((a, b) => a.brand.name.localeCompare(b.brand.name, "es"));

  if (brandsWithProducts.length === 0) {
    return null;
  }

  return (
    <section className="site-section border-t border-black/6 bg-neutral-50/60">
      <Container>
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Marcas"
            title="Encuentra el equipamiento por la marca que prefieres."
            description="Explora las marcas disponibles y entra directamente a sus productos, precios y opciones comerciales."
          />

          <ButtonLink href="/marcas" variant="ghost" size="md" className="shrink-0 font-semibold">
            Ver todas las marcas
            <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandsWithProducts.map(({ brand, productCount }) => (
            <Link key={brand.id} href={`/marcas/${brand.slug}`} className="group">
              <Surface className="flex h-full items-center gap-5 p-5 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--ck-shadow-md)] sm:p-6">
                {brand.logo ? (
                  <BrandLogo
                    src={brand.logo}
                    name={brand.name}
                    className="h-16 w-24 shrink-0 rounded-2xl border border-black/8"
                    sizes="96px"
                  />
                ) : (
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-black tracking-[0.08em] text-white">
                    {getInitials(brand.name)}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-[var(--ck-red)]">
                    {brand.name}
                  </p>

                  <p className="mt-1 text-xs font-medium text-neutral-400">
                    {productCount} {productCount === 1 ? "producto" : "productos"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                    {brand.description || `Explora los productos disponibles de ${brand.name}.`}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all group-hover:border-[var(--ck-red)] group-hover:bg-[var(--ck-red)] group-hover:text-white"
                >
                  →
                </span>
              </Surface>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
