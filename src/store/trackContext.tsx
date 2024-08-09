import React, { createContext, useContext, useState, ReactNode } from "react";
import { trackRowWithFile } from "../types/supabase";

// Context의 타입 정의
interface TrackContextType {
  trackList: trackRowWithFile[];
  setTrackList: React.Dispatch<React.SetStateAction<trackRowWithFile[]>>;
}

// 기본값 설정
export const TrackContext = createContext<TrackContextType | null>(null);

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [trackList, setTrackList] = useState<trackRowWithFile[]>([]);

  return (
    <TrackContext.Provider value={{ trackList, setTrackList }}>
      {children}
    </TrackContext.Provider>
  );
}

export const useTrackContext = () => {
  const context = useContext<TrackContextType | null>(TrackContext);
  if (!context) {
    throw new Error("콘텍스트 오류");
  }
  return context;
};
