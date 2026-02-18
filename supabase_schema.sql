-- Supabase Database Schema for Sipema Maja App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('RESIDENT', 'ADMIN_CLUSTER', 'SUPER_ADMIN', 'TECHNICIAN');
CREATE TYPE complaint_category AS ENUM ('Retensi', 'Fasum');
CREATE TYPE complaint_status AS ENUM ('Pending', 'Proses', 'Selesai', 'Ditolak');
CREATE TYPE invoice_status AS ENUM ('Paid', 'Unpaid', 'Overdue');
CREATE TYPE resident_status AS ENUM ('Pemilik', 'Penyewa', 'Kosong');
CREATE TYPE security_status AS ENUM ('Aman', 'Siaga', 'Bahaya');
CREATE TYPE vendor_status AS ENUM ('Active', 'Inactive');
CREATE TYPE lead_status AS ENUM ('Baru', 'Prospek', 'Survey Lokasi', 'Booking Fee', 'Terjual/Akad', 'Batal');

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  cluster TEXT NOT NULL,
  unit TEXT NOT NULL,
  bast_date DATE NOT NULL
);

-- Clusters table
CREATE TABLE clusters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  total_units INTEGER NOT NULL,
  occupied_units INTEGER NOT NULL,
  cash_balance BIGINT NOT NULL,
  security_status security_status NOT NULL,
  last_audit_date DATE NOT NULL
);

-- Units table
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  cluster TEXT NOT NULL,
  block TEXT NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  land_area INTEGER NOT NULL,
  owner_name TEXT NOT NULL,
  resident_status resident_status NOT NULL,
  phone_number TEXT NOT NULL,
  family_members INTEGER NOT NULL,
  bast_date DATE
);

-- Complaints table
CREATE TABLE complaints (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  category complaint_category NOT NULL,
  sub_category TEXT,
  description TEXT NOT NULL,
  photo_url TEXT,
  status complaint_status NOT NULL,
  is_warranty BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  upvotes INTEGER NOT NULL DEFAULT 0
);

-- Invoices table
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  amount BIGINT NOT NULL,
  status invoice_status NOT NULL,
  due_date DATE NOT NULL,
  category TEXT NOT NULL
);

-- Cluster Expenses table
CREATE TABLE cluster_expenses (
  id TEXT PRIMARY KEY,
  cluster_id TEXT REFERENCES clusters(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  proof_url TEXT
);

-- Vendors table
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status vendor_status NOT NULL,
  contract_start DATE NOT NULL,
  contract_end DATE NOT NULL,
  monthly_cost BIGINT NOT NULL
);

-- Leads table
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT NOT NULL,
  budget TEXT NOT NULL,
  source TEXT NOT NULL,
  status lead_status NOT NULL,
  notes TEXT NOT NULL,
  assigned_agent TEXT NOT NULL,
  created_at DATE NOT NULL
);

-- Marketplace Items table
CREATE TABLE marketplace_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  price BIGINT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- Insert mock data
-- Users
INSERT INTO users (id, name, role, cluster, unit, bast_date) VALUES
('super_admin', 'Hendra Wijaya', 'SUPER_ADMIN', 'Head Office', '-', '2020-01-01'),
('admin_ruby', 'Pak Hartono', 'ADMIN_CLUSTER', 'Cluster Ruby', 'Kantor Pengelola', '2020-01-01'),
('resident_01', 'Budi Santoso', 'RESIDENT', 'Cluster Ruby', 'RB-12', '2023-11-15'),
('tech_01', 'Kang Asep', 'TECHNICIAN', 'Maintenance Team', '-', '2020-01-01');

-- Clusters
INSERT INTO clusters (id, name, manager_name, total_units, occupied_units, cash_balance, security_status, last_audit_date) VALUES
('cl-ruby', 'Cluster Ruby', 'Bpk. Hartono', 120, 98, 45000000, 'Aman', '2023-11-01'),
('cl-topaz', 'Cluster Topaz', 'Ibu Sarah', 85, 80, 32500000, 'Aman', '2023-11-05'),
('cl-sapphire', 'Cluster Sapphire', 'Bpk. Doni', 150, 45, 12000000, 'Siaga', '2023-10-28'),
('cl-kalimaya', 'Cluster Kalimaya', 'Bpk. Rahmat', 200, 180, 89000000, 'Aman', '2023-11-10');

-- Units
INSERT INTO units (id, cluster, block, number, type, land_area, owner_name, resident_status, phone_number, family_members, bast_date) VALUES
('u-rb-01', 'Cluster Ruby', 'A', '01', '36/60', 60, 'Budi Santoso', 'Pemilik', '0812-3456-7890', 4, '2023-11-15'),
('u-rb-02', 'Cluster Ruby', 'A', '02', '45/72', 72, 'Siti Aminah', 'Penyewa', '0813-9999-8888', 2, '2022-05-20'),
('u-tp-05', 'Cluster Topaz', 'C', '12', '36/60', 60, 'Developer Stock', 'Kosong', '-', 0, NULL),
('u-sp-10', 'Cluster Sapphire', 'F', '08', '60/90', 90, 'Rudi Hartono', 'Pemilik', '0811-2233-4455', 5, '2023-09-01'),
('u-kl-22', 'Cluster Kalimaya', 'G', '22', '30/60', 60, 'Dewi Persik', 'Pemilik', '0815-6789-1234', 3, '2023-10-15');

-- Complaints (note: user_id should reference users, but in mock it's u001 etc., using resident_01 for now)
INSERT INTO complaints (id, user_id, category, sub_category, description, status, is_warranty, created_at, upvotes) VALUES
('C-001', 'resident_01', 'Fasum', 'PJU Mati', 'Lampu jalan di depan blok RB-05 mati total sudah 2 hari.', 'Proses', false, '2023-10-20', 12),
('C-002', 'resident_01', 'Retensi', 'Tembok Retak', 'Ada retakan rambut di ruang tamu dekat jendela.', 'Selesai', true, '2023-11-01', 0),
('C-003', 'resident_01', 'Retensi', 'Atap Bocor', 'Air merembes ke plafon kamar utama saat hujan deras.', 'Pending', true, '2023-11-21', 0);

-- Invoices
INSERT INTO invoices (id, unit_id, month, year, amount, status, due_date, category) VALUES
('INV-2023-10', 'u-rb-01', 'Oktober', 2023, 150000, 'Paid', '2023-10-10', 'IPL & Kebersihan'),
('INV-2023-11', 'u-rb-01', 'November', 2023, 150000, 'Overdue', '2023-11-10', 'IPL & Kebersihan'),
('INV-2023-12', 'u-rb-01', 'Desember', 2023, 150000, 'Unpaid', '2023-12-10', 'IPL & Kebersihan');

-- Cluster Expenses
INSERT INTO cluster_expenses (id, cluster_id, date, category, description, amount) VALUES
('EXP-001', 'cl-ruby', '2023-11-02', 'Security', 'Gaji Satpam (4 Personil) - Shift Pagi & Malam', 12000000),
('EXP-002', 'cl-ruby', '2023-11-05', 'Kebersihan', 'Vendor Pengangkut Sampah & Sapu Jalan', 4500000),
('EXP-003', 'cl-ruby', '2023-11-10', 'Listrik', 'Token Listrik Pos Satpam & PJU Utama', 750000),
('EXP-004', 'cl-ruby', '2023-11-15', 'Perbaikan', 'Perbaikan Palang Pintu Gerbang Otomatis (Servis Rutin)', 350000),
('EXP-005', 'cl-ruby', '2023-11-20', 'Lainnya', 'Konsumsi Rapat Warga Bulanan', 250000);

-- Vendors
INSERT INTO vendors (id, name, service_type, contact_person, phone, email, status, contract_start, contract_end, monthly_cost) VALUES
('v1', 'PT. Gardapati Security', 'Security', 'Bpk. Herman (Korlap)', '0812-3344-5566', 'contact@gardapati.co.id', 'Active', '2023-01-01', '2024-01-01', 45000000),
('v2', 'CV. Bersih Selalu', 'Kebersihan', 'Ibu Ratna', '0813-9988-7766', 'info@bersihselalu.com', 'Active', '2023-03-01', '2024-03-01', 12000000),
('v3', 'PT. Fiber Maja Net', 'Internet', 'Teknisi Pusat', '021-555-1234', 'support@majanet.id', 'Active', '2022-06-01', '2025-06-01', 5000000),
('v4', 'CV. Karya Beton', 'Konstruksi', 'Bpk. Yudi', '0815-1122-3344', 'karyabeton@gmail.com', 'Inactive', '2022-01-01', '2022-12-31', 0);

-- Leads
INSERT INTO leads (id, name, phone, interest, budget, source, status, notes, assigned_agent, created_at) VALUES
('l1', 'Bpk. Johny Deep', '0812-9999-0000', 'Cluster Ruby - Type 36/60', 'Cash Bertahap', 'Instagram Ads', 'Baru', 'Tertarik dengan promo DP 0%', 'Sales Rina', '2023-12-01'),
('l2', 'Ibu Angelina', '0813-5555-1234', 'Cluster Sapphire - Hook', 'KPR Bank BTN', 'Walk-in', 'Survey Lokasi', 'Sudah lihat lokasi, minta hitungan simulasi KPR', 'Sales Budi', '2023-11-28'),
('l3', 'Pak Brad Pitt', '0811-2233-4455', 'Ruko Depan', 'Hard Cash', 'Referral Warga', 'Booking Fee', 'Sudah transfer Booking Fee 5jt. Menunggu jadwal akad.', 'Sales Rina', '2023-11-25'),
('l4', 'Mba Taylor', '0877-8888-9999', 'Cluster Topaz', 'KPR', 'Facebook', 'Batal', 'Tidak lolos BI Checking', 'Sales Doni', '2023-11-10');

-- Marketplace Items
INSERT INTO marketplace_items (id, title, seller_name, price, category, image_url) VALUES
('m1', 'Katering Harian "Bu Siti"', 'Siti Aminah (Ruby B-02)', 25000, 'Makanan', 'https://picsum.photos/300/200?random=1'),
('m2', 'Jasa Laundry Kilat', 'Clean Express (Topaz A-10)', 6000, 'Jasa', 'https://picsum.photos/300/200?random=2'),
('m3', 'Galon & Gas Antar Jemput', 'Warung Madura (Ruby Gate)', 18000, 'Kebutuhan', 'https://picsum.photos/300/200?random=3');
