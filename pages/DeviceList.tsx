import React, { useState } from 'react';
import { MOCK_DATA_LIST, generateTrendData } from '../constants';
import { Device } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Battery, Signal, Eye, X, Disc } from 'lucide-react';

const DeviceList: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Filter or pagination logic could go here
  const devices = MOCK_DATA_LIST;

  const handleOpenDetail = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleCloseDetail = () => {
    setSelectedDevice(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
        <h3 className="font-semibold text-slate-200">LPWAN Sensor Registry</h3>
        <span className="text-xs text-slate-500 font-mono">Nodes: {devices.length}</span>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Device ID</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Type</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Water Level</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gas (CH4)</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cover Status</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Battery</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-mono text-sm text-slate-200">{device.id}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    device.type === 'DualMode' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {device.type}
                  </span>
                </td>
                <td className={`p-4 text-sm ${device.waterLevel > 100 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {device.waterLevel} <span className="text-slate-500 text-xs">cm</span>
                </td>
                <td className={`p-4 text-sm ${device.methane > 0.5 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {device.methane} <span className="text-slate-500 text-xs">%</span>
                </td>
                <td className={`p-4 text-sm ${device.tilt > 15 ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>
                  {device.tilt > 15 ? 'Open/Tilt' : 'Closed'} <span className="text-slate-500 text-xs">({device.tilt}°)</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                     <Battery size={14} className={device.voltage < 3.3 ? 'text-red-400' : 'text-green-400'} />
                     <span className="text-sm text-slate-300">{device.voltage}V</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleOpenDetail(device)}
                    className="text-xs bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 border border-slate-700 hover:border-blue-500 px-3 py-1.5 rounded transition-all flex items-center gap-2 ml-auto"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {selectedDevice.id}
                  <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${
                    selectedDevice.status === 'normal' ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-white'
                  }`}>
                    {selectedDevice.status}
                  </span>
                </h2>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-4">
                   <span className="flex items-center gap-1"><Signal size={14}/> {selectedDevice.type}</span>
                   <span>Last Report: {selectedDevice.lastUpdate}</span>
                </p>
              </div>
              <button 
                onClick={handleCloseDetail}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 space-y-8">
              {/* Current Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase">Water Level</div>
                    <div className={`text-2xl font-mono mt-1 ${selectedDevice.waterLevel > 100 ? 'text-red-400' : 'text-blue-400'}`}>
                      {selectedDevice.waterLevel}<span className="text-sm text-slate-500 ml-1">cm</span>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase">Methane</div>
                    <div className={`text-2xl font-mono mt-1 ${selectedDevice.methane > 0.5 ? 'text-red-400' : 'text-orange-400'}`}>
                      {selectedDevice.methane}<span className="text-sm text-slate-500 ml-1">%</span>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase">Manhole Cover</div>
                    <div className={`text-2xl font-mono mt-1 ${selectedDevice.tilt > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedDevice.tilt > 15 ? 'OPEN' : 'CLOSED'}
                      <span className="text-sm text-slate-500 ml-1">({selectedDevice.tilt}°)</span>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase">Voltage</div>
                    <div className="text-2xl font-mono mt-1 text-green-400">
                      {selectedDevice.voltage}<span className="text-sm text-slate-500 ml-1">V</span>
                    </div>
                 </div>
              </div>

              {/* Charts */}
              <div className="space-y-6">
                {/* Water Level Chart */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4">24H Water Level Trend (15min Interval)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateTrendData('water', selectedDevice.status)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                          itemStyle={{ color: '#60a5fa' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Methane Chart */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4">24H Methane Concentration</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateTrendData('methane', selectedDevice.status)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                          itemStyle={{ color: '#f97316' }}
                        />
                        <ReferenceLine y={0.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Warning (0.5)', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceLine y={1.25} stroke="#b91c1c" strokeDasharray="3 3" label={{ value: 'Alarm (1.25)', fill: '#b91c1c', fontSize: 10 }} />
                        <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;