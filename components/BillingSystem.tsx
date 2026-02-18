import React, { useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { InvoiceStatus, Invoice } from '../types';
import { Download, CreditCard, Shield, Zap, Wrench, Trash2, MoreHorizontal, TrendingUp, TrendingDown, DollarSign, QrCode, Store, CheckCircle, X, MessageCircle } from 'lucide-react';
import { useData } from '../DataContext';
import { Role, User } from '../types';
import { jsPDF } from 'jspdf';
import { LOGO_URL } from '../constants'; // Import LOGO_URL

interface BillingSystemProps {
  currentUser: User;
}

export const BillingSystem: React.FC<BillingSystemProps> = ({ currentUser }) => {
  const { invoices, payInvoice, expenses, payments, submitPayment, verifyPayment, units, complaints } = useData();
  const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'cluster' | 'verification' | 'complaints'>('personal');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'va' | 'qris' | 'retail'>('va');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState('P-0001');
  const [rekeningIpl, setRekeningIpl] = useState('');
  const [nominal, setNominal] = useState('');
  const [referensi, setReferensi] = useState('');
  const [nama, setNama] = useState(MOCK_USER.name);
  const [blok, setBlok] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [searchTerm3, setSearchTerm3] = useState('');

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = 25000000;
  const balance = totalIncome - totalExpenses;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security': return <Shield size={18} />;
      case 'Kebersihan': return <Trash2 size={18} />;
      case 'Listrik': return <Zap size={18} />;
      case 'Perbaikan': return <Wrench size={18} />;
      default: return <MoreHorizontal size={18} />;
    }
  };

  const handlePayClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (selectedInvoice) {
        payInvoice(selectedInvoice.id);
        setIsProcessing(false);
        setIsPaymentModalOpen(false);
        alert("Pembayaran Berhasil! Status tagihan otomatis diperbarui.");
      }
    }, 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment = {
      id: `P-${Date.now()}`,
      userId: currentUser.id,
      rekeningIpl,
      nominal: parseInt(nominal),
      referensi,
      nama,
      blok,
      nomorRumah,
      status: 'pending' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };
    submitPayment(newPayment);
    alert(`Pembayaran berhasil dikirim! Nomor Pembayaran: ${newPayment.id}. Status akan diverifikasi dalam 1-2 hari kerja.`);
    const message = `PEMBAYARAN IPL AN ${nama} BLOK ${blok} NOMOR ${nomorRumah} SUDAH DIBAYARKAN BUKTI BAYAR YANG SAYA LAMPIRKAN`;
    const phone = '6281234567890';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDownload = (inv: Invoice) => {
    const unit = units.find(u => u.id === inv.unitId);
    const doc = new jsPDF();
    
    // Outer border
    doc.rect(10, 10, 190, 277);
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SIPEMA MAJA (Sistem Informasi Permata Mutiara Maja)', 105, 25, { align: 'center' });
    doc.addImage(LOGO_URL, 'WEBP', 85, 5, 40, 15);
    
    doc.setFontSize(14);
    doc.text('KWITANSI PEMBAYARAN IPL', 105, 35, { align: 'center' });
    
    // Line under header
    doc.line(20, 40, 180, 40);
    
    // Details section
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    let y = 55;
    const addDetail = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, y);
      y += 10;
    };
    
    addDetail('Nomor Tagihan:', inv.id);
    addDetail('Warga:', unit ? unit.ownerName : 'N/A');
    addDetail('Periode:', `${inv.month} ${inv.year}`);
    addDetail('Jenis Tagihan:', inv.category);
    addDetail('Jatuh Tempo:', inv.dueDate);
    
    // Amount section
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total Pembayaran:', 20, y);
    doc.text(`Rp ${inv.amount.toLocaleString()}`, 80, y);
    
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    addDetail('Status:', 'LUNAS');
    addDetail('Tanggal Pembayaran:', new Date().toLocaleDateString('id-ID'));
    
    // Footer
    doc.line(20, 250, 180, 250);
    doc.setFontSize(10);
    doc.text('Terima Kasih atas Pembayaran Anda', 105, 260, { align: 'center' });
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 105, 270, { align: 'center' });
    
    doc.save(`kwitansi_${inv.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Keuangan & Tagihan</h2>
        <div className="flex bg-gray-200 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'personal' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tagihan Saya
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'payment' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bayar IPL
          </button>
          <button
            onClick={() => setActiveTab('cluster')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'cluster' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Transparansi Cluster
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'complaints' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Aduan
          </button>
          {currentUser.role === Role.ADMIN_CLUSTER && (
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'verification' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Verifikasi Pembayaran
            </button>
          )}
        </div>
      </div>

      {activeTab === 'personal' ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Cari nomor tagihan atau status..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {invoices.filter(inv => {
              const matchesId = inv.id.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = inv.status.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesId || matchesStatus;
            }).map((inv) => {
              const isPaid = inv.status === InvoiceStatus.PAID;
              const isOverdue = inv.status === InvoiceStatus.OVERDUE;
              const unit = units.find(u => u.id === inv.unitId);
              return (
                <div key={inv.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md ${isOverdue && !isPaid ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'}`}>
                  {isOverdue && !isPaid && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold shadow-sm">
                      TERLAMBAT
                    </div>
                  )}
                  {isPaid && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold shadow-sm flex items-center gap-1">
                      LUNAS <CheckCircle size={10} />
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">IPL Periode</p>
                        <h3 className="text-xl font-bold text-gray-800 mt-0.5">{inv.month} {inv.year}</h3>
                        {unit && <p className="text-sm text-gray-600 font-medium">Warga: {unit.ownerName}</p>}
                      </div>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                        <CreditCard size={20} />
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jenis Tagihan</span>
                        <span className="font-medium text-gray-700">{inv.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jatuh Tempo</span>
                        <span className={`font-medium ${isOverdue && !isPaid ? 'text-red-600' : 'text-gray-700'}`}>{inv.dueDate}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed border-gray-200">
                        <span className="text-gray-800">Total</span>
                        <span className="text-emerald-600">{formatRupiah(inv.amount)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {isPaid && (
                      <button 
                        onClick={() => handleDownload(inv)}
                        className="w-full bg-gray-50 text-gray-400 py-2.5 rounded-lg font-medium hover:bg-gray-100 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm border border-gray-200"
                      >
                        <Download size={16} />
                        Download Kwitansi
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Auto-Generated Invoices</h4>
              <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                Tagihan IPL digenerate otomatis setiap tanggal <strong>1 awal bulan</strong>. Sistem pembayaran terintegrasi dengan Payment Gateway (Midtrans), status tagihan akan berubah LUNAS secara realtime setelah pembayaran terverifikasi.
              </p>
            </div>
          </div>
        </div>
      ) : activeTab === 'payment' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Pembayaran</label>
                <input type="text" value={paymentId} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rekening IPL</label>
                <input type="text" value={rekeningIpl} onChange={(e) => setRekeningIpl(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nominal Pembayaran</label>
                <input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Referensi</label>
                <input type="text" value={referensi} onChange={(e) => setReferensi(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Blok</label>
                <input type="text" value={blok} onChange={(e) => setBlok(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Rumah</label>
                <input type="text" value={nomorRumah} onChange={(e) => setNomorRumah(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-sm" required />
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
                    <span className="text-gray-500">Nomor Pembayaran</span>
                    <span className="font-medium">{paymentId}</span>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg shadow-indigo-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageCircle size={20} /> Info Pembayaran
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                    <span>Lampirkan bukti transfer saat mengirim pesan WhatsApp.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                    <span>Pembayaran akan diverifikasi oleh admin dalam 1-2 hari kerja.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'cluster' ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm text-gray-500 font-medium">Pemasukan (Bulan Ini)</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(totalIncome)}</h3>
              <p className="text-xs text-gray-400 mt-1">Dari 98 unit yang membayar</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <TrendingDown size={20} />
                </div>
                <span className="text-sm text-gray-500 font-medium">Pengeluaran (Bulan Ini)</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(totalExpenses)}</h3>
              <p className="text-xs text-gray-400 mt-1">Operasional & Perbaikan</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 text-emerald-400 rounded-lg">
                  <DollarSign size={20} />
                </div>
                <span className="text-sm text-gray-300 font-medium">Saldo Kas Cluster {MOCK_USER.cluster}</span>
              </div>
              <h3 className="text-2xl font-bold">{formatRupiah(balance)}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs text-gray-400">Realtime Update</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Rincian Pengeluaran Cluster</h3>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                <Download size={14} /> Laporan PDF
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {expense.category}
                        </span>
                        <span className="text-xs text-gray-400">{expense.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                      - {formatRupiah(expense.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'complaints' ? (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800">Aduan Warga</h2>
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Cari nomor aduan atau status..." 
              value={searchTerm2} 
              onChange={(e) => setSearchTerm2(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" 
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {complaints.filter(complaint => {
              const matchesId = complaint.id.toLowerCase().includes(searchTerm2.toLowerCase());
              const matchesStatus = complaint.status.toLowerCase().includes(searchTerm2.toLowerCase());
              return complaint.status === 'SELESAI' && (matchesId || matchesStatus);
            }).map((complaint) => (
              <div key={complaint.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700`}>
                    {complaint.status}
                  </span>
                  <span className="text-xs text-gray-400">{complaint.createdAt}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Nomor Aduan:</strong> {complaint.id}</p>
                  <p><strong>Kategori:</strong> {complaint.category}</p>
                  <p><strong>Deskripsi:</strong> {complaint.description}</p>
                </div>
              </div>
            ))}
            {complaints.filter(c => c.status === 'SELESAI').length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl">
                Tidak ada aduan yang sudah selesai.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'verification' ? (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800">Verifikasi Pembayaran Warga</h2>
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Cari nama warga atau nomor pembayaran..." 
              value={searchTerm3} 
              onChange={(e) => setSearchTerm3(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" 
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {payments.filter(p => p.status === 'pending' && (p.nama.toLowerCase().includes(searchTerm3.toLowerCase()) || p.id.toLowerCase().includes(searchTerm3.toLowerCase()))).map((payment) => (
              <div key={payment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700`}>
                    {payment.status}
                  </span>
                  <span className="text-xs text-gray-400">{payment.createdAt}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Nama:</strong> {payment.nama}</p>
                  <p><strong>Blok:</strong> {payment.blok}</p>
                  <p><strong>Nomor Rumah:</strong> {payment.nomorRumah}</p>
                  <p><strong>Rekening IPL:</strong> {payment.rekeningIpl}</p>
                  <p><strong>Nominal:</strong> Rp {payment.nominal.toLocaleString()}</p>
                  <p><strong>Referensi:</strong> {payment.referensi}</p>
                </div>
                <button onClick={() => verifyPayment(payment.id)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  Verifikasi Pembayaran
                </button>
              </div>
            ))}
            {payments.filter(p => p.status === 'pending' && (p.nama.toLowerCase().includes(searchTerm3.toLowerCase()) || p.id.toLowerCase().includes(searchTerm3.toLowerCase()))).length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl">
                Tidak ada pembayaran yang perlu diverifikasi.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100">
            <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Pembayaran Tagihan</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500">Total Pembayaran</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatRupiah(selectedInvoice.amount)}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{selectedInvoice.month} {selectedInvoice.year}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                <button 
                  onClick={() => setPaymentMethod('va')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${paymentMethod === 'va' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Virtual Account
                </button>
                <button 
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${paymentMethod === 'qris' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  QRIS
                </button>
                <button 
                  onClick={() => setPaymentMethod('retail')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${paymentMethod === 'retail' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Retail / Minimarket
                </button>
              </div>
              <div className="min-h-[120px] mb-6">
                {paymentMethod === 'va' && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg flex items-center justify-between hover:border-emerald-500 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">BCA</div>
                        <span className="font-medium text-sm">BCA Virtual Account</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between hover:border-emerald-500 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-[10px] font-bold">MDR</div>
                        <span className="font-medium text-sm">Mandiri Bill</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    </div>
                  </div>
                )}
                {paymentMethod === 'qris' && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <QrCode size={80} className="text-gray-800 mb-2" />
                    <p className="text-xs text-gray-500">Scan menggunakan GoPay, OVO, Dana, ShopeePay</p>
                  </div>
                )}
                {paymentMethod === 'retail' && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg flex items-center justify-between hover:border-emerald-500 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Store size={20} className="text-red-600"/>
                        <span className="font-medium text-sm">Alfamart / Alfamidi</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between hover:border-emerald-500 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Store size={20} className="text-blue-600"/>
                        <span className="font-medium text-sm">Indomaret</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={simulatePayment}
                disabled={isProcessing}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
