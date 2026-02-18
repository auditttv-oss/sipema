import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useData } from '../DataContext';
import { HouseType } from '../types';

export const HouseTypeManagement: React.FC = () => {
  const { houseTypes, addHouseType, updateHouseType, deleteHouseType } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<HouseType | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const openModal = (type?: HouseType) => {
    if (type) {
      setEditingType(type);
      setFormData({ name: type.name, description: type.description || '' });
    } else {
      setEditingType(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateHouseType({ ...editingType, ...formData });
    } else {
      const newType: HouseType = {
        id: `ht-${Date.now()}`,
        ...formData
      };
      addHouseType(newType);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tipe rumah ini?')) {
      deleteHouseType(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tipe Rumah</h1>
        <button
          onClick={() => openModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Tipe Rumah
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Tipe Rumah</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {houseTypes.map((type) => (
            <div key={type.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">{type.name}</h4>
                {type.description && (
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(type)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {houseTypes.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Belum ada tipe rumah yang ditambahkan.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {editingType ? 'Edit Tipe Rumah' : 'Tambah Tipe Rumah'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Tipe
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  {editingType ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
