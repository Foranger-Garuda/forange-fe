"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronLeft, FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineChartBar,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onStateChange: (isClosed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onStateChange }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string>(""); // Track selected menu

  const toggleSidebar = () => {
    setIsClosed((prev) => {
      onStateChange(!prev);
      return !prev;
    });
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <nav
      className={`bg-[#2F4B40] text-white fixed top-4 left-4 h-[calc(100vh-2rem)] rounded-xl transition-all duration-300 flex flex-col ${
        isClosed ? "w-16 px-2" : "w-64 px-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mt-4 mb-4 border-b border-[#3D6652] pb-4">
        <div className="flex flex-row gap-1 w-full">
          <img src="/avatar.png" alt="Logo" className="w-10 h-10" />
          {!isClosed && (
            <div className="flex flex-col gap-1 w-full items-center justify-center">
              <span className="font-semibold text-sm">Carmelo</span>
              <span className="text-xs">Anthony</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute top-6 -right-3 p-1.5 rounded-md bg-[#1F2A24] border-2 border-[#2D2F39]"
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
            onClick={() => handleMenuClick("home")}
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
            onClick={() => handleMenuClick("user")}
            className={`flex w-full items-center justify-baseline shadow-none gap-2 py-2 px-3 rounded ${
              selectedMenu === "user"
                ? "bg-[#E4C77B] text-black hover:bg-[#E4C77B]"
                : "bg-transparent hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <HiOutlineUser />
            {!isClosed && <span>User</span>}
          </Button>
        </li>

        <li className="w-full">
          <Button
            onClick={() => handleMenuClick("clipboard")}
            className={`flex w-full items-center justify-baseline shadow-none gap-2 py-2 px-3 rounded ${
              selectedMenu === "clipboard"
                ? "bg-[#E4C77B] text-black hover:bg-[#E4C77B]"
                : "bg-transparent hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <HiOutlineClipboardList />
            {!isClosed && <span>Clipboard</span>}
          </Button>
        </li>

        {/* Dropdown with Submenu */}
        <li>
          <div
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
            className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer ${
              selectedMenu.startsWith("chart-")
                ? "bg-[#E4C77B] text-black"
                : "hover:bg-[#3D6652]"
            } ${isClosed ? "justify-center" : ""}`}
          >
            <div className="flex items-center gap-2">
              <HiOutlineChartBar />
              {!isClosed && <span>Chart</span>}
            </div>
            {!isClosed && (
              <FaChevronDown
                className={`transition-transform text-sm ${
                  isSubmenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
          {isSubmenuOpen && !isClosed && (
            <ul className="ml-6 mt-1 space-y-1 border-l border-[#888] pl-3">
              {["Ipsum 1", "Ipsum 2", "Ipsum 3"].map((item, i) => {
                const submenuKey = `chart-${i}`;
                return (
                  <li
                    key={i}
                    onClick={() => handleMenuClick(submenuKey)}
                    className={`py-1 px-2 rounded cursor-pointer ${
                      selectedMenu === submenuKey
                        ? "bg-[#E4C77B] text-black"
                        : "hover:bg-[#E4C77B] hover:text-black"
                    }`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto mb-4 pt-4 border-t border-[#3D6652]">
        <div
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`flex items-center gap-2 py-2 px-3 hover:bg-[#3D6652] rounded ${
            isClosed ? "justify-center" : ""
          }`}
        >
          <FiSettings />
          {!isClosed && <span>Settings</span>}
        </div>

        {/* Logout Button */}
        {!isClosed && (
          <button
            className={`bg-white text-red-600 font-semibold rounded-md py-2 mt-4 w-full flex items-center justify-center gap-2 ${
              isClosed ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt />
            Logout
          </button>
        )}
        {isClosed && (
          <button className="bg-white text-red-600 rounded-md p-2 mt-4 flex items-center justify-center w-full">
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
