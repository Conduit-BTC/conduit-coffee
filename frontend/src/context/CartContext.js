import { create } from "zustand";

const calculateTotalCartQty = (cartItems) => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};

const calculateCartPriceUsd = (cartItems) => {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const addItemToCart = (cartItems, newItem) => {
  const existingItem = cartItems.find((item) => item.id === newItem.id);
  if (existingItem) {
    return {
      cartItems: cartItems.map((item) =>
        item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
      ),
      totalCartQty: calculateTotalCartQty(cartItems) + 1,
    };
  } else {
    return {
      cartItems: [...cartItems, { ...newItem, quantity: 1 }],
      totalCartQty: calculateTotalCartQty(cartItems) + 1,
    };
  }
};

const removeItemFromCart = (cartItems, itemToRemove) => {
  const existingItem = cartItems.find((item) => item.id === itemToRemove.id);
  if (existingItem) {
    if (existingItem.quantity === 1) {
      return {
        cartItems: cartItems.filter((item) => item.id !== itemToRemove.id),
        totalCartQty: calculateTotalCartQty(cartItems) - 1,
      };
    } else {
      return {
        cartItems: cartItems.map((item) =>
          item.id === itemToRemove.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        totalCartQty: calculateTotalCartQty(cartItems) - 1,
      };
    }
  } else {
    return {
      cartItems,
      totalCartQty: calculateTotalCartQty(cartItems),
    };
  }
};

export const useCartContext = create((set) => ({
  cartItems: [],
  cartPriceUsd: 0,
  totalCartQty: 0,
  addItemToCart: (newItem) =>
    set((state) => {
      const { cartItems, totalCartQty } = addItemToCart(
        state.cartItems,
        newItem
      );
      return {
        cartItems,
        totalCartQty,
        cartPriceUsd: calculateCartPriceUsd(cartItems),
      };
    }),
  removeItemFromCart: (itemToRemove) =>
    set((state) => {
      const { cartItems, totalCartQty } = removeItemFromCart(
        state.cartItems,
        itemToRemove
      );
      return {
        cartItems,
        totalCartQty,
        cartPriceUsd: calculateCartPriceUsd(cartItems),
      };
    }),
}));
