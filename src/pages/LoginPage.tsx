import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Tractor,
  ShieldCheck,
  ArrowRight,
  Lock,
  Phone,
  Mail,
  User as UserIcon,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Clock,
  Zap,
  Wheat,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LanguageSelector } from '../components/LanguageSelector';

export function LoginPage() {
  const { t } = useLanguage();
  const { login, loginAsDemoFarmer, loginAsDemoOwner } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [villageLocation, setVillageLocation] = useState('');
  const [farmArea, setFarmArea] = useState('5');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'owner'>('farmer');

  // Interactive Demo Modal / Role Selector State
  const [showDemoRolePicker, setShowDemoRolePicker] = useState(false);

  const redirectPath = (location.state as any)?.from?.pathname;

  // Handle Standard Credentials Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      login(selectedRole, {
        name: fullName.trim() || (selectedRole === 'farmer' ? 'Sonia Sakhare' : 'Rajesh Patil'),
        phone: identifier.includes('@') ? '+91 98230 45612' : identifier,
        email: identifier.includes('@') ? identifier : `${selectedRole}@krishimitra.in`,
        location: villageLocation.trim() || 'Nagpur, Maharashtra',
        farmArea: selectedRole === 'farmer' ? Number(farmArea) || 5 : undefined,
      });

      showToast(
        t('login.signUpSuccess', 'Account created successfully! Welcome to KrishiMitra.'),
        `${selectedRole === 'farmer' ? '🌾 Farmer' : '🚜 Machinery Owner'}`,
        'success'
      );
    } else {
      login(selectedRole, {
        name: selectedRole === 'farmer' ? 'Sonia Sakhare' : 'Rajesh Patil',
      });

      showToast(
        t('login.signInSuccess', 'Signed in successfully! Welcome back.'),
        `${selectedRole === 'farmer' ? '🌾 Farmer' : '🚜 Machinery Owner'}`,
        'success'
      );
    }

    const destination = redirectPath || (selectedRole === 'farmer' ? '/farmer-dashboard' : '/owner-dashboard');
    navigate(destination);
  };

  // Handle 1-Click Demo User Flow
  const handleSelectDemoRole = (role: 'farmer' | 'owner') => {
    if (role === 'farmer') {
      loginAsDemoFarmer();
      showToast(
        t('login.demoFarmerToast', 'Demo Access: Signed in as Farmer (Sonia Sakhare)'),
        t('login.farmerRoleDesc', 'Search nearby machinery, run AI match & book rentals'),
        'success'
      );
      navigate('/farmer-dashboard');
    } else {
      loginAsDemoOwner();
      showToast(
        t('login.demoOwnerToast', 'Demo Access: Signed in as Machinery Owner (Rajesh Patil)'),
        t('login.ownerRoleDesc', 'List equipment, approve bookings & track rental income'),
        'success'
      );
      navigate('/owner-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 flex flex-col relative overflow-hidden">
      {/* Background Decorative Farm Landscape with subtle gradient overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000")',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-950 via-stone-900/90 to-emerald-950/80" />

      {/* Top Header Bar with KrishiMitra Branding & Global Language Selector */}
      <header className="relative z-20 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                KRISHI<span className="text-emerald-400">MITRA</span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  AgTech
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium hidden sm:block">
                {t('home.heroBadge', 'Smart Farm Machinery Rentals')}
              </p>
            </div>
          </Link>

          {/* Direct Language Switcher on Sign-In Screen */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-700/80 rounded-2xl p-1 shadow-sm">
              <LanguageSelector variant="header" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Farm Storytelling & Value Highlights (Visible on lg screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-white pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold backdrop-blur-sm self-start">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('login.brandPill', 'AI-Powered Agricultural Platform')}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-stone-100">
                {t('login.heroTitle', 'Smart Farm Machinery At Your Fingertips')}
              </h1>
              <p className="text-stone-300 text-sm xl:text-base leading-relaxed">
                {t(
                  'login.heroSubtitle',
                  'Connecting Indian farmers with trusted local tractor and machinery owners for fast, affordable, and AI-optimized farm operations.'
                )}
              </p>
            </div>

            {/* Visual Value Cards */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-600/40">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('login.badgeVerified', '100+ Verified Equipment')}</h4>
                  <p className="text-xs text-stone-400">Mahindra, John Deere, Swaraj, Kubota & JCB with trained operators</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-800/60 text-amber-300 flex items-center justify-center shrink-0 border border-amber-600/40">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Smart Match — Prototype</h4>
                  <p className="text-xs text-stone-400">
                    {t('login.badgeMatch', 'Weighted matching: 40% Availability, 25% Price, 20% Distance, 15% Reliability')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-900/60 text-rose-300 flex items-center justify-center shrink-0 border border-rose-600/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('login.badgeEmergency', '15-Minute Emergency Broadcast')}</h4>
                  <p className="text-xs text-stone-400">Urgent machinery dispatch during sudden rainfall or mechanical breakdown</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-stone-900/70 border border-emerald-800/50 backdrop-blur-sm text-xs">
              <p className="italic text-emerald-100 mb-1.5">
                {t(
                  'login.quote',
                  '“Booked a 55 HP tractor within 15 minutes during sudden rainfall. Saved our harvest.”'
                )}
              </p>
              <p className="font-bold text-amber-400">
                — {t('login.quoteAuthor', 'Ramesh Patil, Farmer, Wardha')}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Welcome & Sign-In Card */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/90 relative">
              {/* Card Header */}
              <div className="text-center space-y-1.5 mb-6">
                <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-emerald-800 text-white shadow-md mb-1">
                  <Tractor className="w-7 h-7 text-amber-300" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                  {isSignUp ? t('login.createAccount', 'Create Account') : t('login.welcome', 'Welcome to KrishiMitra')}
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm font-medium">
                  {t('login.tagline', 'Access affordable farm machinery whenever you need it.')}
                </p>
              </div>

              {/* HACKATHON DEMO USER ACCESS - PROMINENT SECTION */}
              <div className="mb-6 bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-300/90 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>HACKATHON EVALUATION / JUDGE DEMO</span>
                  </div>
                  <span className="text-[10px] uppercase font-black bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    1-Click
                  </span>
                </div>

                {!showDemoRolePicker ? (
                  <div>
                    <p className="text-xs text-stone-600 mb-3 font-medium">
                      No sign-up or credentials needed. Explore the complete interactive booking & owner journeys immediately:
                    </p>
                    <button
                      type="button"
                      id="continue-as-demo-user-btn"
                      onClick={() => setShowDemoRolePicker(true)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 hover:from-amber-600 hover:to-emerald-800 text-white font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                      <span>{t('login.continueAsDemo', 'Continue as Demo User')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-xs font-bold text-stone-800">
                      {t('login.demoRolePrompt', 'Select role to enter instant demo:')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Farmer Demo Option */}
                      <button
                        type="button"
                        id="demo-farmer-choice"
                        onClick={() => handleSelectDemoRole('farmer')}
                        className="p-3 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-500 hover:border-emerald-600 text-left transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">👨‍🌾</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              Recommended
                            </span>
                          </div>
                          <div className="text-xs font-black text-emerald-950 group-hover:text-emerald-800">
                            {t('login.continueAsFarmer', 'Continue as Farmer')}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1 font-medium leading-tight">
                            {t('login.farmerRoleDesc', 'Search nearby machinery, run AI match & book rentals')}
                          </div>
                        </div>
                        <div className="mt-2.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <span>Enter as Sonia Sakhare</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>

                      {/* Machinery Owner Demo Option */}
                      <button
                        type="button"
                        id="demo-owner-choice"
                        onClick={() => handleSelectDemoRole('owner')}
                        className="p-3 rounded-xl bg-white hover:bg-amber-50 border-2 border-amber-500 hover:border-amber-600 text-left transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">🚜</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                              Fleet Owner
                            </span>
                          </div>
                          <div className="text-xs font-black text-amber-950 group-hover:text-amber-800">
                            {t('login.continueAsOwner', 'Continue as Machinery Owner')}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1 font-medium leading-tight">
                            {t('login.ownerRoleDesc', 'List equipment, approve bookings & track rental income')}
                          </div>
                        </div>
                        <div className="mt-2.5 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          <span>Enter as Rajesh Patil</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDemoRolePicker(false)}
                      className="text-[11px] text-stone-500 hover:text-stone-800 underline font-medium block mx-auto pt-1 cursor-pointer"
                    >
                      {t('btn.close', 'Close')}
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
                  {t('login.orCredentials', 'Or sign in with credentials')}
                </span>
                <div className="border-t border-stone-200 w-full" />
              </div>

              {/* Standard Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Toggle for Login / Sign Up */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t('reviews.role', 'Select Role')} *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('farmer')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'farmer'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-600 ring-2 ring-emerald-600/30 font-black'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>👨‍🌾</span>
                      <span>{t('reviews.roleFarmer', 'Farmer')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('owner')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'owner'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-600 ring-2 ring-emerald-600/30 font-black'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>🚜</span>
                      <span>{t('reviews.roleOwner', 'Machinery Owner')}</span>
                    </button>
                  </div>
                </div>

                {/* Extended fields for Sign Up */}
                {isSignUp && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        {t('login.fullName', 'Full Name')} *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. Sonia Sakhare / Ramesh Patil"
                          className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          {t('login.location', 'Village / District Location')}
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={villageLocation}
                            onChange={e => setVillageLocation(e.target.value)}
                            placeholder="e.g. Nagpur"
                            className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {selectedRole === 'farmer' && (
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            {t('login.farmArea', 'Farm Land Area (Acres)')}
                          </label>
                          <div className="relative">
                            <Wheat className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={farmArea}
                              onChange={e => setFarmArea(e.target.value)}
                              placeholder="5"
                              className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Email / Mobile Number Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('login.emailOrPhone', 'Email / Mobile Number')} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      id="login-identifier-input"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="+91 98230 45612 / farmer@krishimitra.in"
                      className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      {t('login.password', 'Password')} *
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            t(
                              'auth.demoPassToast',
                              'For hackathon demo, click "Continue as Demo User" above or enter any password.'
                            ),
                            '',
                            'info'
                          )
                        }
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold hover:underline cursor-pointer"
                      >
                        {t('login.forgotPassword', 'Forgot Password?')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      id="login-password-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  id="submit-auth-btn"
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 group"
                >
                  <span>{isSignUp ? t('login.createAccount', 'Create Account') : t('login.signIn', 'Sign In')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Secondary Option: Toggle Create Account vs Sign In */}
              <div className="text-center pt-5 mt-2 border-t border-stone-100 text-xs text-stone-600">
                {isSignUp ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{t('login.alreadyHaveAccount', 'Already have an account?')}</span>
                    <button
                      type="button"
                      id="toggle-sign-in"
                      onClick={() => setIsSignUp(false)}
                      className="font-black text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                    >
                      {t('login.signIn', 'Sign In')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{t('login.newToKrishiMitra', 'New to KrishiMitra?')}</span>
                    <button
                      type="button"
                      id="toggle-create-account"
                      onClick={() => setIsSignUp(true)}
                      className="font-black text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                    >
                      {t('login.createAccount', 'Create Account')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer on Login Screen */}
      <footer className="relative z-10 py-4 text-center text-xs text-stone-400 border-t border-stone-800/80 bg-stone-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 KrishiMitra AgTech. All rights reserved.</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Smart Matching & Transparent Farm Machine Rentals
          </span>
        </div>
      </footer>
    </div>
  );
}
