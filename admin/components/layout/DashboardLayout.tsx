"use client";

import React from "react";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { SearchProvider } from "@/hooks/use-search";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import UserToggle from "@/components/layout/UserToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="relative min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col font-hanken antialiased selection:bg-white selection:text-black">
          {/* Vertical Sidebar Navigation Drawer */}
          <Sidebar />

          {/* Floating Top-Right Notification Action + UI Scale Button */}
          <Header />

          {/* Floating Control Elements (Top-Left Pill & Bottom-Center Search) */}
          <UserToggle />

          {/* Main Full-Width Application Canvas Target (No Max-Width Containers) */}
          <main
            id="main-content-canvas"
            className="flex-1 w-full px-6 sm:px-10 lg:px-12 pt-28 sm:pt-32 pb-32 sm:pb-28 animate-page-zoom transition-all duration-300 ease-out origin-top-left"
          >
            {children}
          </main>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
