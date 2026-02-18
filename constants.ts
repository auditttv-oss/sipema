import { User, Role, Complaint, ComplaintCategory, ComplaintStatus, Invoice, InvoiceStatus, MarketplaceItem, ClusterExpense, Cluster, UnitData, Vendor, Lead, LeadStatus, Payment } from './types';

// Multiple Mock Users for Role Switching
export const MOCK_USERS: User[] = [
  {
    id: 'super_admin',
    name: 'Hendra Wijaya',
    role: Role.SUPER_ADMIN,
    cluster: 'Head Office',
    unit: '-',
    bastDate: '2020-01-01'
  },
  {
    id: 'admin_ruby',
    name: 'Pak Hartono',
    role: Role.ADMIN_CLUSTER,
    cluster: 'Cluster Ruby',
    unit: 'Kantor Pengelola',
    bastDate: '2020-01-01'
  },
  {
    id: 'resident_01',
    name: 'Budi Santoso',
    role: Role.RESIDENT,
    cluster: 'Cluster Ruby',
    unit: 'RB-12',
    bastDate: '2023-11-15'
  },
  {
    id: 'tech_01',
    name: 'Kang Asep',
    role: Role.TECHNICIAN,
    cluster: 'Maintenance Team',
    unit: '-',
    bastDate: '2020-01-01'
  }
];

// Default user (will be overridden by App state)
export const MOCK_USER = MOCK_USERS[0];

export const MOCK_CLUSTERS: Cluster[] = [
  {
    id: 'cl-ruby',
    name: 'Cluster Ruby',
    managerName: 'Bpk. Hartono',
    totalUnits: 120,
    occupiedUnits: 98,
    cashBalance: 45000000,
    securityStatus: 'Aman',
    lastAuditDate: '2023-11-01'
  },
  {
    id: 'cl-topaz',
    name: 'Cluster Topaz',
    managerName: 'Ibu Sarah',
    totalUnits: 85,
    occupiedUnits: 80,
    cashBalance: 32500000,
    securityStatus: 'Aman',
    lastAuditDate: '2023-11-05'
  },
  {
    id: 'cl-sapphire',
    name: 'Cluster Sapphire',
    managerName: 'Bpk. Doni',
    totalUnits: 150,
    occupiedUnits: 45,
    cashBalance: 12000000,
    securityStatus: 'Siaga', // Misal ada laporan maling
    lastAuditDate: '2023-10-28'
  },
  {
    id: 'cl-kalimaya',
    name: 'Cluster Kalimaya',
    managerName: 'Bpk. Rahmat',
    totalUnits: 200,
    occupiedUnits: 180,
    cashBalance: 89000000,
    securityStatus: 'Aman',
    lastAuditDate: '2023-11-10'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Bpk. Johny Deep',
    phone: '0812-9999-0000',
    interest: 'Cluster Ruby - Type 36/60',
    budget: 'Cash Bertahap',
    source: 'Instagram Ads',
    status: LeadStatus.NEW,
    notes: 'Tertarik dengan promo DP 0%',
    assignedAgent: 'Sales Rina',
    createdAt: '2023-12-01'
  },
  {
    id: 'l2',
    name: 'Ibu Angelina',
    phone: '0813-5555-1234',
    interest: 'Cluster Sapphire - Hook',
    budget: 'KPR Bank BTN',
    source: 'Walk-in',
    status: LeadStatus.SURVEY,
    notes: 'Sudah lihat lokasi, minta hitungan simulasi KPR',
    assignedAgent: 'Sales Budi',
    createdAt: '2023-11-28'
  },
  {
    id: 'l3',
    name: 'Pak Brad Pitt',
    phone: '0811-2233-4455',
    interest: 'Ruko Depan',
    budget: 'Hard Cash',
    source: 'Referral Warga',
    status: LeadStatus.BOOKING,
    notes: 'Sudah transfer Booking Fee 5jt. Menunggu jadwal akad.',
    assignedAgent: 'Sales Rina',
    createdAt: '2023-11-25'
  },
  {
    id: 'l4',
    name: 'Mba Taylor',
    phone: '0877-8888-9999',
    interest: 'Cluster Topaz',
    budget: 'KPR',
    source: 'Facebook',
    status: LeadStatus.LOST,
    notes: 'Tidak lolos BI Checking',
    assignedAgent: 'Sales Doni',
    createdAt: '2023-11-10'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'PT. Gardapati Security',
    serviceType: 'Security',
    contactPerson: 'Bpk. Herman (Korlap)',
    phone: '0812-3344-5566',
    email: 'contact@gardapati.co.id',
    status: 'Active',
    contractStart: '2023-01-01',
    contractEnd: '2024-01-01',
    monthlyCost: 45000000
  },
  {
    id: 'v2',
    name: 'CV. Bersih Selalu',
    serviceType: 'Kebersihan',
    contactPerson: 'Ibu Ratna',
    phone: '0813-9988-7766',
    email: 'info@bersihselalu.com',
    status: 'Active',
    contractStart: '2023-03-01',
    contractEnd: '2024-03-01',
    monthlyCost: 12000000
  },
  {
    id: 'v3',
    name: 'PT. Fiber Maja Net',
    serviceType: 'Internet',
    contactPerson: 'Teknisi Pusat',
    phone: '021-555-1234',
    email: 'support@majanet.id',
    status: 'Active',
    contractStart: '2022-06-01',
    contractEnd: '2025-06-01',
    monthlyCost: 5000000
  },
  {
    id: 'v4',
    name: 'CV. Karya Beton',
    serviceType: 'Konstruksi',
    contactPerson: 'Bpk. Yudi',
    phone: '0815-1122-3344',
    email: 'karyabeton@gmail.com',
    status: 'Inactive',
    contractStart: '2022-01-01',
    contractEnd: '2022-12-31',
    monthlyCost: 0
  }
];

export const MOCK_UNITS: UnitData[] = [
  {
    id: 'u-rb-01',
    cluster: 'Cluster Ruby',
    block: 'A',
    number: '01',
    type: '36/60',
    landArea: 60,
    ownerName: 'Budi Santoso',
    residentStatus: 'Pemilik',
    phoneNumber: '0812-3456-7890',
    familyMembers: 4,
    bastDate: '2023-11-15' // Masih garansi
  },
  {
    id: 'u-rb-02',
    cluster: 'Cluster Ruby',
    block: 'A',
    number: '02',
    type: '45/72',
    landArea: 72,
    ownerName: 'Siti Aminah',
    residentStatus: 'Penyewa',
    phoneNumber: '0813-9999-8888',
    familyMembers: 2,
    bastDate: '2022-05-20' // Garansi habis
  },
  {
    id: 'u-tp-05',
    cluster: 'Cluster Topaz',
    block: 'C',
    number: '12',
    type: '36/60',
    landArea: 60,
    ownerName: 'Developer Stock',
    residentStatus: 'Kosong',
    phoneNumber: '-',
    familyMembers: 0,
    bastDate: null
  },
  {
    id: 'u-sp-10',
    cluster: 'Cluster Sapphire',
    block: 'F',
    number: '08',
    type: '60/90',
    landArea: 90,
    ownerName: 'Rudi Hartono',
    residentStatus: 'Pemilik',
    phoneNumber: '0811-2233-4455',
    familyMembers: 5,
    bastDate: '2023-09-01'
  },
  {
    id: 'u-kl-22',
    cluster: 'Cluster Kalimaya',
    block: 'G',
    number: '22',
    type: '30/60',
    landArea: 60,
    ownerName: 'Dewi Persik',
    residentStatus: 'Pemilik',
    phoneNumber: '0815-6789-1234',
    familyMembers: 3,
    bastDate: '2023-10-15'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2023-10',
    unitId: 'u-rb-01',
    month: 'Oktober',
    year: 2023,
    amount: 150000,
    status: InvoiceStatus.PAID,
    dueDate: '2023-10-10',
    category: 'IPL & Kebersihan'
  },
  {
    id: 'INV-2023-11',
    unitId: 'u-rb-01',
    month: 'November',
    year: 2023,
    amount: 150000,
    status: InvoiceStatus.OVERDUE,
    dueDate: '2023-11-10',
    category: 'IPL & Kebersihan'
  },
  {
    id: 'INV-2023-12',
    unitId: 'u-rb-01',
    month: 'Desember',
    year: 2023,
    amount: 150000,
    status: InvoiceStatus.UNPAID,
    dueDate: '2023-12-10',
    category: 'IPL & Kebersihan'
  }
];

export const MOCK_CLUSTER_EXPENSES: ClusterExpense[] = [
  {
    id: 'EXP-001',
    clusterId: 'cl-ruby',
    date: '2023-11-02',
    category: 'Security',
    description: 'Gaji Satpam (4 Personil) - Shift Pagi & Malam',
    amount: 12000000
  },
  {
    id: 'EXP-002',
    clusterId: 'cl-ruby',
    date: '2023-11-05',
    category: 'Kebersihan',
    description: 'Vendor Pengangkut Sampah & Sapu Jalan',
    amount: 4500000
  },
  {
    id: 'EXP-003',
    clusterId: 'cl-ruby',
    date: '2023-11-10',
    category: 'Listrik',
    description: 'Token Listrik Pos Satpam & PJU Utama',
    amount: 750000
  },
  {
    id: 'EXP-004',
    clusterId: 'cl-ruby',
    date: '2023-11-15',
    category: 'Perbaikan',
    description: 'Perbaikan Palang Pintu Gerbang Otomatis (Servis Rutin)',
    amount: 350000
  },
  {
    id: 'EXP-005',
    clusterId: 'cl-ruby',
    date: '2023-11-20',
    category: 'Lainnya',
    description: 'Konsumsi Rapat Warga Bulanan',
    amount: 250000
  }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'C-001',
    userId: 'u002',
    category: ComplaintCategory.FASUM,
    subCategory: 'PJU Mati',
    description: 'Lampu jalan di depan blok RB-05 mati total sudah 2 hari.',
    status: ComplaintStatus.PROSES,
    isWarranty: false,
    createdAt: '2023-10-20',
    upvotes: 12
  },
  {
    id: 'C-002',
    userId: 'u001',
    category: ComplaintCategory.RETENSI,
    subCategory: 'Tembok Retak',
    description: 'Ada retakan rambut di ruang tamu dekat jendela.',
    status: ComplaintStatus.SELESAI,
    isWarranty: true,
    createdAt: '2023-11-01',
    upvotes: 0
  },
  {
    id: 'C-003',
    userId: 'u003',
    category: ComplaintCategory.RETENSI,
    subCategory: 'Atap Bocor',
    description: 'Air merembes ke plafon kamar utama saat hujan deras.',
    status: ComplaintStatus.PENDING,
    isWarranty: true,
    createdAt: '2023-11-21',
    upvotes: 0
  }
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'Katering Harian "Bu Siti"',
    sellerName: 'Siti Aminah (Ruby B-02)',
    price: 25000,
    category: 'Makanan',
    imageUrl: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 'm2',
    title: 'Jasa Laundry Kilat',
    sellerName: 'Clean Express (Topaz A-10)',
    price: 6000,
    category: 'Jasa',
    imageUrl: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: 'm3',
    title: 'Galon & Gas Antar Jemput',
    sellerName: 'Warung Madura (Ruby Gate)',
    price: 18000,
    category: 'Kebutuhan',
    imageUrl: 'https://picsum.photos/300/200?random=3'
  }
];

export const CHART_DATA = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'P-0001',
    userId: 'u1',
    rekeningIpl: '1234567890',
    nominal: 500000,
    referensi: 'TF123',
    nama: 'Ahmad',
    blok: 'A',
    nomorRumah: '1',
    status: 'pending',
    createdAt: '2023-10-01'
  }
];

export const MOCK_HOUSE_TYPES: HouseType[] = [
  {
    id: 'ht1',
    name: '36/60',
    description: 'Tipe rumah 36/60 dengan 2 kamar tidur'
  },
  {
    id: 'ht2',
    name: '45/72',
    description: 'Tipe rumah 45/72 dengan 3 kamar tidur'
  },
  {
    id: 'ht3',
    name: '60/120',
    description: 'Tipe rumah 60/120 dengan 4 kamar tidur'
  }
];

export const LOGO_URL = 'https://manage.permatamutiaramaja.co.id/storage/storage/company_logos/N2YwYjUyNDdlMmRjMWZlMTVkZGQ1OTVlM2MwZDcxY2Y.webp';