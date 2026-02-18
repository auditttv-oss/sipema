import React from 'react';
import { MARKETPLACE_ITEMS } from '../constants';
import { ShoppingBag, Star } from 'lucide-react';

export const Marketplace: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pasar Warga</h2>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
          + Jualan Sekarang
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARKETPLACE_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                {item.category}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.sellerName}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-emerald-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</span>
                <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-emerald-100 hover:text-emerald-700 font-medium transition-colors">
                  Chat Penjual
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Promo Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white flex flex-col justify-center items-center text-center">
          <ShoppingBag size={48} className="mb-4 text-white/80" />
          <h3 className="font-bold text-xl mb-2">UMKM Maja Bangkit!</h3>
          <p className="text-sm text-indigo-100 mb-4">Dukung tetangga dengan membeli produk lokal warga Permata Mutiara Maja.</p>
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-50">
            Lihat Semua Kategori
          </button>
        </div>
      </div>
    </div>
  );
};