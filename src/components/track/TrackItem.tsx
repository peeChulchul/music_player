import React from "react";
import { trackRow } from "../../types/supabase";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface ItrackItemProps {
  track: trackRow;
  imagePreview?: string;
  setIsEditing?: (value: React.SetStateAction<boolean>) => void;
  onClickMusicTrack?: (musicZoneId: string, index: number) => void;
}

function TrackItem({
  track,
  imagePreview,
  setIsEditing,
  onClickMusicTrack,
}: ItrackItemProps) {
  function PlayMusicHandler() {
    console.log("플레이!");
    if (onClickMusicTrack) {
      onClickMusicTrack(track.music_zone_id, track.index!);
    }
    return;
  }

  return (
    <div
      onClick={PlayMusicHandler}
      className="flex w-full h-[70px] items-center gap-4 "
    >
      <img
        className="w-[50px] h-[50px]"
        src={imagePreview ? imagePreview : track.thumbnail_url}
      />
      <div className="flex-1 flex flex-col gap-1">
        <h1 className="text-text-primary text-sm">{track.title}</h1>
        <p className="text-text-secondary text-xs">{track.artist}</p>
      </div>
      {setIsEditing && (
        <PencilSquareIcon
          className="w-[20px] cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsEditing(true)}
        />
      )}
      {track.time && <p className="text-sm">{track.time}</p>}
    </div>
  );
}

export default TrackItem;
