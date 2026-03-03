import React from "react";
import { Outlet } from "react-router-dom";
import { LeftPanel, RightPanel } from "../../components";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50">
      <LeftPanel />

      {/* 1. Removed ml-20
          2. Added min-w-0 to prevent flex items from breaking layout
          3. Added w-full so it takes up the whole screen on mobile 
      */}
      <div className="flex-1 min-w-0 w-full sm:ml-auto ml-20 ">
        <RightPanel />
      </div>
    </div>
  );
}
