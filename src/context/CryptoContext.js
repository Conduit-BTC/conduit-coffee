import { create } from "zustand";

export const useCryptoContext = create((set) => ({
  isLooping: false,
  satsToUsd: 0.0,
  priceOverTime: [],

  setSatsPrice: (price) => {
    set({
      satsToUsd: price,
    });
  },

  setSatsPriceOverTime: (array) => {
    set({
      priceOverTime: array,
    });
  },

  startLooping: () => set(() => ({ isLooping: true })),
}));
