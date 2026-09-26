"use client";

import { useMemo } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { buildWhatsAppCartMessage } from "@/lib/whatsapp/message";
import { buildWhatsAppUrl } from "@/lib/whatsapp/url";

export function WhatsAppConsultButton() {
  const { items, closeCart } = useCart();

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    const message = buildWhatsAppCartMessage(items);

    return buildWhatsAppUrl(message);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  if (!whatsappUrl) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">WhatsApp aún no está configurado.</p>
        <p className="mt-1 leading-6 text-amber-800">
          Configura el número comercial en
          <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs">
            src/config/site.ts
          </code>
          para habilitar la consulta.
        </p>
      </div>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={closeCart}
      className="flex min-h-13 w-full items-center justify-center rounded-full bg-[#b31322] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#8d0f1b]"
    >
      Consultar por WhatsApp
    </a>
  );
}
