export type RoleName = 'SALES' | 'PROCUREMENT' | 'ADMIN' | 'FINANCE' | 'MANAGER';

export type LeadStage =
  | 'PROSPECT'
  | 'CONTACTED'
  | 'REQUIREMENT_GATHERING'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type OrderStatus =
  | 'LEAD'
  | 'SOURCING'
  | 'QUOTATION'
  | 'NEGOTIATION'
  | 'DEAL'
  | 'PRODUKSI'
  | 'KIRIM'
  | 'SELESAI'
  | 'CANCELLED';

export type ItemCategory = 'TUMBLER' | 'T_SHIRT' | 'ATK' | 'GIFTBOX' | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  department: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  npwp?: string;
  topDays: number; // 30 or 45 days
  creditLimit: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemName: string;
  category: ItemCategory;
  specification: string;
  quantity: number;
  unit: string;
  customDesignUrl?: string;
  targetBudgetPerUnit: number;
  procurementCostPerUnit: number;
  sellingPricePerUnit: number;
}

export interface VendorPrice {
  id: string;
  orderItemId: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  minOrderQty: number;
  leadTimeDays: number;
  sampleAvailable: boolean;
  isSelected: boolean;
  notes?: string;
}

export interface OrderStatusLog {
  id: string;
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  changedByName: string;
  changedByRole: string;
  notes: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  salesUserId: string;
  salesUserName: string;
  status: OrderStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  deadlineDate: string;
  deliveryAddress: string;
  totalCost: number;
  totalMargin: number;
  totalSellingPrice: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
  statusLogs: OrderStatusLog[];
  quotationNumber?: string;
}

export interface QuotationLineItem {
  id: string;
  itemName: string;
  category: ItemCategory;
  specification: string;
  quantity: number;
  unit: string;
  costPerUnit: number; // HPP Procurement
  sellingPricePerUnit: number; // Harga Penawaran ke Klien
  marginPercent: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  orderId: string;
  version: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  customerEmail: string;
  totalCost: number;
  marginPercentage: number;
  totalMargin: number;
  subTotal: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  paymentTerms: string;
  validUntil: string;
  notes?: string;
  termsAndConditions: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REVISED' | 'REJECTED';
  createdByName: string;
  createdAt: string;
  items: QuotationLineItem[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  topDays: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  orderNumber: string;
  amount: number;
  paymentType: 'DOWN_PAYMENT' | 'PARTIAL' | 'FULL_PAYMENT';
  paymentMethod: 'BANK_TRANSFER' | 'GIRO' | 'CASH';
  paymentDate: string;
  referenceNumber: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  proofUrl?: string;
}

export interface DocumentItem {
  id: string;
  orderId?: string;
  orderNumber?: string;
  title: string;
  category: 'PERIZINAN' | 'PAJAK_FAKTUR' | 'DESIGN_MOCKUP' | 'SURAT_JALAN' | 'BAST' | 'INVOICE' | 'SURAT_PENAWARAN';
  fileUrl: string;
  fileSizeText: string;
  version: number;
  uploadedByName: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string;
  rating: number;
  leadTimeDays: number;
  paymentTerms: string;
  isActive: boolean;
}

export interface SOPItem {
  id: string;
  code: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  version: number;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  entityName: string;
  entityId: string;
  details: string;
  createdAt: string;
}
