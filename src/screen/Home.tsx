import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { musicZoneRow } from "../types/supabase";
import { getAllTable, getEqTable, getNeqTable } from "../service/tableService";
import useloadingStore from "../store/loadingStore";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../store/sessionStore";
import MusicZoneItem from "../components/MusicZoneItem";

interface IfetchMusicZoneTavle {
  usersMusicZone: musicZoneRow[] | null;
  allMusicTableData: musicZoneRow[];
}

function Home() {
  const { openLoading, closeLoading } = useloadingStore();
  const { session } = useSessionStore();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery<IfetchMusicZoneTavle>({
    queryKey: ["home"],
    queryFn: () => fetchMusicZoneTable(),
  });

  useEffect(() => {
    openLoading();
    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

  useEffect(() => {
    if (session) refetch();
  }, [session]);

  async function fetchMusicZoneTable() {
    let allMusicTableData;
    let usersMusicZone = null;

    if (session) {
      allMusicTableData = (await getEqTable({
        eqKey: "id",
        eqValue: session.user.id,
        tableName: "musiczone",
      })) as musicZoneRow[];

      usersMusicZone = (await getNeqTable({
        eqKey: "id",
        eqValue: session.user.id,
        tableName: "musiczone",
      })) as musicZoneRow[];

      return { usersMusicZone, allMusicTableData };
    }

    allMusicTableData = (await getAllTable({
      tableName: "musiczone",
    })) as musicZoneRow[];

    return { usersMusicZone, allMusicTableData };
  }

  if (isLoading) return null;

  return (
    <>
      <div>
        {data?.usersMusicZone && (
          <>
            <h1>My Music Zone</h1>
            <div className="flex gap-4">
              {data?.usersMusicZone.map((musicZone) => (
                <MusicZoneItem
                  musicZoneData={musicZone}
                  onClickMusicZone={() =>
                    navigate(`DetailMusicZone/${musicZone.id}`)
                  }
                />
                // <div
                //   onClick={() => navigate(`DetailMusicZone/${musicZone.id}`)}
                //   key={musicZone.id}
                // >
                //   {musicZone.zone_name}
                // </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
