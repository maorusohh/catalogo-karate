import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getProductsByCategory } from "@/lib/catalog/scoped";
import { catalogRepository } from "@/lib/catalog/static-repository";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora las categorías principales del catálogo de equipamiento de Karate-Do.",
};

export default function CategoriesPage() {
  const categories = catalogRepository.getCategories();
  const products = catalogRepository.getProducts();
  const rootCategories = categories.filter((category) => !category.parentId);

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
                eyebrow="Categorías"
                title="Explora por tipo de equipamiento."
                description="Empieza por una categoría principal y entra después en sus subcategorías cuando estén disponibles."
              />

              <div className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-600">
                {rootCategories.length} categorías principales
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            {rootCategories.map((category, index) => {
              const children = categories.filter((item) => item.parentId === category.id);
              const categoryProducts = getProductsByCategory(products, category.id, categories);

              return (
                <Surface key={category.id} className="p-6 sm:p-7 lg:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--ck-red)]">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950">
                        <Link
                          href={`/categoria/${category.slug}`}
                          className="transition-colors hover:text-[var(--ck-red)]"
                        >
                          {category.name}
                        </Link>
                      </h2>
                    </div>

                    <Link
                      href={`/categoria/${category.slug}`}
                      aria-label={`Explorar ${category.name}`}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all duration-200 hover:border-[var(--ck-red)] hover:bg-[var(--ck-red)] hover:text-white"
                    >
                      ↗
                    </Link>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500">
                    {category.description}
                  </p>

                  {children.length > 0 ? (
                    <div className="mt-7 flex flex-wrap gap-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categoria/${child.slug}`}
                          className="inline-flex min-h-9 items-center rounded-full border border-black/10 bg-white px-3.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-7 border-t border-black/8 pt-5 text-xs font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                    {categoryProducts.length} {categoryProducts.length === 1 ? "producto" : "productos"}
                  </p>
                </Surface>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
