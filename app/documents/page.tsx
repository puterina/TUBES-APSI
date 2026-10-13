"use client";

import React, { useState } from "react";
import {
  FolderArchive,
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "ALL" || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderArchive className="text-brand-600" />
            Dokumen, Arsip & Tracking Revisi (Admin)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pusat penyimpanan Surat Penawaran, Faktur Pajak, Perizinan, Surat Jalan, Mockup Proofing, dan riwayat revisi.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20">
          <Upload size={16} />
          Upload Dokumen Baru
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama dokumen atau nomor order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "SURAT_PENAWARAN", "DESIGN_MOCKUP", "PERIZINAN", "PAJAK_FAKTUR"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                selectedCat === cat
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {cat === "ALL" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">Nama Berkas</th>
              <th className="py-3 px-3">Nomor Order Ref</th>
              <th className="py-3 px-3">Kategori Dokumen</th>
              <th className="py-3 px-3">Versi</th>
              <th className="py-3 px-3">Ukuran File</th>
              <th className="py-3 px-3">Diupload Oleh</th>
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-brand-600 shrink-0" />
                  {doc.title}
                </td>
                <td className="py-3 px-3 text-brand-600 font-medium">
                  {doc.orderNumber || "-"}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold">v{doc.version}</td>
                <td className="py-3 px-3 text-slate-500">{doc.fileSizeText}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{doc.uploadedByName}</td>
                <td className="py-3 px-3 text-slate-500">{doc.createdAt}</td>
                <td className="py-3 px-3 text-right">
                  <button className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1">
                    <Download size={13} />
                    Unduh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
