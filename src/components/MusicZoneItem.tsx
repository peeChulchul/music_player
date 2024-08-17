import React from "react";
import { musicZoneRow } from "../types/supabase";

interface ImusicZoneItem {
  musicZoneData: musicZoneRow;
  onClickMusicZone: () => void;
}

function MusicZoneItem({ musicZoneData, onClickMusicZone }: ImusicZoneItem) {
  return (
    <div
      onClick={onClickMusicZone}
      className="flex flex-col gap-1 cursor-pointer"
    >
      <img
        src={musicZoneData.musiczone_img}
        className="w-[200px] h-[200px] rounded-md"
      />
      <h1 className="text-text-primary ">{musicZoneData.zone_name}</h1>
      <p className="text-text-tertiary text-sm">{musicZoneData.description}</p>
    </div>
  );
}

export default MusicZoneItem;
