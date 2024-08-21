import React, { useEffect, useState } from "react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import useSessionStore from "../../store/sessionStore";
import useModalStore from "../../store/modalStore";
import AuthModal from "../portal/AuthModal";
import { signOut } from "../../service/authService";
import ProfileModal from "../portal/ProfileModal";
import Avatar from "../Avatar";
import CreateMusicZoneModal from "../portal/CreateMusicZoneModal";
import { useNavigate } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const { userTable } = useSessionStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  async function onClickCreateZone() {
    openModal(<CreateMusicZoneModal />);
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
    <div className="flex gap-4 z-10 py-2 bg-layout-dark text-text-primary items-center pl-2 pr-4 sticky top-0">
      <img
        onClick={() => navigate("")}
        src="https://smydpnzfrremvfutiaro.supabase.co/storage/v1/object/public/image/default/default_logo.png?t=2024-08-10T07%3A01%3A47.402Z"
        className="object-contain w-[70px] h-[45px] cursor-pointer"
      />
      <form className="flex w-[480px] bg-bg-secondary rounded-md overflow-hidden items-center py-1 px-2">
        <input className="flex-1 bg-inherit outline-none" />
        <MagnifyingGlassIcon className="w-5 h-5 rounded cursor-pointer" />
      </form>

      <div className="ml-auto relative flex">
        <button
          className="w-7 h-7 cursor-pointer border rounded-full overflow-hidden flex items-center justify-center"
          onClick={onClickProfile}
        >
          <Avatar src={userTable?.avatar_url} />
        </button>

        <div
          className={
            open
              ? "z-10 absolute w-[200px] bg-main-bg text-text-primary rounded-sm shadow left-0 top-[100%] translate-x-[-100%]"
              : "hidden"
          }
        >
          <ul className="text-sm">
            <li className="px-4 py-2 hover:bg-bg-secondary cursor-pointer">
              <div className="flex gap-2 items-center">
                <div className="w-[40px] h-[40px]">
                  <Avatar src={userTable?.avatar_url} />
                </div>
                <h1 className="text-base font-semibold">
                  {userTable?.username}
                </h1>
              </div>
            </li>
            <li
              onClick={() => {
                openModal(<ProfileModal />);
              }}
              className="px-4 py-2 hover:bg-bg-secondary cursor-pointer"
            >
              프로필 수정
            </li>
            <li
              onClick={onClickCreateZone}
              className="px-4 py-2 hover:bg-bg-secondary cursor-pointer"
            >
              MusicZone 만들기
            </li>
            <li
              onClick={signOut}
              className="px-4 py-2 hover:bg-bg-secondary cursor-pointer"
            >
              로그아웃
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
