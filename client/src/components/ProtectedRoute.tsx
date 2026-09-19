import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2b0707] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gold-200 font-serif-royal text-base tracking-wider">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
