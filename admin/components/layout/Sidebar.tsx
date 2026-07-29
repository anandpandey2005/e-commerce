"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { VERTICAL_NAV_ITEMS, APP_CONFIG, CURRENT_USER } from "@/lib/constants";
import { RenderNavIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Dark overlay backdrop on mobile/drawer mode */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Vertical Sidebar Drawer - Monochrome Noir Theme */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[9999] flex flex-col w-72 bg-[#131313] border-r border-[#262626] shadow-2xl transition-transform duration-300 ease-out font-hanken",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header & Brand Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#262626] bg-[#0e0e0e]/50">
          <Link href="/" className="flex items-center space-x-3 group" onClick={closeSidebar}>
            <div className="w-9 h-9 rounded-xl bg-white text-[#131313] flex items-center justify-center font-extrabold text-base shadow-lg group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-base block group-hover:text-[#c4c7c8] transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-[#8e9192] font-geist font-medium tracking-wider uppercase block">
                Monochrome Noir Admin
              </span>
            </div>
          </Link>

          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#1b1b1b] transition-colors cursor-pointer"
            title="Close navigation"
            aria-label="Close sidebar"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section Title */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-geist font-semibold tracking-widest text-[#8e9192] uppercase">
            Main Navigation
          </p>
        </div>

        {/* Vertically Aligned Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {VERTICAL_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "group relative flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200",
                  isActive
                    ? "bg-[#1f1f1f] text-white border border-[#353535] shadow-sm font-semibold"
                    : "text-[#c4c7c8] hover:text-white hover:bg-[#1b1b1b]"
                )}
              >
                <div className="flex items-center space-x-3.5">
                  <RenderNavIcon
                    name={item.icon}
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-white" : "text-[#8e9192] group-hover:text-white"
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-geist font-semibold rounded-full tracking-wider uppercase",
                      isActive
                        ? "bg-white text-[#131313]"
                        : "bg-[#2a2a2a] text-[#c4c7c8] group-hover:bg-white group-hover:text-black"
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Bar indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-[#262626] bg-[#0e0e0e]/80">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#1b1b1b] border border-[#2a2a2a]">
            <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border border-[#353535] flex items-center justify-center text-white font-geist font-semibold text-xs">
              {CURRENT_USER.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {CURRENT_USER.name}
              </p>
              <p className="text-[11px] text-[#8e9192] truncate font-geist">
                {CURRENT_USER.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}
