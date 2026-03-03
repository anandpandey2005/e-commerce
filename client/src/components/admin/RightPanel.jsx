import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { AdminProductView, AdminOrderView, AdminOveriew } from "../../pages";

export default function RightPanel() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* If user is exactly at /admin, show Overview */}
        <Route index element={<AdminOveriew />} />

        {/* Sub-routes relative to /admin/ */}
        <Route path="overview" element={<AdminOveriew />} />
        <Route path="product" element={<AdminProductView />} />
        <Route path="order" element={<AdminOrderView />} />

        {/* Add these if you have the components ready */}
        <Route path="analysis" element={<div>Analysis Page</div>} />
        <Route path="category" element={<div>Category Page</div>} />
        <Route path="customers" element={<div>Customers Page</div>} />

        {/* Redirect any unknown /admin/* paths to overview */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
