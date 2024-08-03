import React, { useEffect, useState } from "react";
import useModalStore from "src/store/modalStore";
import AuthModal from "src/components/overlay/modal/AuthModal";

function Home() {
  const { openModal } = useModalStore();

  return (
    <>
      {/* <button onClick={() => openModal(<AuthModal />)}>로그인</button>
      <button onClick={signOut}>로그아웃</button> */}
    </>
  );
}

export default Home;
