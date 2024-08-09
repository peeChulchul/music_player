import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEqTable } from "../service/tableService";
import { musicZoneRow, trackRow } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import usePlayingMusicStore from "../store/playingMusicStore";

interface IfetchMusicZoneTableResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
}

function DetailMusicZone() {
  const { musicZoneId } = useParams();
  const { openLoading, closeLoading } = useloadingStore();
  const { data, isLoading } = useQuery<IfetchMusicZoneTableResult>({
    queryKey: ["musicZone", musicZoneId],
    queryFn: fetchMusicZoneTable,
  });

  const { selectPlayingMusic, setIsPlaying } = usePlayingMusicStore();

  useEffect(() => {
    openLoading();

    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

  function onClickMusicTrack(musicZoneId: string, index: number) {
    selectPlayingMusic(musicZoneId, index);
    setIsPlaying(true);
  }

  async function fetchMusicZoneTable() {
    const musicZoneData = (await getEqTable({
      eqKey: "id",
      eqValue: musicZoneId!,
      tableName: "musiczone",
    })) as musicZoneRow[];

    const trackData = (await getEqTable({
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

      {data?.trackData.map((track, index) => (
        <div
          onClick={() => onClickMusicTrack(track.music_zone_id, index)}
          key={track.id}
          className="border px-4 border-gray-300 mb-1 bg-white w-[500px] h-[70px] flex  items-center gap-4"
        >
          <img className="w-[50px] h-[50px]" src={track.thumbnail_url} />
          <div className="flex-1">
            <h1>{track.title}</h1>
            <h1>{track.artist}</h1>
          </div>

          {track.time && <p>{track.time}</p>}
        </div>
      ))}
    </div>
  );
}

export default DetailMusicZone;
