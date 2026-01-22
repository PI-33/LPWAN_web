
import React, { useState } from 'react';
import { MOCK_DATA_LIST, generateTrendData } from '../constants';
import { Device } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Battery, Signal, Eye, X, Lock, Unlock, Edit, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';

const DeviceList: React.FC = () => {
  const { role } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', depth: '3.0' });
  const [devices, setDevices] = useState(MOCK_DATA_LIST);

  const handleOpenDetail = (device: Device) => {
    setSelectedDevice(device);
    setEditForm({ id: device.id, depth: '3.0' });
    setIsEditing(false);
  };

  const toggleLock = (deviceId: string) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, isLocked: !d.isLocked } : d));
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(prev => prev ? { ...prev, isLocked: !prev.isLocked } : null);
    }
  };

  const handleSaveParams = () => {
    setDevices(prev => prev.map(d => d.id === selectedDevice?.id ? { ...d, id: editForm.id } : d));
    setSelectedDevice(prev => prev ? { ...prev, id: editForm.id } : null);
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
        <h3 className="font-semibold text-slate-200">LPWAN Sensor Registry</h3>
        <span className="text-xs text-slate-500 font-mono">Total Nodes: {devices.length}</span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Device ID</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Lock Status</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Water Level</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gas (CH4)</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cover Status</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="p-4 font-mono text-sm text-slate-200">{device.id}</td>
                <td className="p-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    device.isLocked ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {device.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                    {device.isLocked ? 'Locked' : 'Released'}
                  </div>
                </td>
                <td className={`p-4 text-sm ${device.waterLevel > 100 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{device.waterLevel} cm</td>
                <td className={`p-4 text-sm ${device.methane > 0.5 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{device.methane} %</td>
                <td className={`p-4 text-sm ${device.tilt > 15 ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>{device.tilt > 15 ? 'Open/Tilt' : 'Closed'}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleOpenDetail(device)}
                    className="text-xs bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 border border-slate-700 px-3 py-1.5 rounded transition-all ml-auto flex items-center gap-1.5"
                  >
                    <Eye size={14} /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input 
                      className="bg-slate-800 border border-purple-500/50 rounded px-2 py-1 text-white font-mono"
                      value={editForm.id}
                      onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                    />
                    <button onClick={handleSaveParams} className="bg-purple-600 p-2 rounded text-white"><Save size={16}/></button>
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    {selectedDevice.id}
                    {role === 'manager' && (
                      <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-purple-400"><Edit size={16}/></button>
                    )}
                  </h2>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  selectedDevice.status === 'normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedDevice.status}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {role === 'manager' && (
                  <button 
                    onClick={() => toggleLock(selectedDevice.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedDevice.isLocked 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    }`}
                  >
                    {selectedDevice.isLocked ? <Unlock size={16}/> : <Lock size={16}/>}
                    {selectedDevice.isLocked ? 'Emergency Unlock' : 'Remote Lock'}
                  </button>
                )}
                <button onClick={() => setSelectedDevice(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X size={24} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-8">
              <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase mb-1">Electronic Lock</div>
                    <div className={`text-xl font-bold ${selectedDevice.isLocked ? 'text-green-400' : 'text-red-400 underline underline-offset-4'}`}>
                      {selectedDevice.isLocked ? 'SECURED' : 'UNLOCKED'}
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase mb-1">Water Level</div>
                    <div className="text-2xl font-mono text-blue-400">{selectedDevice.waterLevel}cm</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase mb-1">Deployment</div>
                    <div className="text-xl font-mono text-slate-300">Depth: {editForm.depth}m</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-500 text-xs uppercase mb-1">Battery</div>
                    <div className="text-2xl font-mono text-emerald-400 flex items-center gap-2">
                       <Battery size={20}/> {selectedDevice.voltage}V
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4">Uplink Telemetry (24H)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateTrendData('water', selectedDevice.status)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 10}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {role !== 'manager' && (
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[11px] text-blue-400 flex items-center gap-2">
                  <Eye size={14}/> Read-only session. Control functions are restricted to Management Personnel.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
