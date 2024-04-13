import { create } from "zustand";

export const useCartContext = create((set) => ({
  cartItems: [],
  cartPriceUsd: 0,
  totalCartQty: 0,

  setcartPriceUsd: (price) =>
    set({
      cartPriceUsd: price,
    }),

  addItemToCart: (newItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalCartQty: state.totalCartQty + 1,
        };
      } else {
        return {
          cartItems: [...state.cartItems, { ...newItem, quantity: 1 }],
          totalCartQty: state.totalCartQty + 1,
        };
      }
    }),
  removeItemFromCart: (itemToRemove) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === itemToRemove.id
      );
      if (existingItem) {
        if (existingItem.quantity === 1) {
          return {
            cartItems: state.cartItems.filter(
              (item) => item.id !== itemToRemove.id
            ),
            totalCartQty: state.totalCartQty - 1,
          };
        } else {
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === itemToRemove.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
            totalCartQty: state.totalCartQty - 1,
          };
        }
      } else {
        return state;
      }
    }),
}));
