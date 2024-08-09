import React, { Dispatch, SetStateAction, useState } from "react";
import { trackRow, trackRowWithFile } from "../../types/supabase";
import TrackItem from "./TrackItem";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTrackContext } from "../../store/trackContext";

function TrackList() {
  const { setTrackList, trackList } = useTrackContext();
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setTrackList((items) => {
        const oldIndex = items.findIndex((tracks) => tracks.id === active.id);
        const newIndex = items.findIndex((tracks) => tracks.id === over.id);
        const newTrackList = arrayMove(items, oldIndex, newIndex).map(
          (track, index) => ({ ...track, index })
        );
        return newTrackList;
      });
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={trackList}
          strategy={verticalListSortingStrategy}
        >
          {trackList.map((track, index) => (
            <TrackItem key={track.id} track={track} index={index} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default TrackList;
