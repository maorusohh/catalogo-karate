"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartTrigger() {
  const { totalItems, openCart, isOpen } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito${
        totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}` : ""
      }`}
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
      className="relative inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-950 transition-colors hover:border-neutral-950"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>

      {totalItems > 0 ? (
        <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#b31322] px-1.5 text-[10px] leading-5 font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );
}
