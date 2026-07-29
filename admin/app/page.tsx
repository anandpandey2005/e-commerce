"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/accountSlice";
import AdminDashboardLayout from "@/app/(dashboard)/layout";
import AnalysisPage from "@/app/(dashboard)/page";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.account);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    dispatch(initializeAuth());
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
    if (!token && !isAuthenticated) {
      router.replace("/signin");
    } else {
      setChecking(false);
    }
  }, [dispatch, isAuthenticated, router]);

  if (checking) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c0d] font-geist text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#a1a1aa]">
          <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
          <span>Redirecting to Sign In...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardLayout>
      <AnalysisPage />
    </AdminDashboardLayout>
  );
}
