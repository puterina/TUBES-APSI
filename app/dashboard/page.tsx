"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  Plus,
  Users,
  Eye,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { MOCK_ORDERS, MOCK_INVOICES } from "@/lib/mock-data";

const MONTHLY_REVENUE_DATA = [
  { month: "Mei", omzet: 140000000, margin: 38000000 },
  { month: "Jun", omzet: 185000000, margin: 49000000 },
  { month: "Jul", omzet: 210000000, margin: 58000000 },
  { month: "Agu", omzet: 195000000, margin: 52000000 },
  { month: "Sep", omzet: 270000000, margin: 74000000 },
  { month: "Okt (Est)", omzet: 340000000, margin: 92000000 },
];

const TOP_AGING_DATA = [
  { name: "Current (Belum Tempo)", amount: 72150000, count: 1, color: "#10B981" },
  { name: "Aging 0 - 30 Hari", amount: 61050000, count: 1, color: "#F59E0B" },
  { name: "Aging 31 - 45 Hari", amount: 27180000, count: 1, color: "#F97316" },
  { name: "Overdue > 45 Hari 🚨", amount: 83250000, count: 1, color: "#EF4444" },
];

const TOP_CLIENTS_DATA = [
  { name: "Bank Mandiri", total: 178000000, orders: 3 },
  { name: "Astra International", total: 83250000, orders: 1 },
  { name: "Telkomsel", total: 61050000, orders: 2 },
  { name: "Tokopedia", total: 42180000, orders: 2 },
];

export default function DashboardPage() {
  const { activeRole, currentUser } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState("Q4 2026");

  // Summary computations
  const totalOmzet = 340000000;
  const totalGrossMargin = 92000000;
  const marginPercentage = ((totalGrossMargin / totalOmzet) * 100).toFixed(1);
  const totalPiutang = MOCK_INVOICES.reduce(
    (acc, inv) => acc + (inv.status !== "PAID" ? inv.balanceAmount : 0),
    0
  );
  const overduePiutang = MOCK_INVOICES.filter((inv) => inv.status === "OVERDUE").reduce(
    (acc, inv) => acc + inv.balanceAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard Operasional & Eksekutif
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Role: {activeRole}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang kembali, <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong>. Pantau metrik penawaran, proses produksi, dan arus kas penagihan TOP.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <Users size={15} />
            Pipeline Leads
          </Link>
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
          >
            <Plus size={15} />
            Buat Penawaran
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (4 Metrik Utama) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Omzet Bulanan */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Omzet (Bulan Ini)
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatRupiah(totalOmzet)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight size={14} />
              <span>+18.4% dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Gross Margin */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gross Margin ({marginPercentage}%)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatRupiah(totalGrossMargin)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight size={14} />
              <span>Target minimal margin: 25% (Tercapai)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Piutang TOP Berjalan */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Piutang Berjalan
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatRupiah(totalPiutang)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
              <span>3 Klien dalam penagihan TOP 30-45 hari</span>
            </div>
          </div>
        </div>

        {/* Card 4: Overdue Piutang Kritis */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-rose-50/30 dark:from-slate-900 dark:to-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Piutang Overdue &gt;45 Hari
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 animate-pulse">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-rose-700 dark:text-rose-400">
              {formatRupiah(overduePiutang)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1">
              <span>1 Invoice butuh eskalasi hukum/somasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Monthly Revenue & Margin Trends (2/3 width) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tren Omzet & Margin Keuntungan (6 Bulan Terakhir)
              </h2>
              <p className="text-xs text-slate-500">
                Pertumbuhan penjualan merchandise custom korporat (Rp Juta)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-sm bg-brand-600 inline-block"></span> Omzet
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block"></span> Margin
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: number) => formatRupiah(val)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="omzet" name="Total Omzet" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="margin" name="Gross Margin" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: TOP Aging Breakdown Chart (1/3 width) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Aging Piutang (TOP Tracker)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                Live Status
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Distribusi tagihan berdasarkan periode tempo kredit klien
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_AGING_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {TOP_AGING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatRupiah(val)}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {TOP_AGING_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatRupiah(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Orders Tracker Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-brand-600" />
              Pesanan Aktif & Real-Time Tracking
            </h2>
            <p className="text-xs text-slate-500">
              Pelacakan tahapan siklus pesanan dari Sourcing, Penawaran, hingga Produksi & Pengiriman
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua ({MOCK_ORDERS.length})
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">No. Order</th>
                <th className="py-3 px-3">Klien & Proyek</th>
                <th className="py-3 px-3">Status Saat Ini</th>
                <th className="py-3 px-3">Nilai Kontrak</th>
                <th className="py-3 px-3">Target Deadline</th>
                <th className="py-3 px-3">Sales PIC</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {MOCK_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-brand-600 dark:text-brand-400">
                    <Link href={`/orders/${order.orderNumber}`} className="hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.customer.companyName}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">
                      {order.notes || "Pengadaan merchandise korporat"}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {formatRupiah(order.totalSellingPrice)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {formatDate(order.deadlineDate)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {order.salesUserName.split(" ")[0]}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-400 transition-colors"
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
    </div>
  );
}
