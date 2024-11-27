import { create } from "zustand";

export const useReceiptContext = create((set) => ({
    receipt: null,
    setReceipt: (receipt) => set({ receipt }),
}));
