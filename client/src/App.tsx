import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            {/* Public Home Landing Page */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Control Panel */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
