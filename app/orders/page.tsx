"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PackageCheck,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MOCK_ORDERS } from "@/lib/mock-data";

export default function OrdersListPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filtered = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="text-brand-600" />
            Daftar Pesanan & Pelacakan Real-Time
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Seluruh pesanan merchandise korporat yang sedang berjalan dan riwayat selesai.
          </p>
        </div>

        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
        >
          <Plus size={16} />
          Input Pesanan Baru
        </Link>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No. Order atau Nama Klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["ALL", "PRODUKSI", "SOURCING", "QUOTATION", "SELESAI"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                selectedStatus === status
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {status === "ALL" ? "Semua Status" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">No. Order</th>
              <th className="py-3 px-3">Klien & Proyek</th>
              <th className="py-3 px-3">Status Pelacakan</th>
              <th className="py-3 px-3">Prioritas</th>
              <th className="py-3 px-3">Nilai Jual</th>
              <th className="py-3 px-3">Target Deadline</th>
              <th className="py-3 px-3">Sales PIC</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-brand-600">
                  <Link href={`/orders/${order.orderNumber}`} className="hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {order.customer.companyName}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{order.notes}</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={order.status} type="order" />
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={order.priority} type="priority" />
                </td>
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                  {formatRupiah(order.totalSellingPrice)}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                  {formatDate(order.deadlineDate)}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                  {order.salesUserName.split(" ")[0]}
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-400"
                  >
                    <Eye size={13} />
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
