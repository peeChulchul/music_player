import React from "react";
import { create } from "zustand";

interface ImodalStoreState {
  isOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (modalContent: React.ReactNode) => void;
  closeModal: () => void;
}

const useModalStore = create<ImodalStoreState>((set) => {
  return {
    isOpen: false,
    modalContent: null,
    openModal: (modalContent) => {
      set({ isOpen: true, modalContent });
    },
    closeModal: () => set({ isOpen: false, modalContent: null }),
  };
});

export default useModalStore;
