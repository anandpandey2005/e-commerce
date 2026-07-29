"use client";

import React from "react";
import Link from "next/link";
import { RECENT_ORDERS_DATA } from "@/lib/constants";
import { useSearch } from "@/hooks/use-search";
import { formatCurrency, cn } from "@/lib/utils";

export default function RecentOrdersTable() {
  const { searchQuery } = useSearch();

  const filteredOrders = RECENT_ORDERS_DATA.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#1b1b1b] border border-[#262626] shadow-md font-hanken">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Customer Transactions & Orders</h2>
          <p className="text-xs text-[#8e9192] font-geist">
            {searchQuery ? `Filtered by search "${searchQuery}"` : "Latest orders submitted across sales channels"}
          </p>
        </div>
        <span className="text-xs font-geist text-[#8e9192]">
          Showing <strong className="text-white">{filteredOrders.length}</strong> orders
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#c4c7c8]">
          <thead className="text-[11px] font-geist uppercase tracking-widest text-[#8e9192] bg-[#0e0e0e] border-b border-[#262626]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Order ID</th>
              <th className="py-3.5 px-4 font-semibold">Customer</th>
              <th className="py-3.5 px-4 font-semibold">Product</th>
              <th className="py-3.5 px-4 font-semibold">Amount</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#252525] transition-colors cursor-pointer">
                <td className="py-4 px-4 font-geist font-bold text-indigo-400">
                  <Link href="/orders/user/sarah-jenkins" className="hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <div className="font-bold text-white">{order.customerName}</div>
                  <div className="text-[11px] font-geist text-[#8e9192]">{order.customerEmail}</div>
                </td>
                <td className="py-4 px-4 text-[#c4c7c8] max-w-[220px] truncate">{order.product}</td>
                <td className="py-4 px-4 font-geist font-bold text-white">{formatCurrency(order.amount)}</td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-geist font-bold tracking-wider uppercase inline-block border shadow-xs",
                      order.status === "Completed" && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      order.status === "Processing" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                      order.status === "Pending" && "bg-blue-500/15 text-blue-400 border-blue-500/30",
                      order.status === "Cancelled" && "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-geist text-[#8e9192]">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
