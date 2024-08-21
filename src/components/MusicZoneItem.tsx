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
      className="flex flex-col gap-1 cursor-pointer flex-1 w-[200px]"
    >
      <img
        src={musicZoneData.musiczone_img}
        className="w-[200px] h-[200px] rounded-md"
      />
      <h1 className="text-text-primary line-clamp-1">
        {musicZoneData.zone_name}
      </h1>
      <p className="text-text-tertiary text-sm line-clamp-2">
        {musicZoneData.description}
      </p>
    </div>
  );
}

export default MusicZoneItem;
