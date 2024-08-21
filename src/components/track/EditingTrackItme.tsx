import React, { Dispatch, SetStateAction, useState } from "react";
import { trackRow } from "../../types/supabase";
import ImageInput from "../ImageInput";
import { useTrackContext } from "../../store/trackContext";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/solid";
import useModalStore from "../../store/modalStore";
import UrlModal from "../portal/UrlModal";

interface ItrackItemProps {
  track: trackRow;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  imagePreview: string;
  setImagePreview: Dispatch<SetStateAction<string>>;
  index: number;
}

function EditingTrackItme({
  track,
  setIsEditing,
  imagePreview,
  setImagePreview,
  index,
}: ItrackItemProps) {
  const [title, setTitle] = useState<string>(track.title);
  const [artist, setArtist] = useState<string>(track.artist || "");
  const [file, setFile] = useState<File | null>(null);
  const [urlData, setUrlData] = useState<string>(track.track_url);
  const [duration, setDuration] = useState<string>(track.time || "");

  const { setTrackList } = useTrackContext();
  const { openModal } = useModalStore();

  function onClickCheckBtn() {
    const track_url = urlData.trim() === "" ? track.track_url : urlData;
    console.log("제출");
    if (!urlData && !track.track_url) {
      return alert("음원이 등록되지않았습니다.");
    }
    if (title.trim() === "") {
      return alert("제목이 입렵되지않았습니다.");
    }
    setTrackList((prev) => {
      const newList = prev.map((prevTrack) => {
        if (prevTrack.id === track.id) {
          return {
            ...prevTrack,
            title,
            time: duration,
            file,
            track_url,
            index,
            artist: artist.trim() === "" ? track.artist : artist,
            thumbnail_url: imagePreview,
          };
        }
        return prevTrack;
      });
      return newList;
    });
    setIsEditing(false);
  }

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="flex px-4 w-full h-[70px] items-center gap-4 cursor-default border border-red-300 mb-1 rounded-md shadow"
    >
      <div className="w-[50px] h-[50px]">
        <ImageInput
          setFile={setFile}
          setImagePreview={setImagePreview}
          imagePreview={imagePreview}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <input
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              setTitle((prev) => prev + " ");
            }
          }}
          value={title}
          onChange={(e) => {
            console.log(e.target.value);
            setTitle(e.target.value);
          }}
          placeholder="제목을 입력해주세요"
          className="text-text-primary  bg-transparent text-sm outline-none rounded-sm"
        />
        <input
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              setArtist((prev) => prev + " ");
            }
          }}
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="아티스트"
          className="text-text-secondary  bg-transparent text-xs outline-none rounded-sm"
        />
      </div>
      <LinkIcon
        onClick={() =>
          openModal(
            <UrlModal setUrlData={setUrlData} setDuration={setDuration} />
          )
        }
        className="w-[20px] h-full text-layouy-dark cursor-pointer"
      />
      {urlData && title && (
        <CheckIcon
          className="w-[20px] h-full text-layouy-dark cursor-pointer"
          onClick={onClickCheckBtn}
        />
      )}

      {duration.trim() !== "" && <p className="text-sm">{duration}</p>}
    </div>
  );
}

export default EditingTrackItme;
