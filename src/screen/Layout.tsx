import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Sidebar />
      <div className="ml-[40px] flex-1 flex">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
