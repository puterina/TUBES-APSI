// Role-Based Access Control (RBAC) System for UniMerchant

export type RoleType = 'SALES' | 'PROCUREMENT' | 'ADMIN' | 'FINANCE' | 'MANAGER';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  department: string;
  avatarUrl?: string;
}

export type Permission =
  // Leads & Orders
  | 'leads:view'
  | 'leads:create'
  | 'leads:edit'
  | 'leads:delete'
  | 'orders:view'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:update_status'
  // Procurement & Vendors
  | 'vendors:view'
  | 'vendors:create'
  | 'vendors:edit'
  | 'vendors:compare_prices'
  | 'vendors:request_quote'
  // Quotations
  | 'quotations:view'
  | 'quotations:create'
  | 'quotations:edit'
  | 'quotations:generate_pdf'
  | 'quotations:approve'
  // Finance & TOP
  | 'finance:view_dashboard'
  | 'finance:manage_payments'
  | 'finance:view_invoices'
  | 'finance:track_top'
  | 'finance:send_reminders'
  // Documents & Revisions
  | 'documents:view'
  | 'documents:upload'
  | 'documents:manage_taxes'
  | 'documents:view_history'
  // Employee Portal
  | 'portal:view_sop'
  | 'portal:edit_sop'
  | 'portal:clock_in_out'
  // Executive & System
  | 'executive:view_kpi'
  | 'users:manage'
  | 'audit:view_logs';

export const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  SALES: [
    'leads:view',
    'leads:create',
    'leads:edit',
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:update_status',
    'quotations:view',
    'quotations:create',
    'quotations:generate_pdf',
    'documents:view',
    'documents:upload',
    'portal:view_sop',
    'portal:clock_in_out',
  ],
  PROCUREMENT: [
    'orders:view',
    'vendors:view',
    'vendors:create',
    'vendors:edit',
    'vendors:compare_prices',
    'vendors:request_quote',
    'quotations:view',
    'documents:view',
    'documents:upload',
    'portal:view_sop',
    'portal:clock_in_out',
  ],
  ADMIN: [
    'leads:view',
    'orders:view',
    'orders:edit',
    'orders:update_status',
    'quotations:view',
    'quotations:create',
    'quotations:edit',
    'quotations:generate_pdf',
    'documents:view',
    'documents:upload',
    'documents:manage_taxes',
    'documents:view_history',
    'users:manage',
    'portal:view_sop',
    'portal:edit_sop',
    'portal:clock_in_out',
    'audit:view_logs',
  ],
  FINANCE: [
    'orders:view',
    'quotations:view',
    'finance:view_dashboard',
    'finance:manage_payments',
    'finance:view_invoices',
    'finance:track_top',
    'finance:send_reminders',
    'executive:view_kpi',
    'documents:view',
    'documents:upload',
    'portal:view_sop',
    'portal:clock_in_out',
  ],
  MANAGER: [
    // Manager has Super Admin privileges: ALL permissions
    'leads:view',
    'leads:create',
    'leads:edit',
    'leads:delete',
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:update_status',
    'vendors:view',
    'vendors:create',
    'vendors:edit',
    'vendors:compare_prices',
    'vendors:request_quote',
    'quotations:view',
    'quotations:create',
    'quotations:edit',
    'quotations:generate_pdf',
    'quotations:approve',
    'finance:view_dashboard',
    'finance:manage_payments',
    'finance:view_invoices',
    'finance:track_top',
    'finance:send_reminders',
    'documents:view',
    'documents:upload',
    'documents:manage_taxes',
    'documents:view_history',
    'portal:view_sop',
    'portal:edit_sop',
    'portal:clock_in_out',
    'executive:view_kpi',
    'users:manage',
    'audit:view_logs',
  ],
};

export function hasPermission(userRole: RoleType, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  allowedRoles: RoleType[];
  badge?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    allowedRoles: ['SALES', 'PROCUREMENT', 'ADMIN', 'FINANCE', 'MANAGER'],
  },
  {
    title: 'Leads & Pipeline',
    href: '/leads',
    iconName: 'KanbanSquare',
    allowedRoles: ['SALES', 'ADMIN', 'MANAGER'],
    badge: 'Hot',
  },
  {
    title: 'Order Tracking',
    href: '/orders',
    iconName: 'PackageCheck',
    allowedRoles: ['SALES', 'PROCUREMENT', 'ADMIN', 'FINANCE', 'MANAGER'],
  },
  {
    title: 'Vendor Directory',
    href: '/vendors',
    iconName: 'Building2',
    allowedRoles: ['PROCUREMENT', 'MANAGER', 'ADMIN'],
  },
  {
    title: 'Quotation Generator',
    href: '/quotations/new',
    iconName: 'FileSpreadsheet',
    allowedRoles: ['SALES', 'ADMIN', 'MANAGER'],
  },
  {
    title: 'Pembayaran & TOP',
    href: '/finance/top-tracker',
    iconName: 'BadgeDollarSign',
    allowedRoles: ['FINANCE', 'MANAGER'],
    badge: 'TOP Alert',
  },
  {
    title: 'Dokumen & Arsip',
    href: '/documents',
    iconName: 'FolderArchive',
    allowedRoles: ['ADMIN', 'FINANCE', 'MANAGER', 'SALES'],
  },
  {
    title: 'Laporan Eksekutif',
    href: '/reports',
    iconName: 'BarChart3',
    allowedRoles: ['FINANCE', 'MANAGER'],
  },
  {
    title: 'Portal Karyawan',
    href: '/portal',
    iconName: 'UserCheck',
    allowedRoles: ['SALES', 'PROCUREMENT', 'ADMIN', 'FINANCE', 'MANAGER'],
  },
  {
    title: 'Pengaturan User',
    href: '/settings/users',
    iconName: 'ShieldAlert',
    allowedRoles: ['MANAGER', 'ADMIN'],
  },
];
