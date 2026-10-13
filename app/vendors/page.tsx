"use client";

import React, { useState } from "react";
import {
  Building2,
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { MOCK_VENDORS } from "@/lib/mock-data";

export default function VendorsPage() {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [search, setSearch] = useState("");
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const handleRequestQuote = (vendorName: string) => {
    setRequestSent(`Permintaan penawaran harga (RFQ) telah dikirimkan via email & WhatsApp ke ${vendorName}!`);
    setTimeout(() => setRequestSent(null), 3500);
  };

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.categories.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-brand-600" />
            Vendor Directory & Procurement Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Katalog mitra vendor merchandise, evaluasi rating mutu, lead time pengerjaan, dan perbandingan harga HPP.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20">
          <Plus size={16} />
          Daftarkan Vendor Baru
        </button>
      </div>

      {requestSent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{requestSent}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari vendor, spesialisasi kategori (Tumbler, T-Shirt, Box)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
        />
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {vendor.name}
                    <ShieldCheck size={16} className="text-brand-600" />
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{vendor.rating} / 5.0</span>
                    <span className="text-slate-400 text-[11px]">• Vendor Terverifikasi QC</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200">
                  Lead Time: {vendor.leadTimeDays} Hari
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Kategori & Keahlian:
                </span>
                <p className="text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 p-2 rounded-lg border border-brand-100 dark:border-brand-900/50">
                  {vendor.categories}
                </p>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{vendor.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span>{vendor.contactPerson} ({vendor.phone})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span>{vendor.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                Syarat: {vendor.paymentTerms}
              </span>
              <button
                onClick={() => handleRequestQuote(vendor.name)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} />
                Request Harga
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
