import React from "react";
import { trackRow } from "../../types/supabase";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import usePlayingMusicStore from "../../store/playingMusicStore";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

interface IEditingAbleTrackItemProps {
  track: trackRow;
  imagePreview?: string;
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
}

function EditingAbleTrackItem({
  track,
  imagePreview,
  setIsEditing,
}: IEditingAbleTrackItemProps) {
  const { isPlaying, musicZoneId, trackId } = usePlayingMusicStore();

  const isSelected = track.id === trackId;

  return (
    <div className="flex px-4 w-full h-[70px] items-center gap-4 border border-gray-300 mb-1 rounded-md shadow cursor-grab">
      <img
        className="w-[50px] h-[50px]"
        src={imagePreview ? imagePreview : track.thumbnail_url}
      />
      <div className="flex-1 flex flex-col gap-1">
        <h1 className="text-text-primary text-sm">{track.title}</h1>
        <p className="text-text-secondary text-xs">{track.artist}</p>
      </div>
      <PencilSquareIcon
        className="w-[20px] cursor-pointer"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setIsEditing(true)}
      />
      {track.time && <p className="text-sm">{track.time}</p>}
    </div>
  );
}

export default EditingAbleTrackItem;
