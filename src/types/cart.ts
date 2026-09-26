export interface CartItemSnapshot {
  productName: string;
  sku: string;
  brandName: string;
  variantLabel: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  snapshot: CartItemSnapshot;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | {
      type: "HYDRATE";
      payload: CartItem[];
    }
  | {
      type: "ADD_ITEM";
      payload: CartItem;
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        variantId: string;
        quantity: number;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: {
        productId: string;
        variantId: string;
      };
    }
  | {
      type: "CLEAR";
    };
