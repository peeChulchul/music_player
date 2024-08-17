import React, { useEffect, useState } from "react";
import { trackRow } from "../../types/supabase";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditingTrackItme from "./EditingTrackItme";
import TrackItem from "./TrackItem";

interface IEditingAbleTrackItemProps {
  track: trackRow;
  index: number;
}

function EditingAbleTrackItem({ track, index }: IEditingAbleTrackItemProps) {
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
    if (track.track_url.trim() === "") {
      setIsEditing(true);
    }
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      className={"flex-1"}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {isEditing && (
        <div className="border px-4 flex border-gray-300 mb-1 rounded-md shadow cursor-grab  h-[70px]">
          <EditingTrackItme
            index={index}
            setIsEditing={setIsEditing}
            track={track}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </div>
      )}
      {!isEditing && (
        <div className="border px-4 flex border-gray-300 mb-1 rounded-md shadow cursor-grab  h-[70px]">
          <TrackItem
            track={track}
            setIsEditing={setIsEditing}
            imagePreview={imagePreview}
          />
        </div>
      )}
    </div>
  );
}

export default EditingAbleTrackItem;
