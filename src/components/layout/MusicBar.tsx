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
  const { isPlaying, musicZoneId, index, setIsPlaying, selectPlayingMusic } =
    usePlayingMusicStore();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(index);
  const [playList, setPlayList] = useState<trackRow[]>([]);
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

  useEffect(() => {
    setCurrentVideoIndex(index);
  }, [index]);

  useEffect(() => {
    if (playList.length === 0) return;
    setCurrentVideoIndex(0);
    setIsPlaying(true);
    setProgress(0);
  }, [playList]);

  useEffect(() => {
    if (progress === 1) {
      if (playList.length - 1 === currentVideoIndex) {
        setIsPlaying(false);
        return;
      }

      setCurrentVideoIndex((prev) => prev + 1);
    }
  }, [progress]);

  async function fetchMusicZoneTable() {
    const trackData = (await getEqTable({
      eqKey: "music_zone_id",
      eqValue: musicZoneId!,
      tableName: "musictrack",
    })) as trackRow[];

    const trackList = trackData.map((data) => {
      const { track_url, ...arg } = data;
      return data;
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
    if (state.played >= 1 && currentVideoIndex === playList.length - 1) {
      setProgress(1);
    } else {
      setProgress(state.played);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    playerRef.current?.seekTo(seekTo);
    setProgress(parseFloat(e.target.value));
  }, []);

  const handleEnded = useCallback(() => {
    if (currentVideoIndex < playList.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setProgress(1);
    }
  }, [currentVideoIndex, playList.length, setIsPlaying]);

  function handlePrev() {
    if (index === 0) return;

    setCurrentVideoIndex((prev) => prev - 1);
    selectPlayingMusic({ index: index - 1, trackId: playList[index - 1].id });
  }

  function handleNext() {
    if (index === playList.length - 1) return;
    setCurrentVideoIndex((prev) => prev + 1);
    selectPlayingMusic({ index: index + 1, trackId: playList[index + 1].id });
  }

  if (playList.length === 0) return null;

  return (
    <div className="fixed z-10 bottom-0 left-0 right-0 bg-gray-800 text-white">
      <div className="flex relative w-full py-4 px-6 h-[60px] justify-between">
        <div className="w-full absolute top-0 left-0 right-0 cursor-pointer">
          <div className="bg-gray-600 h-1 rounded-full">
            <div
              className="bg-blue-500 h-1 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex flex-1 items-center gap-4 mr-10">
          <button onClick={handlePrev} className="focus:outline-none">
            <BackwardIcon className="h-7" />
          </button>

          <button onClick={handlePlayPause} className="focus:outline-none">
            {isPlaying ? (
              <PauseIcon className="h-7" />
            ) : (
              <PlayIcon className="h-7" />
            )}
          </button>
          <button onClick={handleNext} className="focus:outline-none">
            <ForwardIcon className="h-7" />
          </button>

          <p className="text-xs whitespace-nowrap">
            {formatTime(duration * progress)} / {formatTime(duration)}
          </p>
        </div>

        {playList[currentVideoIndex] && (
          <div className="flex flex-1 items-center gap-4">
            <img
              className="w-[40px] h-[40px]"
              src={playList[currentVideoIndex]?.thumbnail_url}
            />
            <div className="flex flex-col">
              <p className="text-s">{playList[currentVideoIndex]?.title}</p>
              <p className="text-s">{playList[currentVideoIndex]?.artist}</p>
            </div>
          </div>
        )}
        <div className="flex-1"></div>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={playList[currentVideoIndex]?.track_url}
        playing={isPlaying}
        onReady={() =>
          playerRef.current?.getDuration &&
          setDuration(playerRef.current.getDuration())
        }
        onDuration={setDuration}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onError={(e) => console.log("Error occurred: ", e)}
        height="0"
        width="0"
        config={{
          youtube: {
            playerVars: {
              controls: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              embedOptions: {
                host: "https://www.youtube-nocookie.com",
              },
            },
          },
        }}
      />
    </div>
  );
}

export default MusicBar;
