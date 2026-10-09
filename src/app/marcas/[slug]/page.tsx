import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandLogo } from "@/components/catalog/brand-logo";
import { ScopedProductGrid } from "@/components/catalog/scoped-product-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getProductsByBrand } from "@/lib/catalog/scoped";
import { catalogRepository } from "@/lib/catalog/static-repository";

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return catalogRepository
    .getBrands()
    .filter((brand) => brand.active)
    .map((brand) => ({
      slug: brand.slug,
    }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = catalogRepository.getBrandBySlug(slug);

  if (!brand) {
    return {};
  }

  const description =
    brand.description || `Explora productos de ${brand.name} en el catálogo de Karate-Do.`;
  const canonical = `/marcas/${brand.slug}/`;

  return {
    title: brand.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: brand.name,
      description,
      images: brand.logo
        ? [
            {
              url: brand.logo,
              alt: `Logo de ${brand.name}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: brand.name,
      description,
      images: brand.logo ? [brand.logo] : undefined,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = catalogRepository.getBrandBySlug(slug);

  if (!brand || !brand.active) {
    notFound();
  }

  const products = getProductsByBrand(catalogRepository.getProducts(), brand.id);
  const brands = catalogRepository.getBrands();
  const categories = catalogRepository.getCategories();

  const brandNames = Object.fromEntries(brands.map((item) => [item.id, item.name]));
  const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));

  return (
    <main>
      <section className="border-b border-black/5">
        <Container>
          <div className="py-14 sm:py-18 lg:py-20">
            <Link
              href="/marcas"
              className="inline-flex text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase transition-colors hover:text-neutral-950"
            >
              ← Volver a marcas
            </Link>

            <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <BrandLogo
                  src={brand.logo}
                  name={brand.name}
                  className="h-24 w-52 shrink-0 rounded-3xl border border-black/10 shadow-sm sm:h-28 sm:w-60"
                  sizes="240px"
                />

                <SectionHeading
                  eyebrow="Marca"
                  title={brand.name}
                  description={brand.description}
                />
              </div>

              <div className="shrink-0">
                <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-600">
                  {products.length} {products.length === 1 ? "producto" : "productos"}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                Selección
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                Productos de {brand.name}
              </h2>
            </div>

            <Surface
              variant="soft"
              className="px-4 py-3 text-xs leading-5 text-neutral-600 sm:max-w-sm"
            >
              Revisa cada producto y entra en su ficha para consultar variantes, disponibilidad y
              preparar tu selección.
            </Surface>
          </div>

          <div className="mt-8">
            <ScopedProductGrid
              products={products}
              brandNames={brandNames}
              categoryNames={categoryNames}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
