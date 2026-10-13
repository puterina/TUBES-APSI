"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  PackageCheck,
  Building2,
  FileSpreadsheet,
  BadgeDollarSign,
  FolderArchive,
  BarChart3,
  UserCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, NavItem } from "@/lib/rbac";
import { useAuth } from "@/context/AuthContext";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  KanbanSquare: <KanbanSquare size={20} />,
  PackageCheck: <PackageCheck size={20} />,
  Building2: <Building2 size={20} />,
  FileSpreadsheet: <FileSpreadsheet size={20} />,
  BadgeDollarSign: <BadgeDollarSign size={20} />,
  FolderArchive: <FolderArchive size={20} />,
  BarChart3: <BarChart3 size={20} />,
  UserCheck: <UserCheck size={20} />,
  ShieldAlert: <ShieldAlert size={20} />,
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeRole, currentUser } = useAuth();

  // Filter navigation items based on current active role
  const visibleItems = NAVIGATION_ITEMS.filter((item) =>
    item.allowedRoles.includes(activeRole)
  );

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <Package size={22} className="stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                UniMerchant
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  PRO
                </span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Ops & Procurement
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          title={isCollapsed ? "Buka Sidebar" : "Kecilkan Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role Pill Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 mx-3 my-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Akses Role
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
              <Sparkles size={11} />
              {activeRole}
            </span>
          </div>
        </div>
      )}

      {/* Nav Menu Items */}
      <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative",
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/80"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <span
                className={cn(
                  "shrink-0 transition-transform group-hover:scale-105",
                  isActive
                    ? "text-white"
                    : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
                )}
              >
                {ICON_MAP[item.iconName] || <PackageCheck size={20} />}
              </span>

              {!isCollapsed && (
                <span className="truncate flex-1 tracking-tight">
                  {item.title}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.department}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
