"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Clock,
  BookOpen,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  MapPin,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_SOPS } from "@/lib/mock-data";

export default function EmployeePortalPage() {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState("08:25 WIB");
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [searchSOP, setSearchSOP] = useState("");
  const [selectedSOP, setSelectedSOP] = useState(MOCK_SOPS[0]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockOutTime(currentTime);
  };

  const filteredSOPs = MOCK_SOPS.filter(
    (sop) =>
      sop.title.toLowerCase().includes(searchSOP.toLowerCase()) ||
      sop.code.toLowerCase().includes(searchSOP.toLowerCase()) ||
      sop.tags.some((t) => t.toLowerCase().includes(searchSOP.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-brand-600" />
            Portal Karyawan & SOP Internal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Presensi kehadiran harian staf dan basis pengetahuan Standard Operating Procedure (SOP) operasional.
          </p>
        </div>
      </div>

      {/* Attendance & Clock In / Out Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-100 flex items-center gap-1.5">
              <Clock size={14} /> Presensi Harian Staf
            </span>
            <h2 className="text-2xl font-extrabold mt-1">
              Waktu Sekarang: {currentTime || "Memuat..."}
            </h2>
            <p className="text-xs text-brand-100 mt-1 flex items-center gap-2">
              <MapPin size={13} />
              Kantor Pusat UniMerchant Jakarta • WFO Validated
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-right">
              <span className="text-[11px] text-brand-200 block">Status Absensi</span>
              <strong className="text-sm flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={16} />
                {isClockedIn ? `Sudah Clock In (${clockInTime})` : `Sudah Clock Out (${clockOutTime})`}
              </strong>
            </div>

            {isClockedIn ? (
              <button
                onClick={handleClockOut}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-700 hover:bg-brand-50 shadow-sm transition-colors"
              >
                Clock Out Sekarang
              </button>
            ) : (
              <button
                onClick={() => setIsClockedIn(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-slate-900 hover:bg-emerald-300 shadow-sm transition-colors"
              >
                Clock In Lagi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SOP Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SOP Directory & Search (1/3) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={16} className="text-brand-600" />
              Direktori SOP Operasional
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cari panduan baku alur kerja per divisi.
            </p>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari SOP (vendor, TOP, QC)..."
              value={searchSOP}
              onChange={(e) => setSearchSOP(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredSOPs.map((sop) => {
              const isSelected = selectedSOP.id === sop.id;
              return (
                <button
                  key={sop.id}
                  onClick={() => setSelectedSOP(sop)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-[10px]">
                      {sop.code}
                    </span>
                    <span className="text-[10px] text-slate-400">v{sop.version}</span>
                  </div>
                  <strong className="block line-clamp-1 text-slate-900 dark:text-white">
                    {sop.title}
                  </strong>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Kategori: {sop.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected SOP Content Reader (2/3) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                {selectedSOP.code} • Versi {selectedSOP.version}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedSOP.title}
              </h2>
              <span className="text-xs text-slate-400">
                Kategori: {selectedSOP.category} • Terakhir diperbarui: {selectedSOP.updatedAt}
              </span>
            </div>
          </div>

          {/* SOP Content Viewer */}
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
            {selectedSOP.content}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Tag size={13} /> Tags:
            </span>
            {selectedSOP.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
