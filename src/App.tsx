import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shell } from './components/layout/Shell';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Role Homes
import { FarmerHome } from './pages/farmer/FarmerHome';
import { Treatments } from './pages/agronomist/treatments/Treatments';
import { Proposals } from './pages/agronomist/proposals/Proposals';

import { SystemHealth } from './pages/admin/health/SystemHealth';
import { Users } from './pages/admin/users/Users';
import { AdminProposals } from './pages/admin/proposals/AdminProposals';
import { AuditLogs } from './pages/admin/audit/AuditLogs';
import { ModelAccuracy } from './pages/admin/model/ModelAccuracy';

import { ScanProvider } from './context/ScanContext';
import { OfflineProvider } from './context/OfflineContext';

import { Scanner } from './pages/farmer/Scanner';
import { ScanResultView } from './pages/farmer/ScanResult';
import { History } from './pages/farmer/History';
import { Assistant } from './pages/farmer/assistant/Assistant';
import { Search } from './pages/farmer/search/Search';
import { Notifications } from './pages/farmer/notifications/Notifications';
import { Profile } from './pages/farmer/profile/Profile';

import { OfficerDashboard } from './pages/officer/dashboard/Dashboard';
import { Heatmap } from './pages/officer/heatmap/Heatmap';
import { Reports } from './pages/officer/reports/Reports';

import { ToastProvider } from './components/ui/Toast';
import { NotificationProvider } from './context/NotificationContext';
import { SystemProvider } from './context/SystemContext';

// Role Router
function RoleRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderRoleHome = () => {
    switch (user.role) {
      case 'farmer': 
        return (
          <Routes>
            <Route path="/" element={<FarmerHome />} />
            <Route path="scan" element={<Scanner />} />
            <Route path="scan/:id" element={<ScanResultView />} />
            <Route path="history" element={<History />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        );
      case 'officer': 
        return (
          <Routes>
            <Route path="/" element={<OfficerDashboard />} />
            <Route path="heatmap" element={<Heatmap />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        );
      case 'agronomist': 
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/app/treatments" replace />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        );
      case 'admin': 
        return (
          <Routes>
            <Route path="/" element={<SystemHealth />} />
            <Route path="users" element={<Users />} />
            <Route path="proposals" element={<AdminProposals />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="model" element={<ModelAccuracy />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        );
      default: return <Navigate to="/login" replace />;
    }
  };

  return <Shell>{renderRoleHome()}</Shell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes (Shell handles navigation) */}
                <Route path="/app/*" element={
                  <SystemProvider>
                    <NotificationProvider>
                      <ScanProvider>
                        <OfflineProvider>
                          <RoleRouter />
                        </OfflineProvider>
                      </ScanProvider>
                    </NotificationProvider>
                  </SystemProvider>
                } />
                <Route path="/" element={<Navigate to="/app" replace />} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
