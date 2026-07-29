import React from "react";
import { ANALYTICS_METRICS } from "@/lib/constants";
import MetricCard from "@/components/dashboard/MetricCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

export default function AnalysisPage() {
  return (
    <div className="space-y-8 font-hanken">
      {/* Monochrome Noir Welcome Banner */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3.5 py-1 mb-3 rounded-full text-[10px] font-geist font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Realtime Analysis Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Store Operational Intelligence
          </h2>
          <p className="mt-2 text-sm text-[#c4c7c8] leading-relaxed">
            Welcome back! Press <kbd className="px-2 py-0.5 rounded bg-emerald-400 text-black font-geist text-xs font-bold shadow-xs">Shift + S</kbd> to open search, or use <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-emerald-400 font-mono text-xs font-bold">+</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-emerald-400 font-mono text-xs font-bold">-</kbd> to scale UI up to <strong className="text-emerald-400">3.0x</strong>.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ANALYTICS_METRICS.map((metric) => (
          <MetricCard key={metric.title} data={metric} />
        ))}
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Goal Reach & System Metrics (Vivid Semantic Color Accents) */}
        <div className="p-8 rounded-2xl bg-[#1b1b1b] border border-[#262626] shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Target & Goal Reach</h3>
            <p className="text-xs text-[#8e9192] font-geist mb-6">Monthly revenue conversion milestone</p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-geist font-medium mb-2">
                  <span className="text-[#c4c7c8]">Revenue Goal ($150,000)</span>
                  <span className="text-amber-400 font-bold">85.6%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0e0e0e] border border-[#262626] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[85.6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-geist font-medium mb-2">
                  <span className="text-[#c4c7c8]">Order Fulfillment</span>
                  <span className="text-emerald-400 font-bold">94.2%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0e0e0e] border border-[#262626] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[94.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-geist font-medium mb-2">
                  <span className="text-[#c4c7c8]">Customer Satisfaction</span>
                  <span className="text-indigo-400 font-bold">98.1%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0e0e0e] border border-[#262626] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[98.1%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#0e0e0e] border border-emerald-500/30 text-xs font-geist text-[#c4c7c8]">
            <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              System Status: Nominal
            </p>
            <p className="text-[11px] text-[#8e9192]">All payment gateways & node instances responding in under 38ms.</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <RecentOrdersTable />
    </div>
  );
}
