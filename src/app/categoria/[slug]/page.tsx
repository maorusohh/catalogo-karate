import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScopedProductGrid } from "@/components/catalog/scoped-product-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getProductsByCategory } from "@/lib/catalog/scoped";
import { catalogRepository } from "@/lib/catalog/static-repository";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogRepository
    .getCategories()
    .filter((category) => category.active)
    .map((category) => ({
      slug: category.slug,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = catalogRepository.getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  const description =
    category.description ||
    `Explora equipamiento de ${category.name} en el catálogo de Karate-Do.`;
  const canonical = `/categoria/${category.slug}/`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: category.name,
      description,
    },
    twitter: {
      card: "summary",
      title: category.name,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = catalogRepository.getCategoryBySlug(slug);

  if (!category || !category.active) {
    notFound();
  }

  const categories = catalogRepository.getCategories();

  const products = getProductsByCategory(catalogRepository.getProducts(), category.id, categories);

  const brands = catalogRepository.getBrands();

  const brandNames = Object.fromEntries(brands.map((brand) => [brand.id, brand.name]));

  const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));

  const children = categories.filter((item) => item.active && item.parentId === category.id);

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
                eyebrow="Categoría"
                title={category.name}
                description={category.description}
              />

              <div className="shrink-0">
                <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-600">
                  {products.length} {products.length === 1 ? "producto" : "productos"}
                </div>
              </div>
            </div>

            {children.length > 0 ? (
              <div className="mt-9 flex flex-wrap gap-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/categoria/${child.slug}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            ) : null}
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
                Productos de {category.name}
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
