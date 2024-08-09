import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";
import usePlayingMusicStore from "../../store/playingMusicStore";
import { getEqTable } from "../../service/tableService";
import { musicZoneRow, trackRow } from "../../types/supabase";
import { useQuery } from "@tanstack/react-query";

function MusicBar() {
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const { isPlaying, musicZoneId, index, setIsPlaying } =
    usePlayingMusicStore();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(index);
  const [playList, setPlayList] = useState<string[]>([]);
  // const { data, isLoading } = useQuery<trackRow[]>({
  //   queryKey: ["musicZone", musicZoneId],
  //   queryFn: fetchMusicZoneTable,
  // });

  useEffect(() => {
    if (musicZoneId) {
      (async () => {
        fetchMusicZoneTable();
      })();
    }
  }, [musicZoneId]);

  async function fetchMusicZoneTable() {
    const trackData = (await getEqTable({
      eqKey: "music_zone_id",
      eqValue: musicZoneId!,
      tableName: "musictrack",
    })) as trackRow[];

    const trackList = trackData.map((data) => {
      const { track_url, ...arg } = data;
      return track_url;
    });
    setPlayList(trackList);
    return trackData;
  }

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const handleProgress = useCallback((state: { played: number }) => {
    setProgress(state.played);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    playerRef.current?.seekTo(seekTo);
    setProgress(parseFloat(e.target.value));
  }, []);

  return (
    <div className="fixed z-20 bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => console.log("Previous")}
          className="focus:outline-none"
        >
          <BackwardIcon className="h-6 w-6" />
        </button>
        <button onClick={handlePlayPause} className="focus:outline-none">
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>
        <button
          onClick={() => console.log("Next")}
          className="focus:outline-none"
        >
          <ForwardIcon className="h-6 w-6" />
        </button>
        <p className="text-xs whitespace-nowrap">
          {formatTime(duration * progress)} / {formatTime(duration)}
        </p>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={progress}
        onChange={handleSeek}
        className="w-full mx-4 cursor-pointer"
      />
      <ReactPlayer
        ref={playerRef}
        url={playList[index]}
        playing={isPlaying}
        onReady={() => setReady(true)}
        onDuration={setDuration}
        onProgress={handleProgress}
        onEnded={() => {
          setIsPlaying(false);
        }}
        onError={(e) => console.log("Error occurred: ", e)}
        height="0"
        width="0"
        config={{
          youtube: {
            playerVars: {
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
            },
          },
        }}
      />
    </div>
  );
}

export default MusicBar;
