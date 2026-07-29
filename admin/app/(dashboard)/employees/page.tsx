"use client";

import React, { useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "Away" | "Offline";
  access: string;
  joinedDate: string;
  avatar: string;
  permissions: string[];
}

export default function EmployeesPage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const initialEmployees: Employee[] = [
    {
      id: "EMP-101",
      name: "Alexander Pierce",
      role: "Super Admin",
      department: "Executive & Tech Ops",
      email: "alexander@apex.store",
      phone: "+1 (555) 019-2831",
      status: "Active",
      access: "Full Root Access",
      joinedDate: "Jan 15, 2023",
      avatar: "AP",
      permissions: ["System Config", "User Management", "Database Operations", "Audit Logs", "Financial Ledger"],
    },
    {
      id: "EMP-102",
      name: "Jessica Taylor",
      role: "Inventory Lead",
      department: "Supply Chain & Warehouse",
      email: "jessica.t@apex.store",
      phone: "+1 (555) 014-9921",
      status: "Active",
      access: "Product & Stock Control",
      joinedDate: "Mar 10, 2024",
      avatar: "JT",
      permissions: ["Catalog CRUD", "Bulk Import/Export", "Stock Reorder Alerts", "Supplier Matrix"],
    },
    {
      id: "EMP-103",
      name: "David Chen",
      role: "Support Specialist",
      department: "Customer Success",
      email: "david.c@apex.store",
      phone: "+1 (555) 018-4412",
      status: "Active",
      access: "Orders & Refund Manager",
      joinedDate: "Nov 02, 2024",
      avatar: "DC",
      permissions: ["Order Status Update", "Process Customer Refunds", "Ticket Escalation"],
    },
    {
      id: "EMP-104",
      name: "Sophia Martinez",
      role: "Marketing Lead",
      department: "Growth & Brand",
      email: "sophia.m@apex.store",
      phone: "+1 (555) 012-7788",
      status: "Away",
      access: "Stories & Promotions",
      joinedDate: "Feb 18, 2025",
      avatar: "SM",
      permissions: ["Banner Management", "Campaign Analytics", "Discount Promo Codes"],
    },
    {
      id: "EMP-105",
      name: "Marcus Vance",
      role: "Security Auditor",
      department: "Compliance",
      email: "marcus.v@apex.store",
      phone: "+1 (555) 016-3390",
      status: "Active",
      access: "Audit & Security Logs",
      joinedDate: "Aug 05, 2025",
      avatar: "MV",
      permissions: ["Security Logs", "API Key Management", "IP Whitelisting"],
    },
  ];

  const [employeesList] = useState<Employee[]>(initialEmployees);

  const filteredEmployees = employeesList.filter((emp) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.access.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 font-hanken">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1 mb-2 rounded-full text-[10px] font-geist font-bold tracking-widest uppercase bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            Employee Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Team Members & Access Governance
          </h1>
          <p className="text-xs text-[#8e9192] font-geist mt-1">
            Role-based administrative controls, access permissions, and staff member details.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-geist text-[#8e9192]">
          {searchQuery && (
            <span className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <span>Filter: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery("")} className="hover:text-white">
                <CloseIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          <span>
            Total Staff: <strong className="text-white">{filteredEmployees.length}</strong>
          </span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#c4c7c8]">
            <thead className="text-[11px] font-geist uppercase tracking-widest text-[#8e9192] bg-[#0e0e0e] border-b border-[#262626]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Employee</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Access Scope</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="hover:bg-[#252525] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-white text-[#131313] flex items-center justify-center font-geist font-bold text-xs shadow-md">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {emp.name}
                        </p>
                        <p className="text-[11px] font-geist text-[#8e9192]">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-geist font-semibold text-white">{emp.role}</td>
                  <td className="py-4 px-4 font-geist text-[#8e9192]">{emp.department}</td>
                  <td className="py-4 px-4 font-geist text-indigo-400 font-medium">{emp.access}</td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-geist font-bold border",
                        emp.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      )}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RICH EMPLOYEE DETAIL SLIDE-OVER DRAWER */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#181818] border-l border-[#2e2e2e] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between text-white font-hanken">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white text-black font-geist font-bold text-base flex items-center justify-center shadow-lg">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedEmployee.name}</h2>
                    <p className="text-xs text-indigo-400 font-geist font-semibold">
                      {selectedEmployee.role} • {selectedEmployee.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1.5 text-[#8e9192] hover:text-white"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#131313] border border-[#262626] space-y-2 text-xs font-geist">
                  <div className="flex justify-between">
                    <span className="text-[#8e9192]">Email Address:</span>
                    <span className="text-white font-semibold">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9192]">Phone Contact:</span>
                    <span className="text-white font-semibold">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9192]">Department:</span>
                    <span className="text-white font-semibold">{selectedEmployee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9192]">Joined On:</span>
                    <span className="text-white font-semibold">{selectedEmployee.joinedDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold font-geist uppercase text-[#8e9192] tracking-wider">
                  Granted System Permissions
                </h3>
                <div className="p-4 rounded-2xl bg-[#131313] border border-[#262626] space-y-2">
                  {selectedEmployee.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-white">
                      <span className="text-emerald-400">✓</span>
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2a2a2a] flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-geist font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
