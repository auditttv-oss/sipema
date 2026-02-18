import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Lead, LeadStatus } from '../types';
import { Plus, Search, User, Phone, DollarSign, Calendar, MessageSquare, Briefcase, TrendingUp, X, Save, Edit2, Trash2 } from 'lucide-react';

export const MarketingSales: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Lead = {
    id: '',
    name: '',
    phone: '',
    interest: '',
    budget: '',
    source: '',
    status: LeadStatus.NEW,
    notes: '',
    assignedAgent: '',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Lead>(initialFormState);

  // Kanban Columns
  const columns = [
    { id: LeadStatus.NEW, label: 'Baru Masuk', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: LeadStatus.PROSPECT, label: 'Prospek', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { id: LeadStatus.SURVEY, label: 'Survey Lokasi', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { id: LeadStatus.BOOKING, label: 'Booking Fee', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { id: LeadStatus.LOST, label: 'Batal', color: 'bg-gray-50 border-gray-200 text-gray-500' }
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, id: `l-${Date.now()}` });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setFormData(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data prospek ini?')) deleteLead(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateLead(formData);
    } else {
      addLead(formData);
    }
    setIsModalOpen(false);
  };

  // Simple stats
  const totalLeads = leads.length;
  const bookingCount = leads.filter(l => l.status === LeadStatus.BOOKING).length;
  const surveyCount = leads.filter(l => l.status === LeadStatus.SURVEY).length;

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Marketing & Sales CRM</h2>
          <p className="text-gray-500">Pipeline penjualan unit dan manajemen prospek pelanggan.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <Plus size={18} />
          Input Prospek Baru
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><User size={24} /></div>
           <div>
             <p className="text-xs text-gray-500 font-bold uppercase">Total Leads</p>
             <h3 className="text-xl font-bold text-gray-800">{totalLeads} Calon</h3>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><TrendingUp size={24} /></div>
           <div>
             <p className="text-xs text-gray-500 font-bold uppercase">Minat Survey</p>
             <h3 className="text-xl font-bold text-gray-800">{surveyCount} Orang</h3>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={24} /></div>
           <div>
             <p className="text-xs text-gray-500 font-bold uppercase">Booking Fee</p>
             <h3 className="text-xl font-bold text-gray-800">{bookingCount} Unit</h3>
           </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
          {columns.map(col => {
            const columnLeads = leads.filter(l => l.status === col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col bg-gray-100/50 rounded-xl border border-gray-200 h-full">
                {/* Column Header */}
                <div className={`p-3 border-b border-gray-200 rounded-t-xl font-bold text-sm flex justify-between items-center ${col.color.replace('bg-', 'bg-opacity-20 ')}`}>
                  <span>{col.label}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm text-gray-600">{columnLeads.length}</span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {columnLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer relative" onClick={() => handleOpenEdit(lead)}>
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-gray-800 text-sm">{lead.name}</h4>
                         <span className="text-[10px] text-gray-400">{lead.createdAt}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-3">
                         <div className="flex items-center gap-2 text-xs text-gray-600">
                           <Phone size={12} className="text-gray-400"/> {lead.phone}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-600">
                           <Briefcase size={12} className="text-gray-400"/> {lead.interest}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-600">
                           <User size={12} className="text-gray-400"/> Agent: {lead.assignedAgent}
                         </div>
                      </div>

                      <div className="pt-2 border-t border-gray-50 text-xs text-gray-500 italic truncate">
                        "{lead.notes}"
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-white pl-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-gray-800">
                {editingId ? 'Edit Data Prospek' : 'Input Prospek Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Calon Pembeli</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WA/HP</label>
                   <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status Lead</label>
                   <select 
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                     value={formData.status}
                     onChange={e => setFormData({...formData, status: e.target.value as any})}
                   >
                     {columns.map(col => (
                       <option key={col.id} value={col.id}>{col.label}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minat Unit / Cluster</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.interest}
                  onChange={e => setFormData({...formData, interest: e.target.value})}
                  placeholder="Contoh: Cluster Ruby - Type 36"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Info</label>
                   <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value})}
                    placeholder="FB Ads / Banner / Teman"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Sales Agent</label>
                   <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.assignedAgent}
                    onChange={e => setFormData({...formData, assignedAgent: e.target.value})}
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Follow Up</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Catatan hasil percakapan atau janji temu..."
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