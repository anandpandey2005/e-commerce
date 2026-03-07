import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Users,
  IdCard,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const siteTitle = import.meta.env.VITE_STORE_NAME || "Admin Panel";

  const navLinks = [
    {
      name: "Overview",
      path: "/overview",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Employees", path: "/employees", icon: <IdCard size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
    { name: "Categories", path: "/categories", icon: <Tags size={20} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={20} /> },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 min-h-screen bg-[#f8f9fa] border-r border-gray-200 
        transition-all duration-300 ease-in-out flex flex-col z-50
        ${isOpen ? "w-64" : "w-20"} 
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-[50%] z-50 
                   bg-yellow-500 text-white rounded-full p-1 shadow-md 
                   hover:bg-yellow-600 transition-colors border-2 border-white"
      >
        {isOpen ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
      </button>

      <div className="p-6 mb-4">
        <Link to="/">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              {siteTitle.charAt(0)}
            </div>
            {isOpen && (
              <h1 className="text-lg font-bold text-gray-800 truncate transition-opacity duration-300">
                {siteTitle}
              </h1>
            )}
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 px-3 grow">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-sm font-medium
              ${isActive ? "bg-blue-50 text-yellow-500 shadow-sm" : "text-gray-500 hover:bg-zinc-300"}
            `}
          >
            <span className="shrink-0">{link.icon}</span>
            {isOpen && <span className="whitespace-nowrap">{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button className="flex items-center gap-4 p-3 w-full  hover:bg-zinc-300 rounded-xl transition-all font-medium">
          <Settings size={20} className="shrink-0" />
          {isOpen && (
            <span className="transition-all duration-300 ease-in-out">
              Setting
            </span>
          )}
        </button>
        <button className="flex items-center gap-4 p-3 w-full text-red-500 hover:bg-red-300 rounded-xl transition-all font-medium">
          <LogOut size={20} className="shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
