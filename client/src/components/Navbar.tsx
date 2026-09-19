import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Shield, Sparkles, Tent, LayoutDashboard } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onBookClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookClick }) => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/#' },
    { name: 'Services', href: '/#services' },
    { name: 'Waterproof Tents', href: '/#waterproof' },
    { name: 'Utensils Rental', href: '/#utensils' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'About Owner', href: '/#owner' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#340e0e] border-b border-gold-500/30 shadow-festive transition-all duration-300">
      {/* Top mini-bar for Bijoliya local recognition */}
      <div className="bg-[#200707] text-gold-300 text-xs py-1 px-4 border-b border-gold-500/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Serving Bijoliya, Bhilwara & Surrounding Regions (15+ Years)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Owner: <strong className="text-gold-400">{settings.ownerName}</strong></span>
            <span>|</span>
            <a href={`tel:${settings.phone}`} className="hover:text-gold-200 transition-colors">
              Call Now: {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-25 gap-4">
          {/* Business Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.businessName}
                className="w-12 h-12 object-contain rounded-full border-2 border-gold-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 via-amber-500 to-amber-700 flex items-center justify-center text-maroon-950 font-bold shadow-gold-glow group-hover:scale-105 transition-transform">
                <Tent className="w-7 h-7 text-maroon-950" />
              </div>
            )}
            <div>
              <span className="font-serif-royal text-xl sm:text-2xl font-black text-white tracking-wide block group-hover:text-gold-300 transition-colors">
                {settings.businessName}
              </span>
              <span className="text-[11px] text-gold-400 font-medium tracking-wider uppercase block">
                Tent Setup • Monsoon Tents • Catering Utensils
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-200 hover:text-gold-400 text-sm font-semibold transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call & CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md transition-all transform hover:scale-105"
            >
              <Phone className="w-4 h-4 text-emerald-100" />
              <span>{settings.phone}</span>
            </a>

            {onBookClick ? (
              <button
                onClick={onBookClick}
                className="flex items-center gap-1.5 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-gold-glow transition-all transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Event</span>
              </button>
            ) : (
              <a
                href="#booking"
                className="flex items-center gap-1.5 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-gold-glow transition-all transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Event</span>
              </a>
            )}

            {user ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 text-gold-300 hover:text-white bg-maroon-800/80 hover:bg-maroon-800 border border-gold-500/40 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden xl:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-400 hover:text-gold-400 p-2 transition-colors"
                title="Admin Login"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${settings.phone}`}
              className="p-2 bg-emerald-600 text-white rounded-full sm:hidden"
              title="Call Now"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gold-400 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#2a0909] border-b border-gold-500/30 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-gold-400 hover:bg-maroon-900/50 rounded-lg transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-gold-500/20 flex flex-col gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {settings.phone}</span>
            </a>
            {onBookClick ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onBookClick();
                }}
                className="w-full bg-gradient-to-r from-gold-400 to-amber-500 text-maroon-950 font-bold py-2.5 rounded-lg text-sm shadow-gold-glow"
              >
                Book Your Event Now
              </button>
            ) : (
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="text-center w-full bg-gradient-to-r from-gold-400 to-amber-500 text-maroon-950 font-bold py-2.5 rounded-lg text-sm shadow-gold-glow"
              >
                Book Your Event Now
              </a>
            )}

            {user ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-center block text-gold-300 hover:text-white bg-maroon-900 border border-gold-500/30 py-2 rounded-lg text-sm"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="text-center block text-xs text-slate-400 hover:text-gold-300 py-1"
              >
                Admin Login Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
