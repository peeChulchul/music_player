import React from "react";
import { trackRow } from "../../types/supabase";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface ItrackItemProps {
  track: trackRow;
  index: number;
}

function TrackItem({ track, index }: ItrackItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      className={[
        "p-2 border flex border-gray-300 mb-1 bg-white cursor-grab",
      ].join(" ")}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <img className="w-[50px] h-[50px]" src={track.thumbnail_url} />
      <h1>{track.title}</h1>
      <a target="_blank" href={track.track_url}>
        링크로 이동
      </a>
    </div>
  );
}

export default TrackItem;
