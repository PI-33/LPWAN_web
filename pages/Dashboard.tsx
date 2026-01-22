
import React, { useMemo, useState } from 'react';
import { MOCK_DATA_LIST } from '../constants';
import MapVisualization from '../components/MapVisualization';
import { AlertTriangle, Zap, Wifi, Disc, Settings, Save, Clock, Sun, CloudRain, Cloud, Zap as Storm, BrainCircuit, RefreshCw } from 'lucide-react';
import { KPIStats } from '../types';
import { useAuth } from '../AuthContext';
import { useSystem } from '../SystemContext';

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  const { weather, reportingCycle, isAutoMode, setReportingCycle, setIsAutoMode } = useSystem();
  const [isUpdating, setIsUpdating] = useState(false);

  const stats: KPIStats = useMemo(() => {
    const totalDevices = MOCK_DATA_LIST.length;
    const alarmCount = MOCK_DATA_LIST.filter(d => d.status !== 'normal').length;
    const voltageSum = MOCK_DATA_LIST.reduce((acc, curr) => acc + curr.voltage, 0);
    const avgVoltage = (voltageSum / totalDevices).toFixed(2);
    return { totalDevices, alarmCount, onlineRate: '99.2%', avgVoltage };
  }, []);

  const alerts = useMemo(() => {
    return MOCK_DATA_LIST.filter(d => d.status !== 'normal');
  }, []);

  const handleManualApply = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1000);
  };

  const WeatherIcon = () => {
    switch(weather.type) {
      case 'sunny': return <Sun className="text-yellow-400 animate-pulse" size={24} />;
      case 'rainy': return <CloudRain className="text-blue-400 animate-bounce" size={24} />;
      case 'storm': return <Storm className="text-purple-400 animate-pulse" size={24} />;
      default: return <Cloud className="text-slate-400" size={24} />;
    }
  };

  const KPICard = ({ title, value, unit, icon, colorClass, subText }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-start justify-between hover:border-slate-700 transition-colors">
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
          <span className="text-slate-500 text-xs">{unit}</span>
        </div>
        {subText && <p className="text-xs text-slate-500 mt-2">{subText}</p>}
      </div>
      <div className={`p-2.5 rounded-lg bg-slate-800 ${colorClass.replace('text', 'text-opacity-80')}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Deployed Sensors" value={stats.totalDevices} unit="Nodes" icon={<Disc size={20} className="text-blue-400" />} colorClass="text-white" subText="Underground 3m Depth" />
        <KPICard title="Packet Delivery" value={stats.onlineRate} unit="" icon={<Wifi size={20} className="text-emerald-400" />} colorClass="text-emerald-500" subText="Loss < 5% (Target Met)" />
        <KPICard title="Active Alarms" value={stats.alarmCount} unit="Events" icon={<AlertTriangle size={20} className="text-red-400" />} colorClass="text-red-500" subText="Event-Driven Reporting" />
        <KPICard title="Est. Battery Life" value="> 3" unit="Years" icon={<Zap size={20} className="text-yellow-400" />} colorClass="text-yellow-500" subText={`Avg Voltage: ${stats.avgVoltage}V`} />
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-[3] bg-slate-900 rounded-xl border border-slate-800 p-1 flex flex-col relative">
           <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded text-xs font-mono text-slate-400 border border-slate-800 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               {reportingCycle} MIN INTERVAL
             </div>
             <div className={`bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded text-xs font-mono border border-slate-800 flex items-center gap-2 ${isAutoMode ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-500'}`}>
               <BrainCircuit size={14}/>
               {isAutoMode ? 'AI OPTIMIZATION ACTIVE' : 'MANUAL OVERRIDE'}
             </div>
           </div>
           <MapVisualization devices={MOCK_DATA_LIST} />
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
          {/* Weather & Smart Sync Panel */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5">
               <RefreshCw size={100} className="animate-spin-slow" />
             </div>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Environment API</h3>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                   <RefreshCw size={10} className="animate-spin" />
                   LIVE SYNC
                </span>
             </div>
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <WeatherIcon />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{weather.label}</div>
                  <div className="text-xs text-slate-500">{weather.temp}°C | Humidity: {weather.humidity}%</div>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 uppercase">Target Frequency</span>
                  <span className="text-blue-400 font-mono">{weather.suggestedCycle}m</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${(1 / weather.suggestedCycle) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  System cycle is dynamically optimized based on real-time precipitation sensors and cloud-based weather forecasts.
                </p>
             </div>
          </div>

          {/* System Control Panel */}
          <div className={`bg-slate-900 rounded-xl border p-4 transition-all duration-500 ${role === 'manager' ? 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold flex items-center gap-2 ${role === 'manager' ? 'text-purple-400' : 'text-slate-300'}`}>
                <Settings size={16} />
                Control & Config
              </h3>
              {role === 'manager' && (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isAutoMode} onChange={(e) => setIsAutoMode(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2 uppercase tracking-tighter">
                  {isAutoMode ? 'Auto-Cycle (Read Only)' : 'Manual Reporting Cycle'}
                </label>
                <select 
                  value={reportingCycle} 
                  disabled={isAutoMode || role !== 'manager'}
                  onChange={(e) => setReportingCycle(Number(e.target.value))}
                  className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all ${
                    isAutoMode ? 'border-slate-800 opacity-50' : 'border-slate-700 focus:ring-1 focus:ring-purple-500'
                  }`}
                >
                  <option value={5}>5m (Emergency)</option>
                  <option value={15}>15m (Standard)</option>
                  <option value={30}>30m (Economy)</option>
                  <option value={60}>60m (Deep Sleep)</option>
                </select>
              </div>
              
              {role === 'manager' && !isAutoMode && (
                <button 
                  onClick={handleManualApply}
                  disabled={isUpdating}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isUpdating ? <Clock size={16} className="animate-spin" /> : <Save size={16} />}
                  Synchronize Manual Config
                </button>
              )}

              {role !== 'manager' && (
                <div className="text-[10px] text-slate-500 bg-slate-800/50 p-2 rounded flex items-center gap-2">
                  <BrainCircuit size={12} className="text-blue-400"/>
                  Mode managed by System Admin or Weather Engine.
                </div>
              )}
            </div>
          </div>

          {/* Alert Feed */}
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
                Exception Log
              </h3>
              <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-tighter">{alerts.length} PENDING</span>
            </div>
            
            <div className="flex-1 overflow-auto p-2 space-y-2">
              {alerts.length === 0 ? (
                <div className="text-center text-slate-600 py-8 text-xs font-mono uppercase">All Channels Clear</div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className="bg-slate-800/30 border-l-2 border-red-500/50 p-2.5 rounded-r transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono text-slate-500">{alert.lastUpdate.split(' ')[1]}</span>
                      <span className="text-[10px] font-bold text-slate-300">{alert.id}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {alert.waterLevel > 100 && <span className="text-red-400/80 mr-2 underline decoration-red-900 underline-offset-2">Lvl: {alert.waterLevel}cm</span>}
                      {alert.methane > 0.5 && <span className="text-orange-400/80 underline decoration-orange-900 underline-offset-2">Gas: {alert.methane}%</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
