import React, { useState } from 'react';
import { MOCK_CLUSTERS } from '../constants';
import { Search, Filter, Home, User, Phone, Users, CalendarCheck, Edit2, Trash2, Key, X, Check } from 'lucide-react';
import { Role, User as UserType, UnitData } from '../types';
import { useData } from '../DataContext';

interface ResidentDatabaseProps {
  currentUser?: UserType;
}

export const ResidentDatabase: React.FC<ResidentDatabaseProps> = ({ currentUser }) => {
  const { units, addUnit, updateUnit, deleteUnit } = useData(); // Use Context

  // If user is Admin Cluster, default and lock filter to their cluster
  const isAdminCluster = currentUser?.role === Role.ADMIN_CLUSTER;
  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;
  
  // Allow Super Admin and Admin Cluster to edit
  const canEdit = isSuperAdmin || isAdminCluster;
  
  const defaultCluster = isAdminCluster ? currentUser.cluster : 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>(defaultCluster);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for Unit
  const initialFormState = {
    cluster: 'Cluster Ruby',
    block: '',
    number: '',
    type: '36/60',
    ownerName: '',
    residentStatus: 'Pemilik'
  };

  const [unitForm, setUnitForm] = useState(initialFormState);

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = 
      unit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      unit.number.includes(searchTerm) ||
      unit.block.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCluster = selectedCluster === 'All' || unit.cluster === selectedCluster;

    return matchesSearch && matchesCluster;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setUnitForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: UnitData) => {
    setEditingId(unit.id);
    setUnitForm({
      cluster: unit.cluster,
      block: unit.block,
      number: unit.number,
      type: unit.type,
      ownerName: unit.ownerName,
      residentStatus: unit.residentStatus
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data unit milik ${name}?`)) {
      deleteUnit(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing unit
      const originalUnit = units.find(u => u.id === editingId);
      if (originalUnit) {
        updateUnit({
          ...originalUnit, // Keep other fields like phone, family members, bast
          cluster: unitForm.cluster,
          block: unitForm.block.toUpperCase(),
          number: unitForm.number,
          type: unitForm.type,
          landArea: parseInt(unitForm.type.split('/')[1] || '60'),
          ownerName: unitForm.ownerName,
          residentStatus: unitForm.residentStatus as any,
        });
      }
    } else {
      // Add new unit
      addUnit({
        id: `u-${Date.now()}`,
        cluster: unitForm.cluster,
        block: unitForm.block.toUpperCase(),
        number: unitForm.number,
        type: unitForm.type,
        landArea: parseInt(unitForm.type.split('/')[1] || '60'),
        ownerName: unitForm.ownerName,
        residentStatus: unitForm.residentStatus as any,
        phoneNumber: '-',
        familyMembers: 0,
        bastDate: new Date().toISOString().split('T')[0] // Assume handover today
      });
    }

    setIsModalOpen(false);
    setEditingId(null);
    setUnitForm(initialFormState);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Database Warga & Unit</h2>
          <p className="text-gray-500">Kelola data hunian, status kepemilikan, dan riwayat BAST.</p>
        </div>
        
        {canEdit && (
          <div className="flex gap-2">
             <button 
               onClick={handleOpenAdd}
               className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
              >
               <Home size={16} />
               + Input Unit Baru
             </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama Warga, Blok, atau Nomor Rumah..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64 relative">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <select 
            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white ${isAdminCluster ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            disabled={isAdminCluster}
          >
            {!isAdminCluster && <option value="All">Semua Cluster</option>}
            {MOCK_CLUSTERS.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Unit Hunian</th>
                <th className="px-6 py-4 font-semibold">Tipe / Luas</th>
                <th className="px-6 py-4 font-semibold">Penghuni</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold">BAST & Retensi</th>
                {canEdit && <th className="px-6 py-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                          {unit.block}-{unit.number}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{unit.cluster}</p>
                          <p className="text-xs text-gray-500">Blok {unit.block} No. {unit.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{unit.type}</p>
                      <p className="text-xs text-gray-500">LT: {unit.landArea} m²</p>
                    </td>
                    <td className="px-6 py-4">
                      {unit.residentStatus === 'Kosong' ? (
                         <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                           Kosong
                         </span>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-800">{unit.ownerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              unit.residentStatus === 'Pemilik' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {unit.residentStatus}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500" title="Jumlah Anggota Keluarga">
                              <Users size={12} /> {unit.familyMembers}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {unit.phoneNumber !== '-' ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {unit.phoneNumber}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {unit.bastDate ? (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Key size={14} className="text-gray-400"/>
                            {unit.bastDate}
                          </div>
                          {/* Simple calculation for warranty status display */}
                          {(() => {
                            const bast = new Date(unit.bastDate);
                            const now = new Date();
                            const diffDays = Math.floor((now.getTime() - bast.getTime()) / (1000 * 60 * 60 * 24));
                            if (diffDays <= 90) {
                              return <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">Garansi Aktif ({90 - diffDays} hari lagi)</span>
                            }
                            return null;
                          })()}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum Serah Terima</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(unit)}
                            className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(unit.id, unit.ownerName)}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data unit yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Menampilkan {filteredUnits.length} dari {units.length} data</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Unit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Data Unit' : 'Tambah Unit Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Cluster</label>
                   <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={unitForm.cluster}
                    onChange={e => setUnitForm({...unitForm, cluster: e.target.value})}
                   >
                     {MOCK_CLUSTERS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Rumah</label>
                   <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={unitForm.type}
                    onChange={e => setUnitForm({...unitForm, type: e.target.value})}
                   >
                     <option value="30/60">30/60 (Subsidi)</option>
                     <option value="36/60">36/60 (Standar)</option>
                     <option value="45/72">45/72 (Hook)</option>
                   </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blok</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase"
                    placeholder="Contoh: A"
                    value={unitForm.block}
                    onChange={e => setUnitForm({...unitForm, block: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Contoh: 12"
                    value={unitForm.number}
                    onChange={e => setUnitForm({...unitForm, number: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Nama Lengkap"
                  value={unitForm.ownerName}
                  onChange={e => setUnitForm({...unitForm, ownerName: e.target.value})}
                  required
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status Penghuni</label>
                 <div className="flex gap-4">
                   <label className="flex items-center gap-2">
                     <input 
                      type="radio" 
                      name="status" 
                      value="Pemilik" 
                      checked={unitForm.residentStatus === 'Pemilik'}
                      onChange={e => setUnitForm({...unitForm, residentStatus: e.target.value})}
                     />
                     <span className="text-sm">Pemilik</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input 
                      type="radio" 
                      name="status" 
                      value="Penyewa" 
                      checked={unitForm.residentStatus === 'Penyewa'}
                      onChange={e => setUnitForm({...unitForm, residentStatus: e.target.value})}
                     />
                     <span className="text-sm">Penyewa</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input 
                      type="radio" 
                      name="status" 
                      value="Kosong" 
                      checked={unitForm.residentStatus === 'Kosong'}
                      onChange={e => setUnitForm({...unitForm, residentStatus: e.target.value})}
                     />
                     <span className="text-sm">Kosong</span>
                   </label>
                 </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 flex items-center justify-center gap-2"
              >
                <Check size={18} /> {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};