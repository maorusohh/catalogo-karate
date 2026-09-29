"use client";

import { useCart } from "@/components/cart/cart-provider";
import type { ProductVariant } from "@/types/catalog";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  sku: string;
  brandName: string;
  variant: ProductVariant | undefined;
};

export function AddToCartButton({
  productId,
  productName,
  sku,
  brandName,
  variant,
}: AddToCartButtonProps) {
  const { items, addItem, openCart } = useCart();

  const isDisabled = !variant || !variant.available;

  const alreadyInCart = variant
    ? items.some((item) => item.productId === productId && item.variantId === variant.id)
    : false;

  function handleAddToCart() {
    if (!variant || !variant.available) {
      return;
    }

    if (!alreadyInCart) {
      const selectedOptions = Object.fromEntries(
        variant.options.map((option) => [option.name, option.value]),
      );

      addItem({
        productId,
        variantId: variant.id,
        quantity: 1,
        selectedOptions,
        snapshot: {
          productName,
          sku,
          brandName,
          variantLabel: variant.label,
        },
      });
    }

    openCart();
  }

  const buttonClasses = isDisabled
    ? "mt-6 inline-flex min-h-13 w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-6 text-sm font-semibold text-neutral-400 opacity-80"
    : alreadyInCart
      ? "action-secondary mt-6 w-full"
      : "action-primary mt-6 w-full";

  return (
    <button type="button" disabled={isDisabled} onClick={handleAddToCart} className={buttonClasses}>
      {isDisabled
        ? "Selecciona una variante"
        : alreadyInCart
          ? "Ver en el carrito"
          : "Agregar al carrito"}
    </button>
  );
}
