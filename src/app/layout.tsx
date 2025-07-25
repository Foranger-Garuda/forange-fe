"use client";
import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const pathname = usePathname();
  const hideSidebarRoutes = ["/login"];
  const showSidebar = !hideSidebarRoutes.includes(pathname);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {showSidebar && <Sidebar onStateChange={setSidebarClosed} />}
        <main
          className={`flex-grow transition-all duration-300 overflow-y-auto h-full min-h-screen `}
        >
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}
