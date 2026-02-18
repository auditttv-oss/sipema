import React from 'react';
import { ComplaintStatus } from '../types';
import { Wrench, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useData } from '../DataContext';

export const WorkOrderSystem: React.FC = () => {
  const { complaints, updateComplaintStatus } = useData();

  // Technician sees Pending (to accept) and Proses (in progress)
  const tasks = complaints.filter(c => c.status !== ComplaintStatus.DITOLAK);

  const handleAcceptTicket = (id: string) => {
    if(confirm('Terima tiket ini dan mulai pengerjaan?')) {
      updateComplaintStatus(id, ComplaintStatus.PROSES);
    }
  };

  const handleCompleteTicket = (id: string) => {
    if(confirm('Tandai pekerjaan sebagai selesai?')) {
      updateComplaintStatus(id, ComplaintStatus.SELESAI);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Work Order System</h2>
          <p className="text-gray-500">Tiket perbaikan dan perawatan lingkungan.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-600">Tiket Aktif: </span>
          <span className="text-lg font-bold text-emerald-600">{tasks.filter(t => t.status === ComplaintStatus.PROSES).length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.length > 0 ? tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                      task.category === 'Retensi' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {task.category}
                    </span>
                    {task.isWarranty && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={10} /> Garansi
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {task.subCategory}
                    <span className="text-gray-400 text-sm font-normal">#{task.id}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                     <MapPin size={14} />
                     <span>Unit Pengaju: {task.userId === 'u001' ? 'RB-12' : 'RB-05'}</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${
                  task.status === ComplaintStatus.PENDING ? 'bg-gray-100 text-gray-600 border-gray-200' :
                  task.status === ComplaintStatus.PROSES ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {task.status === ComplaintStatus.PENDING && <Clock size={16} />}
                  {task.status === ComplaintStatus.PROSES && <Wrench size={16} />}
                  {task.status === ComplaintStatus.SELESAI && <CheckCircle size={16} />}
                  {task.status}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                 <p className="text-gray-700 text-sm italic">"{task.description}"</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-4">
                {task.status === ComplaintStatus.PENDING && (
                  <button 
                    onClick={() => handleAcceptTicket(task.id)}
                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wrench size={18} />
                    Terima & Kerjakan
                  </button>
                )}
                
                {task.status === ComplaintStatus.PROSES && (
                  <>
                     <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Update Progress
                    </button>
                    <button 
                      onClick={() => handleCompleteTicket(task.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Tandai Selesai
                    </button>
                  </>
                )}

                {task.status === ComplaintStatus.SELESAI && (
                   <button disabled className="flex-1 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                     Pekerjaan Selesai
                   </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500">
            Tidak ada tiket pekerjaan saat ini.
          </div>
        )}
      </div>
    </div>
  );
};