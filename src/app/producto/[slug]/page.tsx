import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { catalogRepository } from "@/lib/catalog/static-repository";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogRepository.getProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = catalogRepository.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = catalogRepository.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-neutral-950">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">Producto</p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{product.name}</h1>

        <p className="mt-4 text-neutral-600">{product.description}</p>

        <div className="mt-8 rounded-2xl border border-neutral-200 p-5">
          <p>
            <strong>SKU:</strong> {product.sku}
          </p>

          <p className="mt-2">
            <strong>Aprobación:</strong> {product.approval}
          </p>

          <p className="mt-2">
            <strong>Disponibilidad:</strong> {product.availability}
          </p>

          <h2 className="mt-6 text-lg font-semibold">Variantes</h2>

          <div className="mt-3 space-y-2">
            {product.variants.map((variant) => (
              <div key={variant.id} className="rounded-xl bg-neutral-50 p-3">
                <p className="font-medium">{variant.label}</p>

                <p className="mt-1 text-sm text-neutral-500">
                  {variant.options.map((option) => `${option.name}: ${option.value}`).join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-6 text-lg font-semibold">Precio</h2>

          <div className="mt-3 space-y-2">
            {product.prices.map((price, index) => (
              <div key={`${product.id}-price-${index}`} className="rounded-xl bg-neutral-50 p-3">
                <p className="font-medium">{price.label}</p>

                {price.note ? <p className="mt-1 text-sm text-neutral-500">{price.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
