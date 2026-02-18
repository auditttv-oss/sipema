export enum Role {
  RESIDENT = 'RESIDENT',
  ADMIN_CLUSTER = 'ADMIN_CLUSTER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECHNICIAN = 'TECHNICIAN'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  cluster: string;
  unit: string;
  bastDate: string; // ISO Date string YYYY-MM-DD
}

export enum ComplaintCategory {
  RETENSI = 'Retensi',
  FASUM = 'Fasum'
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  PROSES = 'Proses',
  SELESAI = 'Selesai',
  DITOLAK = 'Ditolak'
}

export interface Complaint {
  id: string;
  userId: string;
  category: ComplaintCategory;
  subCategory?: string; // e.g., "Atap Bocor", "Jalan Rusak"
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  isWarranty: boolean; // Derived from logic
  createdAt: string;
  upvotes: number;
}

export enum InvoiceStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  OVERDUE = 'Overdue'
}

export interface Invoice {
  id: string;
  unitId: string; // Added relation to Unit
  month: string;
  year: number;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  category: string; // IPL, Air, Security
}

export interface ClusterExpense {
  id: string;
  clusterId: string; // Added relation to Cluster
  date: string;
  category: 'Security' | 'Kebersihan' | 'Listrik' | 'Perbaikan' | 'Lainnya';
  description: string;
  amount: number;
  proofUrl?: string;
}

export interface Cluster {
  id: string;
  name: string;
  managerName: string;
  totalUnits: number;
  occupiedUnits: number;
  cashBalance: number;
  securityStatus: 'Aman' | 'Siaga' | 'Bahaya';
  lastAuditDate: string;
}

export interface Vendor {
  id: string;
  name: string;
  serviceType: 'Security' | 'Kebersihan' | 'Konstruksi' | 'Internet' | 'Lainnya';
  contactPerson: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  contractStart: string;
  contractEnd: string;
  monthlyCost: number;
}

export enum LeadStatus {
  NEW = 'Baru',
  PROSPECT = 'Prospek',
  SURVEY = 'Survey Lokasi',
  BOOKING = 'Booking Fee',
  SOLD = 'Terjual/Akad',
  LOST = 'Batal'
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  interest: string; // Tipe unit yang diminati
  budget: string;
  source: string; // Iklan FB, Banner, Walk-in
  status: LeadStatus;
  notes: string;
  assignedAgent: string;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  sellerName: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface HouseType {
  id: string;
  name: string;
  description?: string;
}

export interface Payment {
  id: string;
  userId: string;
  rekeningIpl: string;
  nominal: number;
  referensi: string;
  nama: string;
  blok: string;
  nomorRumah: string;
  status: 'pending' | 'verified';
  createdAt: string;
}