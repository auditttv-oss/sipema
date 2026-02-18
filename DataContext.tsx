import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Cluster,
  ClusterExpense,
  Complaint,
  ComplaintStatus,
  HouseType,
  Invoice,
  InvoiceStatus,
  Lead,
  Payment,
  Role,
  UnitData,
  User,
  Vendor,
} from './types';
import { supabase } from './src/lib/supabaseClient';

interface DataContextType {
  complaints: Complaint[];
  units: UnitData[];
  invoices: Invoice[];
  expenses: ClusterExpense[];
  clusters: Cluster[];
  vendors: Vendor[];
  leads: Lead[];
  users: User[];
  payments: Payment[];
  houseTypes: HouseType[];
  currentUser: User | null;
  loading: boolean;
  addComplaint: (complaint: Complaint) => Promise<void>;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => Promise<void>;
  addUnit: (unit: UnitData) => Promise<void>;
  updateUnit: (unit: UnitData) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  payInvoice: (id: string) => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  submitPayment: (payment: Payment) => Promise<void>;
  verifyPayment: (id: string) => Promise<void>;
  addExpense: (expense: ClusterExpense) => Promise<void>;
  updateExpense: (expense: ClusterExpense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCluster: (cluster: Cluster) => Promise<void>;
  updateCluster: (cluster: Cluster) => Promise<void>;
  deleteCluster: (id: string) => Promise<void>;
  addVendor: (vendor: Vendor) => Promise<void>;
  updateVendor: (vendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addHouseType: (houseType: HouseType) => Promise<void>;
  updateHouseType: (houseType: HouseType) => Promise<void>;
  deleteHouseType: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const toUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  role: row.role as Role,
  cluster: row.cluster ?? '-',
  unit: row.unit ?? '-',
  bastDate: row.bast_date ?? new Date().toISOString().slice(0, 10),
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

const toUnit = (row: any, clusterNameById: Record<string, string>): UnitData => ({
  id: row.id,
  cluster: clusterNameById[row.cluster_id] ?? row.cluster_id,
  block: row.block,
  number: row.number,
  type: row.type,
  landArea: row.land_area,
  ownerName: row.owner_name,
  residentStatus: row.status,
  phoneNumber: row.phone_number ?? '-',
  familyMembers: row.family_members,
  bastDate: row.bast_date,
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

const toPayment = (row: any): Payment => ({
  id: row.id,
  userId: row.user_id,
  rekeningIpl: row.rekening_ipl,
  nominal: row.nominal,
  referensi: row.referensi,
  nama: row.nama,
  blok: row.blok,
  nomorRumah: row.nomor_rumah,
  status: row.status,
  createdAt: row.created_at,
});

const toInvoice = (row: any): Invoice => ({
  id: row.id,
  unitId: row.residents?.unit_id ?? '',
  month: row.month,
  year: row.year,
  amount: row.amount,
  status: row.status,
  dueDate: row.due_date,
  category: row.category,
});

const toComplaint = (row: any): Complaint => ({
  id: row.id,
  userId: row.residents?.profile_id ?? row.resident_id,
  category: row.category,
  subCategory: row.sub_category,
  description: row.description,
  photoUrl: row.photo_url,
  status: row.status,
  isWarranty: row.is_warranty,
  createdAt: row.created_at,
  upvotes: row.upvotes,
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<ClusterExpense[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [houseTypes, setHouseTypes] = useState<HouseType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*, residents(unit_id)')
      .order('year', { ascending: false });
    setInvoices((data || []).map(toInvoice));
  };

  const refreshComplaints = async () => {
    const { data } = await supabase
      .from('complaints')
      .select('*, residents(profile_id)')
      .order('created_at', { ascending: false });
    setComplaints((data || []).map(toComplaint));
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        profilesRes,
        clustersRes,
        unitsRes,
        expensesRes,
        vendorsRes,
        leadsRes,
        paymentsRes,
        houseTypesRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('clusters').select('*'),
        supabase.from('units').select('*'),
        supabase.from('ledger_entries').select('*').order('date', { ascending: false }),
        supabase.from('vendors').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('house_types').select('*'),
      ]);

      const clusterRows = clustersRes.data || [];
      const clusterNameById = Object.fromEntries(clusterRows.map((clusterRow: any) => [clusterRow.id, clusterRow.name]));

      setUsers((profilesRes.data || []).map(toUser));
      setClusters(clusterRows.map(toCluster));
      setUnits((unitsRes.data || []).map((row: any) => toUnit(row, clusterNameById)));
      setExpenses((expensesRes.data || []).map(toExpense));
      setVendors((vendorsRes.data || []).map(toVendor));
      setLeads((leadsRes.data || []).map(toLead));
      setPayments((paymentsRes.data || []).map(toPayment));
      setHouseTypes((houseTypesRes.data || []) as HouseType[]);

      await Promise.all([refreshComplaints(), refreshInvoices()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData().catch(console.error);

    const bootAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return setCurrentUser(null);

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) setCurrentUser(toUser(profile));
    };

    bootAuth().catch(console.error);

    const authListener = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user.id;
      if (!userId) return setCurrentUser(null);

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) setCurrentUser(toUser(profile));
    });

    const complaintsChannel = supabase
      .channel('complaints-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, refreshComplaints)
      .subscribe();

    const invoicesChannel = supabase
      .channel('invoices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, refreshInvoices)
      .subscribe();

    return () => {
      authListener.data.subscription.unsubscribe();
      supabase.removeChannel(complaintsChannel);
      supabase.removeChannel(invoicesChannel);
    };
  }, []);

  const getResidentIdByUserId = async (userId: string) => {
    const byProfile: any = await supabase.from('residents').select('id').eq('profile_id', userId).maybeSingle();
    if (byProfile?.data?.id) return byProfile.data.id as string;

    const byResident: any = await supabase.from('residents').select('id').eq('id', userId).maybeSingle();
    return byResident?.data?.id as string | undefined;
  };

  const getResidentIdByUnit = async (unitId: string) => {
    const result: any = await supabase.from('residents').select('id').eq('unit_id', unitId).limit(1).maybeSingle();
    return result?.data?.id as string | undefined;
  };

  const addComplaint = async (complaint: Complaint) => {
    const residentId = await getResidentIdByUserId(complaint.userId);
    if (!residentId) return;

    await supabase.from('complaints').insert({
      id: complaint.id,
      resident_id: residentId,
      category: complaint.category,
      sub_category: complaint.subCategory,
      description: complaint.description,
      photo_url: complaint.photoUrl,
      status: complaint.status,
      is_warranty: complaint.isWarranty,
      upvotes: complaint.upvotes,
      created_at: complaint.createdAt,
    });
    await refreshComplaints();
  };

  const updateComplaintStatus = async (id: string, status: ComplaintStatus) => {
    await supabase.from('complaints').update({ status }).eq('id', id);
    setComplaints((previous) => previous.map((complaint) => (complaint.id === id ? { ...complaint, status } : complaint)));
  };

  const addUnit = async (unit: UnitData) => {
    const cluster = clusters.find((item) => item.name === unit.cluster);
    if (!cluster) return;

    await supabase.from('units').insert({
      id: unit.id,
      cluster_id: cluster.id,
      block: unit.block,
      number: unit.number,
      type: unit.type,
      land_area: unit.landArea,
      owner_name: unit.ownerName,
      status: unit.residentStatus,
      phone_number: unit.phoneNumber,
      family_members: unit.familyMembers,
      bast_date: unit.bastDate,
    });
    setUnits((previous) => [unit, ...previous]);
  };

  const updateUnit = async (unit: UnitData) => {
    const cluster = clusters.find((item) => item.name === unit.cluster);
    if (!cluster) return;

    await supabase
      .from('units')
      .update({
        cluster_id: cluster.id,
        block: unit.block,
        number: unit.number,
        type: unit.type,
        land_area: unit.landArea,
        owner_name: unit.ownerName,
        status: unit.residentStatus,
        phone_number: unit.phoneNumber,
        family_members: unit.familyMembers,
        bast_date: unit.bastDate,
      })
      .eq('id', unit.id);

    setUnits((previous) => previous.map((item) => (item.id === unit.id ? unit : item)));
  };

  const deleteUnit = async (id: string) => {
    await supabase.from('units').delete().eq('id', id);
    setUnits((previous) => previous.filter((unit) => unit.id !== id));
  };

  const payInvoice = async (id: string) => {
    await supabase.from('invoices').update({ status: InvoiceStatus.PAID }).eq('id', id);
    setInvoices((previous) => previous.map((invoice) => (invoice.id === id ? { ...invoice, status: InvoiceStatus.PAID } : invoice)));
  };

  const addInvoice = async (invoice: Invoice) => {
    const residentId = await getResidentIdByUnit(invoice.unitId);
    if (!residentId) return;

    await supabase.from('invoices').insert({
      id: invoice.id,
      resident_id: residentId,
      month: invoice.month,
      year: invoice.year,
      amount: invoice.amount,
      status: invoice.status,
      due_date: invoice.dueDate,
      category: invoice.category,
    });
    await refreshInvoices();
  };

  const updateInvoice = async (invoice: Invoice) => {
    const residentId = await getResidentIdByUnit(invoice.unitId);
    if (!residentId) return;

    await supabase
      .from('invoices')
      .update({
        resident_id: residentId,
        month: invoice.month,
        year: invoice.year,
        amount: invoice.amount,
        status: invoice.status,
        due_date: invoice.dueDate,
        category: invoice.category,
      })
      .eq('id', invoice.id);

    setInvoices((previous) => previous.map((item) => (item.id === invoice.id ? invoice : item)));
  };

  const deleteInvoice = async (id: string) => {
    await supabase.from('invoices').delete().eq('id', id);
    setInvoices((previous) => previous.filter((invoice) => invoice.id !== id));
  };

  const submitPayment = async (payment: Payment) => {
    await supabase.from('payments').insert({
      id: payment.id,
      user_id: payment.userId,
      rekening_ipl: payment.rekeningIpl,
      nominal: payment.nominal,
      referensi: payment.referensi,
      nama: payment.nama,
      blok: payment.blok,
      nomor_rumah: payment.nomorRumah,
      status: payment.status,
      created_at: payment.createdAt,
    });
    setPayments((previous) => [payment, ...previous]);
  };

  const verifyPayment = async (id: string) => {
    await supabase.from('payments').update({ status: 'verified' }).eq('id', id);
    setPayments((previous) => previous.map((payment) => (payment.id === id ? { ...payment, status: 'verified' } : payment)));
  };

  const addExpense = async (expense: ClusterExpense) => {
    await supabase.from('ledger_entries').insert({
      id: expense.id,
      cluster_id: expense.clusterId,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      proof_url: expense.proofUrl,
    });
    setExpenses((previous) => [expense, ...previous]);
  };

  const updateExpense = async (expense: ClusterExpense) => {
    await supabase
      .from('ledger_entries')
      .update({
        cluster_id: expense.clusterId,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        proof_url: expense.proofUrl,
      })
      .eq('id', expense.id);
    setExpenses((previous) => previous.map((item) => (item.id === expense.id ? expense : item)));
  };

  const deleteExpense = async (id: string) => {
    await supabase.from('ledger_entries').delete().eq('id', id);
    setExpenses((previous) => previous.filter((expense) => expense.id !== id));
  };

  const addCluster = async (cluster: Cluster) => {
    await supabase.from('clusters').insert({
      id: cluster.id,
      name: cluster.name,
      manager_name: cluster.managerName,
      total_units: cluster.totalUnits,
      occupied_units: cluster.occupiedUnits,
      cash_balance: cluster.cashBalance,
      security_status: cluster.securityStatus,
      last_audit_date: cluster.lastAuditDate,
    });
    setClusters((previous) => [...previous, cluster]);
  };

  const updateCluster = async (cluster: Cluster) => {
    await supabase
      .from('clusters')
      .update({
        name: cluster.name,
        manager_name: cluster.managerName,
        total_units: cluster.totalUnits,
        occupied_units: cluster.occupiedUnits,
        cash_balance: cluster.cashBalance,
        security_status: cluster.securityStatus,
        last_audit_date: cluster.lastAuditDate,
      })
      .eq('id', cluster.id);
    setClusters((previous) => previous.map((item) => (item.id === cluster.id ? cluster : item)));
  };

  const deleteCluster = async (id: string) => {
    await supabase.from('clusters').delete().eq('id', id);
    setClusters((previous) => previous.filter((cluster) => cluster.id !== id));
  };

  const addVendor = async (vendor: Vendor) => {
    await supabase.from('vendors').insert({
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
    });
    setVendors((previous) => [...previous, vendor]);
  };

  const updateVendor = async (vendor: Vendor) => {
    await supabase
      .from('vendors')
      .update({
        name: vendor.name,
        service_type: vendor.serviceType,
        contact_person: vendor.contactPerson,
        phone: vendor.phone,
        email: vendor.email,
        status: vendor.status,
        contract_start: vendor.contractStart,
        contract_end: vendor.contractEnd,
        monthly_cost: vendor.monthlyCost,
      })
      .eq('id', vendor.id);
    setVendors((previous) => previous.map((item) => (item.id === vendor.id ? vendor : item)));
  };

  const deleteVendor = async (id: string) => {
    await supabase.from('vendors').delete().eq('id', id);
    setVendors((previous) => previous.filter((vendor) => vendor.id !== id));
  };

  const addLead = async (lead: Lead) => {
    await supabase.from('leads').insert({
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
    });
    setLeads((previous) => [lead, ...previous]);
  };

  const updateLead = async (lead: Lead) => {
    await supabase
      .from('leads')
      .update({
        name: lead.name,
        phone: lead.phone,
        interest: lead.interest,
        budget: lead.budget,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        assigned_agent: lead.assignedAgent,
        created_at: lead.createdAt,
      })
      .eq('id', lead.id);
    setLeads((previous) => previous.map((item) => (item.id === lead.id ? lead : item)));
  };

  const deleteLead = async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    setLeads((previous) => previous.filter((lead) => lead.id !== id));
  };

  const addUser = async (user: User) => {
    await supabase.from('profiles').insert({
      id: user.id,
      name: user.name,
      role: user.role,
      cluster: user.cluster,
      unit: user.unit,
      bast_date: user.bastDate,
    });
    setUsers((previous) => [...previous, user]);
  };

  const updateUser = async (user: User) => {
    await supabase
      .from('profiles')
      .update({
        name: user.name,
        role: user.role,
        cluster: user.cluster,
        unit: user.unit,
        bast_date: user.bastDate,
      })
      .eq('id', user.id);
    setUsers((previous) => previous.map((item) => (item.id === user.id ? user : item)));
  };

  const deleteUser = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    setUsers((previous) => previous.filter((user) => user.id !== id));
  };

  const addHouseType = async (houseType: HouseType) => {
    await supabase.from('house_types').insert(houseType);
    setHouseTypes((previous) => [houseType, ...previous]);
  };

  const updateHouseType = async (houseType: HouseType) => {
    await supabase.from('house_types').update(houseType).eq('id', houseType.id);
    setHouseTypes((previous) => previous.map((item) => (item.id === houseType.id ? houseType : item)));
  };

  const deleteHouseType = async (id: string) => {
    await supabase.from('house_types').delete().eq('id', id);
    setHouseTypes((previous) => previous.filter((houseType) => houseType.id !== id));
  };

  const value = useMemo(
    () => ({
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
    }),
    [complaints, units, invoices, expenses, clusters, vendors, leads, users, payments, houseTypes, currentUser, loading],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
