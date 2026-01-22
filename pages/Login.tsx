
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Radio, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { role, setRole } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -top-40 -left-20"></div>
      <div className="absolute w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide text-center">City Underground Pipeline<br/>Intelligent Monitoring</h1>
          <div className="flex items-center gap-2 mt-3">
             <span className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded border border-slate-700">LPWAN v3.1</span>
             <span className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded border border-slate-700">Role: {role === 'manager' ? 'Admin' : 'Staff'}</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Access Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('maintenance')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  role === 'maintenance' 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <UserCheck size={18} />
                <span className="text-sm font-medium">维修人员</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  role === 'manager' 
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <Shield size={18} />
                <span className="text-sm font-medium">管理人员</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator ID</label>
            <input 
              type="text" 
              defaultValue="admin_01"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} />
            <span>Enter Monitoring System</span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-4">
            <p className="text-[10px] text-slate-600 mt-2">
                Authorized Personnel Only | Pilot Sector A
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
