"use client";

import { useCart } from "@/components/cart/cart-provider";
import type { ProductVariant } from "@/types/catalog";

const DEFAULT_VARIANT_ID = "__default__";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  sku: string;
  brandName: string;
  variant: ProductVariant | undefined;
  requiresVariant: boolean;
  priceReady: boolean;
  paymentLabel?: string;
};

export function AddToCartButton({
  productId,
  productName,
  sku,
  brandName,
  variant,
  requiresVariant,
  priceReady,
  paymentLabel,
}: AddToCartButtonProps) {
  const { items, addItem, openCart } = useCart();

  const variantId = variant?.id ?? DEFAULT_VARIANT_ID;
  const variantMissing = requiresVariant && (!variant || !variant.available);
  const isDisabled = variantMissing || !priceReady;

  const matchingItem = items.find(
    (item) => item.productId === productId && item.variantId === variantId,
  );

  const alreadyInCart =
    Boolean(matchingItem) && matchingItem?.snapshot.paymentLabel === paymentLabel;

  function handleAddToCart() {
    if (isDisabled) {
      return;
    }

    const selectedOptions = variant
      ? Object.fromEntries(variant.options.map((option) => [option.name, option.value]))
      : {};

    addItem({
      productId,
      variantId,
      quantity: matchingItem?.quantity ?? 1,
      selectedOptions,
      snapshot: {
        productName,
        sku,
        brandName,
        variantLabel: variant?.label ?? "Sin variante",
        paymentLabel,
      },
    });

    openCart();
  }

  const buttonClasses = isDisabled
    ? "mt-6 inline-flex min-h-13 w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-6 text-sm font-semibold text-neutral-400 opacity-80"
    : alreadyInCart
      ? "action-secondary mt-6 w-full"
      : "action-primary mt-6 w-full";

  return (
    <button type="button" disabled={isDisabled} onClick={handleAddToCart} className={buttonClasses}>
      {variantMissing
        ? "Selecciona una variante"
        : !priceReady
          ? "Precio por confirmar"
          : alreadyInCart
            ? "Ver en el carrito"
            : matchingItem
              ? "Actualizar selección"
              : "Agregar al carrito"}
    </button>
  );
}
