import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { Product } from "@/types/catalog";

type ScopedProductGridProps = {
  products: Product[];
  brandNames: Record<string, string>;
  categoryNames: Record<string, string>;
};

function getApprovalLabel(approval: Product["approval"]): string {
  switch (approval) {
    case "WKF":
      return "WKF";
    case "NATIONAL":
      return "Nacional";
    case "NON_APPROVED":
      return "No aprobado";
    case "UNSPECIFIED":
    default:
      return "Sin especificar";
  }
}

function getApprovalTone(approval: Product["approval"]): "neutral" | "accent" {
  return approval === "WKF" ? "accent" : "neutral";
}

function getAvailabilityLabel(availability: Product["availability"]): string {
  switch (availability) {
    case "AVAILABLE":
      return "Disponible";
    case "CONSULT":
      return "Consultar";
    case "OUT_OF_STOCK":
      return "Agotado";
    case "COMING_SOON":
      return "Próximamente";
  }
}

export function ScopedProductGrid({ products, brandNames, categoryNames }: ScopedProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-14 text-center">
        <p className="text-sm font-semibold text-neutral-950">
          Todavía no hay productos publicados aquí.
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
          Esta sección ya está preparada para recibir referencias reales cuando incorporemos el
          catálogo definitivo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const brandName = brandNames[product.brandId] ?? "Marca";

        const categoryName = categoryNames[product.categoryId] ?? "Categoría";

        const primaryPrice = product.prices[0]?.label ?? "Consultar";

        return (
          <Link key={product.id} href={`/producto/${product.slug}`} className="group">
            <Surface className="h-full overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e6df]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49%,rgba(23,23,23,0.05)_50%,transparent_51%)]" />

                <div className="absolute top-5 left-5">
                  <Badge tone={getApprovalTone(product.approval)}>
                    {getApprovalLabel(product.approval)}
                  </Badge>
                </div>

                <div className="absolute bottom-5 left-5 max-w-[70%]">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                    {brandName}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950/15 sm:text-3xl">
                    {product.name}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-neutral-950 text-white transition-transform duration-200 group-hover:-rotate-6"
                >
                  ↗
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                      {categoryName}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-950">
                      {product.name}
                    </h2>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-neutral-500">
                    {getAvailabilityLabel(product.availability)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {product.shortDescription}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                  <span className="text-sm font-semibold text-neutral-950">{primaryPrice}</span>

                  <span className="text-xs font-medium text-neutral-400">
                    {product.variants.length}{" "}
                    {product.variants.length === 1 ? "variante" : "variantes"}
                  </span>
                </div>
              </div>
            </Surface>
          </Link>
        );
      })}
    </div>
  );
}
