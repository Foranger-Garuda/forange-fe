"use client";
import React, { useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar onStateChange={setSidebarClosed} />
        <main
          className={`flex-grow transition-all duration-300 overflow-y-auto h-full min-h-screen ${
            sidebarClosed ? "ml-[60px]" : "ml-[250px]"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
