import React from "react";
import { create } from "zustand";

interface IloadingStoreState {
  isOpen: boolean;
  openLoading: () => void;
  closeLoading: () => void;
}

const useloadingStore = create<IloadingStoreState>((set) => {
  return {
    isOpen: true,
    openLoading: () => {
      set({ isOpen: true });
    },
    closeLoading: () => set({ isOpen: false }),
  };
});

export default useloadingStore;
