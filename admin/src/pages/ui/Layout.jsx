import React from "react";
import { Navbar } from "../../handler";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div className=" ">
      <Navbar></Navbar>
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}
