import React from "react";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface IsessionStoreState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const useSessionStore = create<IsessionStoreState>((set) => {
  return {
    session: null,
    setSession: (session) => {
      set({ session });
    },
  };
});

export default useSessionStore;
