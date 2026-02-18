import React, { useState } from 'react';
import { Download, Upload, FileText, File } from 'lucide-react';
import { useData } from '../DataContext';
import { UnitData } from '../types';

export const ResidentDataManagement: React.FC = () => {
  const { units, addUnit } = useData();
  const [importStatus, setImportStatus] = useState<string>('');

  const downloadTemplate = () => {
    const headers = ['cluster', 'block', 'number', 'type', 'landArea', 'ownerName', 'residentStatus', 'phoneNumber', 'familyMembers', 'bastDate'];
    const sampleRow = ['Cluster A', 'A', '1', '36/60', '60', 'Ahmad Supardi', 'Pemilik', '081234567890', '4', '2023-01-15'];
    const csvRows = [headers.join(';'), sampleRow.join(';')];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_warga.csv';
    link.click();
  };

  const exportToCSV = () => {
    const headers = ['cluster', 'block', 'number', 'type', 'landArea', 'ownerName', 'residentStatus', 'phoneNumber', 'familyMembers', 'bastDate'];
    const csvRows = [headers.join(';')];
    
    units.forEach(unit => {
      const row = [
        unit.cluster,
        unit.block,
        unit.number,
        unit.type,
        unit.landArea,
        unit.ownerName,
        unit.residentStatus,
        unit.phoneNumber,
        unit.familyMembers,
        unit.bastDate || ''
      ];
      csvRows.push(row.join(';'));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data_warga.csv';
    link.click();
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(units, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data_warga.json';
    link.click();
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(';').map(h => h.trim());
      
      const importedUnits: UnitData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(v => v.trim());
        if (values.length === headers.length) {
          const unit: UnitData = {
            id: `u-${Date.now()}-${i}`,
            cluster: values[0] || '',
            block: values[1] || '',
            number: values[2] || '',
            type: values[3] || '',
            landArea: parseInt(values[4]) || 0,
            ownerName: values[5] || '',
            residentStatus: values[6] as any || 'Pemilik',
            phoneNumber: values[7] || '',
            familyMembers: parseInt(values[8]) || 0,
            bastDate: values[9] || null
          };
          importedUnits.push(unit);
        }
      }
      
      importedUnits.forEach(unit => addUnit(unit));
      setImportStatus(`Berhasil mengimpor ${importedUnits.length} data warga dari CSV`);
    };
    reader.readAsText(file);
  };

  const handleJSONImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const importedUnits: UnitData[] = JSON.parse(json);
        importedUnits.forEach(unit => addUnit(unit));
        setImportStatus(`Berhasil mengimpor ${importedUnits.length} data warga dari JSON`);
      } catch (error) {
        setImportStatus('Gagal mengimpor JSON. Periksa format file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Warga</h1>
      </div>

      {/* Download Template */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Download size={20} />
          Download Template
        </h3>
        <p className="text-gray-600 mb-4">Download template CSV untuk mengimpor data warga baru.</p>
        <button
          onClick={downloadTemplate}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Download Template CSV
        </button>
      </div>

      {/* Export Data */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} />
          Export Data
        </h3>
        <p className="text-gray-600 mb-4">Export data warga ke format CSV atau JSON.</p>
        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <File size={16} />
            Export ke CSV
          </button>
          <button
            onClick={exportToJSON}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <File size={16} />
            Export ke JSON
          </button>
        </div>
      </div>

      {/* Import Data */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Upload size={20} />
          Import Data
        </h3>
        <p className="text-gray-600 mb-4">Import data warga dari file CSV atau JSON.</p>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Import dari CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Import dari JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={handleJSONImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
        </div>
        {importStatus && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {importStatus}
          </div>
        )}
      </div>

      {/* Data Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Preview Data Warga ({units.length} total)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Cluster</th>
                <th className="text-left py-2">Blok</th>
                <th className="text-left py-2">Nomor</th>
                <th className="text-left py-2">Tipe</th>
                <th className="text-left py-2">Nama Pemilik</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {units.slice(0, 10).map((unit) => (
                <tr key={unit.id} className="border-b border-gray-100">
                  <td className="py-2">{unit.cluster}</td>
                  <td className="py-2">{unit.block}</td>
                  <td className="py-2">{unit.number}</td>
                  <td className="py-2">{unit.type}</td>
                  <td className="py-2">{unit.ownerName}</td>
                  <td className="py-2">{unit.residentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {units.length > 10 && (
            <p className="text-gray-500 text-sm mt-2">Menampilkan 10 data pertama dari {units.length} total.</p>
          )}
        </div>
      </div>
    </div>
  );
};
