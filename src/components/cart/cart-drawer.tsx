"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { WhatsAppConsultButton } from "@/components/cart/whatsapp-consult-button";

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
        <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
              Selección
            </p>

            <h2 id="cart-title" className="mt-1 text-xl font-semibold text-neutral-950">
              Carrito de consulta
            </h2>
          </div>

          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeCart}
            className="inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-950 transition-colors hover:border-neutral-950"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-white text-neutral-400">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M6 8h12l-1 11H7L6 8Z" />
                <path d="M9 8a3 3 0 0 1 6 0" />
              </svg>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-neutral-950">Tu carrito está vacío</h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
              Agrega productos desde el catálogo para preparar una consulta.
            </p>

            <button
              type="button"
              onClick={closeCart}
              className="mt-6 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Seguir explorando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    {totalItems}{" "}
                    {totalItems === 1 ? "unidad seleccionada" : "unidades seleccionadas"}
                  </p>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-950 hover:underline"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <article
                      key={`${item.productId}:${item.variantId}`}
                      className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-950">
                            {item.snapshot.productName}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">{item.snapshot.brandName}</p>

                          {item.snapshot.variantLabel !== "Sin variante" ? (
                            <p className="mt-2 text-sm text-neutral-700">
                              {item.snapshot.variantLabel}
                            </p>
                          ) : null}

                          {item.snapshot.paymentLabel ? (
                            <p className="mt-2 text-xs font-semibold text-neutral-700">
                              {item.snapshot.paymentLabel}
                            </p>
                          ) : null}

                          <p className="mt-1 text-xs text-neutral-400">SKU: {item.snapshot.sku}</p>
                        </div>

                        <button
                          type="button"
                          aria-label={`Eliminar ${item.snapshot.productName}`}
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="shrink-0 text-xs font-semibold text-neutral-400 transition-colors hover:text-[#b31322]"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                        <span className="text-xs font-medium tracking-[0.12em] text-neutral-400 uppercase">
                          Cantidad
                        </span>

                        <div className="flex items-center rounded-full border border-black/10 bg-[#faf9f6]">
                          <button
                            type="button"
                            aria-label={`Disminuir cantidad de ${item.snapshot.productName}`}
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            className="flex size-10 items-center justify-center rounded-full text-lg text-neutral-700 transition-colors hover:bg-white hover:text-neutral-950"
                          >
                            −
                          </button>

                          <span
                            aria-live="polite"
                            className="min-w-9 text-center text-sm font-semibold text-neutral-950"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Aumentar cantidad de ${item.snapshot.productName}`}
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            className="flex size-10 items-center justify-center rounded-full text-lg text-neutral-700 transition-colors hover:bg-white hover:text-neutral-950"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <footer className="border-t border-black/10 bg-[#faf9f6] p-5 sm:p-6">
              <p className="mb-4 text-xs leading-5 text-neutral-500">
                El carrito sirve para preparar tu solicitud. La disponibilidad, precio y condiciones
                se confirman contigo antes de concretar la compra.
              </p>

              <WhatsAppConsultButton />
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
