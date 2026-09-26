"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";

export function CartDrawer() {
  const { isOpen, closeCart, items, totalItems, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-neutral-950/45"
      />

      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-[#faf9f6] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Selección
            </p>

            <h2
              id="cart-title"
              className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950"
            >
              Carrito de consulta
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 hover:border-neutral-950"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m7 7 10 10M17 7 7 17" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-8 text-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                Vacío
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                Todavía no has seleccionado productos.
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Explora el catálogo y agrega los productos que quieras consultar.
              </p>

              <button
                type="button"
                onClick={closeCart}
                className="mt-6 min-h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white"
              >
                Seguir explorando
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-3">
                {items.map((item) => (
                  <article
                    key={`${item.productId}-${item.variantId}`}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                          {item.snapshot.brandName}
                        </p>

                        <h3 className="mt-1 font-semibold tracking-tight text-neutral-950">
                          {item.snapshot.productName}
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500">SKU {item.snapshot.sku}</p>

                        <p className="mt-2 text-sm text-neutral-600">
                          {item.snapshot.variantLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={`Eliminar ${item.snapshot.productName}`}
                        className="shrink-0 text-xs font-semibold text-neutral-400 hover:text-[#b31322]"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/8 pt-4">
                      <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-neutral-50">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          aria-label={`Reducir cantidad de ${item.snapshot.productName}`}
                          className="flex size-9 items-center justify-center text-neutral-700 hover:bg-white"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm font-semibold text-neutral-950">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          aria-label={`Aumentar cantidad de ${item.snapshot.productName}`}
                          className="flex size-9 items-center justify-center text-neutral-700 hover:bg-white"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        {Object.entries(item.selectedOptions).map(([name, value]) => (
                          <p key={name} className="text-xs text-neutral-500">
                            {name}: {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-black/10 bg-white px-5 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">Productos seleccionados</p>

                <p className="text-sm font-semibold text-neutral-950">{totalItems}</p>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Los precios y la disponibilidad definitiva se confirman antes de concretar la
                compra.
              </p>

              <button
                type="button"
                onClick={clearCart}
                className="mt-5 min-h-11 w-full rounded-full border border-black/10 bg-white text-sm font-semibold text-neutral-700 hover:border-neutral-950"
              >
                Vaciar selección
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
