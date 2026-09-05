import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Tractor,
  Menu,
  X,
  AlertTriangle,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Search,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isFarmer, isOwner, logout, switchRole } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.findMachinery', 'Find Machinery'), path: '/find-machinery' },
    { name: t('nav.aiMatch', 'AI Match'), path: '/ai-match' },
    { name: t('nav.rentMachinery', 'Rent Out Machinery'), path: '/rent-machinery' },
    { name: t('nav.howItWorks', 'How It Works'), path: '/how-it-works' },
    { name: t('nav.aboutUs', 'About Us'), path: '/about' },
    { name: t('nav.reviews', 'Reviews'), path: '/reviews' },
    { name: t('nav.contactUs', 'Contact Us'), path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-emerald-950 flex items-center gap-1">
                KRISHI<span className="text-emerald-700">MITRA</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded ml-1 border border-emerald-200">
                  AgTech
                </span>
              </div>
              <div className="text-[10px] text-stone-500 font-medium tracking-wide -mt-1 hidden sm:block">
                {t('home.heroBadge', 'Smart Farm Machinery Rentals')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-bold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Medium screen navigation subset */}
          <div className="hidden lg:flex xl:hidden items-center gap-1">
            {navLinks.slice(0, 5).map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-bold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="header" />

            {/* Emergency Broadcast Shortcut */}
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl transition-colors"
              title={t('nav.emergencyBroadcast', 'Emergency Machinery Request')}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden xl:inline">{t('nav.emergencyBroadcast', 'Emergency Request')}</span>
              <span className="xl:hidden">🚨 {t('emergency.title', 'Emergency')}</span>
            </Link>

            {/* Dashboard / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/50 transition-colors text-stone-800 cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-600/30"
                  />
                  <div className="text-left leading-tight hidden sm:block">
                    <div className="text-xs font-bold text-stone-900 truncate max-w-[100px]">{user.name}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold capitalize flex items-center gap-1">
                      {isFarmer ? `👨‍🌾 ${t('reviews.roleFarmer', 'Farmer')}` : `🚜 ${t('reviews.roleOwner', 'Owner')}`}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-[10px] uppercase font-bold text-stone-400">{t('nav.profile', 'Account Profile')}</p>
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-emerald-700 font-medium">{user.email}</p>
                    </div>

                    <Link
                      to={isFarmer ? '/farmer-dashboard' : '/owner-dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      {isFarmer ? t('nav.farmerDashboard', 'Farmer Dashboard') : t('nav.ownerDashboard', 'Owner Dashboard')}
                    </Link>

                    <Link
                      to="/find-machinery"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold"
                    >
                      <Search className="w-4 h-4 text-stone-500" />
                      {t('nav.findMachinery', 'Find Machinery')}
                    </Link>

                    <Link
                      to="/rent-machinery"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold"
                    >
                      <Tractor className="w-4 h-4 text-stone-500" />
                      {t('nav.rentMachinery', 'Rent Out Machinery')}
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        switchRole(isFarmer ? 'owner' : 'farmer');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-stone-600 hover:bg-stone-50 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isFarmer ? `Switch to ${t('reviews.roleOwner', 'Owner Mode')}` : `Switch to ${t('reviews.roleFarmer', 'Farmer Mode')}`}
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav.logout', 'Sign Out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-emerald-800 hover:bg-stone-50 rounded-xl transition-colors"
                >
                  {t('login.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
                >
                  {t('login.continueAsDemo', 'Demo Access')}
                </Link>
              </div>
            )}

            {/* Primary CTA */}
            <Link
              to={isFarmer ? '/find-machinery' : '/rent-machinery'}
              className="px-3.5 py-2 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 shrink-0"
            >
              {isFarmer ? t('card.bookNow', 'Book Machinery') : t('nav.rentMachinery', 'List Machinery')}
            </Link>
          </div>

          {/* Mobile Menu & Language Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector variant="header" />

            <Link
              to="/emergency"
              className="p-2 text-rose-700 bg-rose-50 rounded-xl border border-rose-200"
              title={t('emergency.title', 'Emergency')}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Language Selector */}
          <LanguageSelector variant="mobile" />

          <div className="grid grid-cols-1 gap-1 pt-1 border-t border-stone-100">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-bold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
            <Link
              to={isFarmer ? '/farmer-dashboard' : '/owner-dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              {isFarmer ? t('nav.farmerDashboard', 'Farmer Dashboard') : t('nav.ownerDashboard', 'Owner Dashboard')}
            </Link>

            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200"
            >
              <AlertTriangle className="w-4 h-4" />
              🚨 {t('nav.emergencyBroadcast', 'Emergency Request')}
            </Link>

            <div className="pt-1">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                    <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{isFarmer ? '👨‍🌾 Farmer' : '🚜 Owner'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('nav.logout', 'Sign Out')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50"
                  >
                    {t('login.signIn', 'Sign In')}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 shadow-sm"
                  >
                    {t('login.continueAsDemo', 'Demo Access')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
