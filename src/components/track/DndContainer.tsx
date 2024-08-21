import React from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
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
import EditingAbleTrackList from "./EditingAbleTrackList";

function DndContainer() {
  const { setTrackList, trackList } = useTrackContext();
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor)
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
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext items={trackList} strategy={verticalListSortingStrategy}>
        {trackList.map((track, index) => (
          <EditingAbleTrackList key={track.id} track={track} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default DndContainer;
