import React from "react";
import {
  Inbox,
  Search,
  FileSpreadsheet,
  Handshake,
  CheckCheck,
  Cog,
  Truck,
  Trophy,
  XCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn, ORDER_STATUS_CONFIG } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "invoice" | "priority" | "quotation";
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "order",
  className,
  size = "md",
}) => {
  if (type === "order") {
    const config = ORDER_STATUS_CONFIG[status] || {
      label: status,
      color: "text-slate-700 dark:text-slate-300",
      border: "border-slate-300 dark:border-slate-700",
      bg: "bg-slate-100 dark:bg-slate-800",
      icon: "Clock",
    };

    const renderIcon = () => {
      const iconSize = size === "sm" ? 12 : 14;
      switch (config.icon) {
        case "Inbox":
          return <Inbox size={iconSize} className="shrink-0" />;
        case "Search":
          return <Search size={iconSize} className="shrink-0" />;
        case "FileSpreadsheet":
          return <FileSpreadsheet size={iconSize} className="shrink-0" />;
        case "Handshake":
          return <Handshake size={iconSize} className="shrink-0" />;
        case "CheckCheck":
          return <CheckCheck size={iconSize} className="shrink-0" />;
        case "Cog":
          return <Cog size={iconSize} className="shrink-0 animate-spin-slow" />;
        case "Truck":
          return <Truck size={iconSize} className="shrink-0" />;
        case "Trophy":
          return <Trophy size={iconSize} className="shrink-0" />;
        case "XCircle":
          return <XCircle size={iconSize} className="shrink-0" />;
        default:
          return <Clock size={iconSize} className="shrink-0" />;
      }
    };

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs transition-colors",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
          config.bg,
          config.color,
          config.border,
          className
        )}
      >
        {renderIcon()}
        <span>{config.label}</span>
      </span>
    );
  }

  if (type === "invoice") {
    let bg = "bg-slate-100 text-slate-700 border-slate-300";
    let icon = <Clock size={12} />;
    let label = status;

    if (status === "PAID") {
      bg = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400";
      icon = <CheckCircle2 size={12} />;
      label = "Lunas (Paid)";
    } else if (status === "PARTIAL") {
      bg = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400";
      icon = <Clock size={12} />;
      label = "Parsial (DP Saja)";
    } else if (status === "UNPAID") {
      bg = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400";
      icon = <Clock size={12} />;
      label = "Belum Bayar";
    } else if (status === "OVERDUE") {
      bg = "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-400 animate-pulse";
      icon = <AlertTriangle size={12} />;
      label = "Menunggak (Overdue)";
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
          bg,
          className
        )}
      >
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  if (type === "priority") {
    let color = "bg-slate-100 text-slate-700 border-slate-200";
    let icon = <Clock size={12} />;
    if (status === "URGENT") {
      color = "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300";
      icon = <AlertCircle size={12} />;
    } else if (status === "HIGH") {
      color = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300";
      icon = <AlertTriangle size={12} />;
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
          color,
          className
        )}
      >
        {icon}
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
      {status}
    </span>
  );
};
