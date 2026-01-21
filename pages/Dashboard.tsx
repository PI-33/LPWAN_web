import React, { useMemo } from 'react';
import { MOCK_DATA_LIST } from '../constants';
import MapVisualization from '../components/MapVisualization';
import { AlertTriangle, Zap, Wifi, Activity, Droplets, Flame, Disc } from 'lucide-react';
import { KPIStats } from '../types';

const Dashboard: React.FC = () => {
  // Calculate KPI Stats on the fly
  const stats: KPIStats = useMemo(() => {
    const totalDevices = MOCK_DATA_LIST.length;
    const alarmCount = MOCK_DATA_LIST.filter(d => d.status !== 'normal').length;
    // Mocking voltage calculation to simulate project target
    const voltageSum = MOCK_DATA_LIST.reduce((acc, curr) => acc + curr.voltage, 0);
    const avgVoltage = (voltageSum / totalDevices).toFixed(2);
    
    return {
      totalDevices,
      alarmCount,
      onlineRate: '99.2%', // Target > 95%
      avgVoltage
    };
  }, []);

  const alerts = useMemo(() => {
    return MOCK_DATA_LIST.filter(d => d.status !== 'normal');
  }, []);

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
      {/* KPI Section - Aligned with Project Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Deployed Sensors" 
          value={stats.totalDevices} 
          unit="Nodes" 
          icon={<Disc size={20} className="text-blue-400" />} 
          colorClass="text-white"
          subText="Underground 3m Depth"
        />
        <KPICard 
          title="Packet Delivery" 
          value={stats.onlineRate} 
          unit="" 
          icon={<Wifi size={20} className="text-emerald-400" />} 
          colorClass="text-emerald-500"
          subText="Loss < 5% (Target Met)"
        />
        <KPICard 
          title="Active Alarms" 
          value={stats.alarmCount} 
          unit="Events" 
          icon={<AlertTriangle size={20} className="text-red-400" />} 
          colorClass="text-red-500"
          subText="Event-Driven Reporting"
        />
        <KPICard 
          title="Est. Battery Life" 
          value="> 3" 
          unit="Years" 
          icon={<Zap size={20} className="text-yellow-400" />} 
          colorClass="text-yellow-500"
          subText={`Avg Voltage: ${stats.avgVoltage}V`}
        />
      </div>

      {/* Main Content Split: Map (Left) & Alert List (Right) */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Container */}
        <div className="flex-[3] bg-slate-900 rounded-xl border border-slate-800 p-1 flex flex-col relative">
           <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded text-xs font-mono text-slate-400 border border-slate-800 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             LIVE MONITORING • 15 MIN INTERVAL
           </div>
           <MapVisualization devices={MOCK_DATA_LIST} />
        </div>

        {/* Real-time Alerts Panel */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Exception Feed
            </h3>
            <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full font-mono">{alerts.length} Active</span>
          </div>
          
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center text-slate-500 py-10 text-sm">
                System Normal<br/>
                <span className="text-xs opacity-50">Next scheduled report in 12m</span>
              </div>
            ) : (
              alerts.map((alert, idx) => {
                const isWater = alert.waterLevel > 100;
                const isMethane = alert.methane > 0.5;
                const isTilt = alert.tilt > 15;
                
                return (
                  <div key={idx} className="bg-slate-800/50 hover:bg-slate-800 border-l-2 border-red-500 p-3 rounded-r-lg transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-slate-400">{alert.lastUpdate.split(' ')[1]}</span>
                      <span className="text-xs font-bold text-slate-200">{alert.id}</span>
                    </div>
                    <div className="space-y-1">
                      {isWater && (
                        <div className="flex items-center gap-2 text-red-400 text-xs">
                          <Droplets size={12} />
                          <span>High Water Level ({alert.waterLevel}cm)</span>
                        </div>
                      )}
                      {isMethane && (
                        <div className="flex items-center gap-2 text-orange-400 text-xs">
                          <Flame size={12} />
                          <span>Methane Gas ({alert.methane}%)</span>
                        </div>
                      )}
                      {isTilt && (
                         <div className="flex items-center gap-2 text-yellow-400 text-xs">
                           <Disc size={12} />
                           <span>Manhole Cover Open ({alert.tilt}°)</span>
                         </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;