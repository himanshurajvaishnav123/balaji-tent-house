import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminLoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  if (user) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message || 'Invalid credentials or server unavailable.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#240404] via-[#450808] to-[#1a0202] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to website button */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gold-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Balaji Tent House</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#2d0707]/90 backdrop-blur-xl border border-gold-500/40 rounded-3xl p-8 shadow-festive relative z-10">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 mx-auto flex items-center justify-center text-maroon-950 shadow-gold-glow mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-black text-white">
            Admin Portal
          </h1>
          <p className="text-xs text-gold-300 mt-1">
            {settings.businessName} • Secure Control Center
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gold-200 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-maroon-950/70 border border-gold-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gold-200 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-maroon-950/70 border border-gold-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-gold-glow transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin mr-2">⟳</span>
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold-500/20 text-center">
          <p className="text-[11px] text-slate-400">
            Authorized administrator access only. All sessions are encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};
