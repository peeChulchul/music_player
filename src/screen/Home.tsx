import React, { useEffect, useState } from "react";
import useModalStore from "src/store/modalStore";
import AuthModal from "src/components/overlay/AuthModal";
import { useQuery } from "@tanstack/react-query";
import { musicZoneRow } from "../types/supabase";
import { getAllTable } from "../service/tableService";
import useloadingStore from "../store/loadingStore";
import { useNavigate } from "react-router-dom";

function Home() {
  const { openModal } = useModalStore();
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

  console.log(data);

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
