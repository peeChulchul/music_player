import React, { useState } from "react";
import { trackRow } from "../../types/supabase";
import TrackItem from "./TrackItem";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useModalStore from "../../store/modalStore";
interface ItrackListProps {
  tracks: trackRow[];
}

function TrackList({ tracks }: ItrackListProps) {
  const [trackList, setTrackList] = useState<trackRow[]>(tracks);
  const { openModal } = useModalStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log(event);
    if (!over) return;

    if (active.id !== over.id) {
      setTrackList((items) => {
        const oldIndex = items.findIndex((tracks) => tracks.id === active.id);
        const newIndex = items.findIndex((tracks) => tracks.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext
          items={trackList}
          strategy={verticalListSortingStrategy}
        >
          {trackList.map((track, index) => (
            <TrackItem key={track.id} track={track} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      <button onClick={() => {}}>리스트 추가</button>
    </div>
  );
}

export default TrackList;
