"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/accountSlice";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { SearchProvider } from "@/hooks/use-search";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import UserToggle from "@/components/layout/UserToggle";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.account);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    dispatch(initializeAuth());
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
    if (!token && !isAuthenticated) {
      router.replace("/signin");
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, isAuthenticated, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c0d] font-geist text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#a1a1aa]">
          <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

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
