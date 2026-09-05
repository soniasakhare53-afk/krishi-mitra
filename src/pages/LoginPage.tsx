import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tractor, User, ShieldCheck, ArrowRight, Lock, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'owner'>('farmer');

  const redirectPath = (location.state as any)?.from?.pathname || (selectedRole === 'farmer' ? '/farmer-dashboard' : '/owner-dashboard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    showToast(
      isSignUp ? t('auth.accountCreated', 'Account created successfully!') : t('auth.loginSuccess', 'Welcome back to KrishiMitra!'),
      '',
      'success'
    );
    navigate(redirectPath);
  };

  const handleDemoLogin = (role: 'farmer' | 'owner') => {
    login(role);
    showToast(`${t('auth.demoLoggedIn', 'Logged in as')} ${role === 'farmer' ? t('reviews.roleFarmer', 'Farmer') : t('reviews.roleOwner', 'Machinery Owner')}`, '', 'success');
    navigate(role === 'farmer' ? '/farmer-dashboard' : '/owner-dashboard');
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800 text-white shadow-md mb-2">
            <Tractor className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {isSignUp ? t('auth.createAccount', 'Create Account') : t('auth.welcome', 'Welcome to KrishiMitra')}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">
            {t('auth.subtitle', 'Access affordable farm machinery whenever you need it.')}
          </p>
        </div>

        {/* Demo User Quick Access Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-amber-900 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>{t('auth.demoQuickAccess', 'Quick Demo Access (1-Click Login)')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100 text-emerald-900 border border-amber-300 font-black text-xs transition-all shadow-2xs cursor-pointer text-center"
            >
              🌾 {t('reviews.roleFarmer', 'Farmer Demo')}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('owner')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100 text-stone-900 border border-amber-300 font-black text-xs transition-all shadow-2xs cursor-pointer text-center"
            >
              🚜 {t('reviews.roleOwner', 'Owner Demo')}
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          {/* Role selector for signup */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
              {t('reviews.role', 'Select Role')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedRole === 'farmer'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                🌾 {t('reviews.roleFarmer', 'Farmer')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedRole === 'owner'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                🚜 {t('reviews.roleOwner', 'Machinery Owner')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('auth.identifier', 'Email / Mobile Number')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. +91 98230 45612 / farmer@gmail.com"
                  className="w-full text-sm pl-9 pr-3 p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {t('auth.password', 'Password')} *
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => showToast(t('auth.demoPassToast', 'For demo access, any password works or use 1-click login above.'), '', 'info')}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold"
                  >
                    {t('auth.forgotPassword', 'Forgot Password?')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-9 pr-3 p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSignUp ? t('auth.createAccount', 'Create Account') : t('nav.signIn', 'Sign In')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-stone-600">
            {isSignUp ? (
              <span>
                {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  {t('nav.signIn', 'Sign In')}
                </button>
              </span>
            ) : (
              <span>
                {t('auth.newToKrishi', 'New to KrishiMitra?')}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  {t('auth.createAccount', 'Create Account')}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
