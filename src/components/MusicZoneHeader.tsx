import React, { useEffect, useState } from "react";
import {
  PencilIcon,
  ShareIcon,
  HandThumbUpIcon,
  PlayCircleIcon,
  TrashIcon,
  AdjustmentsVerticalIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/solid";
import { musicZoneRow, UserRow } from "../types/supabase";
import useModalStore from "../store/modalStore";
import ModifyMusicZoneModal from "./portal/ModifyMusicZoneModal";
import useSessionStore from "../store/sessionStore";
import { useNavigate } from "react-router-dom";
import useloadingStore from "../store/loadingStore";
import { deleteTable } from "../service/tableService";
import { deleteFolder } from "../service/storageService";
import usePlayingMusicStore from "../store/playingMusicStore";

interface ImusicZoneHeaderProps {
  musicZoneData: musicZoneRow;
  userData: UserRow;
  trackLength: number;
  trackId?: string | undefined;
}

function MusicZoneHeader({
  musicZoneData,
  userData,
  trackLength,
  trackId,
}: ImusicZoneHeaderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { openModal } = useModalStore();
  const { session } = useSessionStore();
  const navigate = useNavigate();
  const { openLoading, closeLoading } = useloadingStore();
  const { selectPlayingMusic, setIsPlaying, isPlaying, index, musicZoneId } =
    usePlayingMusicStore();

  const isMain = session?.user.id === musicZoneData.user_id;
  useEffect(() => {
    if (!open) return;
    const closeMenu = () => setOpen(false);

    const closeMenuTimer = setTimeout(() => {
      window.addEventListener("click", closeMenu);
    }, 200);

    return () => {
      clearTimeout(closeMenuTimer);
      window.removeEventListener("click", closeMenu);
    };
  }, [open]);

  async function deleteMusicZone() {
    openLoading();
    const deleteTableResult = await deleteTable({
      tableName: "musiczone",
      eqKey: "id",
      eqValue: musicZoneData.id,
    });
    const deleteFolderResult = await deleteFolder({
      bucketName: "image",
      path: `${userData.id}/${musicZoneData.id}`,
    });
    closeLoading();
    navigate("/");
  }

  function onClickPlay() {
    if (index === trackLength - 1) {
      selectPlayingMusic({
        musicZoneId: musicZoneData.id,
        index: 0,
        trackId: trackId,
      });
    }
    selectPlayingMusic({
      musicZoneId: musicZoneData.id,
      index,
      trackId: trackId,
    });

    setIsPlaying(true);
  }

  const isSelected = musicZoneId === musicZoneData.id;

  return (
    <div className="flex-1">
      <div className="flex sticky top-[50%] translate-y-[-50%] flex-col items-center flex-1 gap-2">
        <img
          src={musicZoneData.musiczone_img}
          className="w-[240px] h-[240px] rounded-2xl"
        />

        <div className="w-full flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <img
              src={userData.avatar_url!}
              className="w-[20px] h-[20px] rounded-full border"
            />
            <p className="text-sm text-text-secondary">{userData.username}</p>
          </div>
          <h1 className="text-xl font-bold w-[65%] text-center ">
            {musicZoneData.zone_name}
          </h1>
          <p className="text-text-tertiary text-xs">
            {musicZoneData.created_at.slice(0, 10)} {trackLength}곡 수록
          </p>
          <p className="text-text-tertiary text-center w-[60%] text-xs scrollbar-hide max-h-[48px] overflow-y-auto">
            {musicZoneData.description}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          {!isMain && (
            <>
              <ShareIcon className="w-[30px] h-[30px] text-layout-dark cursor-pointer" />
              {(!isPlaying || !isSelected) && (
                <PlayCircleIcon
                  onClick={onClickPlay}
                  className="w-[60px] h-[60px] text-layout-dark cursor-pointer"
                />
              )}
              {isSelected && isPlaying && (
                <PauseCircleIcon
                  onClick={() => {
                    setIsPlaying(false);
                  }}
                  className="w-[60px] h-[60px] text-layout-dark cursor-pointer"
                />
              )}
              <HandThumbUpIcon className="w-[30px] h-[30px] text-layout-dark cursor-pointer" />
            </>
          )}
          {isMain && (
            <>
              <ShareIcon className="w-[30px] h-[30px] text-layout-dark cursor-pointer" />
              <HandThumbUpIcon className="w-[30px] h-[30px] text-layout-dark cursor-pointer" />
              {(!isPlaying || !isSelected) && (
                <PlayCircleIcon
                  onClick={onClickPlay}
                  className="w-[60px] h-[60px] text-layout-dark cursor-pointer"
                />
              )}
              {isSelected && isPlaying && (
                <PauseCircleIcon
                  onClick={() => {
                    setIsPlaying(false);
                  }}
                  className="w-[60px] h-[60px] text-layout-dark cursor-pointer"
                />
              )}
              <PencilIcon
                onClick={() =>
                  openModal(
                    <ModifyMusicZoneModal musicZoneData={musicZoneData} />
                  )
                }
                className="w-[30px] h-[30px] text-layout-dark cursor-pointer"
              />
              <div onClick={() => setOpen(true)} className="relative">
                <AdjustmentsVerticalIcon className="w-[30px] h-[30px] text-layout-dark cursor-pointer" />
                <div
                  className={
                    open
                      ? "z-10 absolute w-[200px] bg-main-bg text-text-primary rounded-sm shadow left-[100%] top-0 translate-y-[-100%]"
                      : "hidden"
                  }
                >
                  <ul className="text-sm">
                    <li
                      onClick={() =>
                        navigate(
                          `/ModifyMusicZone/${musicZoneData.user_id}/${musicZoneData.id}`
                        )
                      }
                      className="px-4 py-2 hover:bg-bg-secondary cursor-pointer"
                    >
                      트랙 수정
                    </li>
                    <li
                      onClick={deleteMusicZone}
                      className="px-4 py-2 hover:bg-bg-secondary cursor-pointer"
                    >
                      뮤직존 삭제
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicZoneHeader;
