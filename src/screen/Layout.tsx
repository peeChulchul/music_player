import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MusicBar from "../components/layout/MusicBar";

function Layout() {
  return (
    <div className="min-h-screen w-full bg-main-bg text-text-primary  flex flex-col">
      <Header />
      {/* <Sidebar /> */}
      <div className="mb-[56px] flex-1 flex p-4">
        <Outlet />
      </div>
      <MusicBar />
    </div>
  );
}

export default Layout;
