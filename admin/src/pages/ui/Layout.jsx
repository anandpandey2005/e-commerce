import React from "react";
import { Navbar } from "../../handler";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div className="overflow-hidden">
      <Navbar></Navbar>
      <main className="w-full min-h-screen bg-black text-white ">
        <Outlet></Outlet>
      </main>
    </div>
  );
}
