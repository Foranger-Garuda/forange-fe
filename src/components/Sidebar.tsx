"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronLeft, FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onStateChange: (isClosed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onStateChange }) => {
  const [isClosed, setIsClosed] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string>(""); // Track selected menu
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsClosed((prev) => {
      onStateChange(!prev);
      return !prev;
    });
  };

  const handleMenuClick = (menu: string, link: string) => {
    setSelectedMenu(menu);
    router.push(link);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen((prev) => !prev);
    setSelectedMenu("settings");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 bg-[#1F2A24] lg:hidden text-white p-1 rounded-md border-2 border-[#2D2F39] ${!isClosed ? "hidden" : "block"}`}
      >
        <FaChevronLeft className="rotate-180"
        />
      </button>
      <nav
        className={`bg-primary-brunswick-green text-white fixed top-4 left-4 lg:h-[calc(100vh-2rem)] rounded-xl transition-all duration-300 lg:flex flex-col ${
          isClosed ? "lg:w-16 lg:px-2 hidden" : "w-64 px-4"
        } lg:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-4 border-b border-[#3D6652] pb-4">
          <div className="flex flex-row gap-1 w-full">
            <img src="/Avatar.png" alt="Logo" className="w-10 h-10" />
            {!isClosed && (
              <div className="flex flex-col gap-1 w-full items-center justify-center">
                <span className="font-semibold text-sm">Carmelo</span>
                <span className="text-xs">Anthony</span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="absolute  top-6 -right-3 p-1.5 rounded-md bg-[#1F2A24] border-2 border-[#2D2F39]"
          >
            <FaChevronLeft
              className={`text-xs transition-transform ${
                isClosed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

      {/* Main Menu */}
      {!isClosed && <div className="text-xs text-gray-300 mb-2">MAIN</div>}
      <ul className="flex flex-col space-y-1 text-sm">
        <li className="w-full">
          <Button
            onClick={() => handleMenuClick("home", "/")}
            className={`flex w-full items-center justify-baseline shadow-none gap-2 py-2 px-3 rounded ${
              selectedMenu === "home"
                ? "bg-[#E4C77B] text-black hover:bg-[#E4C77B]"
                : "bg-transparent hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <HiOutlineHome />
            {!isClosed && <span>Home</span>}
          </Button>
        </li>
        <li className="w-full">
          <Button
            onClick={() => handleMenuClick("analyze-soil", "/upload")}
            className={`flex w-full items-center justify-baseline shadow-none gap-2 py-2 px-3 rounded ${
              selectedMenu === "analyze-soil"
                ? "bg-[#E4C77B] text-black hover:bg-[#E4C77B]"
                : "bg-transparent hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <HiOutlineClipboardList />
            {!isClosed && <span>Analyze Soil</span>}
          </Button>
        </li>
        <li className="w-full">
          <Button
            onClick={() => handleMenuClick("history", "/history")}
            className={`flex w-full items-center justify-baseline shadow-none gap-2 py-2 px-3 rounded ${
              selectedMenu === "history"
                ? "bg-[#E4C77B] text-black hover:bg-[#E4C77B]"
                : "bg-transparent hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <HiOutlineBookOpen />
            {!isClosed && <span>History</span>}
          </Button>
        </li>
        </ul>

        {/* Footer */}
        <div className="mt-auto mb-4 pt-4 border-t border-[#3D6652]">
          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full mt-4 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <FaSignOutAlt />
              {!isClosed && "Logout"}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
