import React, { useState } from 'react';
import { BellRing, ShieldCheck, Phone } from 'lucide-react';

export const PanicButton: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handlePress = () => {
    setIsActive(true);
    let counter = 5;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        // Trigger API call here
        alert("SINYAL DARURAT DIKIRIM KE POS KEAMANAN!");
        setIsActive(false);
        setCountdown(5);
      }
    }, 1000);
  };

  const cancelAlarm = () => {
    setIsActive(false);
    setCountdown(5);
    // clear interval logic would need ref var in real app
    window.location.reload(); // Quick reset for demo
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Tombol Darurat</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Gunakan tombol ini HANYA dalam keadaan darurat (Kebakaran, Maling, Medis). Sinyal akan dikirim ke seluruh satpam cluster.
        </p>
      </div>

      <div className="relative group">
        <div className={`absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${isActive ? 'animate-pulse' : ''}`}></div>
        <button
          onClick={handlePress}
          disabled={isActive}
          className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 shadow-2xl transition-transform active:scale-95 ${
            isActive 
              ? 'bg-red-600 border-red-700 text-white' 
              : 'bg-gradient-to-b from-red-500 to-red-600 border-red-100 text-white hover:from-red-600 hover:to-red-700'
          }`}
        >
          {isActive ? (
             <span className="text-5xl font-mono font-bold">{countdown}</span>
          ) : (
            <>
              <BellRing size={48} className="mb-2" />
              <span className="font-bold text-lg">SOS</span>
            </>
          )}
        </button>
      </div>

      {isActive && (
        <button 
          onClick={cancelAlarm}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300"
        >
          Batalkan Alarm
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500">Komandan Regu</p>
            <p className="font-bold text-gray-800">Pak Asep (Satpam)</p>
          </div>
          <a href="tel:08123456789" className="ml-auto bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
            <Phone size={16} />
          </a>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500">Pos Gerbang</p>
            <p className="font-bold text-gray-800">021-555-9999</p>
          </div>
           <a href="tel:0215559999" className="ml-auto bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
            <Phone size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};