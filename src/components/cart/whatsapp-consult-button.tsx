"use client";

import { useMemo } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { buildWhatsAppCartMessage } from "@/lib/whatsapp/message";
import { buildWhatsAppUrl } from "@/lib/whatsapp/url";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor">
      <path d="M12 2.25a9.75 9.75 0 0 0-8.42 14.67L2.5 21.5l4.74-1.04A9.75 9.75 0 1 0 12 2.25Zm0 17.77a7.98 7.98 0 0 1-4.08-1.12l-.29-.17-2.81.62.63-2.74-.19-.3A7.97 7.97 0 1 1 12 20.02Zm4.35-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.38-1.31-1.62-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.15.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

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
      className="action-whatsapp w-full"
    >
      <WhatsAppIcon />
      Enviar consulta por WhatsApp
    </a>
  );
}
