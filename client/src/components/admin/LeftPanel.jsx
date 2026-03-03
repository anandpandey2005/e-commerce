import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  LayoutDashboard,
  BarChart3,
  Users,
  Layers,
  LogOut,
} from "lucide-react";

export default function LeftPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    {
      name: "Overview",
      path: "/admin/overview", // Changed from admin/dashboard/overview
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Analysis",
      path: "/admin/analysis", // Changed
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Products",
      path: "/admin/product", // Changed
      icon: <Package size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/category", // Changed
      icon: <Layers size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/order", // Changed
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Customers",
      path: "/admin/customers", // Changed
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r transition-all duration-300 ease-in-out shadow-sm flex flex-col
        ${isOpen ? "w-64" : "w-20"} 
        lg:relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute -right-3 top-[45%] bg-white border border-gray-200 text-gray-600 rounded-full p-1 shadow-md hover:text-blue-600 transition-all z-[60]
          ${!isOpen && "translate-x-3 lg:translate-x-0"}`}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Branding Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-50 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span
            className={`ml-3 font-bold text-gray-800 transition-opacity duration-300 ${!isOpen ? "opacity-0 invisible" : "opacity-100"}`}
          >
            ADMIN
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 flex flex-col p-3 gap-2 mt-4 overflow-y-auto no-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <span
                className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${!isOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}
              >
                {link.name}
              </span>
              {!isOpen && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all bg-gray-900 text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap">
                  {link.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="p-3 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="group relative flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <div className="shrink-0 group-hover:scale-110 transition-transform">
              <LogOut size={20} />
            </div>
            <span
              className={`ml-3 font-medium transition-all duration-300 ${!isOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}
            >
              Logout
            </span>
            {!isOpen && (
              <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all bg-red-600 text-white text-xs px-2 py-1 rounded z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
