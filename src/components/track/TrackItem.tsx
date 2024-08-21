import React from "react";
import { trackRow } from "../../types/supabase";
import usePlayingMusicStore from "../../store/playingMusicStore";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

interface ItrackItemProps {
  track: trackRow;
}

function TrackItem({ track }: ItrackItemProps) {
  const { isPlaying, trackId, selectPlayingMusic, setIsPlaying } =
    usePlayingMusicStore();

  const isSelected = track.id === trackId;

  function playMusicHandler() {
    selectPlayingMusic({
      index: track.index!,
      musicZoneId: track.music_zone_id,
      trackId: track.id,
    });
    if (isSelected) {
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(true);
    }
  }

  return (
    <div
      onClick={playMusicHandler}
      className={[
        `border border-gray-300 shadow mb-2 rounded-md cursor-pointer px-4 flex w-full h-[70px] items-center gap-4 hover:bg-bg-secondary group ${isSelected && "bg-bg-secondary"}`,
      ].join(" ")}
    >
      <div
        className={[
          `w-[50px] h-[50px] relative group-hover:bg-black ${isSelected ? "bg-black" : ""}`,
        ].join(" ")}
      >
        <img
          className={[
            `w-full h-full group-hover:opacity-40 ${isSelected ? "opacity-40" : ""}`,
          ].join(" ")}
          src={track.thumbnail_url}
        />
        <button
          className={[
            `text-white ${isSelected ? "block" : "hidden"} group-hover:block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[20px] `,
          ].join(" ")}
        >
          {isPlaying && isSelected && <PauseIcon />}
          {(!isPlaying || !isSelected) && <PlayIcon />}
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h1 className="text-text-primary text-sm">{track.title}</h1>
        <p className="text-text-secondary text-xs">{track.artist}</p>
      </div>
      {track.time && <p className="text-sm">{track.time}</p>}
    </div>
  );
}

export default TrackItem;
