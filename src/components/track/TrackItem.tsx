import React, { useEffect, useState } from "react";
import { trackRow } from "../../types/supabase";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditingTrackItme from "./EditingTrackItme";
import { WrenchIcon } from "@heroicons/react/24/outline";

interface ItrackItemProps {
  track: trackRow;
  index: number;
}

function TrackItem({ track, index }: ItrackItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track.id });
  const [imagePreview, setImagePreview] = useState<string>(() => {
    if (track.thumbnail_url.startsWith("data:image")) {
      return `${track.thumbnail_url}`;
    } else if (track.thumbnail_url.startsWith("https://")) {
      return `${track.thumbnail_url}?${Math.random()}`;
    }
    return track.thumbnail_url;
  });

  useEffect(() => {
    if (track.track_url === "") {
      setIsEditing(true);
    }
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={style}
      className={[
        "border px-4 flex border-gray-300 mb-1 bg-white cursor-grab w-[500px] h-[70px]",
      ].join(" ")}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {isEditing && (
        <EditingTrackItme
          setIsEditing={setIsEditing}
          track={track}
          index={index}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />
      )}
      {!isEditing && (
        <div className="flex w-full h-full items-center gap-4">
          <img className="w-[50px] h-[50px]" src={imagePreview} />
          <div className="flex-1">
            <h1>{track.title}</h1>
            <h1>{track.artist}</h1>
          </div>
          <WrenchIcon
            className="w-[50px]"
            onPointerDown={handlePointerDown}
            onClick={() => setIsEditing(true)}
          />
          {track.time && <p>{track.time}</p>}
        </div>
      )}
    </div>
  );
}

export default TrackItem;
