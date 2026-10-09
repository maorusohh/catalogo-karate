import Image from "next/image";
import Link from "next/link";

import type { ApprovalLevel, AvailabilityStatus, Product } from "@/types/catalog";

const approvalLabels: Record<ApprovalLevel, string> = {
  WKF: "WKF",
  NATIONAL: "Aprobación nacional",
  NON_APPROVED: "No aprobado",
  UNSPECIFIED: "Por confirmar",
};

const availabilityLabels: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Disponible",
  CONSULT: "Consultar disponibilidad",
  OUT_OF_STOCK: "Agotado",
  COMING_SOON: "Próximamente",
};

type ProductCardProps = {
  product: Product;
  brandName: string;
  categoryName: string;
};

export function ProductCard({ product, brandName, categoryName }: ProductCardProps) {
  const image = product.images[0];
  const primaryPrice = product.prices.find((price) => !price.variantId) ?? product.prices[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_10px_30px_rgb(23_23_23_/_0.045)] transition-all duration-200 hover:-translate-y-1 hover:border-black/12 hover:shadow-[var(--ck-shadow-md)]">
      <Link href={`/producto/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden border-b border-black/5 bg-[var(--ck-surface-soft)]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] sm:p-5"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div>
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-950 text-xs font-black tracking-tight text-white shadow-sm">
                  KD
                </span>

                <p className="mt-3 text-[11px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">
                  Imagen pendiente
                </p>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.025] to-transparent" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-black/6 bg-neutral-50 px-3 py-1.5 text-[11px] leading-none font-semibold tracking-[0.02em] text-neutral-650 sm:text-xs">
            {categoryName}
          </span>

          <span className="rounded-full border border-[var(--ck-red)]/10 bg-[var(--ck-red-soft)] px-3 py-1.5 text-[11px] leading-none font-semibold tracking-[0.02em] text-[var(--ck-red-dark)] sm:text-xs">
            {approvalLabels[product.approval]}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold tracking-[0.13em] text-neutral-500 uppercase">
          {brandName}
        </p>

        <h2 className="mt-2 text-[1.1rem] leading-6 font-semibold tracking-[-0.02em] text-neutral-950">
          <Link
            href={`/producto/${product.slug}`}
            className="transition-colors hover:text-[var(--ck-red)]"
          >
            {product.name}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-6">
          <div className="border-t border-black/7 pt-4">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-neutral-950">
                  {primaryPrice?.label ?? "Consultar precio"}
                </p>

                <p className="mt-1 text-xs font-medium text-neutral-500">
                  {availabilityLabels[product.availability]}
                </p>
              </div>

              <Link
                href={`/producto/${product.slug}`}
                aria-label={`Ver producto: ${product.name}`}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-neutral-950 px-3.5 text-xs font-semibold text-white transition-all duration-200 group-hover:bg-[var(--ck-red)] sm:px-4 sm:text-sm"
              >
                Ver producto
                <span aria-hidden="true" className="text-white/70">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
