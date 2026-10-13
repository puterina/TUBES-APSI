"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  Clock,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Upload,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  History,
  FolderArchive,
  CreditCard,
  Building2,
  Star,
  Download,
  AlertCircle,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import {
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_VENDORS,
  MOCK_DOCUMENTS,
  MOCK_AUDIT_LOGS,
} from "@/lib/mock-data";

export default function OrderDetailPage() {
  const params = useParams();
  const { can, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "info" | "tracking" | "vendor" | "quotation" | "payment" | "documents" | "history"
  >("info");

  // Load order data (match by id or orderNumber or fallback to ORD-2026-0001)
  const orderIdParam = params.id as string;
  const order =
    MOCK_ORDERS.find(
      (o) => o.id === orderIdParam || o.orderNumber === orderIdParam
    ) || MOCK_ORDERS[0];

  const [orderStatus, setOrderStatus] = useState(order.status);
  const [statusLogs, setStatusLogs] = useState(order.statusLogs);
  const [statusNote, setStatusNote] = useState("");

  const TRACKING_STEPS = [
    { key: "LEAD", label: "1. Lead Masuk" },
    { key: "SOURCING", label: "2. Sourcing Vendor" },
    { key: "QUOTATION", label: "3. Surat Penawaran" },
    { key: "NEGOTIATION", label: "4. Negosiasi" },
    { key: "DEAL", label: "5. Deal / PO Diterima" },
    { key: "PRODUKSI", label: "6. Dalam Produksi" },
    { key: "KIRIM", label: "7. Pengiriman" },
    { key: "SELESAI", label: "8. Selesai" },
  ];

  const currentStepIndex = TRACKING_STEPS.findIndex((s) => s.key === orderStatus);

  const handleUpdateStatus = (newStatus: any) => {
    setOrderStatus(newStatus);
    const newLog = {
      id: `log-${Date.now()}`,
      orderId: order.id,
      previousStatus: orderStatus,
      newStatus: newStatus,
      changedByName: "Hendra Wijaya (Super Admin)",
      changedByRole: activeRole,
      notes: statusNote || `Status diubah menjadi ${newStatus}`,
      createdAt: "Baru saja",
    };
    setStatusLogs([...statusLogs, newLog]);
    setStatusNote("");
  };

  return (
    <div className="space-y-6">
      {/* Back button & top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {order.orderNumber}
              </h1>
              <StatusBadge status={orderStatus} type="order" />
              <StatusBadge status={order.priority} type="priority" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Klien: <strong className="text-slate-800 dark:text-slate-200">{order.customer.companyName}</strong> • Tanggal Masuk: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2">
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Printer size={14} />
            Cetak PDF Penawaran
          </Link>
          <button
            onClick={() => setActiveTab("tracking")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
          >
            Update Tahapan
          </button>
        </div>
      </div>

      {/* Navigation Tabs (7 Required Modul Tabs) */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <nav className="flex space-x-2 md:space-x-4 min-w-max">
          {[
            { id: "info", label: "Ringkasan Info", icon: Package },
            { id: "tracking", label: "Timeline Tracking", icon: Truck },
            { id: "vendor", label: "Vendor Quote & Sourcing", icon: Building2 },
            { id: "quotation", label: "Surat Penawaran", icon: FileSpreadsheet },
            { id: "payment", label: "Pembayaran & TOP", icon: CreditCard },
            { id: "documents", label: "Dokumen & Arsip", icon: FolderArchive },
            { id: "history", label: "Riwayat Audit", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs md:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  isActive
                    ? "border-brand-600 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB 1: RINGKASAN INFO */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">Nilai Kontrak Klien</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatRupiah(order.totalSellingPrice)}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Excl. PPN 11%</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">Total HPP / Procurement Cost</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatRupiah(order.totalCost)}
              </p>
              <span className="text-[11px] text-slate-500">Kalkulasi 3 vendor</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">Estimasi Margin Keuntungan</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(order.totalMargin)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">24.6% Margin</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">Term of Payment (TOP)</span>
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">
                TOP {order.customer.topDays} Hari
              </p>
              <span className="text-[11px] text-slate-500">DP 50% + Pelunasan 45 Hari</span>
            </div>
          </div>

          {/* Customer & Delivery Spec */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building size={16} className="text-brand-600" />
                Informasi Klien Korporat
              </h3>
              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Perusahaan:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{order.customer.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PIC / Kontak:</span>
                  <span>{order.customer.contactPerson} ({order.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Tagihan:</span>
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NPWP Perusahaan:</span>
                  <span>{order.customer.npwp || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Credit Limit:</span>
                  <span className="font-semibold text-emerald-600">{formatRupiah(order.customer.creditLimit)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={16} className="text-brand-600" />
                Jadwal & Logistik Pengiriman
              </h3>
              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deadline Pengiriman:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{formatDate(order.deadlineDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sales Account PIC:</span>
                  <span>{order.salesUserName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Alamat Pengiriman Gudang:</span>
                  <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Item List Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Rincian Item Custom Merchandise ({order.items.length} Item)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Nama Barang & Kategori</th>
                    <th className="py-2.5 px-3">Spesifikasi Kustom</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">HPP Procurement</th>
                    <th className="py-2.5 px-3">Harga Jual Satuan</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.itemName}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed text-[11px]">
                        {item.specification}
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatRupiah(item.procurementCostPerUnit)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {formatRupiah(item.sellingPricePerUnit)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatRupiah(item.quantity * item.sellingPricePerUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE TRACKING */}
      {activeTab === "tracking" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Siklus Pelacakan Pesanan Real-Time
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Alur status pesanan terpantau secara transparan dari inisiasi lead hingga serah terima BAST.
            </p>

            {/* Step Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {TRACKING_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.key}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? "border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-md ring-2 ring-brand-500/20"
                        : isPassed
                        ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1.5">
                      {isPassed ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : isCurrent ? (
                        <span className="h-3.5 w-3.5 rounded-full bg-brand-600 animate-ping" />
                      ) : (
                        <Clock size={16} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold block">{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Advance Status Action Form */}
            <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Perbarui Tahapan Status Pesanan
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={orderStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none"
                >
                  {TRACKING_STEPS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Catatan update (contoh: 'Vendor selesai cetak sampel proofing')..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  onClick={() => handleUpdateStatus(orderStatus)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                >
                  Simpan Catatan Status
                </button>
              </div>
            </div>

            {/* Timeline Activity Feed */}
            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Riwayat Perubahan Status Log
              </h4>
              <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-4">
                {statusLogs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Status diubah ke: <strong>{log.newStatus}</strong></span>
                      <span className="text-[10px] text-slate-400 font-normal">({log.createdAt})</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {log.notes}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Oleh: {log.changedByName} ({log.changedByRole})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VENDOR QUOTE & SOURCING */}
      {activeTab === "vendor" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Katalog Vendor & Perbandingan Harga (Procurement)
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih vendor terbaik berdasarkan riwayat mutu, lead time, sampel fisik, dan harga per unit.
                </p>
              </div>
              <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5">
                <Building2 size={14} />
                + Request Harga ke Vendor Baru
              </button>
            </div>

            {/* Comparison Cards for Item 1 (Tumbler) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase">
                Perbandingan Item: Smart Tumbler Stainless LED 500ml (1.000 pcs)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Vendor 1 (Selected) */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-sm relative">
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Vendor Terpilih
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    CV Cahaya Tumbler Indo
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star size={13} fill="currentColor" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">4.8 / 5.0</span>
                    <span className="text-slate-400 text-[11px]">(32 Proyek Selesai)</span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harga Satuan (HPP):</span>
                      <strong className="text-slate-900 dark:text-white text-sm">Rp 48.000 / pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lead Time Produksi:</span>
                      <span className="font-semibold text-emerald-600">7 Hari Kerja</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sampel Fisik (Proofing):</span>
                      <span className="text-emerald-600 font-semibold">Tersedia Gratis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Term Pembayaran:</span>
                      <span>DP 50%, Pelunasan sebelum kirim</span>
                    </div>
                  </div>
                </div>

                {/* Vendor 2 (Alternative) */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Multi Souvenir Grafika
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star size={13} fill="currentColor" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">4.6 / 5.0</span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harga Satuan (HPP):</span>
                      <span className="text-slate-900 dark:text-white">Rp 53.000 / pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lead Time Produksi:</span>
                      <span className="text-slate-600">10 Hari Kerja</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sampel Fisik (Proofing):</span>
                      <span className="text-slate-500">Berbayar Rp 150.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Term Pembayaran:</span>
                      <span>Cash Before Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SURAT PENAWARAN (QUOTATION) */}
      {activeTab === "quotation" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase">
                  No. Surat Penawaran: SP/MF/2026/10/0042 (Rev 2)
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Surat Penawaran Harga Resmi (Quotation PDF)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/quotations/new"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  Buka Generator & Print
                </Link>
              </div>
            </div>

            {/* Quotation Summary Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Subtotal Penawaran:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Rp 130.000.000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">PPN (11%):</span>
                <span className="font-semibold text-slate-900 dark:text-white">Rp 14.300.000</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">Total Tagihan Final (Grand Total):</span>
                <span className="text-brand-600 dark:text-brand-400">Rp 144.300.000</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Syarat Pembayaran: DP 50% saat PO terbit, Pelunasan TOP 45 Hari setelah BAST & Faktur Pajak lengkap.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PEMBAYARAN & TOP TRACKER */}
      {activeTab === "payment" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Catatan Pembayaran & Tagihan Piutang (TOP 45 Hari)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Status pelunasan faktur Bank Mandiri dan verifikasi bukti transfer rekening.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  Pembayaran DP 50% (Lunas & Terverifikasi)
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  Rp 72.150.000
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Via Bank Transfer Mandiri (Ref: BM-TRF-9948201) pada 05 Okt 2026
                </span>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  Sisa Tagihan Pelunasan (TOP 45 Hari)
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  Rp 72.150.000
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Jatuh tempo 45 hari kalender setelah barang diterima dan BAST ditandatangani
                </span>
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5">
              <Upload size={14} />
              + Input Pelunasan / Upload Bukti Bayar Baru
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: DOKUMEN & ARSIP */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Arsip Dokumen Legalitas & Produksi
                </h3>
                <p className="text-xs text-slate-500">
                  Surat penawaran, purchase order resmi, mockup proofing, faktur pajak, dan surat jalan.
                </p>
              </div>
              <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5">
                <Upload size={14} />
                + Upload Dokumen Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Nama Dokumen</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Versi</th>
                    <th className="py-2.5 px-3">Ukuran</th>
                    <th className="py-2.5 px-3">Diupload Oleh</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={15} className="text-brand-600" />
                        {doc.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">v{doc.version}</td>
                      <td className="py-3 px-3 text-slate-500">{doc.fileSizeText}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{doc.uploadedByName}</td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-brand-600 hover:underline flex items-center gap-1 ml-auto font-semibold">
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
        </div>
      )}

      {/* TAB 7: RIWAYAT AUDIT */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Audit Trail & Riwayat Modifikasi Sistem
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rekam jejak setiap aksi per user (siapa, kapan, dan apa yang berubah) demi akuntabilitas data.
            </p>

            <div className="space-y-3">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white">{log.userName}</strong>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {log.userRole}
                      </span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        [{log.action}]
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1">
                      {log.details}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {log.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
