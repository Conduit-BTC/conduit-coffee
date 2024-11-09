// context/UiContext.js
import { create } from "zustand";

export const useUiContext = create((set) => ({
  isCheckoutModalOpen: false,
  openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
  closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),

  isProductDetailsModalOpen: false,
  currentProductDetails: null,
  openProductDetailsModal: (product) =>
    set({ isProductDetailsModalOpen: true, currentProductDetails: product }),
  closeProductDetailsModal: () =>
    set({ isProductDetailsModalOpen: false, currentProductDetails: null }),

  isRelayEditorOpen: false,
  openRelayEditor: () => set({ isRelayEditorOpen: true }),
  closeRelayEditor: () => set({ isRelayEditorOpen: false }),
}));
