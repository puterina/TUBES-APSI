"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KanbanSquare,
  List,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Building,
  Calendar,
  DollarSign,
  ChevronRight,
  MoveRight,
  CheckCircle2,
  X,
  Upload,
  Sparkles,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";

interface KanbanCardItem {
  id: string;
  leadNumber: string;
  orderNumber?: string;
  customerName: string;
  title: string;
  category: "TUMBLER" | "T_SHIRT" | "ATK" | "GIFTBOX" | "OTHER";
  qty: number;
  estimatedValue: number;
  deadline: string;
  stage: "PROSPECT" | "SOURCING" | "QUOTATION" | "NEGOTIATION" | "DEAL" | "PRODUKSI";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  picSales: string;
}

const INITIAL_PIPELINE: KanbanCardItem[] = [
  {
    id: "lead-1",
    leadNumber: "LD-2026-0001",
    orderNumber: "ORD-2026-0001",
    customerName: "PT Bank Mandiri (Persero) Tbk",
    title: "1.000 Set Year-End VIP Giftbox (Tumbler LED + Agenda Kulit)",
    category: "GIFTBOX",
    qty: 1000,
    estimatedValue: 144300000,
    deadline: "2026-11-25",
    stage: "PRODUKSI",
    priority: "HIGH",
    picSales: "Dimas",
  },
  {
    id: "lead-2",
    leadNumber: "LD-2026-0005",
    orderNumber: "ORD-2026-0005",
    customerName: "PT Bank Mandiri (Persero) Tbk",
    title: "500 Pcs Seminar Kit Rapimnas (Notebook & Metal Pen)",
    category: "ATK",
    qty: 500,
    estimatedValue: 48000000,
    deadline: "2026-11-10",
    stage: "SOURCING",
    priority: "URGENT",
    picSales: "Dimas",
  },
  {
    id: "lead-3",
    leadNumber: "LD-2026-0006",
    orderNumber: "ORD-2026-0006",
    customerName: "PT Telekomunikasi Selular",
    title: "800 Pcs Tumbler Corkcicle Style Media Gathering",
    category: "TUMBLER",
    qty: 800,
    estimatedValue: 61000000,
    deadline: "2026-12-05",
    stage: "QUOTATION",
    priority: "MEDIUM",
    picSales: "Dimas",
  },
  {
    id: "lead-4",
    leadNumber: "LD-2026-0007",
    customerName: "PT Tokopedia (GoTo Group)",
    title: "1.200 Pcs T-Shirt Combed 30s Hackathon 2026",
    category: "T_SHIRT",
    qty: 1200,
    estimatedValue: 72000000,
    deadline: "2026-11-30",
    stage: "NEGOTIATION",
    priority: "HIGH",
    picSales: "Dimas",
  },
  {
    id: "lead-5",
    leadNumber: "LD-2026-0008",
    customerName: "PT Astra International Tbk",
    title: "300 Pcs Hampers Eksekutif Rapat Dewan Komisaris",
    category: "GIFTBOX",
    qty: 300,
    estimatedValue: 55000000,
    deadline: "2026-12-15",
    stage: "PROSPECT",
    priority: "MEDIUM",
    picSales: "Dimas",
  },
  {
    id: "lead-6",
    leadNumber: "LD-2026-0009",
    customerName: "Kopi Kenangan Group",
    title: "2.000 Pcs Custom Enamel Pin & Lanyard Barista",
    category: "ATK",
    qty: 2000,
    estimatedValue: 35000000,
    deadline: "2026-11-20",
    stage: "DEAL",
    priority: "MEDIUM",
    picSales: "Dimas",
  },
];

const STAGES: { key: KanbanCardItem["stage"]; label: string; color: string }[] = [
  { key: "PROSPECT", label: "1. Prospect & Brief", color: "border-slate-400 bg-slate-50 dark:bg-slate-900" },
  { key: "SOURCING", label: "2. Sourcing Vendor", color: "border-blue-400 bg-blue-50/40 dark:bg-blue-950/20" },
  { key: "QUOTATION", label: "3. Surat Penawaran", color: "border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20" },
  { key: "NEGOTIATION", label: "4. Negosiasi Klien", color: "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20" },
  { key: "DEAL", label: "5. Deal & PO Sah", color: "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20" },
  { key: "PRODUKSI", label: "6. Dalam Produksi", color: "border-violet-400 bg-violet-50/40 dark:bg-violet-950/20" },
];

export default function LeadsPipelinePage() {
  const { can } = useAuth();
  const [pipeline, setPipeline] = useState<KanbanCardItem[]>(INITIAL_PIPELINE);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New lead form state
  const [formData, setFormData] = useState({
    customerName: "",
    title: "",
    category: "TUMBLER" as KanbanCardItem["category"],
    qty: 500,
    estimatedValue: 50000000,
    deadline: "2026-12-01",
    priority: "MEDIUM" as KanbanCardItem["priority"],
    specification: "",
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: KanbanCardItem = {
      id: `lead-${Date.now()}`,
      leadNumber: `LD-2026-00${pipeline.length + 10}`,
      customerName: formData.customerName,
      title: `${formData.qty} Pcs ${formData.title}`,
      category: formData.category,
      qty: Number(formData.qty),
      estimatedValue: Number(formData.estimatedValue),
      deadline: formData.deadline,
      stage: "PROSPECT",
      priority: formData.priority,
      picSales: "Dimas",
    };
    setPipeline([newLead, ...pipeline]);
    setIsModalOpen(false);
  };

  const advanceStage = (leadId: string) => {
    setPipeline((prev) =>
      prev.map((item) => {
        if (item.id !== leadId) return item;
        const stageIndex = STAGES.findIndex((s) => s.key === item.stage);
        if (stageIndex < STAGES.length - 1) {
          return { ...item, stage: STAGES[stageIndex + 1].key };
        }
        return item;
      })
    );
  };

  const filteredPipeline = pipeline.filter((item) =>
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.leadNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <KanbanSquare className="text-brand-600" />
            Leads & Kanban Order Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manajemen alur penjualan dan konversi penawaran barang custom dari prospek hingga rilis ke pabrik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle view mode */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <KanbanSquare size={14} />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List size={14} />
              Tabel
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus size={16} />
            Input Lead Custom
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter nama klien, nomor lead, atau item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total: <strong className="text-slate-800 dark:text-slate-200">{filteredPipeline.length}</strong> Leads Aktif
        </div>
      </div>

      {/* VIEW: KANBAN BOARD */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((col) => {
            const colItems = filteredPipeline.filter((i) => i.stage === col.key);
            const totalStageValue = colItems.reduce((acc, curr) => acc + curr.estimatedValue, 0);

            return (
              <div
                key={col.key}
                className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3 min-w-[260px] h-[720px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {col.label}
                    </h3>
                    <span className="text-[10px] text-slate-500 block">
                      {formatRupiah(totalStageValue)}
                    </span>
                  </div>
                  <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                  {colItems.length === 0 ? (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-400">
                      Tidak ada lead
                    </div>
                  ) : (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
                      >
                        <div>
                          {/* Card top tags */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                              {item.leadNumber}
                            </span>
                            <StatusBadge status={item.priority} type="priority" />
                          </div>

                          {/* Customer & Title */}
                          <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                            {item.customerName}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                            {item.title}
                          </p>
                        </div>

                        {/* Card bottom details */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Qty:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {item.qty.toLocaleString()} pcs
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Estimasi:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {formatRupiah(item.estimatedValue)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>Deadline: {formatDate(item.deadline)}</span>
                            <span>PIC: {item.picSales}</span>
                          </div>

                          {/* Action Button: Advance stage or View */}
                          <div className="flex items-center gap-1.5 pt-2">
                            {item.orderNumber ? (
                              <Link
                                href={`/orders/${item.orderNumber}`}
                                className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-center text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                Detail Order
                              </Link>
                            ) : (
                              <Link
                                href="/quotations/new"
                                className="flex-1 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 text-center text-[10px] font-bold text-brand-700 dark:text-brand-300 transition-colors"
                              >
                                Buat SP
                              </Link>
                            )}

                            {col.key !== "PRODUKSI" && (
                              <button
                                onClick={() => advanceStage(item.id)}
                                title="Lanjut ke tahap berikutnya"
                                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 text-slate-500 transition-colors"
                              >
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: TABLE */}
      {viewMode === "table" && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No. Lead</th>
                <th className="py-3 px-3">Perusahaan & Proyek</th>
                <th className="py-3 px-3">Kategori & Qty</th>
                <th className="py-3 px-3">Nilai Estimasi</th>
                <th className="py-3 px-3">Tahapan Pipeline</th>
                <th className="py-3 px-3">Prioritas</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPipeline.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-brand-600">{item.leadNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.customerName}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{item.title}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                    <div className="text-xs text-slate-500">{item.qty.toLocaleString()} pcs</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {formatRupiah(item.estimatedValue)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.priority} type="priority" />
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {formatDate(item.deadline)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => advanceStage(item.id)}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Majukan Tahap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-brand-600" />
                Input Lead & Request Merchandise Custom
              </h2>
              <p className="text-xs text-slate-500">
                Catat kebutuhan spesifikasi pesanan klien korporat untuk diteruskan ke tim Procurement.
              </p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs md:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Perusahaan / Klien Korporat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Bank Mandiri (Persero) Tbk"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Proyek / Kebutuhan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tumbler Stainless LED Suhu & Notebook PU Leather"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Barang
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="TUMBLER">Tumbler (Stainless, LED, Sakura)</option>
                    <option value="T_SHIRT">T-Shirt / Polo / Hoodie</option>
                    <option value="ATK">ATK / Notebook Agenda / Pen Metal</option>
                    <option value="GIFTBOX">Giftbox Hardboard Magnetik</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Pesanan (Qty) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Anggaran (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    step={1000000}
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Deadline Pengiriman
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spesifikasi Detail & Catatan Desain (Logo, Warna, Finishing)
                </label>
                <textarea
                  rows={3}
                  placeholder="Misal: Warna Navy Pantone 281 C, Laser engrave 1 sisi logo Bank Mandiri, box finishing hotprint emas."
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center gap-2 cursor-pointer text-slate-500 hover:border-brand-500">
                <Upload size={16} />
                <span className="text-xs">Upload Mockup / Referensi Desain PDF/PNG</span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20"
                >
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
