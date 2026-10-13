"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Printer,
  Save,
  ArrowLeft,
  Sparkles,
  Calculator,
  Building,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";

interface QuotationItem {
  id: string;
  itemName: string;
  category: string;
  specification: string;
  quantity: number;
  unit: string;
  costPrice: number; // HPP dari vendor
  marginPercent: number; // Margin %
  sellingPrice: number; // Harga jual
  total: number;
}

export default function QuotationGeneratorPage() {
  const { currentUser } = useAuth();

  // Auto-generated Official Letter Number format: SP/UM/YYYY/MM/XXXX
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const autoNumber = `SP/UM/${year}/${month}/0043`;

  const [quotationNumber, setQuotationNumber] = useState(autoNumber);
  const [version, setVersion] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState("cust-mandiri");
  const [validUntilDays, setValidUntilDays] = useState(14);
  const [paymentTerms, setPaymentTerms] = useState("DP 50% saat PO terbit, Pelunasan TOP 45 Hari setelah BAST & Faktur Pajak");
  const [ppnEnabled, setPpnEnabled] = useState(true);
  const [revisionReason, setRevisionReason] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Line items state
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: "1",
      itemName: "Smart Tumbler Stainless LED Suhu 500ml",
      category: "TUMBLER",
      specification: "Material SUS 304 food-grade, display temperatur sentuh LED, warna Navy Blue Doff, laser engrave logo Bank Mandiri Prioritas.",
      quantity: 1000,
      unit: "pcs",
      costPrice: 48000,
      marginPercent: 26.0,
      sellingPrice: 65000,
      total: 65000000,
    },
    {
      id: "2",
      itemName: "Custom PU Leather Agenda & Metal Pen Set",
      category: "ATK",
      specification: "Ukuran A5, 192 hal bookpaper garis, cover kulit PU magnetic lock emboss gold, pen metal hitam tinta gel.",
      quantity: 1000,
      unit: "set",
      costPrice: 32000,
      marginPercent: 28.8,
      sellingPrice: 45000,
      total: 45000000,
    },
    {
      id: "3",
      itemName: "Premium Hardbox Magnetic + Custom EVA Spon Cut",
      category: "GIFTBOX",
      specification: "Dimensi 28 x 22 x 9 cm, karton tebal no. 30 lapis fancy paper navy, penutup magnet, busa cetak presisi.",
      quantity: 1000,
      unit: "box",
      costPrice: 18000,
      marginPercent: 28.0,
      sellingPrice: 25000,
      total: 25000000,
    },
  ]);

  const selectedCustomer =
    MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId) || MOCK_CUSTOMERS[0];

  // Recalculate item selling price when cost or margin changes
  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };

        if (field === "costPrice" || field === "marginPercent") {
          const cost = field === "costPrice" ? Number(value) : updated.costPrice;
          const margin = field === "marginPercent" ? Number(value) : updated.marginPercent;
          const calculatedSelling = Math.round(cost / (1 - margin / 100));
          updated.sellingPrice = calculatedSelling;
          updated.total = calculatedSelling * updated.quantity;
        } else if (field === "quantity" || field === "sellingPrice") {
          const qty = field === "quantity" ? Number(value) : updated.quantity;
          const sell = field === "sellingPrice" ? Number(value) : updated.sellingPrice;
          updated.total = qty * sell;
          if (updated.costPrice > 0) {
            updated.marginPercent = Number((((sell - updated.costPrice) / sell) * 100).toFixed(1));
          }
        }
        return updated;
      })
    );
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: String(Date.now()),
      itemName: "Item Merchandise Custom Baru",
      category: "TUMBLER",
      specification: "Spesifikasi bahan, logo, dan kemasan kustom",
      quantity: 500,
      unit: "pcs",
      costPrice: 35000,
      marginPercent: 25,
      sellingPrice: 47000,
      total: 500 * 47000,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  // Grand totals
  const totalCost = items.reduce((acc, curr) => acc + curr.costPrice * curr.quantity, 0);
  const subTotalSelling = items.reduce((acc, curr) => acc + curr.total, 0);
  const totalMarginRp = subTotalSelling - totalCost;
  const overallMarginPercent = ((totalMarginRp / subTotalSelling) * 100).toFixed(1);
  const ppnAmount = ppnEnabled ? Math.round(subTotalSelling * 0.11) : 0;
  const grandTotal = subTotalSelling + ppnAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="text-brand-600" />
              Quotation Generator & Margin Calculator
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate Surat Penawaran Harga resmi dengan kalkulasi margin otomatis dan versi revisi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <Printer size={15} />
            Preview & Print PDF
          </button>
          <button
            onClick={() => {
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
          >
            <Save size={15} />
            Simpan Quotation
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 text-xs font-semibold no-print">
          <CheckCircle2 size={16} />
          Quotation resmi nomor {quotationNumber} berhasil disimpan ke database!
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Left Column: Metadata & Client Selector (1/3) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building size={16} className="text-brand-600" />
            Informasi Surat & Klien Korporat
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nomor Surat Penawaran (Auto-Generated)
            </label>
            <input
              type="text"
              value={quotationNumber}
              onChange={(e) => setQuotationNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Versi Revisi
              </label>
              <input
                type="number"
                min={1}
                value={version}
                onChange={(e) => setVersion(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Masa Berlaku
              </label>
              <select
                value={validUntilDays}
                onChange={(e) => setValidUntilDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={7}>7 Hari Kalender</option>
                <option value={14}>14 Hari Kalender</option>
                <option value={30}>30 Hari Kalender</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Klien Korporat Tujuan
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {MOCK_CUSTOMERS.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.companyName} (TOP {cust.topDays} Hari)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white">
              {selectedCustomer.companyName}
            </div>
            <div className="text-slate-500 text-[11px] leading-relaxed">
              {selectedCustomer.address}
            </div>
            <div className="text-slate-500 text-[11px]">
              PIC: {selectedCustomer.contactPerson}
            </div>
            <div className="text-brand-600 dark:text-brand-400 font-semibold text-[11px]">
              Ketentuan Kredit: Term of Payment {selectedCustomer.topDays} Hari
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Syarat & Metode Pembayaran
            </label>
            <textarea
              rows={2}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alasan Revisi (Jika Versi &gt; 1)
            </label>
            <input
              type="text"
              placeholder="Contoh: Penyesuaian diskon volume 1.000 unit"
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Right Column: Line Items Table & Live Margin Calculator (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator size={16} className="text-brand-600" />
                  Rincian Item & Kalkulasi Margin Profit
                </h2>
                <p className="text-xs text-slate-500">
                  Ubah HPP atau target Margin % untuk menghitung harga penawaran secara instan.
                </p>
              </div>
              <button
                onClick={addItem}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center gap-1 border border-brand-200 dark:border-brand-800"
              >
                <Plus size={14} />
                Tambah Item
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="h-6 w-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Nama Barang
                        </label>
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Kategori
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(item.id, "category", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="TUMBLER">TUMBLER</option>
                          <option value="T_SHIRT">T-SHIRT</option>
                          <option value="ATK">ATK</option>
                          <option value="GIFTBOX">GIFTBOX</option>
                          <option value="OTHER">LAINNYA</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      title="Hapus baris"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Spesifikasi Detail (Bahan, Warna, Teknik Cetak / Logo)
                    </label>
                    <textarea
                      rows={2}
                      value={item.specification}
                      onChange={(e) => updateItem(item.id, "specification", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Calculations row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Jumlah (Qty)</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">HPP Vendor</span>
                      <input
                        type="number"
                        step={1000}
                        value={item.costPrice}
                        onChange={(e) => updateItem(item.id, "costPrice", e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Margin %</span>
                      <input
                        type="number"
                        step={0.5}
                        value={item.marginPercent}
                        onChange={(e) => updateItem(item.id, "marginPercent", e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Harga Jual/pcs</span>
                      <input
                        type="number"
                        step={1000}
                        value={item.sellingPrice}
                        onChange={(e) => updateItem(item.id, "sellingPrice", e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Subtotal</span>
                      <span className="font-extrabold text-slate-900 dark:text-white pt-1 block truncate">
                        {formatRupiah(item.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Financial Summary */}
            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Biaya Procurement (HPP):</span>
                <span className="font-mono">{formatRupiah(totalCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Total Gross Margin ({overallMarginPercent}%):</span>
                <span className="font-mono">+{formatRupiah(totalMarginRp)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Subtotal Penawaran:</span>
                <span className="font-mono">{formatRupiah(subTotalSelling)}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ppnEnabled}
                    onChange={(e) => setPpnEnabled(e.target.checked)}
                    className="rounded text-brand-600"
                  />
                  <span>PPN 11% (Faktur Pajak)</span>
                </label>
                <span className="font-mono">{formatRupiah(ppnAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-brand-600 dark:text-brand-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Harga Penawaran (Grand Total):</span>
                <span className="font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / PRINT PREVIEW: SURAT PENAWARAN RESMI */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 md:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-10 relative print-only-container">
            {/* Action Bar (hidden on print) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-brand-600 uppercase">
                Pratinjau Surat Penawaran Resmi (Siap Dicetak / PDF)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={14} />
                  Print / Unduh PDF
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* KOP SURAT RESMI PERUSAHAAN */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl tracking-tighter">
                  UM
                </div>
                <div>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                    PT UNIMERCHANT KREATIF NUSANTARA
                  </h2>
                  <p className="text-xs text-slate-600">
                    One-Stop Corporate Gifts & Custom Merchandising Procurement
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Menara Sentraya Lt. 12, Jl. Iskandarsyah Raya No. 1A, Jakarta Selatan • Email: contact@unimerchant.id
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                  ORIGINAL QUOTATION
                </span>
                <p className="text-xs text-slate-500 mt-1">Jakarta, {formatDate(today)}</p>
              </div>
            </div>

            {/* Nomor & Tujuan Surat */}
            <div className="grid grid-cols-2 gap-6 text-xs mb-6">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-24 text-slate-500 py-0.5">Nomor</td>
                      <td className="font-bold text-slate-900">: {quotationNumber} (Rev {version})</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Lampiran</td>
                      <td className="text-slate-900">: 1 Berkas Spesifikasi Mockup</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Perihal</td>
                      <td className="font-semibold text-slate-900">: Penawaran Harga Pengadaan Merchandise Kustom</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Kepada Yth:
                </span>
                <p className="font-bold text-slate-900">{selectedCustomer.companyName}</p>
                <p className="text-slate-600 text-[11px]">{selectedCustomer.contactPerson}</p>
                <p className="text-slate-500 text-[11px] truncate">{selectedCustomer.address}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-4 leading-relaxed">
              Dengan hormat,<br />
              Sehubungan dengan kebutuhan pengadaan merchandise custom korporasi Bapak/Ibu, bersama ini kami sampaikan rincian penawaran harga terbaik sebagai berikut:
            </p>

            {/* TABEL RINCIAN BARANG */}
            <table className="w-full text-left text-xs border border-slate-300 mb-6">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-300 w-10 text-center">No</th>
                  <th className="py-2 px-3 border-r border-slate-300">Deskripsi Barang & Spesifikasi</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-center w-20">Qty</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right w-28">Harga Satuan</th>
                  <th className="py-2 px-3 text-right w-32">Total Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <strong className="text-slate-900 block">{item.itemName}</strong>
                      <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                        {item.specification}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      {formatRupiah(item.sellingPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold font-mono">
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 font-semibold bg-slate-50">
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-right border-r border-slate-300">
                    Subtotal:
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {formatRupiah(subTotalSelling)}
                  </td>
                </tr>
                {ppnEnabled && (
                  <tr>
                    <td colSpan={4} className="py-1.5 px-3 text-right border-r border-slate-300">
                      PPN (11%):
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono">
                      {formatRupiah(ppnAmount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-100 text-sm font-extrabold text-slate-900">
                  <td colSpan={4} className="py-2.5 px-3 text-right border-r border-slate-300">
                    Grand Total:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-brand-600">
                    {formatRupiah(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* SYARAT & KETENTUAN */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-[11px] space-y-1 mb-8">
              <strong className="text-slate-900 block font-bold">Syarat & Ketentuan:</strong>
              <p>1. Penawaran harga ini berlaku selama <strong>{validUntilDays} hari kalender</strong> sejak diterbitkan.</p>
              <p>2. Syarat pembayaran: <strong>{paymentTerms}</strong>.</p>
              <p>3. Waktu produksi: 14 hari kerja setelah approval sample proofing fisik & PO resmi.</p>
              <p>4. Pembayaran ditransfer ke rekening: Bank Mandiri 122-00-1928371-0 a/n PT Kreatif Merchandising Nusantara.</p>
            </div>

            {/* TANDA TANGAN */}
            <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4">
              <div>
                <p className="text-slate-500 mb-14">Disetujui oleh Klien (Customer):</p>
                <div className="border-t border-slate-400 w-48 mx-auto pt-1">
                  <p className="font-bold text-slate-900">{selectedCustomer.contactPerson.split("(")[0]}</p>
                  <p className="text-[11px] text-slate-500">{selectedCustomer.companyName}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-14">Hormat Kami,</p>
                <div className="border-t border-slate-400 w-48 mx-auto pt-1">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">PT UniMerchant Kreatif Nusantara</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
