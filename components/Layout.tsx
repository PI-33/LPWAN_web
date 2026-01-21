import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, LogOut, Activity, Radio } from 'lucide-react';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
             <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              PipeGuard
            </h1>
            <span className="text-[10px] text-blue-400 font-mono tracking-widest">LPWAN SYSTEM</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="System Cockpit" />
          <SidebarItem to="/devices" icon={<List size={20} />} label="Sensor Registry" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-slate-300">City Underground Pipeline Intelligent Monitoring System (LPWAN)</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-400 font-mono font-bold">NETWORK: ONLINE</span>
             </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;