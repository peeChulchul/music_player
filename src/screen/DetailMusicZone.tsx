import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEqTable } from "../service/tableService";
import { musicZoneRow, trackRow, UserRow } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import usePlayingMusicStore from "../store/playingMusicStore";
import MusicZoneHeader from "../components/MusicZoneHeader";
import TrackItem from "../components/track/TrackItem";
import { IfetchMusicZoneResult } from "../types/query";

function DetailMusicZone() {
  const { musicZoneId } = useParams();
  const { openLoading, closeLoading } = useloadingStore();
  const { data, isLoading } = useQuery<IfetchMusicZoneResult>({
    queryKey: ["musiczone", musicZoneId],
    queryFn: fetchMusicZoneTable,
  });

  const { selectPlayingMusic, setIsPlaying, isPlaying } =
    usePlayingMusicStore();

  useEffect(() => {
    openLoading();

    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

  function onClickMusicTrack({
    musicZoneId,
    index,
    trackId,
  }: {
    musicZoneId: string;
    index: number;
    trackId: string;
  }) {
    selectPlayingMusic({ musicZoneId, index, trackId });
    setIsPlaying(!isPlaying);
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

    const userData = (await getEqTable({
      eqKey: "id",
      eqValue: musicZoneData[0].user_id!,
      tableName: "user",
    })) as UserRow[];

    return {
      musicZoneData: musicZoneData[0],
      trackData,
      userData: userData[0],
    };
  }

  if (isLoading) return null;
  return (
    <div className="flex w-full">
      <MusicZoneHeader
        trackLength={data?.trackData.length!}
        userData={data?.userData!}
        musicZoneData={data?.musicZoneData!}
        trackId={data?.trackData[0]?.id}
      />

      <div className="flex-1 flex flex-col">
        {data?.trackData.map((track, index) => (
          // <div className=" mb-1 rounded-md shadow cursor-pointer ">
          <TrackItem track={track} key={track.id} />
          // </div>
        ))}
      </div>
    </div>
  );
}

export default DetailMusicZone;
