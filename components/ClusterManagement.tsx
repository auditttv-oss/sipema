import React, { useState } from 'react';
import { Building2, Users, Wallet, ShieldCheck, AlertTriangle, ChevronRight, BarChart3, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useData } from '../DataContext';
import { Cluster } from '../types';

export const ClusterManagement: React.FC = () => {
  const { clusters, addCluster, updateCluster, deleteCluster } = useData();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState: Cluster = {
    id: '',
    name: '',
    managerName: '',
    totalUnits: 0,
    occupiedUnits: 0,
    cashBalance: 0,
    securityStatus: 'Aman',
    lastAuditDate: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState<Cluster>(initialFormState);

  // Calculate Global Stats
  const totalBalance = clusters.reduce((acc, c) => acc + c.cashBalance, 0);
  const totalUnits = clusters.reduce((acc, c) => acc + c.totalUnits, 0);
  const totalOccupied = clusters.reduce((acc, c) => acc + c.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Handlers
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, id: `cl-${Date.now()}` });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cluster: Cluster) => {
    setEditingId(cluster.id);
    setFormData(cluster);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${name}? Data tidak bisa dikembalikan.`)) {
      deleteCluster(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCluster(formData);
    } else {
      addCluster(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Cluster</h2>
          <p className="text-gray-500">Super Admin Dashboard - Permata Mutiara Maja</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <Plus size={18} />
          Tambah Cluster Baru
        </button>
      </div>

      {/* Global Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-emerald-50 font-medium text-sm">Total Dana Abadi (Semua Cluster)</p>
              <h3 className="text-2xl font-bold mt-1">{formatRupiah(totalBalance)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-gray-500 font-medium text-sm">Total Unit Terbangun</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalUnits} Unit</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-500 font-medium text-sm">Tingkat Hunian (Occupancy)</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{occupancyRate}%</h3>
              <p className="text-xs text-gray-400">{totalOccupied} dari {totalUnits} unit terisi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clusters Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-gray-500" />
          Daftar Cluster ({clusters.length})
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster) => {
            const occupancy = cluster.totalUnits > 0 ? Math.round((cluster.occupiedUnits / cluster.totalUnits) * 100) : 0;
            
            return (
              <div key={cluster.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group relative">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl">
                        {cluster.name.charAt(8) || 'C'} 
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors">{cluster.name}</h4>
                        <p className="text-sm text-gray-500">PIC: {cluster.managerName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      cluster.securityStatus === 'Aman' ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {cluster.securityStatus === 'Aman' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                      {cluster.securityStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Saldo Kas</p>
                      <p className="font-bold text-gray-800">{formatRupiah(cluster.cashBalance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Hunian</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">{occupancy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 text-xs">Audit Terakhir: {cluster.lastAuditDate}</span>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenEdit(cluster)}
                        className="p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Edit Cluster"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cluster.id, cluster.name)}
                        className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Hapus Cluster"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100">
            <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {editingId ? 'Edit Data Cluster' : 'Tambah Cluster Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cluster</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: Cluster Diamond"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Manajer / PIC</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: Bpk. Suryadi"
                  value={formData.managerName}
                  onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Unit</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({...formData, totalUnits: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Terisi</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.occupiedUnits}
                    onChange={(e) => setFormData({...formData, occupiedUnits: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Kas Awal (Rp)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.cashBalance}
                    onChange={(e) => setFormData({...formData, cashBalance: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Keamanan</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.securityStatus}
                    onChange={(e) => setFormData({...formData, securityStatus: e.target.value as any})}
                  >
                    <option value="Aman">Aman</option>
                    <option value="Siaga">Siaga</option>
                    <option value="Bahaya">Bahaya</option>
                  </select>
                </div>
              </div>

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