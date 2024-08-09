/* eslint-disable no-restricted-globals */

import React, { useContext, useEffect, useState } from "react";
import { musicZoneRow, trackRow, trackRowWithFile } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import { useParams } from "react-router-dom";
import {
  getAllTable,
  getEqTable,
  insertTable,
  upsertTable,
} from "../service/tableService";
import { useQuery } from "@tanstack/react-query";
import TrackList from "../components/track/TrackList";
import Button from "../components/ui/Button";
import { v4 } from "uuid";
import { useTrackContext } from "../store/trackContext";
import { getPublicUrl, uploadFile } from "../service/storageService";

interface IfetchMusicZoneTableResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
}

function AddMusicZone() {
  const { openLoading, closeLoading } = useloadingStore();
  const { musicZoneId } = useParams();
  const { error, isLoading, refetch } = useQuery<IfetchMusicZoneTableResult>({
    queryKey: ["musiczone", musicZoneId],
    queryFn: () => fetchMusicZoneTable(),

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const [musicZoneData, setMusicZoneData] = useState<musicZoneRow>();

  const { trackList, setTrackList } = useTrackContext();

  useEffect(() => {
    openLoading();
    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

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
    const trackDataWithFiles = trackData.map((track) => ({
      ...track,
      file: null,
    }));
    setTrackList(trackDataWithFiles);
    setMusicZoneData(musicZoneData[0]);

    return { musicZoneData: musicZoneData[0], trackData };
  }

  async function saveMusicZoneHandler() {
    const agreed = confirm("저장하지 않은 내용은 삭제됩니다!");
    console.log(agreed);
    if (agreed) {
      openLoading();
      const bucketName = "image";
      const newTrackList = await Promise.all(
        trackList
          .filter((track) => track.track_url || track.title)
          .map(async (track) => {
            const { file, ...trackItems } = track;

            if (file) {
              const fileName = track.id;
              const path = `${musicZoneData?.user_id}/${track.music_zone_id}`;
              await uploadFile({
                bucketName,
                path: `${path}/${fileName}`,
                file,
              });
              const publicUrl = await getPublicUrl({
                bucketName,
                fileName,
                path,
              });
              console.log(publicUrl);
              return { ...trackItems, thumbnail_url: publicUrl };
            }
            return { ...trackItems };
          })
      );

      if (newTrackList.length > 0) {
        const upsertResult = await upsertTable({
          onConflict: "id",
          tableName: "musictrack",
          upsertValue: newTrackList,
        });
        console.log(upsertResult);
      }
      await refetch();
      closeLoading();
    }
  }

  if (isLoading || !musicZoneData) return null;

  return (
    <div>
      <img className="w-[240px] h-[240px]" src={musicZoneData.musiczone_img} />
      <h1>{musicZoneData.zone_name}</h1>
      <p>{musicZoneData.description}</p>
      <TrackList />

      <Button
        onClick={() => {
          setTrackList((cur) => [
            ...cur,
            {
              id: v4(),
              index: null,
              music_zone_id: musicZoneData.id!,
              thumbnail_url:
                "https://smydpnzfrremvfutiaro.supabase.co/storage/v1/object/public/image/default/default_music.png",
              title: "",
              track_url: "",
              artist: "알수없는 아티스트",
              file: null,
              time: "",
            },
          ]);
        }}
      >
        리스트 추가
      </Button>
      <Button onClick={saveMusicZoneHandler}>저장하기</Button>
    </div>
  );
}

export default AddMusicZone;
