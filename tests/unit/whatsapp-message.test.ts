import { describe, expect, it } from "vitest";

import { buildWhatsAppCartMessage } from "@/lib/whatsapp/message";
import type { CartItem } from "@/types/cart";

const item: CartItem = {
  productId: "product-1",
  variantId: "__default__",
  quantity: 1,
  selectedOptions: {},
  snapshot: {
    productName: "Guantes de Karate-Do",
    sku: "TEST-01",
    brandName: "Marca Test",
    variantLabel: "Sin variante",
    paymentLabel: "40 USDT / Binance",
  },
};

describe("buildWhatsAppCartMessage", () => {
  it("incluye la preferencia de pago y omite una variante artificial", () => {
    const message = buildWhatsAppCartMessage([item]);

    expect(message).toContain("Forma de pago preferida: 40 USDT / Binance");
    expect(message).not.toContain("Variante: Sin variante");
  });
});
