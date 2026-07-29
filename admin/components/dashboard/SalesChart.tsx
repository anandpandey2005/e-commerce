"use client";

import React from "react";
import { REVENUE_GRAPH_DATA } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function SalesChart() {
  const maxRevenue = Math.max(...REVENUE_GRAPH_DATA.map((d) => d.revenue));

  // Multi-color gradients for bars
  const barGradients = [
    "from-indigo-600 via-indigo-500 to-purple-500",
    "from-emerald-600 via-emerald-500 to-teal-400",
    "from-amber-600 via-amber-500 to-yellow-400",
    "from-orange-600 via-orange-500 to-amber-400",
    "from-cyan-600 via-cyan-500 to-blue-400",
    "from-indigo-600 via-indigo-500 to-purple-400",
    "from-emerald-500 via-teal-400 to-cyan-400",
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#1b1b1b] border border-[#262626] shadow-md font-hanken">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Revenue Growth & Analytics</h2>
          <p className="text-xs text-[#8e9192] font-geist">Monthly breakdown of gross revenue and fulfilled order volume</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-geist font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            2026 YTD
          </span>
        </div>
      </div>

      {/* Colorized Bar Chart Visualization */}
      <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-[#262626]">
        {REVENUE_GRAPH_DATA.map((item, idx) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          const gradientClass = barGradients[idx % barGradients.length];

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center group h-full justify-end">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2.5 py-1 bg-[#2a2a2a] text-white text-[11px] font-geist rounded-md border border-[#353535] whitespace-nowrap z-10 pointer-events-none shadow-lg">
                {formatCurrency(item.revenue)} ({item.orders} orders)
              </div>

              {/* Bar Column */}
              <div className="w-full max-w-[42px] bg-[#0e0e0e] rounded-t-lg overflow-hidden h-full flex items-end p-0.5 border border-[#262626]">
                <div
                  className={`w-full bg-gradient-to-t ${gradientClass} rounded-t-md transition-all duration-500 group-hover:brightness-125`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="mt-3 text-xs font-geist font-bold text-[#8e9192] group-hover:text-emerald-400 transition-colors">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs font-geist text-[#8e9192]">
        <div className="flex items-center space-x-5">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-emerald-400 mr-2 inline-block shadow-xs" /> Gross Revenue ($)
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-amber-400 mr-2 inline-block shadow-xs" /> Order Density
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-indigo-400 mr-2 inline-block shadow-xs" /> Target Volume
          </span>
        </div>
        <span className="text-emerald-400 font-semibold">Live Realtime</span>
      </div>
    </div>
  );
}
