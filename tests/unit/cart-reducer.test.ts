import { describe, expect, it } from "vitest";

import { cartReducer } from "@/lib/cart/reducer";
import type { CartItem, CartState } from "@/types/cart";

function makeItem(paymentLabel: string): CartItem {
  return {
    productId: "product-1",
    variantId: "__default__",
    quantity: 1,
    selectedOptions: {},
    snapshot: {
      productName: "Guantes de Karate-Do",
      sku: "TEST-01",
      brandName: "Marca Test",
      variantLabel: "Sin variante",
      paymentLabel,
    },
  };
}

describe("cartReducer", () => {
  it("actualiza la preferencia de pago sin duplicar la línea ni perder la cantidad", () => {
    const state: CartState = {
      items: [
        {
          ...makeItem("40 USD / Divisas"),
          quantity: 3,
        },
      ],
    };

    const result = cartReducer(state, {
      type: "ADD_ITEM",
      payload: makeItem("40 USDT / Binance"),
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(3);
    expect(result.items[0].snapshot.paymentLabel).toBe("40 USDT / Binance");
  });
});
