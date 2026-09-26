"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { cartReducer, initialCartState } from "@/lib/cart/reducer";
import { loadCartItems, saveCartItems } from "@/lib/cart/storage";
import type { CartItem, CartState } from "@/types/cart";

type CartContextValue = CartState & {
  isOpen: boolean;
  totalItems: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const [isOpen, setIsOpen] = useState(false);

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    dispatch({
      type: "HYDRATE",
      payload: loadCartItems(),
    });

    hasHydratedRef.current = true;
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      const action = {
        type: "ADD_ITEM" as const,
        payload: item,
      };

      const nextState = cartReducer(state, action);

      dispatch(action);

      if (hasHydratedRef.current) {
        saveCartItems(nextState.items);
      }
    },
    [state],
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      const action = {
        type: "UPDATE_QUANTITY" as const,
        payload: {
          productId,
          variantId,
          quantity,
        },
      };

      const nextState = cartReducer(state, action);

      dispatch(action);

      if (hasHydratedRef.current) {
        saveCartItems(nextState.items);
      }
    },
    [state],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      const action = {
        type: "REMOVE_ITEM" as const,
        payload: {
          productId,
          variantId,
        },
      };

      const nextState = cartReducer(state, action);

      dispatch(action);

      if (hasHydratedRef.current) {
        saveCartItems(nextState.items);
      }
    },
    [state],
  );

  const clearCart = useCallback(() => {
    const action = {
      type: "CLEAR" as const,
    };

    const nextState = cartReducer(state, action);

    dispatch(action);

    if (hasHydratedRef.current) {
      saveCartItems(nextState.items);
    }
  }, [state]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const totalItems = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items],
  );

  const contextValue = useMemo(
    () => ({
      ...state,
      isOpen,
      totalItems,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      state,
      isOpen,
      totalItems,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
