import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  Menu,
  X,
  AlertTriangle,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';

export function Navbar() {
  const { user, isFarmer, isOwner, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Machinery', path: '/find-machinery' },
    { name: 'Rent Out Machinery', path: '/rent-machinery' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact Us', path: '/contact' },
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
                Smart Farm Machinery Rentals
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            {/* Emergency Broadcast Shortcut */}
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors animate-pulse"
              title="Request emergency farm machinery assistance"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>🚨 Emergency Request</span>
            </Link>

            {/* Dashboard / User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/50 transition-colors text-stone-800"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-600/30"
                  />
                  <div className="text-left leading-tight hidden sm:block">
                    <div className="text-xs font-bold text-stone-900 truncate max-w-[110px]">{user.name}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold capitalize flex items-center gap-1">
                      {isFarmer ? '👨‍🌾 Farmer' : '🚜 Owner'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-emerald-700 font-medium">{user.email}</p>
                    </div>

                    <Link
                      to={isFarmer ? '/farmer-dashboard' : '/owner-dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      {isFarmer ? 'Farmer Dashboard' : 'Owner Dashboard'}
                    </Link>

                    <Link
                      to="/find-machinery"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Search className="w-4 h-4 text-stone-500" />
                      Find Machinery
                    </Link>

                    <Link
                      to="/rent-machinery"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Tractor className="w-4 h-4 text-stone-500" />
                      List Machinery
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        switchRole(isFarmer ? 'owner' : 'farmer');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-stone-600 hover:bg-stone-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Switch to {isFarmer ? 'Machinery Owner Mode' : 'Farmer Mode'}
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-800 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  Login / Sign Up
                </Link>
                <Link
                  to="/find-machinery"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Primary CTA */}
            <Link
              to={isFarmer ? '/find-machinery' : '/rent-machinery'}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {isFarmer ? 'Book Machinery' : 'List Machinery'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/emergency"
              className="p-2 text-rose-700 bg-rose-50 rounded-lg border border-rose-200"
              title="Emergency"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 gap-1 pt-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
            <Link
              to={isFarmer ? '/farmer-dashboard' : '/owner-dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-sm border border-emerald-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              {isFarmer ? 'Farmer Dashboard' : 'Owner Dashboard'}
            </Link>

            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 font-semibold text-sm border border-rose-200"
            >
              <AlertTriangle className="w-4 h-4" />
              🚨 Emergency Machinery Broadcast
            </Link>

            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                Login / Switch
              </Link>
              <Link
                to="/find-machinery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
