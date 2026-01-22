
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import Layout from './components/Layout';
import { AuthProvider } from './AuthContext';
import { SystemProvider } from './SystemContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SystemProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="devices" element={<DeviceList />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </SystemProvider>
    </AuthProvider>
  );
};

export default App;
