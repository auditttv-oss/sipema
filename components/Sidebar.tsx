import React, { useState } from 'react';
import { Home, FileText, CreditCard, AlertCircle, ShoppingBag, LogOut, Building2, Users, Wrench, ChevronUp, DollarSign, Briefcase, TrendingUp, House, Upload } from 'lucide-react';
import { MOCK_USERS, LOGO_URL } from '../constants';
import { Role, User } from '../types';

type ViewState = 'dashboard' | 'complaints' | 'billing' | 'marketplace' | 'panic' | 'admin_clusters' | 'resident_database' | 'work_orders' | 'financial_admin' | 'vendor_management' | 'marketing_sales' | 'user_management' | 'house_types' | 'resident_data_management';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  currentUser: User;
  onSwitchUser: (user: User) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, currentUser, onSwitchUser }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Define menu visibility based on roles
  const isSuperAdmin = currentUser.role === Role.SUPER_ADMIN;
  const isAdminCluster = currentUser.role === Role.ADMIN_CLUSTER;
  const isTechnician = currentUser.role === Role.TECHNICIAN;
  const isResident = currentUser.role === Role.RESIDENT;

  // Base items for Residents and Admins
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'complaints', label: 'Pusat Aduan', icon: FileText },
    { id: 'billing', label: 'Keuangan & IPL', icon: CreditCard },
    { id: 'marketplace', label: 'Pasar Warga', icon: ShoppingBag },
  ];

  // Technician specific items
  const technicianItems = [
    { id: 'work_orders', label: 'Work Orders', icon: Wrench },
  ];

  // Admin specific items
  const adminItems = [
    ...(isSuperAdmin ? [{ id: 'admin_clusters', label: 'Manajemen Cluster', icon: Building2 }] : []),
    ...(isSuperAdmin ? [{ id: 'financial_admin', label: 'Manajemen Keuangan', icon: DollarSign }] : []),
    ...(isSuperAdmin ? [{ id: 'house_types', label: 'Manajemen Tipe Rumah', icon: House }] : []),
    ...(isSuperAdmin ? [{ id: 'resident_data_management', label: 'Manajemen Data Warga', icon: Upload }] : []),
    ...(isSuperAdmin ? [{ id: 'marketing_sales', label: 'Marketing & Sales', icon: TrendingUp }] : []),
    ...(isSuperAdmin ? [{ id: 'vendor_management', label: 'Manajemen Vendor', icon: Briefcase }] : []),
    ...(isSuperAdmin ? [{ id: 'user_management', label: 'User Management', icon: Users }] : []),
    { id: 'resident_database', label: 'Database Warga', icon: Users },
  ];

  // Panic button available to everyone
  const panicItem = { id: 'panic', label: 'Panic Button', icon: AlertCircle, variant: 'danger' };

  let displayedItems: any[] = [];

  if (isTechnician) {
    displayedItems = [...technicianItems];
  } else {
    displayedItems = [...baseItems, panicItem];
  }

  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 bg-slate-950 shrink-0">
        <img src={LOGO_URL} alt="Sipema Maja (Sistem Informasi Permata Mutiara Maja)" className="h-8 w-auto" style={{ filter: 'invert(1)' }} />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* Main Menu */}
        {displayedItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isDanger = item.variant === 'danger';

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? (isDanger ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white') 
                  : (isDanger ? 'text-red-400 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-800 hover:text-white')
                }
              `}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}

        {/* Admin Section */}
        {(isSuperAdmin || isAdminCluster) && (
          <>
            <div className="pt-4 pb-2 px-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Menu</p>
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id as ViewState)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* User / Role Switcher (Footer) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
             <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
               <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role.replace('_', ' ').toLowerCase()}</p>
             </div>
             <ChevronUp size={16} className={`text-slate-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu for Role Switching */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 z-50 animate-fadeIn">
               <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 text-xs font-bold text-slate-500 uppercase">
                 Simulasi Role
               </div>
               {MOCK_USERS.map(user => (
                 <button
                   key={user.id}
                   onClick={() => {
                     onSwitchUser(user);
                     setIsUserMenuOpen(false); // Close menu after selection
                   }}
                   className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 flex items-center justify-between ${currentUser.id === user.id ? 'text-emerald-400 bg-slate-700/50' : 'text-slate-300'}`}
                 >
                   <span>{user.role}</span>
                   {currentUser.id === user.id && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                 </button>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};