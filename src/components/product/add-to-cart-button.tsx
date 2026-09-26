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

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleAddToCart}
      className={`mt-6 min-h-13 w-full rounded-full px-6 text-sm font-semibold transition-colors ${
        isDisabled
          ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
          : alreadyInCart
            ? "border border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950"
            : "bg-[#b31322] text-white hover:bg-[#8d0f1b]"
      }`}
    >
      {isDisabled
        ? "Selecciona una variante"
        : alreadyInCart
          ? "Ver en el carrito"
          : "Agregar al carrito"}
    </button>
  );
}
