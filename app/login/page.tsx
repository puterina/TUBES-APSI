"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RoleType } from "@/lib/rbac";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState("manager@unimerchant.id");
  const [password, setPassword] = useState("password123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleQuickLogin = (role: RoleType) => {
    switchRole(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/30">
            <Package size={26} className="stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Masuk ke UniMerchant
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sistem Operasional Merchandising & Pengendalian Arus Kas TOP 30-45 Hari.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4 text-xs md:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Kantor
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-all text-xs md:text-sm"
            >
              <span>Masuk Sistem</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick 1-Click Role Switcher for Evaluation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ 1-Click Login Demonstrasi (Tubes APSI)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin("MANAGER")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <strong className="block text-slate-900 dark:text-white text-[11px]">Manager (Super Admin)</strong>
                <span className="text-[10px] text-slate-400">Semua Fitur & Eksekutif</span>
              </button>

              <button
                onClick={() => handleQuickLogin("SALES")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <strong className="block text-slate-900 dark:text-white text-[11px]">Sales & Marketing</strong>
                <span className="text-[10px] text-slate-400">Leads, Kanban & SP</span>
              </button>

              <button
                onClick={() => handleQuickLogin("PROCUREMENT")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <strong className="block text-slate-900 dark:text-white text-[11px]">Procurement Sourcing</strong>
                <span className="text-[10px] text-slate-400">Vendor & HPP Sourcing</span>
              </button>

              <button
                onClick={() => handleQuickLogin("FINANCE")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <strong className="block text-slate-900 dark:text-white text-[11px]">Finance & Cashflow</strong>
                <span className="text-[10px] text-slate-400">TOP 30-45hr & Pembayaran</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
