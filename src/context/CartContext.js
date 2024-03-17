import { create } from "zustand";

export const useCartContext = create((set) => ({
  lightRoastBags: 0,
  darkRoastBags: 0,

  cartPrice: 0, // Number of bags * cost per bag
  cartPriceOverTime: [], // CryptoContext's priceOverTime with each Sats value multiplied by (the number of bags * cost per bag)

  setCartPrice: (price) =>
    set({
      cartPrice: price,
    }),

  setCartPriceOverTime: (array) =>
    set({
      cartPriceOverTime: array,
    }),

  increaseLightRoastBags: () =>
    set((state) => ({ lightRoastBags: state.lightRoastBags + 1 })),

  increaseDarkRoastBags: () =>
    set((state) => ({ darkRoastBags: state.darkRoastBags + 1 })),

  decreaseLightRoastBags: () =>
    set((state) => ({
      lightRoastBags:
        state.lightRoastBags <= 0
          ? (state.lightRoastBags = 0)
          : state.lightRoastBags - 1,
    })),

  decreaseDarkRoastBags: () =>
    set((state) => ({
      darkRoastBags:
        state.darkRoastBags <= 0
          ? (state.darkRoastBags = 0)
          : state.darkRoastBags - 1,
    })),

  resetLightRoastBags: () => set({ lightRoastBags: 0 }),

  resetDarkRoastBags: () => set({ darkRoastBags: 0 }),

  resetAllBags: () => set({ lightRoastBags: 0, darkRoastBags: 0 }),

  setLightRoastBags: (qty) => set({ lightRoastBags: qty }),

  setDarkRoastBags: (qty) => set({ darkRoastBags: qty }),
}));
