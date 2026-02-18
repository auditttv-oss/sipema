import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { 
  MOCK_COMPLAINTS, 
  MOCK_UNITS, 
  MOCK_INVOICES, 
  MOCK_CLUSTER_EXPENSES,
  MOCK_CLUSTERS,
  MOCK_VENDORS,
  MOCK_LEADS,
  MOCK_USERS,
  MOCK_PAYMENTS,
  MOCK_HOUSE_TYPES
} from './constants';
import { 
  Complaint, 
  UnitData, 
  Invoice, 
  ClusterExpense, 
  ComplaintStatus, 
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Complaint,
  UnitData,
  Invoice,
  ClusterExpense,
  ComplaintStatus,
  InvoiceStatus,
  Cluster,
  Vendor,
  Lead,
  User,
  Payment,
  HouseType
  HouseType,
  Role,
} from './types';
import * as complaintService from './services/complaintService';
import * as userService from './services/userService';
import { MOCK_PAYMENTS, MOCK_HOUSE_TYPES } from './constants';
import { supabase } from './src/lib/supabaseClient';

interface DataContextType {
  complaints: Complaint[];
  units: UnitData[];
  invoices: Invoice[];
  expenses: ClusterExpense[];
  clusters: Cluster[]; 
  clusters: Cluster[];
  vendors: Vendor[];
  leads: Lead[];
  users: User[];
  payments: Payment[];
  houseTypes: HouseType[];
  
  // Complaint CRUD
  currentUser: User | null;
  loading: boolean;
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  
  // Unit CRUD
  addUnit: (unit: UnitData) => void;
  updateUnit: (unit: UnitData) => void;
  deleteUnit: (id: string) => void;
  
  // Invoice CRUD
  payInvoice: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  
  // Payment CRUD
  submitPayment: (payment: Payment) => void;
  verifyPayment: (id: string) => void;
  
  // Expense CRUD
  addExpense: (expense: ClusterExpense) => void;
  updateExpense: (expense: ClusterExpense) => void;
  deleteExpense: (id: string) => void;
  
  // Cluster CRUD
  addCluster: (cluster: Cluster) => void;
  updateCluster: (cluster: Cluster) => void;
  deleteCluster: (id: string) => void;

  // Vendor CRUD
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;

  // Marketing/Leads CRUD
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;

  // User CRUD
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  // House Type CRUD
  addHouseType: (houseType: HouseType) => void;
  updateHouseType: (houseType: HouseType) => void;
  deleteHouseType: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const toUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  role: (row.role as Role) ?? Role.RESIDENT,
  cluster: row.cluster ?? '-',
  unit: row.unit ?? '-',
  bastDate: row.bast_date ?? new Date().toISOString().slice(0, 10),
});

const toUnit = (row: any): UnitData => ({
  id: row.id,
  cluster: row.cluster,
  block: row.block,
  number: row.number,
  type: row.type,
  landArea: row.land_area ?? 0,
  ownerName: row.owner_name ?? '-',
  residentStatus: row.resident_status ?? 'Kosong',
  phoneNumber: row.phone_number ?? '-',
  familyMembers: row.family_members ?? 0,
  bastDate: row.bast_date,
});

const toComplaint = (row: any): Complaint => ({
  id: row.id,
  userId: row.user_id,
  category: row.category,
  subCategory: row.sub_category,
  description: row.description,
  photoUrl: row.photo_url,
  status: row.status,
  isWarranty: row.is_warranty ?? false,
  createdAt: row.created_at,
  upvotes: row.upvotes ?? 0,
});

const toInvoice = (row: any): Invoice => ({
  id: row.id,
  unitId: row.unit_id,
  month: row.month,
  year: row.year,
  amount: row.amount,
  status: row.status,
  dueDate: row.due_date,
  category: row.category,
});

const toExpense = (row: any): ClusterExpense => ({
  id: row.id,
  clusterId: row.cluster_id,
  date: row.date,
  category: row.category,
  description: row.description,
  amount: row.amount,
  proofUrl: row.proof_url,
});

const toVendor = (row: any): Vendor => ({
  id: row.id,
  name: row.name,
  serviceType: row.service_type,
  contactPerson: row.contact_person,
  phone: row.phone,
  email: row.email,
  status: row.status,
  contractStart: row.contract_start,
  contractEnd: row.contract_end,
  monthlyCost: row.monthly_cost,
});

const toLead = (row: any): Lead => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  interest: row.interest,
  budget: row.budget,
  source: row.source,
  status: row.status,
  notes: row.notes,
  assignedAgent: row.assigned_agent,
  createdAt: row.created_at,
});

const toCluster = (row: any): Cluster => ({
  id: row.id,
  name: row.name,
  managerName: row.manager_name,
  totalUnits: row.total_units,
  occupiedUnits: row.occupied_units,
  cashBalance: row.cash_balance,
  securityStatus: row.security_status,
  lastAuditDate: row.last_audit_date,
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with Mock Data
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [units, setUnits] = useState<UnitData[]>(MOCK_UNITS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [expenses, setExpenses] = useState<ClusterExpense[]>(MOCK_CLUSTER_EXPENSES);
  const [clusters, setClusters] = useState<Cluster[]>(MOCK_CLUSTERS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<ClusterExpense[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [houseTypes, setHouseTypes] = useState<HouseType[]>(MOCK_HOUSE_TYPES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        supabase.from('profiles').select('*'),
        supabase.from('clusters').select('*'),
        supabase.from('units').select('*'),
        supabase.from('complaints').select('*').order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').order('year', { ascending: false }),
        supabase.from('ledger_entries').select('*').order('date', { ascending: false }),
        supabase.from('vendors').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('house_types').select('*'),
      ]);

      const [
        profilesRes,
        clustersRes,
        unitsRes,
        complaintsRes,
        invoicesRes,
        expensesRes,
        vendorsRes,
        leadsRes,
        paymentsRes,
        houseTypesRes,
      ] = results.map((r) => (r.status === 'fulfilled' ? r.value : null));

      if (profilesRes && !profilesRes.error) setUsers((profilesRes.data || []).map(toUser));
      if (clustersRes && !clustersRes.error) setClusters((clustersRes.data || []).map(toCluster));
      if (unitsRes && !unitsRes.error) setUnits((unitsRes.data || []).map(toUnit));
      if (complaintsRes && !complaintsRes.error) setComplaints((complaintsRes.data || []).map(toComplaint));
      if (invoicesRes && !invoicesRes.error) setInvoices((invoicesRes.data || []).map(toInvoice));
      if (expensesRes && !expensesRes.error) setExpenses((expensesRes.data || []).map(toExpense));
      if (vendorsRes && !vendorsRes.error) setVendors((vendorsRes.data || []).map(toVendor));
      if (leadsRes && !leadsRes.error) setLeads((leadsRes.data || []).map(toLead));
      if (paymentsRes && !paymentsRes.error) setPayments((paymentsRes.data || []) as Payment[]);
      if (houseTypesRes && !houseTypesRes.error) setHouseTypes((houseTypesRes.data || []) as HouseType[]);
    } catch (error) {
      console.error('Failed to load Supabase data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints).catch(console.error);
  }, []);

  useEffect(() => {
    userService.getUsers().then(setUsers).catch(console.error);
    loadAllData().catch(console.error);

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (profile) setCurrentUser(toUser(profile));
      }
    };
    initAuth().catch(console.error);

    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user.id;
      if (!userId) {
        setCurrentUser(null);
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) setCurrentUser(toUser(profile));
    });

    const complaintChannel = supabase
      .channel('complaints-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        supabase.from('complaints').select('*').order('created_at', { ascending: false }).then(({ data }) => {
          setComplaints((data || []).map(toComplaint));
        });
      })
      .subscribe();

    const invoiceChannel = supabase
      .channel('invoices-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        supabase.from('invoices').select('*').order('year', { ascending: false }).then(({ data }) => {
          setInvoices((data || []).map(toInvoice));
        });
      })
      .subscribe();

    return () => {
      authSubscription.subscription.unsubscribe();
      supabase.removeChannel(complaintChannel);
      supabase.removeChannel(invoiceChannel);
    };
  }, []);

  // Complaints
  const addComplaint = (newComplaint: Complaint) => {
    const { id, createdAt, ...complaintData } = newComplaint;
    complaintService.addComplaint(complaintData).then(added => {
      setComplaints(prev => [added, ...prev]);
    const payload = {
      user_id: newComplaint.userId,
      category: newComplaint.category,
      sub_category: newComplaint.subCategory,
      description: newComplaint.description,
      photo_url: newComplaint.photoUrl,
      status: newComplaint.status ?? ComplaintStatus.PENDING,
      is_warranty: newComplaint.isWarranty,
      upvotes: newComplaint.upvotes ?? 0,
    };
    supabase.from('complaints').insert(payload).select().single().then(({ data }) => {
      if (data) setComplaints((prev) => [toComplaint(data), ...prev]);
    }).catch(console.error);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    complaintService.updateComplaintStatus(id, status).then(() => {
      setComplaints(prev => prev.map(c => 
        c.id === id ? { ...c, status: status } : c
      ));
    supabase.from('complaints').update({ status }).eq('id', id).then(({ error }) => {
      if (!error) setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    }).catch(console.error);
  };

  // Units
  const addUnit = (newUnit: UnitData) => {
    setUnits(prev => [newUnit, ...prev]);
  const addUnit = (unit: UnitData) => {
    supabase.from('units').insert({
      id: unit.id,
      cluster: unit.cluster,
      block: unit.block,
      number: unit.number,
      type: unit.type,
      land_area: unit.landArea,
      owner_name: unit.ownerName,
      resident_status: unit.residentStatus,
      phone_number: unit.phoneNumber,
      family_members: unit.familyMembers,
      bast_date: unit.bastDate,
    }).then(({ error }) => {
      if (!error) setUnits((prev) => [unit, ...prev]);
    }).catch(console.error);
  };

  const updateUnit = (updatedUnit: UnitData) => {
    setUnits(prev => prev.map(u => u.id === updatedUnit.id ? updatedUnit : u));
  const updateUnit = (unit: UnitData) => {
    supabase.from('units').update({
      cluster: unit.cluster,
      block: unit.block,
      number: unit.number,
      type: unit.type,
      land_area: unit.landArea,
      owner_name: unit.ownerName,
      resident_status: unit.residentStatus,
      phone_number: unit.phoneNumber,
      family_members: unit.familyMembers,
      bast_date: unit.bastDate,
    }).eq('id', unit.id).then(({ error }) => {
      if (!error) setUnits((prev) => prev.map((u) => (u.id === unit.id ? unit : u)));
    }).catch(console.error);
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    supabase.from('units').delete().eq('id', id).then(({ error }) => {
      if (!error) setUnits((prev) => prev.filter((u) => u.id !== id));
    }).catch(console.error);
  };

  // Invoices
  const payInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: InvoiceStatus.PAID } : inv
    ));
    supabase.from('invoices').update({ status: InvoiceStatus.PAID }).eq('id', id).then(({ error }) => {
      if (!error) setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: InvoiceStatus.PAID } : inv)));
    }).catch(console.error);
  };

  const addInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  const addInvoice = (invoice: Invoice) => {
    supabase.from('invoices').insert({
      id: invoice.id,
      unit_id: invoice.unitId,
      month: invoice.month,
      year: invoice.year,
      amount: invoice.amount,
      status: invoice.status,
      due_date: invoice.dueDate,
      category: invoice.category,
    }).then(({ error }) => {
      if (!error) setInvoices((prev) => [invoice, ...prev]);
    }).catch(console.error);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  const updateInvoice = (invoice: Invoice) => {
    supabase.from('invoices').update({
      unit_id: invoice.unitId,
      month: invoice.month,
      year: invoice.year,
      amount: invoice.amount,
      status: invoice.status,
      due_date: invoice.dueDate,
      category: invoice.category,
    }).eq('id', invoice.id).then(({ error }) => {
      if (!error) setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? invoice : inv)));
    }).catch(console.error);
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    supabase.from('invoices').delete().eq('id', id).then(({ error }) => {
      if (!error) setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    }).catch(console.error);
  };

  // Payments
  const submitPayment = (newPayment: Payment) => {
    setPayments(prev => [newPayment, ...prev]);
  const submitPayment = (payment: Payment) => {
    supabase.from('payments').insert(payment).then(({ error }) => {
      if (!error) setPayments((prev) => [payment, ...prev]);
    }).catch(console.error);
  };

  const verifyPayment = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'verified' as const } : p
    ));
    // Find user's unpaid invoices and mark as paid
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setInvoices(prev => prev.map(inv => 
        inv.unitId === payment.userId && inv.status !== InvoiceStatus.PAID 
          ? { ...inv, status: InvoiceStatus.PAID } 
          : inv
      ));
    }
    supabase.from('payments').update({ status: 'verified' }).eq('id', id).then(({ error }) => {
      if (!error) setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p)));
    }).catch(console.error);
  };

  // Expenses
  const addExpense = (newExpense: ClusterExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  const addExpense = (expense: ClusterExpense) => {
    supabase.from('ledger_entries').insert({
      id: expense.id,
      cluster_id: expense.clusterId,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      proof_url: expense.proofUrl,
    }).then(({ error }) => {
      if (!error) setExpenses((prev) => [expense, ...prev]);
    }).catch(console.error);
  };

  const updateExpense = (updatedExpense: ClusterExpense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  const updateExpense = (expense: ClusterExpense) => {
    supabase.from('ledger_entries').update({
      cluster_id: expense.clusterId,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      proof_url: expense.proofUrl,
    }).eq('id', expense.id).then(({ error }) => {
      if (!error) setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
    }).catch(console.error);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    supabase.from('ledger_entries').delete().eq('id', id).then(({ error }) => {
      if (!error) setExpenses((prev) => prev.filter((e) => e.id !== id));
    }).catch(console.error);
  };

  // Clusters
  const addCluster = (newCluster: Cluster) => {
    setClusters(prev => [...prev, newCluster]);
  const addCluster = (cluster: Cluster) => {
    supabase.from('clusters').insert({
      id: cluster.id,
      name: cluster.name,
      manager_name: cluster.managerName,
      total_units: cluster.totalUnits,
      occupied_units: cluster.occupiedUnits,
      cash_balance: cluster.cashBalance,
      security_status: cluster.securityStatus,
      last_audit_date: cluster.lastAuditDate,
    }).then(({ error }) => {
      if (!error) setClusters((prev) => [...prev, cluster]);
    }).catch(console.error);
  };

  const updateCluster = (updatedCluster: Cluster) => {
    setClusters(prev => prev.map(c => 
      c.id === updatedCluster.id ? updatedCluster : c
    ));
  const updateCluster = (cluster: Cluster) => {
    supabase.from('clusters').update({
      name: cluster.name,
      manager_name: cluster.managerName,
      total_units: cluster.totalUnits,
      occupied_units: cluster.occupiedUnits,
      cash_balance: cluster.cashBalance,
      security_status: cluster.securityStatus,
      last_audit_date: cluster.lastAuditDate,
    }).eq('id', cluster.id).then(({ error }) => {
      if (!error) setClusters((prev) => prev.map((c) => (c.id === cluster.id ? cluster : c)));
    }).catch(console.error);
  };

  const deleteCluster = (id: string) => {
    setClusters(prev => prev.filter(c => c.id !== id));
    supabase.from('clusters').delete().eq('id', id).then(({ error }) => {
      if (!error) setClusters((prev) => prev.filter((c) => c.id !== id));
    }).catch(console.error);
  };

  // Vendors
  const addVendor = (newVendor: Vendor) => {
    setVendors(prev => [...prev, newVendor]);
  const addVendor = (vendor: Vendor) => {
    supabase.from('vendors').insert({
      id: vendor.id,
      name: vendor.name,
      service_type: vendor.serviceType,
      contact_person: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      status: vendor.status,
      contract_start: vendor.contractStart,
      contract_end: vendor.contractEnd,
      monthly_cost: vendor.monthlyCost,
    }).then(({ error }) => {
      if (!error) setVendors((prev) => [...prev, vendor]);
    }).catch(console.error);
  };

  const updateVendor = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
  const updateVendor = (vendor: Vendor) => {
    supabase.from('vendors').update({
      name: vendor.name,
      service_type: vendor.serviceType,
      contact_person: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      status: vendor.status,
      contract_start: vendor.contractStart,
      contract_end: vendor.contractEnd,
      monthly_cost: vendor.monthlyCost,
    }).eq('id', vendor.id).then(({ error }) => {
      if (!error) setVendors((prev) => prev.map((v) => (v.id === vendor.id ? vendor : v)));
    }).catch(console.error);
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    supabase.from('vendors').delete().eq('id', id).then(({ error }) => {
      if (!error) setVendors((prev) => prev.filter((v) => v.id !== id));
    }).catch(console.error);
  };

  // Leads (Marketing)
  const addLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  }
  const addLead = (lead: Lead) => {
    supabase.from('leads').insert({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      interest: lead.interest,
      budget: lead.budget,
      source: lead.source,
      status: lead.status,
      notes: lead.notes,
      assigned_agent: lead.assignedAgent,
      created_at: lead.createdAt,
    }).then(({ error }) => {
      if (!error) setLeads((prev) => [lead, ...prev]);
    }).catch(console.error);
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  }
  const updateLead = (lead: Lead) => {
    supabase.from('leads').update({
      name: lead.name,
      phone: lead.phone,
      interest: lead.interest,
      budget: lead.budget,
      source: lead.source,
      status: lead.status,
      notes: lead.notes,
      assigned_agent: lead.assignedAgent,
      created_at: lead.createdAt,
    }).eq('id', lead.id).then(({ error }) => {
      if (!error) setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
    }).catch(console.error);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  // Users
  const addUser = (newUser: User) => {
    const { id, ...userData } = newUser;
    userService.addUser(userData).then(added => {
      setUsers(prev => [...prev, added]);
    supabase.from('leads').delete().eq('id', id).then(({ error }) => {
      if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
    }).catch(console.error);
  };

  const addUser = (user: User) => {
    supabase.from('profiles').insert({
      id: user.id,
      name: user.name,
      role: user.role,
      cluster: user.cluster,
      unit: user.unit,
      bast_date: user.bastDate,
    }).then(({ error }) => {
      if (!error) setUsers((prev) => [...prev, user]);
    }).catch(console.error);
  };

  const updateUser = (updatedUser: User) => {
    userService.updateUser(updatedUser).then(() => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  const updateUser = (user: User) => {
    supabase.from('profiles').update({
      name: user.name,
      role: user.role,
      cluster: user.cluster,
      unit: user.unit,
      bast_date: user.bastDate,
    }).eq('id', user.id).then(({ error }) => {
      if (!error) setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    }).catch(console.error);
  };

  const deleteUser = (id: string) => {
    userService.deleteUser(id).then(() => {
      setUsers(prev => prev.filter(u => u.id !== id));
    supabase.from('profiles').delete().eq('id', id).then(({ error }) => {
      if (!error) setUsers((prev) => prev.filter((u) => u.id !== id));
    }).catch(console.error);
  };

  // House Types
  const addHouseType = (newHouseType: HouseType) => {
    setHouseTypes(prev => [newHouseType, ...prev]);
  const addHouseType = (houseType: HouseType) => {
    supabase.from('house_types').insert(houseType).then(({ error }) => {
      if (!error) setHouseTypes((prev) => [houseType, ...prev]);
    }).catch(console.error);
  };

  const updateHouseType = (updatedHouseType: HouseType) => {
    setHouseTypes(prev => prev.map(ht => ht.id === updatedHouseType.id ? updatedHouseType : ht));
  const updateHouseType = (houseType: HouseType) => {
    supabase.from('house_types').update(houseType).eq('id', houseType.id).then(({ error }) => {
      if (!error) setHouseTypes((prev) => prev.map((ht) => (ht.id === houseType.id ? houseType : ht)));
    }).catch(console.error);
  };

  const deleteHouseType = (id: string) => {
    setHouseTypes(prev => prev.filter(ht => ht.id !== id));
    supabase.from('house_types').delete().eq('id', id).then(({ error }) => {
      if (!error) setHouseTypes((prev) => prev.filter((ht) => ht.id !== id));
    }).catch(console.error);
  };

  return (
    <DataContext.Provider value={{
      complaints,
      units,
      invoices,
      expenses,
      clusters,
      vendors,
      leads,
      users,
      payments,
      houseTypes,
      addComplaint,
      updateComplaintStatus,
      addUnit,
      updateUnit,
      deleteUnit,
      payInvoice,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      submitPayment,
      verifyPayment,
      addExpense,
      updateExpense,
      deleteExpense,
      addCluster,
      updateCluster,
      deleteCluster,
      addVendor,
      updateVendor,
      deleteVendor,
      addLead,
      updateLead,
      deleteLead,
      addUser,
      updateUser,
      deleteUser,
      addHouseType,
      updateHouseType,
      deleteHouseType
    }}>
      {children}
    </DataContext.Provider>
  );
  const value = useMemo(() => ({
    complaints,
    units,
    invoices,
    expenses,
    clusters,
    vendors,
    leads,
    users,
    payments,
    houseTypes,
    currentUser,
    loading,
    addComplaint,
    updateComplaintStatus,
    addUnit,
    updateUnit,
    deleteUnit,
    payInvoice,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    submitPayment,
    verifyPayment,
    addExpense,
    updateExpense,
    deleteExpense,
    addCluster,
    updateCluster,
    deleteCluster,
    addVendor,
    updateVendor,
    deleteVendor,
    addLead,
    updateLead,
    deleteLead,
    addUser,
    updateUser,
    deleteUser,
    addHouseType,
    updateHouseType,
    deleteHouseType,
  }), [complaints, units, invoices, expenses, clusters, vendors, leads, users, payments, houseTypes, currentUser, loading]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
};