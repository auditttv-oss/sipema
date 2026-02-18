import React, { useState } from 'react';
import { useData } from '../DataContext';
import { Role, User } from '../types';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [form, setForm] = useState<Omit<User, 'id'>>({
    name: '',
    role: Role.RESIDENT,
    cluster: '',
    unit: '',
    bastDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...form, id: '' } as User);
    setForm({
      name: '',
      role: Role.RESIDENT,
      cluster: '',
      unit: '',
      bastDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Role.RESIDENT}>Resident</option>
              <option value={Role.ADMIN_CLUSTER}>Admin Cluster</option>
              <option value={Role.SUPER_ADMIN}>Super Admin</option>
              <option value={Role.TECHNICIAN}>Technician</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cluster</label>
            <input
              type="text"
              value={form.cluster}
              onChange={(e) => setForm({ ...form, cluster: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BAST Date</label>
            <input
              type="date"
              value={form.bastDate}
              onChange={(e) => setForm({ ...form, bastDate: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add User
        </button>
      </form>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Users</h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">Role: {user.role.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600">Cluster: {user.cluster}, Unit: {user.unit}</p>
                </div>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
