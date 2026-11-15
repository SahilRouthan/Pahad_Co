import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api, setAuthToken } from '../../utils/api';
import { isSupabaseConfigured } from '../../utils/supabase';
import { MountainLogo } from '../common/MountainLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite
}) => {
  const [username, setUsername] = useState('admin@pahad.co');
  const [password, setPassword] = useState('PahadAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username/email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.admin.login(username.trim(), password);
      if (res.success && res.token) {
        setAuthToken(res.token);
        onLoginSuccess(res.admin);
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or unauthorized account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pahad-mesh bg-[#FFF0E1] dark:bg-[#062F26] text-[#202522] dark:text-[#FFF3E5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Top action row */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-pahad-green dark:text-[#FFF3E5] hover:text-pahad-green-light dark:hover:text-[#D9B477] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <MountainLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pahad-green/10 dark:bg-[#0B4636] text-pahad-green dark:text-[#D9B477] text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-pahad-gold-dark dark:text-[#D9B477]" />
          <span>Management Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5]">
          Administrative Portal
        </h2>
        <p className="mt-1 text-xs text-pahad-charcoal/70 dark:text-[#E8DFD3]/80">
          Sign in to manage client inquiries, review approvals, feedback, and gallery portfolio.
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white dark:bg-[#083D30] border border-[#D9BB87]/50 dark:border-[#D9B477]/30 text-pahad-charcoal/80 dark:text-[#E8DFD3]">
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isSupabaseConfigured() ? 'Supabase Authentication & PostgreSQL' : 'Local Authentication Mode'}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-[#0B4636] py-8 px-6 sm:px-10 rounded-3xl shadow-premium border border-[#D9BB87]/50 dark:border-[#D9B477]/30">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#FFF3E5] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-pahad-charcoal/40 dark:text-[#FFF3E5]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@pahad.co"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 focus:border-pahad-green dark:focus:border-[#D9B477] text-sm bg-[#FBF6F0]/50 dark:bg-[#083D30]/80 text-[#202522] dark:text-[#FFF3E5] placeholder:text-pahad-charcoal/40 dark:placeholder:text-[#FFF3E5]/40 focus:outline-none focus:ring-2 focus:ring-pahad-green/30 dark:focus:ring-pahad-gold/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#FFF3E5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pahad-charcoal/40 dark:text-[#FFF3E5]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 focus:border-pahad-green dark:focus:border-[#D9B477] text-sm bg-[#FBF6F0]/50 dark:bg-[#083D30]/80 text-[#202522] dark:text-[#FFF3E5] placeholder:text-pahad-charcoal/40 dark:placeholder:text-[#FFF3E5]/40 focus:outline-none focus:ring-2 focus:ring-pahad-green/30 dark:focus:ring-pahad-gold/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-pahad-green dark:bg-[#0B6B50] text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover dark:hover:bg-[#108765] transition-colors shadow-subtle disabled:opacity-70 focus:outline-none"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          {/* Seed Credentials Hint */}
          <div className="mt-6 pt-4 border-t border-[#D9BB87]/30 dark:border-[#D9B477]/20 text-center">
            <span className="text-[11px] font-medium text-pahad-charcoal/60 dark:text-[#A3B5A2] block mb-1">
              Default Admin Account:
            </span>
            <div className="inline-block bg-[#FBF6F0] dark:bg-[#083D30] px-3 py-1.5 rounded-lg border border-[#D9BB87]/40 dark:border-[#D9B477]/30 text-[11px] text-pahad-green dark:text-[#D9B477] font-mono">
              Email: <span className="font-bold">admin@pahad.co</span> | Pass: <span className="font-bold">PahadAdmin@2026</span>
            </div>
            <p className="mt-2 text-[10px] text-pahad-charcoal/60 dark:text-[#A3B5A2]">
              Run <code className="text-pahad-green dark:text-[#D9B477] font-semibold">supabase/fix_admin_account.sql</code> in your Supabase SQL Editor to provision or repair this account instantly.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
