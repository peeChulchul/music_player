import React from "react";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { Database, UserRow } from "../types/supabase";

interface IsessionStoreState {
  session: Session | null;
  userTable: UserRow | null;
  setSession: (session: Session | null) => void;
  setUserTable: (user: UserRow | null) => void;
  clerSession: () => void;
}

const useSessionStore = create<IsessionStoreState>((set) => {
  return {
    session: null,
    userTable: null,
    setSession: (session) => {
      set({ session });
    },
    setUserTable: (user) => {
      set({ userTable: user });
    },
    clerSession: () => {
      set({ session: null, userTable: null });
    },
  };
});

export default useSessionStore;
