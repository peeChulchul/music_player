import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { trackRow } from "../../types/supabase";
import ImageInput from "../ImageInput";
import { useTrackContext } from "../../store/trackContext";
import ReactPlayer from "react-player";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/solid";
import useModalStore from "../../store/modalStore";
import UrlModal from "../overlay/UrlModal";

interface ItrackItemProps {
  track: trackRow;
  index: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  imagePreview: string;
  setImagePreview: Dispatch<SetStateAction<string>>;
}

function EditingTrackItme({
  track,
  setIsEditing,
  imagePreview,
  setImagePreview,
}: ItrackItemProps) {
  const [title, setTitle] = useState<string>(track.title);
  const [artist, setArtist] = useState<string>(track.artist || "");
  const [file, setFile] = useState<File | null>(null);
  const [urlData, setUrlData] = useState<string>("");
  const [duration, setDuration] = useState<string>(track.time || "");

  const { setTrackList, trackList } = useTrackContext();
  const { openModal } = useModalStore();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

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

  useEffect(() => {
    if (file) {
      setTrackList((trackList) => {
        const newTrackList = trackList.map((trackData) => {
          if (trackData.id === track.id) {
            return { ...trackData, file };
          }
          return trackData;
        });

        return newTrackList;
      });
    }
  }, [file]);

  return (
    <div
      className="flex w-full h-full items-center gap-4 cursor-default"
      onPointerDown={handlePointerDown}
    >
      <div className="w-[50px] h-[50px]">
        <ImageInput
          setFile={setFile}
          setImagePreview={setImagePreview}
          imagePreview={imagePreview}
        />
      </div>
      <div className="flex-1 flex flex-col">
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
        />
      </div>
      <LinkIcon
        onClick={() =>
          openModal(
            <UrlModal setUrlData={setUrlData} setDuration={setDuration} />
          )
        }
        className="w-[25px] h-full cursor-pointer"
      />

      <CheckIcon
        className="w-[25px] h-full cursor-pointer"
        onClick={onClickCheckBtn}
      />
      {duration.trim() !== "" && <p>{duration}</p>}
    </div>
  );
}

export default EditingTrackItme;
