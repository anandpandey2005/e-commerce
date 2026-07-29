"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useSearch } from "@/hooks/use-search";
import { CURRENT_USER, MOCK_PRODUCTS, MOCK_CATEGORIES, RECENT_ORDERS_DATA } from "@/lib/constants";
import { MenuIcon, SearchIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function UserToggle() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isInventoryPage = pathname === "/inventory" || pathname === "/products";
  const isEmployeePage = pathname === "/employees";
  const isOrderPage = pathname === "/orders";
  const isCustomerPage = pathname === "/customers";

  // Close dropdown overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut handler ('Shift+S', 'Cmd+K', '/')
  useEffect(() => {
    let wPressed = false;
    let wTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof document !== "undefined") {
        if (document.visibilityState !== "visible" || !document.hasFocus()) {
          return;
        }
      }

      const activeEl = document.activeElement;
      const isInputActive =
        activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";

      const key = e.key.toLowerCase();

      if (isInputActive && key !== "escape") {
        if ((e.metaKey || e.ctrlKey) && key === "k") {
          e.preventDefault();
          inputRef.current?.select();
        }
        return;
      }

      if (
        (e.shiftKey && key === "s") ||
        (e.altKey && key === "s") ||
        ((e.metaKey || e.ctrlKey) && key === "k") ||
        key === "/"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsFocused(true);
        wPressed = false;
        return;
      }

      if (key === "escape") {
        setIsFocused(false);
        inputRef.current?.blur();
        return;
      }

      if (key === "w") {
        wPressed = true;
        if (wTimeout) clearTimeout(wTimeout);
        wTimeout = setTimeout(() => {
          wPressed = false;
        }, 1000);
      } else if (key === "s" && wPressed) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsFocused(true);
        wPressed = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      if (wTimeout) clearTimeout(wTimeout);
    };
  }, []);

  const getActivePageName = () => {
    switch (pathname) {
      case "/":
      case "/analytics":
        return "Analysis & Overview";
      case "/inventory":
        return "Inventory Hub";
      case "/products":
        return "Products Catalog";
      case "/employees":
        return "Team & Roles";
      case "/orders":
        return "Orders & Sales";
      case "/customers":
        return "Customer Insights";
      case "/settings":
        return "System Settings";
      default:
        return "Admin Console";
    }
  };

  const getSearchPlaceholder = () => {
    if (isInventoryPage) return "Search products by name, SKU, brand, or category...";
    if (isEmployeePage) return "Search employees by name, role, email, access level...";
    if (isOrderPage) return "Search orders by order ID, customer name, status...";
    if (isCustomerPage) return "Search customers by name, email, tier...";
    return "Search metrics, orders, customers...";
  };

  const activePageTitle = getActivePageName();

  // Filter global search items (when on Analysis or general pages)
  const globalProducts = searchQuery.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const globalCategories = searchQuery.trim()
    ? MOCK_CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const globalOrders = searchQuery.trim()
    ? RECENT_ORDERS_DATA.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.product.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* 1. Top-Left Navigation & Active Page Pill */}
      <div className="fixed top-6 left-6 sm:top-8 sm:left-8 z-40">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle vertical navigation sidebar"
          className={cn(
            "group flex items-center space-x-3.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-[#1b1b1b] border border-[#2a2a2a] shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#2a2a2a] hover:border-[#444748] focus:outline-none focus:ring-2 focus:ring-white/40 shrink-0",
            isOpen && "ring-2 ring-white/50 bg-[#2a2a2a] border-white/60"
          )}
        >
          {/* User Icon Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#131313] flex items-center justify-center font-geist font-bold text-xs sm:text-sm shadow-md">
              {CURRENT_USER.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 ring-2 ring-[#131313]" />
          </div>

          {/* Dynamic Active Page Name & User Name */}
          <div className="flex flex-col text-left pr-1.5">
            <span className="text-xs sm:text-sm font-hanken font-bold text-white group-hover:text-[#c4c7c8] transition-colors truncate max-w-[130px] sm:max-w-[170px]">
              {activePageTitle}
            </span>
            <span className="text-[10px] sm:text-xs font-geist text-[#8e9192] truncate max-w-[130px] sm:max-w-[170px]">
              {CURRENT_USER.name}
            </span>
          </div>

          {/* Menu Icon Indicator */}
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#e2e2e2] group-hover:bg-white group-hover:text-[#131313] transition-all duration-300 shrink-0">
            <MenuIcon className="w-4.5 h-4.5" />
          </div>
        </button>
      </div>

      {/* 2. Single Prominent Context-Aware Bottom Search Bar */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[82%] max-w-lg md:max-w-xl pointer-events-auto">
        <div className="relative">
          {/* Global Search Popup Overlay (When on Global Analysis Page) */}
          {(!isInventoryPage && !isEmployeePage && !isOrderPage) && isFocused && searchQuery.trim() !== "" && (
            <div
              ref={overlayRef}
              className="absolute bottom-16 left-0 right-0 max-h-96 overflow-y-auto rounded-3xl bg-[#1b1b1b] border border-[#333333] shadow-2xl backdrop-blur-3xl p-4 text-white font-hanken animate-in fade-in slide-in-from-bottom-3 duration-200"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#262626] mb-3">
                <span className="text-xs font-geist font-bold text-emerald-400 uppercase tracking-widest">
                  Global Search Matches
                </span>
                <span className="text-[10px] font-geist text-[#8e9192]">
                  {globalProducts.length + globalCategories.length + globalOrders.length} results
                </span>
              </div>

              {/* Matching Products */}
              {globalProducts.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-geist font-bold uppercase text-orange-400 px-3">
                    Products Inventory ({globalProducts.length})
                  </div>
                  {globalProducts.map((prod) => (
                    <Link
                      key={prod._id}
                      href="/inventory"
                      onClick={() => setIsFocused(false)}
                      className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#131313] hover:bg-[#252525] border border-[#262626] transition-colors"
                    >
                      <img
                        src={prod.thumbnail}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#333]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {prod.name}
                        </div>
                        <div className="text-[10px] font-geist text-[#8e9192]">
                          SKU: {prod.sku} • ${prod.current_price.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Matching Orders */}
              {globalOrders.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-geist font-bold uppercase text-indigo-400 px-3">
                    Customer Orders ({globalOrders.length})
                  </div>
                  {globalOrders.map((ord) => (
                    <Link
                      key={ord.id}
                      href="/orders"
                      onClick={() => setIsFocused(false)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#131313] hover:bg-[#252525] border border-[#262626] transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {ord.id} • {ord.customerName}
                        </div>
                        <div className="text-[10px] font-geist text-[#8e9192]">
                          {ord.product}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-geist font-bold bg-emerald-500/20 text-emerald-400">
                        ${ord.amount.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Matching Categories */}
              {globalCategories.length > 0 && (
                <div className="space-y-2 mb-2">
                  <div className="text-[10px] font-geist font-bold uppercase text-[#8e9192] px-3">
                    Categories ({globalCategories.length})
                  </div>
                  {globalCategories.map((cat) => (
                    <Link
                      key={cat._id}
                      href="/inventory"
                      onClick={() => setIsFocused(false)}
                      className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#131313] hover:bg-[#252525] border border-[#262626] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/30">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cat.name}
                        </div>
                        <div className="text-[10px] font-geist text-[#8e9192]">
                          {cat.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {globalProducts.length === 0 && globalCategories.length === 0 && globalOrders.length === 0 && (
                <div className="p-6 text-center text-xs text-[#8e9192] font-geist">
                  No matching metrics, orders, or inventory items found for "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* Single Bottom Search Bar Input Pill */}
          <div className="relative flex items-center rounded-full bg-[#1b1b1b] border border-[#2a2a2a] shadow-2xl backdrop-blur-2xl px-6 py-4 sm:px-8 sm:py-4.5 focus-within:border-white focus-within:ring-2 focus-within:ring-white/40 focus-within:bg-[#1f1f1f] transition-all duration-300 hover:border-[#444748]">
            <SearchIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#8e9192] shrink-0 mr-4 transition-colors group-focus-within:text-white" />

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getSearchPlaceholder()}
              className="w-full bg-transparent text-sm sm:text-base font-hanken text-white placeholder-[#8e9192] focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1.5 rounded-full text-[#8e9192] hover:text-white hover:bg-[#2e2e2e] transition-colors mr-2"
                title="Clear Search"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}

            {/* Shift + S Badge Tag remains ALWAYS as requested */}
            <kbd
              title="Press Shift + S, W -> S, / or Ctrl + K to focus search"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-[11px] font-geist text-black bg-white rounded-xl border border-[#e2e2e2] shrink-0 ml-4 shadow-sm font-semibold tracking-wide"
            >
              Shift + S
            </kbd>
          </div>
        </div>
      </div>
    </>
  );
}
