import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Vendor } from '../types';
import { Search, Plus, Edit2, Trash2, X, Save, Building, Phone, Mail, Calendar, Shield, Briefcase } from 'lucide-react';

export const VendorManagement: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Vendor = {
    id: '',
    name: '',
    serviceType: 'Lainnya',
    contactPerson: '',
    phone: '',
    email: '',
    status: 'Active',
    contractStart: new Date().toISOString().split('T')[0],
    contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    monthlyCost: 0
  };

  const [formData, setFormData] = useState<Vendor>(initialFormState);

  // Filter vendors
  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, id: `v-${Date.now()}` });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingId(vendor.id);
    setFormData(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus vendor ${name}? Data tidak dapat dikembalikan.`)) {
      deleteVendor(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVendor(formData);
    } else {
      addVendor(formData);
    }
    setIsModalOpen(false);
  };

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Vendor</h2>
          <p className="text-gray-500">Kelola kontrak pihak ketiga, keamanan, dan kebersihan.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <Plus size={18} />
          Tambah Vendor Baru
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama vendor atau jenis layanan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => {
           const isExpiringSoon = new Date(vendor.contractEnd).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30; // 30 days
           
           return (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">{vendor.name}</h3>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {vendor.serviceType}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {vendor.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building size={16} className="text-gray-400" />
                    <span className="font-medium">{vendor.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Masa Kontrak:</span>
                      <span className={`font-medium ${isExpiringSoon && vendor.status === 'Active' ? 'text-red-600' : 'text-gray-700'}`}>
                        {vendor.contractEnd}
                      </span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Biaya Bulanan:</span>
                      <span className="font-bold text-gray-800">{formatRupiah(vendor.monthlyCost)}</span>
                   </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                 {isExpiringSoon && vendor.status === 'Active' ? (
                   <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                     <Shield size={12} /> Kontrak Segera Habis
                   </span>
                 ) : (
                   <span className="text-xs text-gray-400">ID: {vendor.id}</span>
                 )}
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(vendor)}
                      className="text-gray-400 hover:text-indigo-600 p-1 rounded hover:bg-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(vendor.id, vendor.name)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </div>
           );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-gray-800">
                {editingId ? 'Edit Data Vendor' : 'Tambah Vendor Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan / Vendor</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Contoh: PT. Aman Jaya"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Layanan</label>
                   <select 
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                     value={formData.serviceType}
                     onChange={e => setFormData({...formData, serviceType: e.target.value as any})}
                   >
                     <option value="Security">Security</option>
                     <option value="Kebersihan">Kebersihan</option>
                     <option value="Konstruksi">Konstruksi</option>
                     <option value="Internet">Internet</option>
                     <option value="Lainnya">Lainnya</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select 
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                     value={formData.status}
                     onChange={e => setFormData({...formData, status: e.target.value as any})}
                   >
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kontak (PIC)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.contactPerson}
                  onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                   <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Mulai Kontrak</label>
                   <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.contractStart}
                    onChange={e => setFormData({...formData, contractStart: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Selesai Kontrak</label>
                   <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.contractEnd}
                    onChange={e => setFormData({...formData, contractEnd: e.target.value})}
                   />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Bulanan (Rp)</label>
                 <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.monthlyCost}
                  onChange={e => setFormData({...formData, monthlyCost: parseInt(e.target.value) || 0})}
                 />
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
                  Simpan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};