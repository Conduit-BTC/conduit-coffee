import { create } from "zustand";

export const useUiContext = create((set) => ({
  isModalOpen: false,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
