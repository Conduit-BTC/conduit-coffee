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


  isEmailModalOpen: false,
  openEmailModal: () => set({ isEmailModalOpen: true }),
  closeEmailModal: () => set({ isEmailModalOpen: false }),

  currentNpub: null,
  isNostrModalOpen: false,
  openNostrModal: () => set({ isNostrModalOpen: true }),
  closeNostrModal: () => set({ isNostrModalOpen: false }),
}));
