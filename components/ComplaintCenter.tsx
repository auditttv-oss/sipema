import React, { useState, useEffect } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { getNextTicket } from '../services/complaintService';
import { useData } from '../DataContext';

export const ComplaintCenter: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');

  const { clusters } = useData();
  const { complaints, addComplaint: addComplaintContext, updateComplaintStatus: updateComplaintStatusContext } = useData();

  const displayedComplaints = (() => {
    if (currentUser.role === 'RESIDENT') {
      return complaints.filter(c => c.userId === currentUser.id);
    } else if (currentUser.role === 'TECHNICIAN') {
      return complaints.filter(c => c.status === 'Proses');
    } else {
      // ADMIN_CLUSTER, SUPER_ADMIN
      return complaints;
    }
  })();

  const sortedComplaints = [...displayedComplaints].sort((a, b) => {
    const order = { 'Pending': 0, 'Proses': 1, 'Selesai': 2, 'Ditolak': 3 };
    return order[a.status] - order[b.status];
  });

  useEffect(() => {
    getNextTicket().then(setTicketNumber).catch(() => setTicketNumber('T-0001'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint = {
      id: ticketNumber,
      userId: MOCK_USER.id,
      category: 'RETENSI',
      subCategory: subCategory,
      description: description,
      status: 'Pending',
      isWarranty: true,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0
    };
    const message = `Selamat siang, saya ${name} dari Blok ${block} Nomor ${houseNumber}, Cluster ${selectedCluster}.

Saya ingin mengajukan komplain terkait masa retensi unit saya.

Berikut ini adalah nomor tiket pengaduan saya: ${ticketNumber}.

Adapun keluhan yang ingin saya sampaikan adalah:
${subCategory}: ${description}

Mohon lampirkan foto/gambar kerusakan jika ada untuk memudahkan penanganan.

Saya harap pihak developer dapat segera menindaklanjuti sesuai dengan ketentuan masa retensi yang berlaku.
Atas perhatian dan kerjasamanya, saya ucapkan terima kasih.`;
    addComplaintContext(newComplaint);
    window.open(`https://wa.me/6281282162109?text=${encodeURIComponent(message)}`);
    setDescription('');
    setSubCategory('');
    setSelectedCluster('');
    setName('');
    setBlock('');
    setHouseNumber('');
    getNextTicket().then(setTicketNumber);
    setActiveTab('list');
  };

  return currentUser.role === 'RESIDENT' ? (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pusat Aduan</h2>
          <p className="text-gray-500 text-sm">Layanan purna jual & pemeliharaan lingkungan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Tiket</label>
              <input type="text" value={ticketNumber} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cluster</label>
              <select value={selectedCluster} onChange={(e) => setSelectedCluster(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required>
                <option value="">Pilih Cluster</option>
                {clusters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Blok</label>
              <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Rumah</label>
              <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul Masalah</label>
              <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm mb-4" placeholder="Contoh: Atap Bocor di Kamar Tidur" required />
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Detail</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" placeholder="Ceritakan kronologi kerusakan..." required />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Kirim via WhatsApp
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Data Unit Anda</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Unit</span>
                  <span className="font-medium">{MOCK_USER.unit}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Cluster</span>
                  <span className="font-medium">{MOCK_USER.cluster}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Tgl BAST</span>
                  <span className="font-medium">{MOCK_USER.bastDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Nomor Tiket</span>
                  <span className="font-medium">{ticketNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg shadow-indigo-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} /> Info Penting
              </h3>
              <ul className="space-y-3 text-indigo-100 text-sm">
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                  <span>Garansi struktural berlaku <strong>3 bulan</strong> sejak serah terima kunci.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                  <span>Kerusakan akibat renovasi pribadi di luar tanggung jawab developer.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pusat Aduan</h2>
          <p className="text-gray-500 text-sm">Layanan purna jual & pemeliharaan lingkungan</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Buat Laporan Baru
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Tracking Tiket
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Tiket</label>
                <input type="text" value={ticketNumber} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cluster</label>
                <select value={selectedCluster} onChange={(e) => setSelectedCluster(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required>
                  <option value="">Pilih Cluster</option>
                  {clusters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Blok</label>
                <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Rumah</label>
                <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Masalah</label>
                <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm mb-4" placeholder="Contoh: Atap Bocor di Kamar Tidur" required />
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Detail</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" placeholder="Ceritakan kronologi kerusakan..." required />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                <MessageCircle size={18} /> Kirim via WhatsApp
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Data Unit Anda</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium">{MOCK_USER.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Cluster</span>
                    <span className="font-medium">{MOCK_USER.cluster}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Tgl BAST</span>
                    <span className="font-medium">{MOCK_USER.bastDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Nomor Tiket</span>
                    <span className="font-medium">{ticketNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg shadow-indigo-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={20} /> Info Penting
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                    <span>Garansi struktural berlaku <strong>3 bulan</strong> sejak serah terima kunci.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                    <span>Kerusakan akibat renovasi pribadi di luar tanggung jawab developer.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {sortedComplaints.length > 0 ? sortedComplaints.map((complaint, index) => (
            <div key={`${complaint.id}-${index}`} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${complaint.category === 'RETENSI' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                  {complaint.category}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  complaint.status === 'Pending' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                  complaint.status === 'Proses' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{complaint.subCategory}</h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{complaint.createdAt}</span>
                  </div>
                </div>
              </div>
              {complaint.status === 'Pending' && (
                <button onClick={() => updateComplaintStatusContext(complaint.id, 'Proses')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                  Mulai Proses
                </button>
              )}
              {complaint.status === 'Proses' && (
                <button onClick={() => updateComplaintStatusContext(complaint.id, 'Selesai')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  Tandai Selesai
                </button>
              )}
            </div>
          )) : (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-xl">
              Belum ada riwayat laporan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};