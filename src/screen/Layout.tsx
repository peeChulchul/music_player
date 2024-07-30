import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Layout() {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="ml-[44px]">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
