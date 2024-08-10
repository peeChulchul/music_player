import React from "react";
import {
  HomeIcon,
  FolderIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

function Sidebar() {
  return (
    <div className="fixed z-10 top-0 left-0 h-full bg-gray-800 p-2 border-r border-r-slate-600">
      <HomeIcon className="w-6 h-6 text-white mb-4" />
      <FolderIcon className="w-6 h-6 text-white mb-4" />
      <MusicalNoteIcon className="w-6 h-6 text-white mb-4" />
    </div>
  );
}

export default Sidebar;
