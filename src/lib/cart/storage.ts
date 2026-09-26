import { cartStorageSchema } from "@/lib/validation/cart.schema";
import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "catalogo-karate:cart:v2";

function normalizeCartItems(items: CartItem[]): CartItem[] {
  const uniqueItems = new Map<string, CartItem>();

  for (const item of items) {
    const key = `${item.productId}:${item.variantId}`;
    const existingItem = uniqueItems.get(key);

    if (!existingItem) {
      uniqueItems.set(key, item);
      continue;
    }

    existingItem.quantity = Math.min(99, existingItem.quantity + item.quantity);
  }

  return [...uniqueItems.values()];
}

export function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    const result = cartStorageSchema.safeParse(parsedValue);

    if (!result.success) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }

    return normalizeCartItems(result.data.items);
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items,
      }),
    );
  } catch {
    // Ignore storage failures so the cart can continue working in memory.
  }
}
