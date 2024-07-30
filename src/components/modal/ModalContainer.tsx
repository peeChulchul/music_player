import React from "react";
import ReactDOM from "react-dom";
import useModalStore from "src/store/modalStore";
import styles from "src/style/modal.module.css";
function ModalContainer() {
  const { isOpen, modalContent, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <div className={styles.modalcontainer}>
            <div onClick={closeModal} className={styles.modaloverlay} />
            {modalContent}
          </div>
        </>,
        document.getElementById("modal-root")!
      )}
    </>
  );
}

export default ModalContainer;
