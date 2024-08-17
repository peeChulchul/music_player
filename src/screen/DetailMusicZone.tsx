import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEqTable } from "../service/tableService";
import { musicZoneRow, trackRow, UserRow } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import usePlayingMusicStore from "../store/playingMusicStore";
import MusicZoneHeader from "../components/MusicZoneHeader";
import TrackItem from "../components/track/TrackItem";
import useSessionStore from "../store/sessionStore";

interface IfetchMusicZoneTableResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
  userData: UserRow;
}

function DetailMusicZone() {
  const { musicZoneId } = useParams();
  const { openLoading, closeLoading } = useloadingStore();
  const { data, isLoading } = useQuery<IfetchMusicZoneTableResult>({
    queryKey: ["musicZone", musicZoneId],
    queryFn: fetchMusicZoneTable,
  });
  const { session } = useSessionStore();

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

  console.log(data);

  if (isLoading) return null;
  return (
    <div className="flex w-full">
      <MusicZoneHeader
        trackLength={data?.trackData.length!}
        userData={data?.userData!}
        musicZoneData={data?.musicZoneData!}
      />

      <div className="flex-1 flex flex-col">
        {data?.trackData.map((track, index) => (
          <div
            key={track.id}
            className="border px-4 flex border-gray-300 mb-1 rounded-md shadow cursor-default h-[70px]"
          >
            <TrackItem track={track} onClickMusicTrack={onClickMusicTrack} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailMusicZone;
