import React from "react";
import { create } from "zustand";

interface IplayingMusicState {
  musicZoneId: string | null;
  isPlaying: boolean;
  index: number;
  setIsPlaying: (isPlaying: boolean) => void;
  selectPlayingMusic: (musicZoneId: string, index: number) => void;
}

const usePlayingMusicStore = create<IplayingMusicState>((set) => {
  return {
    isPlaying: false,
    musicZoneId: null,
    index: 0,
    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
    },
    selectPlayingMusic: (musicZoneId, index) => {
      set({ musicZoneId, index });
    },
  };
});

export default usePlayingMusicStore;
