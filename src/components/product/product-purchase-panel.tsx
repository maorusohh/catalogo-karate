"use client";

import { useCallback, useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { VariantSelector } from "@/components/product/variant-selector";
import type { ProductPrice, ProductVariant } from "@/types/catalog";

type ProductPurchasePanelProps = {
  productId: string;
  productName: string;
  sku: string;
  brandName: string;
  variants: ProductVariant[];
  prices: ProductPrice[];
};

export function ProductPurchasePanel({
  productId,
  productName,
  sku,
  brandName,
  variants,
  prices,
}: ProductPurchasePanelProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const selectedPrice = prices[selectedPriceIndex];
  const requiresVariant = variants.length > 0;

  const handleVariantChange = useCallback((variant: ProductVariant | undefined) => {
    setSelectedVariant(variant);
  }, []);

  return (
    <div className="space-y-7">
      <section>
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-neutral-400 uppercase">
            Forma de pago
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-neutral-950">
            ¿Cómo deseas realizar tu pago?
          </h2>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Selecciona la opción que prefieres usar al momento de confirmar la compra.
          </p>
        </div>

        {prices.length > 0 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {prices.map((price, index) => {
              const selected = index === selectedPriceIndex;

              return (
                <button
                  key={`${price.basis}-${index}`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedPriceIndex(index)}
                  className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-black/10 bg-white text-neutral-700 hover:border-neutral-950"
                  }`}
                >
                  {price.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-950">Consultar precio</p>
          </div>
        )}

        {selectedPrice?.note ? (
          <p className="mt-3 text-xs leading-5 text-neutral-500">{selectedPrice.note}</p>
        ) : null}
      </section>

      {requiresVariant ? (
        <VariantSelector variants={variants} onVariantChange={handleVariantChange} />
      ) : (
        <div className="rounded-2xl border border-black/8 bg-neutral-50 px-4 py-3">
          <p className="text-sm font-semibold text-neutral-950">Variantes por confirmar</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Si necesitas talla, color u otra opción, indícala durante la consulta por WhatsApp.
          </p>
        </div>
      )}

      <AddToCartButton
        productId={productId}
        productName={productName}
        sku={sku}
        brandName={brandName}
        variant={selectedVariant}
        requiresVariant={requiresVariant}
        paymentLabel={selectedPrice?.label}
      />
    </div>
  );
}
