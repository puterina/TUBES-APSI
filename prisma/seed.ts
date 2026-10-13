import { PrismaClient, RoleName, OrderStatus, ItemCategory, QuotationStatus, InvoiceStatus, PaymentType, PaymentMethod, PaymentStatus, DocumentCategory, AttendanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database UniMerchant...");

  // 1. Bersihkan tabel (urutan cascading aman)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.sOP.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.quotationRevision.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.vendorPrice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusLog.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // 2. Buat Role
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: RoleName.MANAGER,
        displayName: "Operational Manager (Super Admin)",
        description: "Akses penuh seluruh modul, dashboard eksekutif, dan kontrol akses.",
        permissions: ["all"],
      },
    }),
    prisma.role.create({
      data: {
        name: RoleName.SALES,
        displayName: "Sales & Marketing",
        description: "Manajemen lead, kanban pipeline, request custom item, & penawaran.",
        permissions: ["leads:view", "leads:create", "orders:view", "quotations:create"],
      },
    }),
    prisma.role.create({
      data: {
        name: RoleName.PROCUREMENT,
        displayName: "Procurement & Sourcing",
        description: "Katalog vendor, request harga, perbandingan vendor, & kalkulasi HPP.",
        permissions: ["vendors:view", "vendors:compare_prices", "orders:view"],
      },
    }),
    prisma.role.create({
      data: {
        name: RoleName.ADMIN,
        displayName: "Operations Admin",
        description: "Arsip dokumen, nomor surat penawaran, pajak, perizinan, & audit log.",
        permissions: ["quotations:generate_pdf", "documents:manage", "users:manage"],
      },
    }),
    prisma.role.create({
      data: {
        name: RoleName.FINANCE,
        displayName: "Finance & Accounting",
        description: "Manajemen pembayaran DP/pelunasan, TOP aging tracker, & arus kas.",
        permissions: ["finance:track_top", "finance:manage_payments", "invoices:view"],
      },
    }),
  ]);

  const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  // 3. Buat User Staff
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Hendra Wijaya, S.E.",
        email: "manager@unimerchant.id",
        passwordHash: "$2a$12$eMockHashedPasswordForDemo1234567890",
        phone: "081122334455",
        department: "Executive Management",
        roleId: roleMap[RoleName.MANAGER],
      },
    }),
    prisma.user.create({
      data: {
        name: "Dimas Aditya Pratama",
        email: "sales@unimerchant.id",
        phone: "081234567890",
        department: "Sales & Business Development",
        passwordHash: "$2a$12$eMockHashedPasswordForDemo1234567890",
        roleId: roleMap[RoleName.SALES],
      },
    }),
    prisma.user.create({
      data: {
        name: "Rian Ramadhan",
        email: "procurement@unimerchant.id",
        phone: "081398765432",
        department: "Procurement & Supply Chain",
        passwordHash: "$2a$12$eMockHashedPasswordForDemo1234567890",
        roleId: roleMap[RoleName.PROCUREMENT],
      },
    }),
    prisma.user.create({
      data: {
        name: "Siti Nurhaliza",
        email: "admin@unimerchant.id",
        phone: "081555666777",
        department: "General & Operational Admin",
        passwordHash: "$2a$12$eMockHashedPasswordForDemo1234567890",
        roleId: roleMap[RoleName.ADMIN],
      },
    }),
    prisma.user.create({
      data: {
        name: "Maya Indah Puspita",
        email: "finance@unimerchant.id",
        phone: "081988899900",
        department: "Finance & Accounts Receivable",
        passwordHash: "$2a$12$eMockHashedPasswordForDemo1234567890",
        roleId: roleMap[RoleName.FINANCE],
      },
    }),
  ]);

  const [manager, sales, procurement, adminUser, finance] = users;

  // 4. Buat Corporate Customers (dengan ketentuan TOP 30 & 45 hari)
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        companyName: "PT Bank Mandiri (Persero) Tbk",
        contactPerson: "Ibu Kartika Sari (Corporate Secretary)",
        email: "kartika.sari@bankmandiri.co.id",
        phone: "021-5265555",
        address: "Plaza Mandiri Lt. 14, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan",
        npwp: "01.001.604.5-093.000",
        topDays: 45, // TOP 45 Hari
        creditLimit: 500000000,
        notes: "Klien korporasi prioritas, pembayaran via rekening giro korporat TOP 45 hari.",
      },
    }),
    prisma.customer.create({
      data: {
        companyName: "PT Telekomunikasi Selular (Telkomsel)",
        contactPerson: "Bpk. Bagus Wicaksono (Procurement Officer)",
        email: "bagus.wicaksono@telkomsel.co.id",
        phone: "021-5240123",
        address: "Telkom Landmark Tower Lt. 18, Jl. Jend. Gatot Subroto, Jakarta Selatan",
        npwp: "01.309.283.9-092.000",
        topDays: 30, // TOP 30 Hari
        creditLimit: 350000000,
        notes: "Membutuhkan spesifikasi ketat untuk packaging dan konsistensi warna brand merah Telkomsel.",
      },
    }),
    prisma.customer.create({
      data: {
        companyName: "PT Tokopedia (GoTo Group)",
        contactPerson: "Kevin Gunawan (People Operations Lead)",
        email: "kevin.g@tokopedia.com",
        phone: "021-80647333",
        address: "Tokopedia Tower Lt. 32, Ciputra World 2, Kuningan, Jakarta Selatan",
        npwp: "02.827.492.1-016.000",
        topDays: 30,
        creditLimit: 250000000,
        notes: "Pesanan rutin onboarding merchandise & hampers partner tahunan.",
      },
    }),
    prisma.customer.create({
      data: {
        companyName: "PT Astra International Tbk",
        contactPerson: "Dian Anggraini (Corporate Communications)",
        email: "dian.a@astra.co.id",
        phone: "021-6522555",
        address: "Menara Astra, Jl. Jendral Sudirman Kav. 5-6, Jakarta Pusat",
        npwp: "01.302.993.4-054.000",
        topDays: 45,
        creditLimit: 600000000,
        notes: "Hampers VIP HUT Astra, finishing emboss foil emas pada leather notebook.",
      },
    }),
  ]);

  const [bankMandiri, telkomsel, tokopedia, astra] = customers;

  // 5. Buat Katalog Vendor Terpercaya
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: "CV Cahaya Tumbler Indo",
        contactPerson: "Bpk. Bambang Sutrisno",
        email: "sales@cahayatumbler.com",
        phone: "081288991122",
        address: "Kawasan Industri Jatake Blok C No. 12, Tangerang",
        categories: "Tumbler Stainless, UV Print, Grafir Laser, Thermal Flask",
        rating: 4.8,
        leadTimeDays: 7,
        paymentTerms: "DP 50%, Pelunasan sebelum kirim",
        bankDetails: "BCA 8830192837 a/n CV Cahaya Tumbler Indo",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "PT Bandung Garment Prima",
        contactPerson: "Kang Asep Hidayat",
        email: "asep@garmentprima.co.id",
        phone: "081322110099",
        address: "Jl. Cigondewah Rahayu No. 88, Bandung",
        categories: "T-Shirt Cotton Combed 24s/30s, Polo Lacoste, Hoodie, Tote Bag",
        rating: 4.7,
        leadTimeDays: 10,
        paymentTerms: "DP 50%, Pelunasan TOP 14 hari",
        bankDetails: "Mandiri 1310099887766 a/n PT Bandung Garment Prima",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Exclusive Hardbox & Packaging Nusantara",
        contactPerson: "Ibu Jessica Wijaya",
        email: "order@nusantarapackaging.com",
        phone: "081199887766",
        address: "Sentra Percetakan Kalibaru Timur No. 45, Jakarta Pusat",
        categories: "Giftbox Hardboard Magnetik, Custom EVA Foam, Hotprint Foil Emas",
        rating: 4.9,
        leadTimeDays: 8,
        paymentTerms: "DP 40%, Sisa setelah inspeksi sampel",
        bankDetails: "BCA 5270918273 a/n Jessica Wijaya",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Grafika Promosi Sentosa",
        contactPerson: "Bpk. Andi Saputra",
        email: "andi@grafikapromosi.id",
        phone: "081765432100",
        address: "Kawasan Niaga Daan Mogot KM 11, Jakarta Barat",
        categories: "ATK Custom, Notebook Kulit Sintetis, Metal Ballpoint, Lanyard Pod",
        rating: 4.6,
        leadTimeDays: 5,
        paymentTerms: "Cash Before Delivery",
        bankDetails: "BNI 0928374615 a/n Grafika Promosi Sentosa",
      },
    }),
  ]);

  const [vendorTumbler, vendorGarment, vendorHardbox, vendorATK] = vendors;

  // 6. Buat Leads & Order Aktif
  const lead1 = await prisma.lead.create({
    data: {
      leadNumber: "LD-2026-0001",
      title: "Corporate Year-End VIP Giftbox 2026",
      customerId: bankMandiri.id,
      assignedUserId: sales.id,
      estimatedValue: 145000000,
      expectedDeadline: new Date("2026-11-20"),
      stage: "WON",
      source: "Tender Korporat Bank BUMN",
      notes: "Kebutuhan paket giftbox eksklusif untuk nasabah Prioritas Bank Mandiri.",
    },
  });

  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0001",
      leadId: lead1.id,
      customerId: bankMandiri.id,
      salesUserId: sales.id,
      status: OrderStatus.PRODUKSI,
      priority: "HIGH",
      deadlineDate: new Date("2026-11-25"),
      deliveryAddress: "Gudang Logistik Bank Mandiri, Kawasan Pergudangan Marunda Center Blok D, Bekasi",
      totalCost: 98000000,
      totalMargin: 32000000,
      totalSellingPrice: 130000000,
      notes: "Desain packaging disetujui Bpk. Kartika Sari. Target pengiriman bertahap 2 kloter.",
    },
  });

  // Items untuk Order 1
  const itemTumbler = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      itemName: "Smart Tumbler Stainless LED Suhu 500ml",
      category: ItemCategory.TUMBLER,
      specification: "Material SUS 304 food-grade, display temperatur sentuh LED, warna Navy Blue Doff, laser engrave logo Bank Mandiri Prioritas.",
      quantity: 1000,
      unit: "pcs",
      targetBudgetPerUnit: 55000,
      procurementCostPerUnit: 48000,
      sellingPricePerUnit: 65000,
    },
  });

  const itemNotebook = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      itemName: "Custom PU Leather Agenda & Metal Pen Set",
      category: ItemCategory.ATK,
      specification: "Ukuran A5, 192 halaman bookpaper 80gsm garis, cover kulit PU magnetic lock emboss gold, pen metal hitam tinta gel.",
      quantity: 1000,
      unit: "set",
      targetBudgetPerUnit: 40000,
      procurementCostPerUnit: 32000,
      sellingPricePerUnit: 45000,
    },
  });

  const itemGiftbox = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      itemName: "Premium Hardbox Magnetic + Custom EVA Spon Cut",
      category: ItemCategory.GIFTBOX,
      specification: "Dimensi 28 x 22 x 9 cm, karton tebal no. 30 lapis fancy paper navy, penutup magnet, busa cetak presisi untuk tumbler & buku.",
      quantity: 1000,
      unit: "box",
      targetBudgetPerUnit: 22000,
      procurementCostPerUnit: 18000,
      sellingPricePerUnit: 25000,
    },
  });

  // Vendor Price Comparison untuk Item Tumbler
  await prisma.vendorPrice.createMany({
    data: [
      {
        orderItemId: itemTumbler.id,
        vendorId: vendorTumbler.id,
        unitPrice: 48000,
        minOrderQty: 500,
        leadTimeDays: 7,
        sampleAvailable: true,
        isSelected: true,
        notes: "Termasuk laser engrave 1 sisi logo Bank Mandiri, sudah bersertifikat food grade.",
      },
      {
        orderItemId: itemTumbler.id,
        vendorId: vendorHardbox.id, // misal vendor lain
        unitPrice: 53000,
        minOrderQty: 1000,
        leadTimeDays: 10,
        sampleAvailable: false,
        isSelected: false,
        notes: "Harga lebih mahal dan lead time lebih lama 3 hari.",
      },
    ],
  });

  // Vendor Price Comparison untuk Item Notebook & ATK
  await prisma.vendorPrice.create({
    data: {
      orderItemId: itemNotebook.id,
      vendorId: vendorATK.id,
      unitPrice: 32000,
      minOrderQty: 500,
      leadTimeDays: 6,
      sampleAvailable: true,
      isSelected: true,
      notes: "Kualitas cover kulit lembut dan emboss tajam.",
    },
  });

  // Status Log untuk Order 1
  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order1.id,
        previousStatus: OrderStatus.LEAD,
        newStatus: OrderStatus.SOURCING,
        changedById: sales.id,
        notes: "Kebutuhan disetujui, diteruskan ke bagian procurement untuk verifikasi vendor.",
      },
      {
        orderId: order1.id,
        previousStatus: OrderStatus.SOURCING,
        newStatus: OrderStatus.QUOTATION,
        changedById: procurement.id,
        notes: "Harga vendor CV Cahaya Tumbler & Grafika Promosi terpilih, Surat Penawaran dibuat.",
      },
      {
        orderId: order1.id,
        previousStatus: OrderStatus.QUOTATION,
        newStatus: OrderStatus.NEGOTIATION,
        changedById: sales.id,
        notes: "Klien meminta penyesuaian diskon volume dari margin 28% ke 25%.",
      },
      {
        orderId: order1.id,
        previousStatus: OrderStatus.NEGOTIATION,
        newStatus: OrderStatus.DEAL,
        changedById: sales.id,
        notes: "PO resmi nomor PO-BM/CORP/2026/091 diterbitkan klien. DP 50% diterima.",
      },
      {
        orderId: order1.id,
        previousStatus: OrderStatus.DEAL,
        newStatus: OrderStatus.PRODUKSI,
        changedById: procurement.id,
        notes: "Proses produksi massal 1.000 set berjalan di pabrik vendor.",
      },
    ],
  });

  // 7. Buat Surat Penawaran Resmi (Quotation) & Revisi
  const quote1 = await prisma.quotation.create({
    data: {
      quotationNumber: "SP/MF/2026/10/0042",
      orderId: order1.id,
      version: 2,
      totalCost: 98000000,
      marginPercentage: 24.62,
      totalMargin: 32000000,
      subTotal: 130000000,
      taxPercentage: 11.0,
      taxAmount: 14300000,
      grandTotal: 144300000,
      paymentTerms: "DP 50% saat PO terbit, Pelunasan TOP 45 Hari setelah BAST & Faktur Pajak",
      validUntil: new Date("2026-11-15"),
      notes: "Harga sudah mencakup mockup sampel 1 unit, packaging hardbox magnetik, dan ongkos kirim Jabodetabek.",
      termsAndConditions: "1. Waktu produksi 14 hari kerja setelah approval sample proofing.\n2. Toleransi selisih produksi +- 2%.\n3. Garansi cacat cetak 7 hari setelah barang diterima.",
      status: QuotationStatus.ACCEPTED,
      createdById: sales.id,
    },
  });

  await prisma.quotationRevision.create({
    data: {
      quotationId: quote1.id,
      revisionNumber: 1,
      snapshotData: {
        version: 1,
        grandTotal: 153180000,
        discountReason: "Harga awal sebelum negosiasi diskon volume dari Bank Mandiri",
      },
      reasonForChange: "Negosiasi klien untuk paket 1.000 unit, diberikan diskon penyesuaian margin.",
      changedById: sales.id,
    },
  });

  // 8. Dokumen & Arsip Order
  await prisma.document.createMany({
    data: [
      {
        orderId: order1.id,
        title: "Surat Penawaran Resmi SP-MF-2026-10-0042.pdf",
        category: DocumentCategory.SURAT_PENAWARAN,
        fileUrl: "https://unimerchant.id/docs/SP-MF-2026-10-0042.pdf",
        fileSize: 450200,
        mimeType: "application/pdf",
        version: 2,
        uploadedById: adminUser.id,
        description: "Surat penawaran harga final yang disetujui nasabah Bank Mandiri.",
      },
      {
        orderId: order1.id,
        title: "Mockup Approval Desain Giftbox & Tumbler.pdf",
        category: DocumentCategory.DESIGN_MOCKUP,
        fileUrl: "https://unimerchant.id/docs/mockup-mandiri-vip.pdf",
        fileSize: 1250000,
        mimeType: "application/pdf",
        version: 1,
        uploadedById: sales.id,
        description: "File visual proofing 3D dengan tanda tangan persetujuan PIC Klien.",
      },
      {
        orderId: order1.id,
        title: "Purchase Order PO-BM-CORP-2026-091.pdf",
        category: DocumentCategory.PERIZINAN,
        fileUrl: "https://unimerchant.id/docs/po-mandiri-091.pdf",
        fileSize: 320000,
        mimeType: "application/pdf",
        version: 1,
        uploadedById: adminUser.id,
        description: "Official PO dari divisi Corporate Secretary Bank Mandiri.",
      },
    ],
  });

  // 9. Invoices & TOP Tracker Piutang (Kondisi Nyata: Piutang Berjalan & Overdue)
  // Invoice 1: Bank Mandiri (DP sudah bayar, sisa pelunasan TOP 45 hari)
  const invMandiriDP = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV/MF/2026/10/001",
      orderId: order1.id,
      customerId: bankMandiri.id,
      issueDate: new Date("2026-10-01"),
      dueDate: new Date("2026-10-15"),
      topDays: 14,
      totalAmount: 72150000, // 50% DP
      paidAmount: 72150000,
      balanceAmount: 0,
      status: InvoiceStatus.PAID,
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: "PAY/2026/10/0001",
      invoiceId: invMandiriDP.id,
      orderId: order1.id,
      amount: 72150000,
      paymentType: PaymentType.DOWN_PAYMENT,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentDate: new Date("2026-10-05"),
      proofOfPaymentUrl: "https://unimerchant.id/proofs/transfer-mandiri-dp.jpg",
      referenceNumber: "BM-TRF-9948201",
      status: PaymentStatus.VERIFIED,
      verifiedById: finance.id,
      verifiedAt: new Date("2026-10-05T14:30:00Z"),
      notes: "Dana masuk rekening Mandiri operasional UniMerchant, match 100%.",
    },
  });

  // Order 2: Telkomsel (TOP 30 hari - Aging 0-30 Hari)
  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0002",
      customerId: telkomsel.id,
      salesUserId: sales.id,
      status: OrderStatus.SELESAI,
      priority: "MEDIUM",
      deadlineDate: new Date("2026-09-30"),
      totalCost: 38000000,
      totalMargin: 17000000,
      totalSellingPrice: 55000000,
      notes: "500 pcs T-Shirt Onboarding Red Edition sudah selesai dan diterima gudang Telkomsel.",
    },
  });

  // Invoice Telkomsel: Jatuh tempo 30 hari, saat ini aging ~13 hari (Kategori 0-30 Hari)
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV/MF/2026/09/014",
      orderId: order2.id,
      customerId: telkomsel.id,
      issueDate: new Date("2026-09-01"),
      dueDate: new Date("2026-10-01"), // 12 hari yang lalu
      topDays: 30,
      totalAmount: 61050000, // PPN 11%
      paidAmount: 0,
      balanceAmount: 61050000,
      status: InvoiceStatus.UNPAID,
      reminderH7Sent: true,
      reminderH3Sent: true,
      reminderH0Sent: true,
    },
  });

  // Order 3: Tokopedia (TOP 30 hari - Aging 31-45 Hari)
  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0003",
      customerId: tokopedia.id,
      salesUserId: sales.id,
      status: OrderStatus.SELESAI,
      priority: "LOW",
      deadlineDate: new Date("2026-08-20"),
      totalCost: 26000000,
      totalMargin: 12000000,
      totalSellingPrice: 38000000,
    },
  });

  // Invoice Tokopedia: Jatuh tempo 35 hari lalu (Kategori 31-45 Hari)
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV/MF/2026/08/088",
      orderId: order3.id,
      customerId: tokopedia.id,
      issueDate: new Date("2026-08-05"),
      dueDate: new Date("2026-09-05"), // ~38 hari lalu
      topDays: 30,
      totalAmount: 42180000,
      paidAmount: 15000000,
      balanceAmount: 27180000,
      status: InvoiceStatus.PARTIAL,
      reminderH7Sent: true,
      reminderH3Sent: true,
      reminderH0Sent: true,
      reminderOverdueSent: true,
    },
  });

  // Order 4: Astra International (TOP 45 hari - Kategori OVERDUE >45 Hari!)
  const order4 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0004",
      customerId: astra.id,
      salesUserId: sales.id,
      status: OrderStatus.SELESAI,
      priority: "HIGH",
      deadlineDate: new Date("2026-07-15"),
      totalCost: 52000000,
      totalMargin: 23000000,
      totalSellingPrice: 75000000,
    },
  });

  // Invoice Astra: Jatuh tempo 60 hari lalu (OVERDUE >45 HARI)
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV/MF/2026/07/045",
      orderId: order4.id,
      customerId: astra.id,
      issueDate: new Date("2026-07-01"),
      dueDate: new Date("2026-08-15"), // ~59 hari lalu
      topDays: 45,
      totalAmount: 83250000,
      paidAmount: 0,
      balanceAmount: 83250000,
      status: InvoiceStatus.OVERDUE,
      reminderH7Sent: true,
      reminderH3Sent: true,
      reminderH0Sent: true,
      reminderOverdueSent: true,
    },
  });

  // 10. Notifikasi Otomatis
  await prisma.notification.createMany({
    data: [
      {
        userId: finance.id,
        title: "🚨 Alert Piutang Kritis: Overdue >45 Hari!",
        message: "Invoice INV/MF/2026/07/045 (PT Astra International Tbk) senilai Rp 83.250.000 sudah menunggak 59 hari. Segera kirimkan surat somasi penagihan ke finance Astra.",
        type: "TOP_REMINDER",
        linkUrl: "/finance/top-tracker",
        isRead: false,
      },
      {
        userId: finance.id,
        title: "⚠️ Peringatan Jatuh Tempo: PT Tokopedia (Aging 38 Hari)",
        message: "Sisa tagihan Rp 27.180.000 pada INV/MF/2026/08/088 melewati batas TOP 30 hari.",
        type: "TOP_REMINDER",
        linkUrl: "/finance/top-tracker",
        isRead: false,
      },
      {
        userId: sales.id,
        title: "🎉 Quotation Disetujui: Bank Mandiri",
        message: "Surat Penawaran SP/MF/2026/10/0042 telah di-ACC. Order ORD-2026-0001 berpindah ke tahap Produksi.",
        type: "QUOTATION_ALERT",
        linkUrl: "/orders/ORD-2026-0001",
        isRead: true,
      },
    ],
  });

  // 11. SOP Internal & Portal Karyawan
  await prisma.sOP.createMany({
    data: [
      {
        code: "SOP-OPS-001",
        title: "Prosedur Pengadaan Vendor & Verifikasi Sampel Merchandise",
        category: "Procurement & QC",
        content: `### 1. Tujuan
Memastikan setiap vendor yang memproduksi merchandise custom memiliki standar mutu tinggi, ketepatan lead time, dan spesifikasi bahan sesuai persetujuan klien.

### 2. Tahapan Sourcing
1. Tim Procurement wajib meminta minimal **3 penawaran harga kompetitif** dari katalog vendor terdaftar.
2. Untuk pesanan >500 unit, wajib dilakukan **mockup physical proofing** (1 sampel fisik) sebelum produksi massal.
3. Sampel harus ditandatangani oleh PIC Klien dan tim Quality Control UniMerchant.

### 3. Batas Toleransi Mutu
- Deviasi warna cetak maks Delta E <= 2.0.
- Toleransi cacat jahit atau baret cat maks 1.5% dari total qty.`,
        tags: "vendor, procurement, qc, sample proofing",
        version: 2,
        lastUpdatedById: manager.id,
      },
      {
        code: "SOP-FIN-002",
        title: "Kebijakan Term of Payment (TOP 30-45 Hari) & Penagihan Piutang",
        category: "Finance & Accounting",
        content: `### 1. Ketentuan TOP Korporat
- Klien Tier 1 (BUMN / Listed Corporate): Diberikan **TOP 45 Hari** kalender setelah BAST & Faktur Pajak lengkap.
- Klien Tier 2 (Startup / Swasta Menengah): Diberikan **TOP 30 Hari** kalender dengan DP 50% di awal.
- Klien Baru: Cash on Delivery atau DP 50% + 50% sebelum barang dikirim.

### 2. Protokol Otomasi Reminder Penagihan
- **H-7**: Sistem otomatis mengirim email reminder ramah beserta salinan faktur.
- **H-3**: Konfirmasi jadwal kliring/transfer via email ke bagian Finance klien.
- **H-0**: Panggilan follow-up konfirmasi status kliring.
- **Overdue >30 Hari**: Eskalasi ke Sales Director dan penghentian order baru sementara.`,
        tags: "finance, top, aging, collection, reminder",
        version: 1,
        lastUpdatedById: finance.id,
      },
    ],
  });

  // 12. Absensi Harian Staf
  const today = new Date();
  await prisma.attendance.createMany({
    data: [
      {
        userId: sales.id,
        date: today,
        clockIn: new Date(today.setHours(8, 25, 0, 0)),
        status: AttendanceStatus.PRESENT,
        clockInNotes: "WFO di kantor pusat UniMerchant",
      },
      {
        userId: procurement.id,
        date: today,
        clockIn: new Date(today.setHours(8, 45, 0, 0)),
        status: AttendanceStatus.PRESENT,
        clockInNotes: "WFO, agenda inspeksi pabrik vendor jam 13:00",
      },
      {
        userId: finance.id,
        date: today,
        clockIn: new Date(today.setHours(8, 15, 0, 0)),
        status: AttendanceStatus.PRESENT,
        clockInNotes: "WFO, rekonsiliasi penerimaan bank harian",
      },
    ],
  });

  // 13. Audit Log
  await prisma.auditLog.createMany({
    data: [
      {
        userId: sales.id,
        action: "STATUS_CHANGE",
        entityName: "Order",
        entityId: order1.id,
        newState: { status: "PRODUKSI", orderNumber: "ORD-2026-0001" },
        ipAddress: "192.168.1.104",
      },
      {
        userId: adminUser.id,
        action: "GENERATE_PDF",
        entityName: "Quotation",
        entityId: quote1.id,
        newState: { quotationNumber: "SP/MF/2026/10/0042", version: 2 },
        ipAddress: "192.168.1.102",
      },
      {
        userId: finance.id,
        action: "APPROVE_PAYMENT",
        entityName: "Payment",
        entityId: invMandiriDP.id,
        newState: { status: "VERIFIED", amount: 72150000 },
        ipAddress: "192.168.1.115",
      },
    ],
  });

  console.log("✅ Seeding selesai sukses! 5 Roles, 5 Users, 4 Klien, 4 Vendor, Order, Quote, Invoices, SOP & Audit Log siap.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
