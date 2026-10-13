"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Mail,
  PhoneCall,
  Calendar,
  Building,
} from "lucide-react";
import { formatRupiah, formatDate, calculateAging } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { MOCK_INVOICES } from "@/lib/mock-data";

export default function TOPTrackerPage() {
  const { can } = useAuth();
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeBucket, setActiveBucket] = useState<string>("ALL");
  const [sentAlertMessage, setSentAlertMessage] = useState<string | null>(null);

  const handleSendReminder = (invNumber: string, customerName: string, days: number) => {
    setSentAlertMessage(
      `Email reminder penagihan otomatis (H-${days} / Overdue) berhasil dikirimkan ke tim Finance ${customerName}!`
    );
    setTimeout(() => setSentAlertMessage(null), 4000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeBucket === "ALL") return true;
    const aging = calculateAging(inv.dueDate);
    if (activeBucket === "OVERDUE_45") return aging.bucket === "OVERDUE_45";
    if (activeBucket === "DAYS_31_45") return aging.bucket === "DAYS_31_45";
    if (activeBucket === "DAYS_0_30") return aging.bucket === "DAYS_0_30";
    if (activeBucket === "CURRENT") return aging.bucket === "CURRENT";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BadgeDollarSign className="text-brand-600" />
            TOP Tracker & Manajemen Piutang (30-45 Hari)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengendalian penagihan piutang korporat, pemantauan aging invoice, dan otomatisasi reminder H-7, H-3, H-0, dan Overdue.
          </p>
        </div>

        <button
          onClick={() => handleSendReminder("ALL", "Seluruh Klien Menunggak", 0)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
        >
          <Mail size={15} />
          Jalankan Cron Reminder Hari Ini
        </button>
      </div>

      {sentAlertMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{sentAlertMessage}</span>
        </div>
      )}

      {/* Aging Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "ALL", label: "Semua Piutang", amount: 171480000, count: 3, border: "border-slate-200 dark:border-slate-800" },
          { key: "DAYS_0_30", label: "Aging 0 - 30 Hari", amount: 61050000, count: 1, border: "border-amber-200 dark:border-amber-900" },
          { key: "DAYS_31_45", label: "Aging 31 - 45 Hari", amount: 27180000, count: 1, border: "border-orange-200 dark:border-orange-900" },
          { key: "OVERDUE_45", label: "Overdue > 45 Hari 🚨", amount: 83250000, count: 1, border: "border-rose-300 dark:border-rose-900/80 bg-rose-50/20" },
        ].map((card) => {
          const isSelected = activeBucket === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setActiveBucket(card.key)}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border text-left transition-all ${card.border} ${
                isSelected ? "ring-2 ring-brand-500 shadow-md" : "hover:border-slate-300 shadow-xs"
              }`}
            >
              <span className="text-xs font-semibold text-slate-500 uppercase">{card.label}</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatRupiah(card.amount)}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {card.count} Faktur Korporat
              </span>
            </button>
          );
        })}
      </div>

      {/* Invoices Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Daftar Tagihan Piutang & Status Penagihan ({filteredInvoices.length} Invoice)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No. Invoice</th>
                <th className="py-3 px-3">Klien & Order</th>
                <th className="py-3 px-3">Jatuh Tempo & TOP</th>
                <th className="py-3 px-3">Aging Kategori</th>
                <th className="py-3 px-3">Nilai Tagihan</th>
                <th className="py-3 px-3">Sisa Piutang</th>
                <th className="py-3 px-3">Status Bayar</th>
                <th className="py-3 px-3 text-right">Aksi Penagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
                const aging = calculateAging(inv.dueDate);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-brand-600 dark:text-brand-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.customerName}</div>
                      <Link href={`/orders/${inv.orderNumber}`} className="text-xs text-slate-500 hover:underline">
                        Order Ref: {inv.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(inv.dueDate)}
                      </div>
                      <span className="text-[11px] text-slate-500">TOP {inv.topDays} Hari</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${aging.badgeClass}`}>
                        {aging.badgeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {formatRupiah(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      {formatRupiah(inv.balanceAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={inv.status} type="invoice" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.status !== "PAID" && (
                        <button
                          onClick={() => handleSendReminder(inv.invoiceNumber, inv.customerName, aging.daysOverdue)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                        >
                          <Send size={12} />
                          Kirim Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
