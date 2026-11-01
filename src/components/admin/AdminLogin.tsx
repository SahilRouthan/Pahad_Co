import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api, setAuthToken } from '../../utils/api';
import { MountainLogo } from '../common/MountainLogo';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('PahadAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
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
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pahad-mesh bg-[#FFF0E1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-pahad-green hover:text-pahad-green-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <MountainLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pahad-green/10 text-pahad-green text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-pahad-gold-dark" />
          <span>Management Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">
          Administrative Portal
        </h2>
        <p className="mt-1 text-xs text-pahad-charcoal/70">
          Sign in to manage client inquiries, review approvals, feedback, and gallery portfolio.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-premium border border-[#D9BB87]/50">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-pahad-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm bg-[#FBF6F0]/50 focus:outline-none focus:ring-2 focus:ring-pahad-green/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pahad-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm bg-[#FBF6F0]/50 focus:outline-none focus:ring-2 focus:ring-pahad-green/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover transition-colors shadow-subtle disabled:opacity-70 focus:outline-none"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          {/* Seed Credentials Hint */}
          <div className="mt-6 pt-4 border-t border-[#D9BB87]/30 text-center">
            <span className="text-[11px] font-medium text-pahad-charcoal/60 block mb-1">
              Default Configured Credentials:
            </span>
            <div className="inline-block bg-[#FBF6F0] px-3 py-1.5 rounded-lg border border-[#D9BB87]/40 text-[11px] text-pahad-green font-mono">
              User: <span className="font-bold">admin</span> | Pass: <span className="font-bold">PahadAdmin@2026</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
