"use client";

import React, { useState, useEffect, useRef } from "react";
import { BellIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scaleLevel, setScaleLevel] = useState<number>(1.0);
  const scaleRef = useRef<number>(1.0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update canvas scale transformation up to 3.0x directly on DOM
  const applyScale = (newScale: number) => {
    const clampedScale = Math.min(3.0, Math.max(1.0, parseFloat(newScale.toFixed(2))));
    scaleRef.current = clampedScale;
    setScaleLevel(clampedScale);

    const mainEl = document.getElementById("main-content-canvas");
    if (mainEl) {
      const style = mainEl.style as any;
      style.transition = "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
      if ("zoom" in style) {
        style.zoom = `${clampedScale}`;
      } else {
        style.transform = `scale(${clampedScale})`;
        style.transformOrigin = "top left";
      }
    }
  };

  const increaseScale = () => applyScale(scaleRef.current + 0.25);
  const decreaseScale = () => applyScale(scaleRef.current - 0.25);

  // Listen for '+' / '=' to zoom in and '-' to zoom out (up to 3.0x)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof document !== "undefined") {
        if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      }

      const activeEl = document.activeElement;
      const isInputActive =
        activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";

      if (isInputActive) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        applyScale(scaleRef.current + 0.25);
      } else if (e.key === "-") {
        e.preventDefault();
        applyScale(scaleRef.current - 0.25);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  return (
    <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center space-x-3 pointer-events-auto" ref={dropdownRef}>
      {/* 3.0x Interactive Scale Control Pill (+ / - / Readout) - ONLY Visible on Large Screens */}
      <div className="hidden lg:flex items-center space-x-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#1b1b1b] border border-[#2a2a2a] shadow-2xl backdrop-blur-2xl text-white font-geist text-xs font-semibold">
        <button
          onClick={decreaseScale}
          disabled={scaleLevel <= 1.0}
          title="Decrease UI Scale (- key)"
          className="w-6 h-6 rounded-full bg-[#2a2a2a] hover:bg-[#353535] disabled:opacity-40 disabled:hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          -
        </button>

        <div className="px-2 font-bold text-xs sm:text-sm tracking-wide font-mono text-emerald-400 min-w-[50px] text-center">
          {scaleLevel.toFixed(2)}x
        </div>

        <button
          onClick={increaseScale}
          disabled={scaleLevel >= 3.0}
          title="Increase UI Scale up to 3.0x (+ key)"
          className="w-6 h-6 rounded-full bg-[#2a2a2a] hover:bg-[#353535] disabled:opacity-40 disabled:hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          +
        </button>
      </div>

      {/* 1x Floating Notification Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={cn(
          "relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1b1b1b] border border-[#2a2a2a] text-[#e2e2e2] hover:text-white hover:bg-[#2a2a2a] hover:border-[#444748] transition-all duration-300 shadow-2xl backdrop-blur-2xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40",
          isOpen && "ring-2 ring-white/50 bg-[#2a2a2a] border-white/60 scale-105"
        )}
      >
        <BellIcon className="w-5 h-5" />
        {!isOpen && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#131313] animate-pulse" />
        )}
      </button>

      {/* 3x Scaled Animated Notification Panel with Backdrop Dismissal */}
      {isOpen && (
        <>
          {/* Dark Backdrop for Click Outside Dismissal */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-16 z-50 w-80 sm:w-96 rounded-2xl bg-[#1f1f1f] border border-[#353535] p-5 shadow-2xl backdrop-blur-3xl animate-notification-3x origin-top-right text-[#e2e2e2]">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
            <div className="flex items-center space-x-2">
              <span className="font-hanken font-semibold text-sm text-white">Notifications</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-geist font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                3 New
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#c4c7c8] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* List of Notifications */}
          <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
            <div className="p-3 rounded-xl bg-[#1b1b1b] border border-emerald-500/30 hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-geist text-[11px] font-semibold text-emerald-400">⚡ System Alert</span>
                <span className="font-geist text-[10px] text-[#8e9192]">2m ago</span>
              </div>
              <p className="font-hanken text-xs text-[#c4c7c8] mt-1 leading-snug">
                Revenue spike detected: <strong className="text-emerald-400">+14.2%</strong> increase in sales volume.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1b1b1b] border border-amber-500/30 hover:border-amber-500/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-geist text-[11px] font-semibold text-amber-400">📦 Order Processing</span>
                <span className="font-geist text-[10px] text-[#8e9192]">14m ago</span>
              </div>
              <p className="font-hanken text-xs text-[#c4c7c8] mt-1 leading-snug">
                Order #ORD-9481 being packed for shipment.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1b1b1b] border border-orange-500/30 hover:border-orange-500/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-geist text-[11px] font-semibold text-orange-400">🔥 Inventory Alert</span>
                <span className="font-geist text-[10px] text-[#8e9192]">1h ago</span>
              </div>
              <p className="font-hanken text-xs text-[#c4c7c8] mt-1 leading-snug">
                Wireless Headphones stock down to 12 units.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a2a] text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-hanken font-bold text-xs transition-colors shadow-md"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </>
    )}
    </div>
  );
}
