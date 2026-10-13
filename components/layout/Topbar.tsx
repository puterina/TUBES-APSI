"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  ChevronDown,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { RoleType } from "@/lib/rbac";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const Topbar: React.FC = () => {
  const { activeRole, switchRole, currentUser } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const rolesList: { role: RoleType; label: string; desc: string }[] = [
    { role: "MANAGER", label: "Manager (Super Admin)", desc: "Akses lengkap, KPI eksekutif & audit" },
    { role: "SALES", label: "Sales & Marketing", desc: "Pipeline lead, request custom & penawaran" },
    { role: "PROCUREMENT", label: "Procurement / Sourcing", desc: "Katalog vendor & perbandingan HPP" },
    { role: "ADMIN", label: "Operations Admin", desc: "Arsip dokumen, nomor surat & pajak" },
    { role: "FINANCE", label: "Finance & Accounting", desc: "Pembayaran, invoice & TOP aging tracker" },
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari Order (ORD-...), Klien, Vendor, Quotation... (⌘K)"
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
          />
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Dynamic Role Switcher Dropdown (Essential for testing & demos!) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-100/70 transition-colors text-xs font-semibold"
          >
            <Shield size={14} className="text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold underline decoration-brand-400 decoration-2 underline-offset-2">
              {activeRole}
            </span>
            <ChevronDown size={14} className="text-brand-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Ganti Role Demonstrasi (RBAC)
                </p>
                <p className="text-[11px] text-slate-500">
                  Uji tampilan & hak akses per divisi
                </p>
              </div>
              <div className="space-y-1 mt-1">
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col gap-0.5",
                      activeRole === item.role
                        ? "bg-brand-500 text-white font-semibold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {activeRole === item.role && (
                        <CheckCircle2 size={13} className="text-white" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px]",
                        activeRole === item.role ? "text-brand-100" : "text-slate-400"
                      )}
                    >
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Pusat Notifikasi"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Notifikasi Sistem & TOP
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 text-[10px]">
                    3 Baru
                  </span>
                </span>
                <span className="text-[11px] text-brand-600 cursor-pointer hover:underline">
                  Tandai dibaca
                </span>
              </div>

              <div className="space-y-2 mt-2 max-h-80 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold mb-1">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>🚨 Alert Piutang: Overdue >45 Hari!</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Invoice PT Astra International Tbk (Rp 83.250.000) menunggak 59 hari. Segera tindak lanjuti somasi.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">10 menit yang lalu</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-1">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>⚠️ Peringatan Jatuh Tempo: Tokopedia</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Sisa tagihan Rp 27.180.000 melewati batas TOP 30 hari. Aging saat ini 38 hari.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">1 jam yang lalu</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                    <FileCheck size={14} className="shrink-0" />
                    <span>🎉 Quotation Disetujui: Bank Mandiri</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Surat Penawaran SP/MF/2026/10/0042 telah di-ACC. Order ORD-2026-0001 berlanjut ke tahap Produksi.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">3 jam yang lalu</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title={isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-brand-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser.name.split(" ")[0]}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">
              {activeRole.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
