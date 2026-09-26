import type { CartAction, CartState } from "@/types/cart";

const MAX_ITEM_QUANTITY = 99;

export const initialCartState: CartState = {
  items: [],
};

function clampQuantity(quantity: number): number {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(0, quantity));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.payload,
      };

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId,
      );

      if (existingItemIndex === -1) {
        return {
          items: [...state.items, action.payload],
        };
      }

      return state;
    }

    case "UPDATE_QUANTITY": {
      const nextQuantity = clampQuantity(action.payload.quantity);

      if (nextQuantity === 0) {
        return {
          items: state.items.filter(
            (item) =>
              !(
                item.productId === action.payload.productId &&
                item.variantId === action.payload.variantId
              ),
          ),
        };
      }

      return {
        items: state.items.map((item) => {
          if (
            item.productId !== action.payload.productId ||
            item.variantId !== action.payload.variantId
          ) {
            return item;
          }

          return {
            ...item,
            quantity: nextQuantity,
          };
        }),
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.variantId === action.payload.variantId
            ),
        ),
      };

    case "CLEAR":
      return initialCartState;

    default:
      return state;
  }
}
