import React, { useEffect, useMemo, useState } from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ComplaintCenter } from './components/ComplaintCenter';
import { BillingSystem } from './components/BillingSystem';
import { PanicButton } from './components/PanicButton';
import { Marketplace } from './components/Marketplace';
import { ClusterManagement } from './components/ClusterManagement';
import { ResidentDatabase } from './components/ResidentDatabase';
import { WorkOrderSystem } from './components/WorkOrderSystem';
import { FinancialManagement } from './components/FinancialManagement';
import { VendorManagement } from './components/VendorManagement';
import { MarketingSales } from './components/MarketingSales';
import UserManagement from './components/UserManagement';
import { HouseTypeManagement } from './components/HouseTypeManagement';
import { ResidentDataManagement } from './components/ResidentDataManagement';
import { DataProvider, useData } from './DataContext';
import { LOGO_URL, MOCK_USERS } from './constants';
import { Role, User as UserType } from './types';
import { supabase } from './src/lib/supabaseClient';

type ViewState =
  | 'dashboard'
  | 'complaints'
  | 'billing'
  | 'marketplace'
  | 'panic'
  | 'admin_clusters'
  | 'resident_database'
  | 'work_orders'
  | 'financial_admin'
  | 'vendor_management'
  | 'marketing_sales'
  | 'user_management'
  | 'house_types'
  | 'resident_data_management';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('admin@sipema.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const normalizedEmail = email.trim().toUpperCase() === 'BNIP' ? 'admin@sipema.com' : email.trim();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError) setError(authError.message);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
        <img src={LOGO_URL} alt="Sipema" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-gray-800">Masuk ke SIPEMA</h1>
        <p className="text-sm text-gray-500">Gunakan akun Supabase Auth. Username lama BNIP dipetakan ke admin@sipema.com.</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="admin@sipema.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const AppShell: React.FC = () => {
  const { currentUser, loading } = useData();
  const fallbackUser = useMemo<UserType>(() => MOCK_USERS[0], []);
  const user = currentUser ?? fallbackUser;

  const getInitialView = (role: Role): ViewState => (role === Role.TECHNICIAN ? 'work_orders' : 'dashboard');

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView(user.role));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setCurrentView(getInitialView(user.role));
  }, [user.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center text-gray-600">
        Memuat data SIPEMA...
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
      case 'complaints':
        return <ComplaintCenter currentUser={user} />;
      case 'billing':
        return <BillingSystem currentUser={user} />;
      case 'marketplace':
        return <Marketplace />;
      case 'panic':
        return <PanicButton />;
      case 'admin_clusters':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <ClusterManagement />;
      case 'financial_admin':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <FinancialManagement />;
      case 'vendor_management':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <VendorManagement />;
      case 'marketing_sales':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <MarketingSales />;
      case 'user_management':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <UserManagement />;
      case 'house_types':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <HouseTypeManagement />;
      case 'resident_data_management':
        if (user.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
        return <ResidentDataManagement />;
      case 'resident_database':
        return <ResidentDatabase currentUser={user} />;
      case 'work_orders':
        return <WorkOrderSystem />;
      default:
        return <Dashboard onViewChange={setCurrentView} currentUser={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <Sidebar
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        currentUser={user}
        onSwitchUser={() => undefined}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              <img src={LOGO_URL} alt="Sipema Maja" className="h-8 w-auto" />
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs text-gray-500">{user.unit}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded text-white ${
                      user.role === Role.SUPER_ADMIN
                        ? 'bg-slate-800'
                        : user.role === Role.ADMIN_CLUSTER
                          ? 'bg-indigo-600'
                          : user.role === Role.TECHNICIAN
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                    }`}
                  >
                    {user.role.replace('ADMIN_', '')}
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <User size={18} />
              </div>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  );
};

export default App;
