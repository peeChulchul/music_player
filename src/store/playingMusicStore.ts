import React from "react";
import { create } from "zustand";

interface IplayingMusicState {
  musicZoneId: string | null;
  isPlaying: boolean;
  index: number;
  trackId: string | null;
  setIsPlaying: (isPlaying: boolean) => void;
  selectPlayingMusic: ({
    musicZoneId,
    index,
    trackId,
  }: {
    musicZoneId?: string;
    index: number;
    trackId?: string;
  }) => void;
}

const usePlayingMusicStore = create<IplayingMusicState>((set) => {
  return {
    isPlaying: false,
    musicZoneId: null,
    index: 0,
    trackId: null,
    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
    },
    selectPlayingMusic: ({ musicZoneId, index, trackId }) => {
      set({ musicZoneId, index, trackId });
    },
  };
});

export default usePlayingMusicStore;
