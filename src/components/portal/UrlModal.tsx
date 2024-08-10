import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import useModalStore from "../../store/modalStore";
import styles from "src/style/modal.module.css";
import { OutlineButton } from "../ui/Button";

interface IurlModalProps {
  setUrlData: Dispatch<SetStateAction<string>>;
  setDuration: Dispatch<SetStateAction<string>>;
}

function UrlModal({ setDuration, setUrlData }: IurlModalProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isAllowedUrl, setIsAllowedUrl] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { closeModal } = useModalStore();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isAllowedUrl) {
      closeModal();
    }
  }, [isAllowedUrl, closeModal, showError]);

  function handleError() {
    setShowError(true);
  }

  function handleReady() {
    setIsAllowedUrl(true);
    setUrlData(url);
  }

  function onSubmitUrlHandler(e: React.FormEvent) {
    e.preventDefault();
    setUrl(inputValue);
    setShowError(false);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <form
      onSubmit={onSubmitUrlHandler}
      className={`${styles.modalcontent} flex flex-col items-center gap-2 p-6 pb-4 rounded-lg shadow-lg`}
    >
      <h1 className="font-semibold text-xl">URL을 입력해주세요</h1>
      <input
        ref={inputRef}
        placeholder="Url을 입력해주세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="outline-none text-text-primary p-2 rounded-md min-w-[300px]"
      />
      {showError && <p className="text-xs text-red-400">잘못된 URL입니다</p>}
      <ReactPlayer
        url={url}
        playing={false}
        onReady={handleReady}
        onDuration={(duration) => {
          {
            setDuration(formatTime(duration));
          }
        }}
        onError={handleError}
        height="0"
        width="0"
        config={{
          youtube: {
            playerVars: {
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
            },
          },
        }}
      />
      <div className="w-full flex flex-col">
        <OutlineButton text="text-blue-400">등록</OutlineButton>
      </div>
    </form>
  );
}

export default UrlModal;
