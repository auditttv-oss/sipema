import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Invoice, ClusterExpense, InvoiceStatus } from '../types';
import { Plus, Search, Filter, Trash2, Edit2, CheckCircle, Wallet, TrendingDown, Calendar, FileText, X, Save, AlertCircle } from 'lucide-react';

export const FinancialManagement: React.FC = () => {
  const { 
    invoices, addInvoice, updateInvoice, deleteInvoice, 
    expenses, addExpense, updateExpense, deleteExpense,
    units, clusters 
  } = useData();

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCluster, setFilterCluster] = useState('All');

  // --- INVOICE STATES ---
  const initialInvoiceState: Invoice = {
    id: '',
    unitId: '',
    month: 'Januari',
    year: new Date().getFullYear(),
    amount: 150000,
    status: InvoiceStatus.UNPAID,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'IPL & Kebersihan'
  };
  const [invoiceForm, setInvoiceForm] = useState<Invoice>(initialInvoiceState);

  // --- EXPENSE STATES ---
  const initialExpenseState: ClusterExpense = {
    id: '',
    clusterId: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Lainnya',
    description: '',
    amount: 0
  };
  const [expenseForm, setExpenseForm] = useState<ClusterExpense>(initialExpenseState);

  // --- HELPERS ---
  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const getUnitInfo = (unitId: string) => {
    const u = units.find(u => u.id === unitId);
    return u ? `${u.cluster} - Blok ${u.block}/${u.number} (${u.ownerName})` : 'Unknown Unit';
  };

  const getClusterName = (clusterId: string) => {
    const c = clusters.find(c => c.id === clusterId);
    return c ? c.name : 'Unknown Cluster';
  };

  // --- HANDLERS INVOICE ---
  const handleOpenAddInvoice = () => {
    setEditingId(null);
    setInvoiceForm({ ...initialInvoiceState, id: `INV-${Date.now()}`, unitId: units[0]?.id || '' });
    setIsModalOpen(true);
  };

  const handleOpenEditInvoice = (inv: Invoice) => {
    setEditingId(inv.id);
    setInvoiceForm(inv);
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if(confirm('Hapus tagihan ini?')) deleteInvoice(id);
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateInvoice(invoiceForm);
    } else {
      addInvoice(invoiceForm);
    }
    setIsModalOpen(false);
  };

  // --- HANDLERS EXPENSE ---
  const handleOpenAddExpense = () => {
    setEditingId(null);
    setExpenseForm({ ...initialExpenseState, id: `EXP-${Date.now()}`, clusterId: clusters[0]?.id || '' });
    setIsModalOpen(true);
  };

  const handleOpenEditExpense = (exp: ClusterExpense) => {
    setEditingId(exp.id);
    setExpenseForm(exp);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    if(confirm('Hapus catatan pengeluaran ini?')) deleteExpense(id);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateExpense(expenseForm);
    } else {
      addExpense(expenseForm);
    }
    setIsModalOpen(false);
  };

  // --- FILTERING ---
  const filteredInvoices = invoices.filter(inv => {
    const unit = units.find(u => u.id === inv.unitId);
    const matchesSearch = unit?.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          unit?.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCluster = filterCluster === 'All' || unit?.cluster === filterCluster;
    return matchesSearch && matchesCluster;
  });

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCluster = filterCluster === 'All' || getClusterName(exp.clusterId) === filterCluster;
    return matchesSearch && matchesCluster;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Keuangan</h2>
          <p className="text-gray-500">Kelola Tagihan Warga & Pengeluaran Operasional Cluster</p>
        </div>
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button 
            onClick={() => { setActiveTab('invoices'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'invoices' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
          >
            Pemasukan (Tagihan)
          </button>
          <button 
            onClick={() => { setActiveTab('expenses'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'expenses' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* TOOLS & STATS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={activeTab === 'invoices' ? "Cari Unit / Nama..." : "Cari Deskripsi..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
          >
            <option value="All">Semua Cluster</option>
            {clusters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        
        <button 
          onClick={activeTab === 'invoices' ? handleOpenAddInvoice : handleOpenAddExpense}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <Plus size={18} />
          {activeTab === 'invoices' ? 'Buat Tagihan Baru' : 'Catat Pengeluaran'}
        </button>
      </div>

      {/* TABLE CONTENT */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'invoices' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">ID Tagihan</th>
                  <th className="px-6 py-4 font-semibold">Unit / Warga</th>
                  <th className="px-6 py-4 font-semibold">Periode</th>
                  <th className="px-6 py-4 font-semibold">Jumlah</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map(inv => {
                   const unit = units.find(u => u.id === inv.unitId);
                   return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{inv.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                              {unit?.block}{unit?.number}
                           </div>
                           <div>
                             <p className="font-bold text-gray-800 text-sm">{unit?.ownerName}</p>
                             <p className="text-xs text-gray-500">{unit?.cluster}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{inv.month} {inv.year}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{formatRupiah(inv.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          inv.status === InvoiceStatus.PAID ? 'bg-emerald-100 text-emerald-700' : 
                          inv.status === InvoiceStatus.OVERDUE ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEditInvoice(inv)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteInvoice(inv.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">ID Pengeluaran</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Cluster</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Deskripsi</th>
                  <th className="px-6 py-4 font-semibold">Jumlah</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{exp.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{exp.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{getClusterName(exp.clusterId)}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{exp.description}</td>
                    <td className="px-6 py-4 font-medium text-red-600">{formatRupiah(exp.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEditExpense(exp)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16}/></button>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100">
             <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {editingId ? 'Edit Data' : (activeTab === 'invoices' ? 'Buat Tagihan Baru' : 'Catat Pengeluaran Baru')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={activeTab === 'invoices' ? handleSubmitInvoice : handleSubmitExpense} className="p-6 space-y-4">
              {activeTab === 'invoices' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Unit</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                      value={invoiceForm.unitId}
                      onChange={e => setInvoiceForm({...invoiceForm, unitId: e.target.value})}
                      required
                    >
                      {units.map(u => (
                        <option key={u.id} value={u.id}>{u.cluster} - {u.block}/{u.number} ({u.ownerName})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                          value={invoiceForm.month}
                          onChange={e => setInvoiceForm({...invoiceForm, month: e.target.value})}
                        >
                          {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                        <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={invoiceForm.year} onChange={e => setInvoiceForm({...invoiceForm, year: parseInt(e.target.value)})} />
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Tagihan</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={invoiceForm.category} onChange={e => setInvoiceForm({...invoiceForm, category: e.target.value})} placeholder="Contoh: IPL & Kebersihan" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: parseInt(e.target.value)})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" value={invoiceForm.status} onChange={e => setInvoiceForm({...invoiceForm, status: e.target.value as InvoiceStatus})}>
                      <option value={InvoiceStatus.UNPAID}>Belum Bayar (Unpaid)</option>
                      <option value={InvoiceStatus.PAID}>Lunas (Paid)</option>
                      <option value={InvoiceStatus.OVERDUE}>Terlambat (Overdue)</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Cluster</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                      value={expenseForm.clusterId}
                      onChange={e => setExpenseForm({...expenseForm, clusterId: e.target.value})}
                      required
                    >
                      {clusters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value as any})}>
                         <option value="Security">Security</option>
                         <option value="Kebersihan">Kebersihan</option>
                         <option value="Listrik">Listrik</option>
                         <option value="Perbaikan">Perbaikan</option>
                         <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pengeluaran</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} placeholder="Contoh: Beli Token Listrik Pos" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: parseInt(e.target.value)})} required />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};