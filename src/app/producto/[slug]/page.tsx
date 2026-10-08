import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApprovalBadge } from "@/components/product/approval-badge";
import { AvailabilityBadge } from "@/components/product/availability-badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { catalogRepository } from "@/lib/catalog/static-repository";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ParsedFeature = {
  label: string | null;
  value: string;
};

export const dynamicParams = false;

function parseFeature(feature: string): ParsedFeature {
  const separatorIndex = feature.indexOf(":");

  if (separatorIndex <= 0) {
    return {
      label: null,
      value: feature,
    };
  }

  return {
    label: feature.slice(0, separatorIndex).trim(),
    value: feature.slice(separatorIndex + 1).trim(),
  };
}

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
  const parsedFeatures = product.features.map(parseFeature);

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
        <div className="contents lg:block lg:min-w-0">
          <ProductGallery images={product.images} productName={product.name} />

          {parsedFeatures.length > 0 || product.approvalNote ? (
            <section className="order-3 border-t border-black/10 pt-7 lg:order-none lg:mt-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                Características
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                Información del producto:
              </h2>

              {parsedFeatures.length > 0 ? (
                <dl className="mt-5 divide-y divide-black/8 border-y border-black/8">
                  {parsedFeatures.map((feature, index) => (
                    <div
                      key={`${feature.label ?? "feature"}-${feature.value}-${index}`}
                      className="grid gap-1 py-3.5 sm:grid-cols-[minmax(120px,0.34fr)_minmax(0,1fr)] sm:gap-5"
                    >
                      {feature.label ? (
                        <dt className="text-xs font-semibold tracking-[0.08em] text-neutral-400 uppercase">
                          {feature.label}
                        </dt>
                      ) : (
                        <dt className="sr-only">Característica</dt>
                      )}

                      <dd className="text-sm leading-6 text-neutral-700">{feature.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {product.approvalNote ? (
                <div className="mt-5 rounded-2xl border border-black/10 bg-neutral-50 p-4">
                  <p className="text-sm leading-6 text-neutral-600">
                    <span className="font-semibold text-neutral-950">
                      Información sobre aprobación:
                    </span>{" "}
                    {product.approvalNote}
                  </p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <div className="order-2 lg:sticky lg:top-28 lg:order-none">
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
            <ProductPurchasePanel
              productId={product.id}
              productName={product.name}
              sku={product.sku}
              brandName={brand?.name ?? "Marca"}
              variants={product.variants}
              prices={product.prices}
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
    </main>
  );
}
