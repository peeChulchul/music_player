import React, { useEffect, useState } from "react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import useSessionStore from "../store/sessionStore";
import useModalStore from "../store/modalStore";
import AuthModal from "./modal/AuthModal";
import { signOut } from "../service/authService";
import ProfileModal from "./modal/ProfileModal";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const { userTable } = useSessionStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  function onClickCreateZone() {
    navigate(`${userTable!.id}/addMusicZone`);
  }

  function onClickProfile() {
    if (userTable) {
      return setOpen(true);
    }
    openModal(<AuthModal />);
  }

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

  return (
    <div className="flex py-2 bg-gray-800 items-center pl-2 pr-4 sticky top-0 ml-[40px]">
      <form className="flex w-[480px] bg-slate-600 rounded-md overflow-hidden items-center py-1 px-2">
        <input className="flex-1 bg-inherit outline-none" />
        <MagnifyingGlassIcon className="w-5 h-5 rounded cursor-pointer" />
      </form>

      <div className="text-white ml-auto relative flex">
        <button
          className="w-7 h-7 cursor-pointer border rounded-full overflow-hidden flex items-center justify-center"
          onClick={onClickProfile}
        >
          <Avatar src={userTable?.avatar_url} />
        </button>
        <button onClick={onClickCreateZone}>Zone생성하기(임시)</button>

        <div
          id="HeadCateDropdown"
          className={
            open
              ? "z-10 absolute w-24 bg-white rounded-sm shadow left-0 translate-x-[-100%]"
              : "hidden"
          }
        >
          <ul className="text-sm text-gray-700 ">
            <li className="p-2 hover:underline  cursor-pointer">
              <button
                onClick={() => {
                  openModal(<ProfileModal />);
                }}
              >
                프로필 수정
              </button>
            </li>
            <li className="p-2 hover:underline  cursor-pointer">
              <button className="w-full h-full text-left" onClick={signOut}>
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
