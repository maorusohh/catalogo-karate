import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApprovalBadge } from "@/components/product/approval-badge";
import { AvailabilityBadge } from "@/components/product/availability-badge";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductGallery } from "@/components/product/product-gallery";
import { catalogRepository } from "@/lib/catalog/static-repository";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";

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

  const brand = catalogRepository.getBrands().find((item) => item.id === product.brandId);

  const category = catalogRepository.getCategories().find((item) => item.id === product.categoryId);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <nav aria-label="Migas de pan" className="text-sm text-neutral-500">
        <Link href="/catalogo" className="transition-colors hover:text-neutral-950">
          Catálogo
        </Link>

        <span className="mx-2 text-neutral-300">/</span>

        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-14">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="lg:sticky lg:top-28">
          <div className="flex flex-wrap gap-2">
            {brand ? (
              <span className="inline-flex min-h-8 items-center rounded-full bg-neutral-950 px-3 text-xs font-semibold text-white">
                {brand.name}
              </span>
            ) : null}

            {category ? (
              <span className="inline-flex min-h-8 items-center rounded-full bg-neutral-100 px-3 text-xs font-semibold text-neutral-600">
                {category.name}
              </span>
            ) : null}

            <ApprovalBadge approval={product.approval} />
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-base leading-7 text-neutral-600">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">
              SKU {product.sku}
            </p>

            <AvailabilityBadge availability={product.availability} />
          </div>

          <div className="mt-8 border-y border-black/10 py-7">
            <PriceDisplay prices={product.prices} />
          </div>

          <div className="mt-8">
            <ProductPurchasePanel
              productId={product.id}
              productName={product.name}
              sku={product.sku}
              brandName={brand?.name ?? "Marca"}
              variants={product.variants}
            />
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold">¿Necesitas confirmar algo antes de comprar?</p>

            <p className="mt-2 text-sm leading-6 text-white/60">
              La disponibilidad, precio y condiciones comerciales se confirman durante la consulta.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-black/10 pt-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            Características
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            Información del producto
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text-sm leading-6 text-neutral-700">{feature}</p>
            </div>
          ))}
        </div>

        {product.approvalNote ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <p className="text-sm leading-6 text-neutral-600">
              <span className="font-semibold text-neutral-950">Información sobre aprobación:</span>{" "}
              {product.approvalNote}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
