import React from "react";
import styles from "src/style/modal.module.css";
function AddTrack() {
  return (
    <div
      className={[
        styles.modalcontent,
        "bg-white p-6 rounded-lg shadow-lg",
      ].join(" ")}
    >
      AddTrack
    </div>
  );
}

export default AddTrack;
