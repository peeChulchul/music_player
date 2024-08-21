import { musicZoneRow, trackRow, UserRow } from "./supabase";

export interface IfetchMusicZoneResult {
  musicZoneData: musicZoneRow;
  trackData: trackRow[];
  userData: UserRow;
}
