import Image from "next/image";
import Link from "next/link";

import type { ApprovalLevel, AvailabilityStatus, Product } from "@/types/catalog";

const approvalLabels: Record<ApprovalLevel, string> = {
  WKF: "WKF",
  NATIONAL: "FVKD",
  NON_APPROVED: "No aprobado",
  UNSPECIFIED: "Sin aprobación",
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
  const primaryPrice = product.prices[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_18px_40px_rgba(0,0,0,0.075)]">
      <Link href={`/producto/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden border-b border-black/5 bg-[#ebe7de]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.025] sm:p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div>
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-950 text-xs font-black tracking-tight text-white">
                  KD
                </span>

                <p className="mt-3 text-xs font-medium tracking-[0.12em] text-neutral-400 uppercase">
                  Imagen pendiente
                </p>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-600">
            {categoryName}
          </span>

          <span className="rounded-full bg-[var(--ck-red)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--ck-red-dark)]">
            {approvalLabels[product.approval]}
          </span>
        </div>

        <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-neutral-500 uppercase">
          {brandName}
        </p>

        <h2 className="mt-2 text-xl leading-[1.18] font-semibold tracking-[-0.015em] text-neutral-950">
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
          <div className="border-t border-black/8 pt-4">
            <p className="text-base font-semibold tracking-[-0.01em] text-neutral-950">
              {primaryPrice?.label ?? "Consultar precio"}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {availabilityLabels[product.availability]}
            </p>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[var(--ck-red)]"
          >
            Ver producto
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
