import React, { useState, useCallback } from "react";
import ReactPlayer from "react-player";

const AudioPlayer: React.FC<{ url: string }> = React.memo(({ url }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div onPointerDown={handlePointerDown}>
      <ReactPlayer
        url={url}
        playing={isPlaying}
        controls={false}
        width="0"
        height="0"
        onEnded={() => setIsPlaying(false)}
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
      <button onClick={togglePlayback}>{isPlaying ? "Stop" : "Play"}</button>
    </div>
  );
});

export default AudioPlayer;
