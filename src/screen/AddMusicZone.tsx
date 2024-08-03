import React, { useEffect, useState } from "react";

import { musicZoneRow, Tables, trackRow } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import { useParams } from "react-router-dom";
import { getAllTable } from "../service/tableService";
import { useQuery } from "@tanstack/react-query";
import TrackList from "../components/track/TrackList";

interface Itracks
  extends Pick<Tables<"musictrack">, "title" | "thumbnail_url" | "track_url"> {}
interface IfetchMusicZoneTableResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
}

function AddMusicZone() {
  const { openLoading, closeLoading } = useloadingStore();
  const { musicZoneId } = useParams();
  const { data, error, isLoading } = useQuery<IfetchMusicZoneTableResult>({
    queryKey: ["musiczone", musicZoneId],
    queryFn: () => fetchMusicZoneTable(),
  });

  const [track, useTrack] = useState<Itracks[]>([]);

  useEffect(() => {
    openLoading();
    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

  async function fetchMusicZoneTable() {
    const musicZoneData = (await getAllTable({
      eqKey: "id",
      eqValue: musicZoneId!,
      tableName: "musiczone",
    })) as musicZoneRow[];
    const trackData = (await getAllTable({
      eqKey: "music_zone_id",
      eqValue: musicZoneId!,
      tableName: "musictrack",
    })) as trackRow[];

    return { musicZoneData: musicZoneData[0], trackData };
  }

  if (isLoading) return null;

  return (
    <div>
      <img
        className="w-[240px] h-[240px]"
        src={data?.musicZoneData.musiczone_img}
      />
      <TrackList tracks={data!.trackData as trackRow[]} />
    </div>
  );
}

export default AddMusicZone;
