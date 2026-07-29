import React from "react";
import { CustomersIcon } from "@/components/ui/icons";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CustomersIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Customer Intelligence & Retention</h2>
            <p className="text-xs text-zinc-400">View registered users, LTV, churn rate, and segments</p>
          </div>
        </div>
      </div>

      <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-500">
        <p className="text-sm font-medium">Customer CRM & Audience Segmentation Matrix</p>
        <p className="text-xs mt-1 text-zinc-600">Connects with backend database endpoints `/api/customers`</p>
      </div>
    </div>
  );
}
