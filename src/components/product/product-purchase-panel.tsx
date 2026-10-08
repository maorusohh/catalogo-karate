"use client";

import { useCallback, useMemo, useState } from "react";

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

  const requiresVariant = variants.length > 0;
  const hasVariantPricing = prices.some((price) => Boolean(price.variantId));

  const genericPrices = useMemo(() => prices.filter((price) => !price.variantId), [prices]);

  const visiblePrices = useMemo(() => {
    if (!hasVariantPricing) {
      return genericPrices.length > 0 ? genericPrices : prices;
    }

    if (!selectedVariant) {
      return [];
    }

    return prices.filter((price) => price.variantId === selectedVariant.id);
  }, [genericPrices, hasVariantPricing, prices, selectedVariant]);

  const selectedPrice = visiblePrices[selectedPriceIndex];

  const handleVariantChange = useCallback((variant: ProductVariant | undefined) => {
    setSelectedVariant(variant);
    setSelectedPriceIndex(0);
  }, []);

  const variantSelector = requiresVariant ? (
    <VariantSelector variants={variants} onVariantChange={handleVariantChange} />
  ) : null;

  const priceSelector = (
    <section>
      <p className="text-xs font-semibold tracking-[0.14em] text-neutral-400 uppercase">
        {hasVariantPricing ? "Precio y forma de pago" : "Forma de pago"}
      </p>

      <h2 className="mt-1 text-base font-semibold tracking-tight text-neutral-950">
        {hasVariantPricing && !selectedVariant
          ? "Selecciona una talla para ver el precio."
          : hasVariantPricing && selectedVariant
            ? `Precio para ${selectedVariant.label}.`
            : "Selecciona tu forma de pago preferida."}
      </h2>

      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {hasVariantPricing
          ? "El precio se actualiza según la variante elegida. La forma de pago seleccionada se incluirá en tu consulta."
          : "La opción elegida se incluirá en tu consulta y se confirmará antes de concretar la compra."}
      </p>

      {visiblePrices.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {visiblePrices.map((price, index) => {
            const selected = index === selectedPriceIndex;

            return (
              <button
                key={`${price.variantId ?? "generic"}-${price.basis}-${index}`}
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
      ) : hasVariantPricing ? (
        <div className="mt-3 rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
          <p className="text-sm font-semibold text-neutral-950">
            {selectedVariant ? "Precio por confirmar" : "Selecciona una talla"}
          </p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {selectedVariant
              ? "No hay un precio verificado asociado a esta variante."
              : "Al elegir una talla aparecerán las opciones de precio disponibles."}
          </p>
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
  );

  return (
    <div className="space-y-7">
      {hasVariantPricing ? (
        <>
          {variantSelector}
          {priceSelector}
        </>
      ) : (
        <>
          {priceSelector}
          {variantSelector}
        </>
      )}

      <AddToCartButton
        productId={productId}
        productName={productName}
        sku={sku}
        brandName={brandName}
        variant={selectedVariant}
        requiresVariant={requiresVariant}
        priceReady={Boolean(selectedPrice)}
        paymentLabel={selectedPrice?.label}
      />
    </div>
  );
}
