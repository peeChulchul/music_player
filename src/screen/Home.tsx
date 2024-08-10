import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { musicZoneRow } from "../types/supabase";
import { getAllTable } from "../service/tableService";
import useloadingStore from "../store/loadingStore";
import { useNavigate } from "react-router-dom";

function Home() {
  const { openLoading, closeLoading } = useloadingStore();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<musicZoneRow[]>({
    queryKey: ["home"],
    queryFn: () => fetchMusicZoneTable(),
  });

  useEffect(() => {
    openLoading();
    if (!isLoading) {
      closeLoading();
    }
  }, [isLoading]);

  async function fetchMusicZoneTable() {
    const result = await getAllTable({ tableName: "musiczone" });
    console.log(result);
    return result as musicZoneRow[];
  }

  if (isLoading) return null;

  return (
    <>
      {data?.map((musicZone) => (
        <div
          onClick={() => navigate(`DetailMusicZone/${musicZone.id}`)}
          key={musicZone.id}
        >
          {musicZone.zone_name}
        </div>
      ))}
    </>
  );
}

export default Home;
