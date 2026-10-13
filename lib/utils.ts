import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number into Indonesian Rupiah (IDR) deterministically
 * Avoids React Hydration mismatch between Node.js server (space) and Safari client (no space).
 */
export function formatRupiah(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "Rp 0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  const formattedNumber = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formattedNumber}`;
}

const BULAN_INDONESIA = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/**
 * Format standard Date to Indonesian short date deterministically
 */
export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";
  const day = date.getDate();
  const month = BULAN_INDONESIA[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export type AgingBucket = "CURRENT" | "DAYS_0_30" | "DAYS_31_45" | "OVERDUE_45";

export interface AgingInfo {
  daysOverdue: number;
  bucket: AgingBucket;
  badgeLabel: string;
  badgeClass: string;
}

/**
 * Calculate Term of Payment (TOP) aging relative to dueDate
 */
export function calculateAging(dueDateInput: Date | string): AgingInfo {
  const dueDate = typeof dueDateInput === "string" ? new Date(dueDateInput) : dueDateInput;
  const today = new Date();
  
  // Calculate difference in whole days
  const diffTime = today.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      daysOverdue: 0,
      bucket: "CURRENT",
      badgeLabel: `Jatuh tempo dlm ${Math.abs(diffDays)} hr`,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
    };
  } else if (diffDays <= 30) {
    return {
      daysOverdue: diffDays,
      bucket: "DAYS_0_30",
      badgeLabel: `Aging ${diffDays} hr (0-30)`,
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
    };
  } else if (diffDays <= 45) {
    return {
      daysOverdue: diffDays,
      bucket: "DAYS_31_45",
      badgeLabel: `Aging ${diffDays} hr (31-45)`,
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400",
    };
  } else {
    return {
      daysOverdue: diffDays,
      bucket: "OVERDUE_45",
      badgeLabel: `Overdue >45 hr (${diffDays} hr)`,
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse",
    };
  }
}

/**
 * Status definition map with accessible badge styles & icons
 */
export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; border: string; bg: string; icon: string }
> = {
  LEAD: {
    label: "Lead Masuk",
    color: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    bg: "bg-slate-100 dark:bg-slate-800",
    icon: "Inbox",
  },
  SOURCING: {
    label: "Sourcing Vendor",
    color: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    icon: "Search",
  },
  QUOTATION: {
    label: "Surat Penawaran",
    color: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-300 dark:border-indigo-800",
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
    icon: "FileSpreadsheet",
  },
  NEGOTIATION: {
    label: "Negosiasi",
    color: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    icon: "Handshake",
  },
  DEAL: {
    label: "Deal / PO Diterima",
    color: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    icon: "CheckCheck",
  },
  PRODUKSI: {
    label: "Dalam Produksi",
    color: "text-violet-700 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-800",
    bg: "bg-violet-50 dark:bg-violet-950/50",
    icon: "Cog",
  },
  KIRIM: {
    label: "Pengiriman / Ekspedisi",
    color: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-300 dark:border-cyan-800",
    bg: "bg-cyan-50 dark:bg-cyan-950/50",
    icon: "Truck",
  },
  SELESAI: {
    label: "Pesanan Selesai",
    color: "text-green-700 dark:text-green-300",
    border: "border-green-300 dark:border-green-800",
    bg: "bg-green-50 dark:bg-green-950/50",
    icon: "Trophy",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    bg: "bg-rose-50 dark:bg-rose-950/50",
    icon: "XCircle",
  },
};
