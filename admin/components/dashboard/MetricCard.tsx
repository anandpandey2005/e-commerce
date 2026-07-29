import React from "react";
import { MetricCardData } from "@/lib/types";
import { RenderNavIcon, TrendingUpIcon, TrendingDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function MetricCard({ data }: { data: MetricCardData }) {
  return (
    <div
      className={cn(
        "relative group p-6 rounded-2xl bg-[#1b1b1b] border shadow-md transition-all duration-300 hover:-translate-y-1 font-hanken",
        data.isPositive
          ? "border-emerald-500/30 hover:border-emerald-500/60"
          : "border-rose-500/30 hover:border-rose-500/60"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-geist font-semibold text-[#8e9192] tracking-wider uppercase">
          {data.title}
        </span>
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors",
            data.isPositive
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white"
          )}
        >
          <RenderNavIcon name={data.icon} className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-2xl sm:text-3xl font-hanken font-bold text-white tracking-tight">
          {data.value}
        </h3>

        <div className="mt-3 flex items-center space-x-2 text-xs font-geist">
          <span
            className={cn(
              "inline-flex items-center font-bold px-2.5 py-0.5 rounded-full text-[11px] border shadow-xs",
              data.isPositive
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                : "bg-rose-500/15 text-rose-400 border-rose-500/40"
            )}
          >
            {data.isPositive ? (
              <TrendingUpIcon className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDownIcon className="w-3.5 h-3.5 mr-1" />
            )}
            {data.change}
          </span>
          <span className="text-[#8e9192]">{data.period}</span>
        </div>
      </div>
    </div>
  );
}
