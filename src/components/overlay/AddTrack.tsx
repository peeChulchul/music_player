import React, { useState } from "react";
import styles from "src/style/modal.module.css";
function AddTrack() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  return (
    <div
      className={[
        styles.modalcontent,
        "bg-white p-6 rounded-lg shadow-lg",
      ].join(" ")}
    >
      <img
        src={
          preview
            ? preview
            : "https://smydpnzfrremvfutiaro.supabase.co/storage/v1/object/public/image/default/default_music.png?t=2024-08-03T23%3A54%3A33.990Z"
        }
      />
      <input />
    </div>
  );
}

export default AddTrack;
