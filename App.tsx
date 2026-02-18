import React, { useState, useEffect } from 'react';
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
import { MarketingSales } from './components/MarketingSales'; // Added Import
import UserManagement from './components/UserManagement';
import { HouseTypeManagement } from './components/HouseTypeManagement';
import { ResidentDataManagement } from './components/ResidentDataManagement';
import { Menu, User, Bell } from 'lucide-react';
import { MOCK_USERS, LOGO_URL } from './constants';
import { Role, User as UserType } from './types';
import { DataProvider } from './DataContext';

type ViewState = 'dashboard' | 'complaints' | 'billing' | 'marketplace' | 'panic' | 'admin_clusters' | 'resident_database' | 'work_orders' | 'financial_admin' | 'vendor_management' | 'marketing_sales' | 'user_management' | 'house_types' | 'resident_data_management';

const AppContent: React.FC = () => {
  // Initialize with Super Admin, but allow switching
  const [currentUser, setCurrentUser] = useState<UserType>(MOCK_USERS[0]);
  
  // Determine initial view based on role
  const getInitialView = (role: Role): ViewState => {
    return role === Role.TECHNICIAN ? 'work_orders' : 'dashboard';
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView(currentUser.role));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // When user changes, reset view
  useEffect(() => {
    setCurrentView(getInitialView(currentUser.role));
  }, [currentUser]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'complaints':
        return <ComplaintCenter currentUser={currentUser} />;
      case 'billing':
        return <BillingSystem currentUser={currentUser} />;
      case 'marketplace':
        return <Marketplace />;
      case 'panic':
        return <PanicButton />;
      case 'admin_clusters':
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <ClusterManagement />;
      case 'financial_admin': 
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <FinancialManagement />;
      case 'vendor_management': 
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <VendorManagement />;
      case 'marketing_sales': // Added Case
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <MarketingSales />;
      case 'user_management':
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <UserManagement />;
      case 'house_types':
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <HouseTypeManagement />;
      case 'resident_data_management':
        if (currentUser.role !== Role.SUPER_ADMIN) return <Dashboard onViewChange={setCurrentView} />;
        return <ResidentDataManagement />;
      case 'resident_database':
        return <ResidentDatabase currentUser={currentUser} />;
      case 'work_orders':
        return <WorkOrderSystem />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none"
            >
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
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs text-gray-500">{currentUser.unit}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${
                    currentUser.role === Role.SUPER_ADMIN ? 'bg-slate-800' :
                    currentUser.role === Role.ADMIN_CLUSTER ? 'bg-indigo-600' :
                    currentUser.role === Role.TECHNICIAN ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {currentUser.role.replace('ADMIN_', '')}
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;