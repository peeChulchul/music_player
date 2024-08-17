/* eslint-disable no-restricted-globals */

import React, { useEffect, useState } from "react";
import { musicZoneRow, trackRow, trackRowWithFile } from "../types/supabase";
import useloadingStore from "../store/loadingStore";
import { useParams } from "react-router-dom";
import { getEqTable, upsertTable } from "../service/tableService";
import { useQuery } from "@tanstack/react-query";
import TrackList from "../components/track/TrackList";
import { Button, OutlineButton } from "../components/ui/Button";
import { v4 } from "uuid";
import { useTrackContext } from "../store/trackContext";
import { getPublicUrl, uploadFile } from "../service/storageService";
import MusicZoneHeader from "../components/MusicZoneHeader";
import useSessionStore from "../store/sessionStore";
import { PlusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

interface IfetchMusicZoneTableResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
}

function AddMusicZone() {
  const { openLoading, closeLoading } = useloadingStore();
  const { musicZoneId } = useParams();
  const { data, error, isLoading, refetch } =
    useQuery<IfetchMusicZoneTableResult>({
      queryKey: ["musiczone", musicZoneId],
      queryFn: () => fetchMusicZoneTable(),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  const { userTable } = useSessionStore();
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
    <div className="flex flex-1">
      <MusicZoneHeader
        musicZoneData={musicZoneData}
        userData={userTable!}
        trackLength={trackList.length}
      />

      <div className={"flex-1 pr-10 h-[calc(100vh-149px)]"}>
        <div className="h-[calc(100%-110px)] overflow-y-auto scrollbar-hide">
          <TrackList />
        </div>
        <div className="text-center flex flex-col sticky bottom-0">
          <OutlineButton
            border="shadow"
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
            <PlusIcon className="w-[30px] mx-auto text-layout-dark" />
          </OutlineButton>
          <Button
            color="bg-gray-600 flex justify-center px-5 me-0 py-2"
            onClick={saveMusicZoneHandler}
          >
            <FolderPlusIcon className="w-[30px] mx-auto text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddMusicZone;
