"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signInAdmin, clearAuthError } from "@/redux/slices/accountSlice";
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.account);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [includePhone, setIncludePhone] = useState(false);

  // If already authenticated, redirect to inventory dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/inventory");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const payload: {
      email: string;
      password: string;
      phone?: { country_code: string; number: string };
    } = {
      email: email.trim(),
      password,
    };

    if (includePhone && phoneNumber) {
      payload.phone = {
        country_code: countryCode,
        number: phoneNumber.trim(),
      };
    }

    const result = await dispatch(signInAdmin(payload));
    if (signInAdmin.fulfilled.match(result)) {
      router.replace("/inventory");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@admin.com");
    setPassword("admin123");
    setCountryCode("+1");
    setPhoneNumber("9998887777");
    setIncludePhone(true);
    dispatch(clearAuthError());
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0c0d] font-hanken text-white flex flex-col justify-between overflow-x-hidden selection:bg-orange-500 selection:text-black">
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT HERO SECTION */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6 animate-in fade-in slide-in-from-left-6 duration-500">
            {/* Enterprise Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1f] border border-[#2e2e33] text-orange-400 font-geist text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Enterprise Admin Portal v2.4</span>
              <span className="text-[#666]">•</span>
              <span className="text-[#a1a1aa] font-normal">System Operational</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Master Control Center <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                  E-Commerce Admin System
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl font-geist leading-relaxed">
                Streamlined product catalog management, real-time warehouse inventory controls, and zero-trust admin authentication.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#141417] border border-[#242429] hover:border-orange-500/40 transition-colors space-y-2 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-white font-hanken">Secure JWT Authorization</h3>
                <p className="text-[11px] text-[#8e9192] font-geist leading-normal">
                  Dual HTTP-only cookie and Bearer access token authorization with automatic session refresh.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141417] border border-[#242429] hover:border-amber-500/40 transition-colors space-y-2 group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-white font-hanken">Real-Time Inventory Stream</h3>
                <p className="text-[11px] text-[#8e9192] font-geist leading-normal">
                  Instant catalog syncing, multi-media uploads, category classification, and dynamic stock flags.
                </p>
              </div>
            </div>

            {/* Simulated Live Analytics Preview Card */}
            <div className="p-5 rounded-3xl bg-[#141417]/80 backdrop-blur-xl border border-[#242429] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-geist">Live Store Metrics</div>
                    <div className="text-[10px] text-[#8e9192]">Updated seconds ago</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-geist">
                  +24.8% Growth
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1 border-t border-[#242429]">
                <div>
                  <div className="text-[10px] text-[#8e9192] font-geist">Active Products</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">1,480 Units</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8e9192] font-geist">Categories</div>
                  <div className="text-sm font-extrabold text-amber-400 mt-0.5">24 Active</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8e9192] font-geist">Security ACL</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">Role Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIGN IN FORM SECTION */}
          <div className="lg:col-span-5 w-full animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#151518] border border-[#27272c] shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Subtle top ambient bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

              {/* Form Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-hanken">
                    Admin Sign In
                  </h2>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-geist text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Fill Demo Admin</span>
                  </button>
                </div>
                <p className="text-xs text-[#a1a1aa] font-geist">
                  Authenticate with your registered administrator account.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-geist font-semibold flex items-center space-x-2 animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-geist">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Admin Email Address <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8e9192] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) dispatch(clearAuthError());
                      }}
                      placeholder="admin@domain.com"
                      className="w-full bg-[#0d0d0f] border border-[#2a2a30] focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 rounded-2xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-[#555] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Password <span className="text-orange-400">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8e9192] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) dispatch(clearAuthError());
                      }}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0d0d0f] border border-[#2a2a30] focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 rounded-2xl py-3 pl-10 pr-10 text-white text-xs placeholder:text-[#555] outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e9192] hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Optional Phone Authorization Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIncludePhone(!includePhone)}
                    className="text-[11px] text-orange-400 font-semibold hover:underline flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{includePhone ? "Hide Phone Verification" : "+ Add Phone Verification (Optional)"}</span>
                  </button>

                  {includePhone && (
                    <div className="mt-2.5 grid grid-cols-12 gap-2 p-3 rounded-2xl bg-[#0d0d0f] border border-[#2a2a30] animate-in fade-in">
                      <div className="col-span-4">
                        <label className="block text-[10px] text-[#8e9192] mb-1 font-bold">Country</label>
                        <input
                          type="text"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          placeholder="+1"
                          className="w-full bg-[#18181b] border border-[#333] rounded-xl py-2 px-3 text-white text-xs font-mono outline-none"
                        />
                      </div>
                      <div className="col-span-8">
                        <label className="block text-[10px] text-[#8e9192] mb-1 font-bold">Phone Number</label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="9998887777"
                          className="w-full bg-[#18181b] border border-[#333] rounded-xl py-2 px-3 text-white text-xs font-mono outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1 text-[#a1a1aa] text-[11px]">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded bg-[#0d0d0f] border-[#333] text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>Remember admin session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-hanken font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-[0.99] transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer SSL Note */}
              <div className="pt-2 text-center border-t border-[#242429]">
                <p className="text-[10px] text-[#71717a] font-geist flex items-center justify-center space-x-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit SSL Encrypted TLS Admin Session</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1c1c1f] py-4 text-center text-[11px] text-[#71717a] font-geist">
        <p>© 2026 NextGen E-Commerce Admin System. All rights reserved.</p>
      </footer>
    </div>
  );
}
