import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MusicBar from "../components/layout/MusicBar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Sidebar />
      <div className="ml-[40px] mb-[56px] flex-1 flex">
        <Outlet />
      </div>
      <MusicBar />
    </div>
  );
}

export default Layout;
