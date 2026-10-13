# UniMerchant — Corporate Merchandising & Procurement Operations Management System
> **Tugas Besar Analisis & Perancangan Sistem Informasi (Tubes APSI)**  
> Studi Kasus: Industri Pengadaan Custom Corporate Gifts (Tumbler, T-Shirt, ATK, Giftbox) & Pengendalian Cash Flow Piutang (TOP 30–45 Hari).

---

## 📌 Ringkasan Eksekutif & Latar Belakang Masalah

Perusahaan *merchandising & procurement corporate gifts* sering menghadapi 3 tantangan operasional utama:
1. **Inefisiensi Pembuatan Penawaran (Quotation)**: Butuh waktu berhari-hari mengumpulkan harga dari berbagai vendor konveksi/tumbler, menghitung margin, dan mengetik surat penawaran secara manual di Word/Excel yang rawan salah hitung.
2. **Keterbatasan Pelacakan Status Pesanan (Blind Spot Produksi)**: Tim Sales kesulitan memantau posisi pesanan secara *real-time* saat berpindah antara sourcing vendor, persetujuan sampel (*physical proofing*), hingga produksi massal dan pengiriman.
3. **Krisis Cash Flow akibat Piutang Macet (Term of Payment 30–45 Hari)**: Klien korporat (BUMN & multinasional) umumnya menerapkan kebijakan kredit **TOP 30 hingga 45 hari**. Tanpa sistem otomasi pengingat penagihan (H-7, H-3, H-0, dan Overdue >45 hari), arus kas perusahaan pengadaan terancam terhenti.

**UniMerchant** hadir sebagai solusi berbasis web dinamis *all-in-one* yang mengintegrasikan alur **Sales Pipeline -> Procurement HPP Comparison -> Automated Quotation Generator -> Real-Time Order Tracking -> TOP Receivables Aging Control**.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui design tokens, Recharts (Visualisasi Data Interaktif), Lucide React (Aksesibilitas Ikon).
- **Backend & Database**: Next.js API Routes, Prisma ORM, PostgreSQL (18 Models & Enums lengkap).
- **Autentikasi & Otorisasi**: Role-Based Access Control (RBAC) 5 Role terpisah (*Sales*, *Procurement*, *Admin*, *Finance*, *Manager/Super Admin*).
- **PDF & Dokumen**: Generator Surat Penawaran Resmi (*Print-ready* layout PDF dengan nomor surat otomatis & kop surat korporat).
- **Otomasi Notifikasi**: In-App Notification Center + Cron Job Endpoint untuk Pengingat TOP H-7, H-3, H-0, dan Overdue.

---

## 👥 Matriks Hak Akses (Role-Based Access Control / RBAC)

| Modul / Menu | Sales | Procurement | Admin | Finance | Manager (Super Admin) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Executive Dashboard (KPI Omzet & Margin)** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Leads & Kanban Pipeline** | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Real-Time Order Tracking** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Vendor Directory & HPP Sourcing** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Quotation Generator (Surat Penawaran)** | ✅ | ❌ | ✅ | ❌ | ✅ |
| **TOP Tracker & Manajemen Piutang** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Dokumen, Faktur Pajak & Revisi** | 👁️ (Read) | 👁️ (Read) | ✅ | ✅ | ✅ |
| **Portal Karyawan (SOP & Absensi)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Audit Log & User Management** | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Fitur Demonstrasi Praktis**: Pada topbar aplikasi tersedia tombol **Role Switcher 1-Click** sehingga dosen/evaluator dapat langsung menguji perbedaan menu dan kontrol tombol per role tanpa perlu logout-login berulang kali.

---

## 📂 Struktur Folder Proyek

```text
TUBES APSI/
├── app/
│   ├── api/
│   │   └── top-reminders/
│   │       └── route.ts          # Endpoint Cron Job Otomasi Reminder TOP
│   ├── dashboard/
│   │   └── page.tsx              # Executive Dashboard (KPI, Recharts, Pesanan Aktif)
│   ├── documents/
│   │   └── page.tsx              # Arsip Dokumen Legalitas, Pajak, & Revisi
│   ├── finance/
│   │   └── top-tracker/
│   │       └── page.tsx          # Modul Piutang, Aging (0-30, 31-45, >45), Penagihan
│   ├── leads/
│   │   └── page.tsx              # Kanban Pipeline Alur Penjualan & Modal Request Custom
│   ├── login/
│   │   └── page.tsx              # Halaman Login dengan 1-Click Persona Evaluasi
│   ├── orders/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Detail Order 7-Tab (Info, Tracking, Vendor, SP, Bayar, Dokumen, Audit)
│   │   └── page.tsx              # Tabel Filter & List Seluruh Pesanan
│   ├── portal/
│   │   └── page.tsx              # Portal Karyawan (Presensi Absensi Live + Searchable SOP)
│   ├── quotations/
│   │   └── new/
│   │       └── page.tsx          # Quotation Generator + Live Margin Calculator + Print PDF
│   ├── vendors/
│   │   └── page.tsx              # Direktori Vendor, Rating, Lead Time, & RFQ
│   ├── globals.css               # Desain Sistem Tailwind, CSS Variables, Print PDF Media
│   ├── layout.tsx                # Layout Root Shell (Sidebar + Topbar + AuthProvider)
│   └── page.tsx                  # Redirect Root ke /dashboard
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Sidebar Collapsible dengan Filter Menu Dinamis RBAC
│   │   └── Topbar.tsx            # Global Search (⌘K), Notifikasi TOP Bell, Role Switcher, Dark Mode
│   └── ui/
│       └── StatusBadge.tsx       # Badge Status Aksesibel (Warna + Ikon WCAG AA)
├── context/
│   └── AuthContext.tsx           # Dynamic State Manajemen Role & Session Staf
├── lib/
│   ├── mock-data.ts              # Data Realistis Klien BUMN, Vendor, Order, Invoices
│   ├── prisma.ts                 # Prisma Client Singleton
│   ├── rbac.ts                   # Definisi Matriks Permission & Navigasi RBAC
│   └── utils.ts                  # Formatter Rupiah, Tanggal Indonesia, Kalkulasi Aging TOP
├── prisma/
│   ├── schema.prisma             # 18 Model Entitas Lengkap Relasional Database
│   └── seed.ts                   # Script Seeding Data Nyata Pengadaan Merchandising
├── types/
│   └── index.ts                  # TypeScript Interfaces & Enums
├── .env.example                  # Template Variabel Lingkungan
├── package.json                  # Konfigurasi Dependensi Proyek
├── tailwind.config.ts            # Brand Palette (Indigo, Emerald, Amber, Rose)
└── tsconfig.json                 # Path Aliases (@/*)
```

---

## 🚀 Panduan Menjalankan Aplikasi (Setup & Run)

### 1. Prasyarat
- **Node.js** v18.17+ atau v20+
- **PostgreSQL** database (lokal atau cloud seperti Supabase / Neon / Docker)

### 2. Instalasi Dependensi
```bash
# Masuk ke direktori proyek
cd "TUBES APSI"

# Install semua paket dependensi
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi URL database PostgreSQL pada file `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/unimerchant_db?schema=public"
NEXTAUTH_SECRET="unimerchant-super-secret-key-32chars-min-tubes-apsi"
```

### 4. Migrasi & Seeding Database
Jalankan migrasi Prisma untuk membuat 18 tabel dan isi dengan contoh data realistis:
```bash
# Push skema tabel ke database PostgreSQL
npx prisma db push

# Eksekusi seed script (Membuat 5 Role, 5 User Staf, 4 Klien BUMN, 4 Vendor, Order, Invoice, SOP)
npm run prisma:seed
```

### 5. Menjalankan Server Development
```bash
npm run dev
```
Buka browser dan akses: **`http://localhost:3000`**

---

## 🧪 Skenario Pengujian Fitur Utama (Panduan Presentasi Dosen)

1. **Uji Coba RBAC (Hak Akses Divisi)**:
   - Klik tombol **Role: [NAMA ROLE]** pada Topbar kanan atas.
   - Pilih **Sales**: Perhatikan menu *TOP Tracker* dan *Laporan Eksekutif* otomatis disembunyikan.
   - Pilih **Finance**: Menu *Leads Pipeline* otomatis hilang, dan menu *Pembayaran & TOP* tampil dengan tanda badge peringatan.
   - Pilih **Manager**: Seluruh 10 modul tampil lengkap.

2. **Uji Coba Leads Kanban & Request Custom Item**:
   - Buka menu **Leads & Pipeline**.
   - Klik tombol **Input Lead Custom** -> Isi form kebutuhan barang merchandise custom.
   - Klik tanda panah `>` pada kartu Kanban untuk memajukan tahapan (Prospect -> Sourcing -> Quotation -> Negotiation -> Deal -> Produksi).

3. **Uji Coba Quotation Generator & Margin Calculator**:
   - Buka menu **Quotation Generator**.
   - Masukkan biaya HPP vendor (misal Rp 48.000) dan margin target (misal 26%).
   - Amati sistem secara instan menghitung harga penawaran jual, subtotal, dan PPN 11%.
   - Klik **Preview & Print PDF** untuk melihat format Surat Penawaran Resmi siap cetak ber-kop surat.

4. **Uji Coba TOP Tracker & Piutang Menunggak**:
   - Buka menu **Pembayaran & TOP**.
   - Amati 4 kartu *aging bucket* (Current, 0-30 Hari, 31-45 Hari, dan Overdue >45 Hari).
   - Klik tombol **Kirim Reminder** pada invoice Astra International (>45 hari menunggak) untuk memicu otomasi notifikasi penagihan.

5. **Uji Coba Portal Karyawan & SOP**:
   - Buka menu **Portal Karyawan**.
   - Lakukan simulasi presensi kerja **Clock In / Clock Out**.
   - Cari SOP dengan kata kunci seperti `vendor` atau `top` untuk membaca standard operational procedure.

---
*Dibuat dengan dedikasi untuk Tugas Besar Analisis & Perancangan Sistem Informasi (APSI).*
