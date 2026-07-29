"use client";

import React from "react";
import Link from "next/link";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

export default function OrdersPage() {
  return (
    <div className="space-y-8 font-hanken">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-xl">
        <div>
          <span className="inline-block px-3.5 py-1 mb-2 rounded-full text-[10px] font-geist font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Order Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Orders & Sales Ledger
          </h1>
          <p className="text-xs text-[#8e9192] font-geist mt-1">
            Manage transactions, inspect specific customer order histories, and edit order status.
          </p>
        </div>

        <Link
          href="/orders/user/sarah-jenkins"
          className="px-5 py-3 rounded-2xl bg-white text-black font-hanken font-bold text-xs shadow-xl hover:bg-[#e2e2e2] transition-colors shrink-0 text-center"
        >
          View Sarah Jenkins Specific Orders &rarr;
        </Link>
      </div>

      <RecentOrdersTable />
    </div>
  );
}
