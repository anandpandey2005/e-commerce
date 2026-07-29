import React from "react";
import { SettingsIcon } from "@/components/ui/icons";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">System Preferences & Settings</h2>
            <p className="text-xs text-zinc-400">Configure API keys, notifications, payment gateways, and team roles</p>
          </div>
        </div>
      </div>

      <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-500">
        <p className="text-sm font-medium">Platform Credentials & Security Settings</p>
        <p className="text-xs mt-1 text-zinc-600">Connects with backend database endpoints `/api/settings`</p>
      </div>
    </div>
  );
}
