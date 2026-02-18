# Sipema Maja - Sistem Informasi Permata Mutiara Maja

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Platform terdepan untuk kemudahan pembayaran IPL dan pengelolaan aduan selama masa retensi perumahan

## 📋 Deskripsi Proyek

Sipema Maja adalah aplikasi web modern yang dikembangkan untuk mengelola sistem pembayaran Iuran Pengelolaan Lingkungan (IPL) dan pusat aduan selama masa retensi perumahan. Aplikasi ini dirancang untuk memfasilitasi komunikasi antara pengembang perumahan, admin, teknisi, dan warga dengan fitur-fitur lengkap untuk manajemen keuangan, pengaduan, dan data warga.

## ✨ Fitur Utama

### 👥 Manajemen Pengguna
- **Super Admin**: Akses penuh ke semua fitur sistem
- **Admin Cluster**: Manajemen cluster dan data lokal
- **Teknisi**: Pengelolaan work orders dan perbaikan
- **Warga**: Akses terbatas untuk pembayaran dan pengaduan

### 💰 Sistem Pembayaran IPL
- Pembayaran WhatsApp integration
- Tracking status pembayaran (Pending, Verified, Paid)
- Generate kwitansi PDF otomatis
- Dashboard keuangan dengan chart analitik

### 📝 Pusat Aduan
- Sistem tiket pengaduan
- Tracking status (Baru, Diproses, Selesai)
- Kategori aduan dengan ikon
- History aduan lengkap

### 🏢 Manajemen Data
- Database warga dengan import/export CSV/JSON
- Manajemen tipe rumah
- Manajemen cluster dan vendor
- Template download untuk data entry

### 📊 Dashboard & Analitik
- Dashboard dengan stats real-time
- Progress pembayaran per cluster
- Distribusi status pembayaran
- Infografik IPL progress

## 🏗️ Arsitektur Sistem (Blueprint)

### Diagram Arsitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Data Context  │    │   Supabase      │
│   (React + TS)  │◄──►│   (React)       │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • State Mgmt    │    │ • Users         │
│ • Billing       │    │ • CRUD Ops      │    │ • Invoices      │
│ • Complaints    │    │ • API Calls     │    │ • Complaints    │
│ • Admin Panels  │    │                 │    │ • Clusters      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                ▼
                   ┌─────────────────┐
                   │   External APIs │
                   │ • WhatsApp API  │
                   │ • PDF Generation│
                   │ • File Export   │
                   └─────────────────┘
```

### Struktur Komponen

```
src/
├── components/
│   ├── Dashboard.tsx          # Dashboard utama
│   ├── BillingSystem.tsx      # Sistem pembayaran
│   ├── ComplaintCenter.tsx    # Pusat aduan
│   ├── Sidebar.tsx            # Navigasi sidebar
│   ├── ResidentDatabase.tsx   # Database warga
│   ├── ClusterManagement.tsx  # Manajemen cluster
│   ├── UserManagement.tsx     # Manajemen user
│   ├── HouseTypeManagement.tsx # Manajemen tipe rumah
│   └── ResidentDataManagement.tsx # Import/export data
├── DataContext.tsx            # Global state management
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Konstanta aplikasi
├── services/                  # API services
└── supabase_schema.sql        # Database schema
```

### Database Schema

Database menggunakan Supabase (PostgreSQL) dengan schema lengkap di `supabase_schema.sql`. Tabel utama:

- **users**: Informasi pengguna dan role
- **invoices**: Data tagihan IPL
- **complaints**: Tiket pengaduan
- **units**: Data rumah dan warga
- **clusters**: Informasi cluster perumahan
- **payments**: Record pembayaran
- **vendors**: Data vendor dan kontraktor

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool dan dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Chart library

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Row Level Security** - Database security

### Libraries
- **jsPDF** - PDF generation
- **React Router** - Client-side routing (future)
- **Axios** - HTTP client (future API calls)

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone repository:**
   ```bash
   git clone https://github.com/auditttv-oss/sipemamaja.git
   cd sipemamaja
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Buat file `.env.local` di root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup database:**
   - Import `supabase_schema.sql` ke Supabase project
   - Konfigurasi RLS policies sesuai kebutuhan

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Build untuk production:**
   ```bash
   npm run build
   npm run preview
   ```

## 📖 Panduan Penggunaan

### Login & Role
- **Super Admin**: Akses semua menu admin
- **Admin Cluster**: Manajemen data cluster
- **Teknisi**: Work orders dan maintenance
- **Warga**: Dashboard, pembayaran, pengaduan

### Menu Utama

#### Dashboard
- Overview stats pembayaran dan aduan
- Progress IPL per cluster
- Quick actions untuk navigasi

#### Keuangan & IPL
- Tagihan Saya: List invoice pribadi
- Bayar IPL: Form pembayaran WhatsApp
- Transparansi Cluster: Finance overview
- Verifikasi Pembayaran: Admin payment verification
- Aduan: Complaint management

#### Admin Features
- Manajemen Cluster: CRUD cluster data
- Manajemen Tipe Rumah: House type management
- Manajemen Data Warga: Import/export resident data
- User Management: User dan role management
- Vendor Management: Vendor database
- Marketing & Sales: Lead management

## 🌐 Deployment

### Vercel (Recommended)
1. Import project dari GitHub
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables di Vercel dashboard
4. Deploy

### Manual Deployment
```bash
npm run build
# Upload dist/ ke hosting provider
```

## 🔧 Development Guide

### Code Structure
- **Components**: Modular UI components
- **Context**: Global state management
- **Services**: API calls dan business logic
- **Types**: TypeScript interfaces
- **Constants**: Mock data dan konfigurasi

### Adding New Features
1. Define types di `types.ts`
2. Add mock data ke `constants.ts`
3. Implement CRUD di `DataContext.tsx`
4. Create component di `components/`
5. Add routing di `App.tsx`
6. Update sidebar di `Sidebar.tsx`

### Database Operations
- Gunakan Supabase client untuk real database
- Implement RLS policies untuk security
- Use migrations untuk schema changes

### Styling Guidelines
- Tailwind CSS utility classes
- Consistent color scheme
- Responsive design
- Dark mode support (future)

## 📈 API Endpoints

### Supabase Tables
- `users` - User management
- `invoices` - Invoice tracking
- `complaints` - Complaint tickets
- `units` - Resident data
- `clusters` - Cluster management
- `payments` - Payment records
- `vendors` - Vendor database
- `house_types` - House type definitions

### External Integrations
- WhatsApp API untuk pembayaran
- PDF generation untuk kwitansi
- CSV/JSON import/export

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Standards
- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Comprehensive testing (future)
- Documentation updates

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk support teknis atau pertanyaan development:
- Buat issue di GitHub repository
- Contact development team

---

**Sipema Maja** - Sistem Informasi Modern untuk Perumahan Masa Depan 🚀
