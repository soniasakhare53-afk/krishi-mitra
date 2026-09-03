import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
                <Tractor className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                KRISHI<span className="text-emerald-500">MITRA</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Connecting farmers with nearby agricultural machinery owners for transparent, affordable, and on-demand
              equipment rentals across rural India.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium bg-stone-800/80 px-3 py-1.5 rounded-lg w-fit border border-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Smart Matching & Verified Local Machinery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-machinery" className="hover:text-emerald-400 transition-colors">
                  Find Machinery
                </Link>
              </li>
              <li>
                <Link to="/rent-machinery" className="hover:text-emerald-400 transition-colors">
                  Rent Out Machinery
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-emerald-400 transition-colors">
                  Farmer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialized Modules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/emergency" className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1">
                  🚨 Emergency Machinery <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/farmer-dashboard" className="hover:text-emerald-400 transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner-dashboard" className="hover:text-emerald-400 transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-emerald-400 transition-colors">
                  Compare Machinery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Info</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nagpur Agri Innovation Hub, Maharashtra 440001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 1800-419-FARM (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@krishimitra.in</span>
              </li>
              <li>
                <Link to="/contact#faqs" className="text-emerald-400 hover:underline text-xs">
                  Read Frequently Asked Questions →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 KrishiMitra. AI-Powered Agricultural Technology Prototype. Designed for Indian Farmers.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-stone-400">
              Terms & Conditions
            </Link>
            <Link to="/about" className="hover:text-stone-400">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-stone-400">
              Help Center
            </Link>
            <span className="flex items-center gap-1 text-stone-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Agriculture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
