# Sipema Maja - System Blueprint

## Sistem Overview

Sipema Maja adalah Sistem Informasi terintegrasi untuk pengelolaan perumahan modern yang fokus pada pembayaran Iuran Pengelolaan Lingkungan (IPL) dan sistem pengaduan selama masa retensi. Sistem ini dirancang untuk memfasilitasi komunikasi multi-stakeholder antara pengembang perumahan, admin, teknisi, dan warga dengan arsitektur yang scalable dan user-friendly.

## 🎯 Tujuan Sistem

1. **Otomasi Pembayaran**: Sistem pembayaran IPL yang terintegrasi dengan WhatsApp
2. **Manajemen Pengaduan**: Platform terpusat untuk pengelolaan komplain warga
3. **Dashboard Analitik**: Real-time insights untuk pengambilan keputusan
4. **Data Management**: Sistem CRUD lengkap untuk semua entitas perumahan
5. **Multi-Role Access**: Kontrol akses berbasis peran dengan keamanan RLS

## 🏗️ Arsitektur Sistem

### Diagram Arsitektur Utama

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   React SPA     │  │   Data Context  │  │  Components │ │
│  │   (TypeScript)  │◄►│   (State Mgmt)  │◄►│   (UI/UX)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Supabase      │  │   PostgreSQL    │  │   RLS       │ │
│  │   (BaaS)        │  │   (Database)    │  │   (Security) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ WhatsApp API    │  │ PDF Generation  │  │ File Export │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Layer Breakdown

#### 1. Frontend Layer
- **React 18 + TypeScript**: Framework utama untuk UI
- **Vite**: Build tool dan development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Recharts**: Data visualization

#### 2. Backend Layer
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Relational database
- **Row Level Security**: Database-level access control
- **Real-time subscriptions**: Live data updates

#### 3. External Integrations
- **WhatsApp Business API**: Payment notifications
- **PDF Generation**: Invoice receipts
- **CSV/JSON Export**: Data portability

## 📊 Struktur Komponen

### Core Components

```
src/
├── components/
│   ├── App.tsx                    # Root component & routing
│   ├── Dashboard.tsx              # Main dashboard
│   ├── BillingSystem.tsx          # IPL payment system
│   ├── ComplaintCenter.tsx        # Complaint management
│   ├── Sidebar.tsx                # Navigation sidebar
│   ├── ResidentDatabase.tsx       # Resident data viewer
│   ├── ClusterManagement.tsx      # Cluster CRUD
│   ├── UserManagement.tsx         # User CRUD
│   ├── HouseTypeManagement.tsx    # House type CRUD
│   └── ResidentDataManagement.tsx # Data import/export
├── DataContext.tsx                # Global state management
├── types.ts                       # TypeScript definitions
├── constants.ts                   # App constants & mock data
└── services/                      # API service functions
```

### Component Responsibilities

#### App.tsx
- **Routing Logic**: Conditional rendering berdasarkan role dan view state
- **Authentication**: User role management
- **Layout**: Main app layout dengan sidebar dan header

#### Dashboard.tsx
- **Stats Overview**: Real-time metrics (unpaid bills, complaints, payments)
- **Progress Visualization**: IPL payment progress per cluster
- **Quick Actions**: Navigation shortcuts

#### BillingSystem.tsx
- **Invoice Display**: Grid layout untuk tagihan pribadi
- **Payment Forms**: WhatsApp integration untuk pembayaran
- **PDF Generation**: Kwitansi otomatis
- **Status Tracking**: Payment verification workflow

#### DataContext.tsx
- **State Management**: Centralized state dengan React Context
- **CRUD Operations**: Generic CRUD functions untuk semua entities
- **Data Synchronization**: Real-time data updates
- **Error Handling**: Centralized error management

## 🔄 Data Flow Architecture

### User Interaction Flow

```
User Action → Component → DataContext → Supabase API → Database
      ↓              ↓              ↓              ↓
   UI Update ← Component ← DataContext ← Supabase API ← Database
```

### Payment Flow

```
1. User selects invoice → BillingSystem component
2. User fills payment form → WhatsApp message generation
3. Payment submitted → DataContext updates payment status
4. Admin verifies → Status changes to verified
5. PDF receipt generated → Download available
```

### Complaint Flow

```
1. User submits complaint → ComplaintCenter
2. Complaint stored → Status: 'Baru'
3. Admin/technician assigns → Status: 'Diproses'
4. Resolution completed → Status: 'Selesai'
5. User notified → Real-time updates
```

## 🗄️ Database Design

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin_cluster', 'technician', 'resident')),
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### invoices
```sql
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES units(id),
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid', 'Overdue')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### complaints
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Baru' CHECK (status IN ('Baru', 'Diproses', 'Selesai')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### units
```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster TEXT NOT NULL,
  block TEXT NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  land_area DECIMAL(8,2),
  owner_name TEXT NOT NULL,
  resident_status TEXT DEFAULT 'Pemilik' CHECK (resident_status IN ('Pemilik', 'Penyewa', 'Kosong')),
  phone_number TEXT,
  family_members INTEGER DEFAULT 1,
  bast_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships

```
users (1) ←→ (many) units
users (1) ←→ (many) complaints
users (1) ←→ (many) payments
units (1) ←→ (many) invoices
units (1) ←→ (many) payments
clusters (1) ←→ (many) units
house_types (1) ←→ (many) units
```

## 🔐 Security Architecture

### Row Level Security (RLS)

#### Users Table
- Users can only view their own record
- Admins can view all records
- Super admins have full access

#### Invoices Table
- Residents can view their unit's invoices
- Admins can view all invoices
- Technicians have read-only access

#### Complaints Table
- Users can view/modify their own complaints
- Admins/technicians can view all complaints
- Assignment permissions for technicians

### Authentication Flow

```
Login → Supabase Auth → JWT Token → Role-based Access → Component Rendering
```

### Data Validation

- **Client-side**: Form validation dengan HTML5 + custom rules
- **Server-side**: Supabase RLS policies
- **Database**: Constraints dan triggers

## 👥 User Roles & Permissions

### Super Admin
- **Full System Access**: Semua fitur dan data
- **User Management**: Create/edit/delete users
- **System Configuration**: Cluster, house types, vendor management
- **Data Operations**: Import/export resident data
- **Financial Oversight**: All payment and invoice management

### Admin Cluster
- **Cluster Management**: CRUD operations untuk cluster mereka
- **Resident Oversight**: View resident data dalam cluster
- **Payment Verification**: Approve payment submissions
- **Complaint Management**: Assign dan resolve complaints
- **Reporting**: Cluster-specific analytics

### Technician
- **Complaint Resolution**: Handle assigned complaints
- **Work Order Management**: Create dan update work orders
- **Status Updates**: Update complaint/payment status
- **Read Access**: View relevant resident dan invoice data

### Resident
- **Personal Dashboard**: View personal invoices dan payments
- **Complaint Submission**: Create dan track complaints
- **Payment Initiation**: Submit payment requests via WhatsApp
- **Profile Management**: Update personal information

## 🚀 Deployment Architecture

### Vercel Deployment

```
GitHub Repository → Vercel CI/CD → Build Process → Static Assets → CDN Distribution
      ↓                    ↓              ↓              ↓              ↓
   Source Code →    Environment    →   Vite Build  →   dist/    →   Global CDN
                    Variables      →   (npm run     →   folder   →   (Edge Network)
                                     build)         →           →
```

### Environment Configuration

```env
# Production Environment
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

### Build Optimization

- **Code Splitting**: Route-based code splitting
- **Asset Optimization**: Image compression dan minification
- **Caching Strategy**: Long-term caching untuk static assets
- **CDN Delivery**: Global content delivery

## 🔧 Development Workflow

### Git Branching Strategy

```
main (production)
├── develop (staging)
│   ├── feature/payment-integration
│   ├── feature/complaint-system
│   ├── feature/dashboard-analytics
│   └── bugfix/mobile-responsive
```

### Code Standards

#### TypeScript
- Strict mode enabled
- Interface definitions untuk semua data structures
- Type guards untuk runtime type checking

#### React
- Functional components dengan hooks
- Custom hooks untuk reusable logic
- Error boundaries untuk error handling

#### CSS
- Tailwind utility classes
- Responsive design dengan mobile-first approach
- Consistent color scheme dan spacing

### Testing Strategy

#### Unit Tests
- Component logic testing dengan Jest
- Custom hook testing
- Utility function testing

#### Integration Tests
- API integration testing
- Form submission workflows
- Authentication flows

#### E2E Tests (Future)
- User journey testing dengan Playwright
- Cross-browser compatibility
- Mobile responsiveness testing

## 📈 Scalability Considerations

### Database Scaling
- **Indexing**: Strategic indexing untuk query performance
- **Partitioning**: Time-based partitioning untuk historical data
- **Replication**: Read replicas untuk high-traffic operations

### Application Scaling
- **Code Splitting**: Lazy loading untuk large components
- **Caching**: Client-side caching dengan React Query
- **CDN**: Static asset delivery optimization

### Performance Optimization
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: WebP format dan lazy loading
- **Database Queries**: Optimized queries dengan proper joins

## 🔮 Future Enhancements

### Phase 2 Features
- **Mobile App**: React Native implementation
- **Push Notifications**: Real-time notifications
- **Advanced Analytics**: BI dashboard dengan Power BI integration
- **Document Management**: File upload untuk dokumen perumahan

### Phase 3 Features
- **AI Integration**: Chatbot untuk complaint handling
- **IoT Integration**: Smart home device management
- **Blockchain**: Secure document verification
- **Multi-language**: Internationalization support

### Technical Debt
- **Testing Coverage**: Increase to 80%+
- **Performance Monitoring**: Implement APM tools
- **Documentation**: API documentation dengan Swagger
- **Migration Strategy**: Database migration tools

## 📋 Development Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] RLS policies tested
- [ ] Build process verified
- [ ] Performance benchmarks met

### Post-deployment
- [ ] User acceptance testing
- [ ] Load testing completed
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

**Sipema Maja Blueprint** - Comprehensive System Architecture & Development Guide
Last Updated: February 2026
