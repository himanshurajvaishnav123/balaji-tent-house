import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Tent, Shield, Sparkles, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer id="contact" className="bg-[#1f0505] text-slate-300 border-t-2 border-gold-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400 text-maroon-950 flex items-center justify-center font-bold shadow-gold-glow">
                <Tent className="w-6 h-6" />
              </div>
              <span className="font-serif-royal text-xl font-black text-white tracking-wide">
                {settings.businessName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Led by {settings.ownerName}. Your dependable event partner in Bijoliya for majestic wedding shamianas, all-weather monsoon waterproof pavilions, and complete catering cookware rental.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-maroon-900 border border-gold-500/30 text-gold-300 text-xs px-3 py-1 rounded-full">
                ★ 15+ Years of Local Trust
              </span>
            </div>
          </div>

          {/* Col 2: Core Offerings */}
          <div>
            <h4 className="font-serif-royal text-lg font-bold text-gold-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Our Specialties</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#services" className="hover:text-gold-300 transition-colors">
                  • Royal Wedding Mandap & Entry Gate
                </a>
              </li>
              <li>
                <a href="#waterproof" className="hover:text-gold-300 transition-colors">
                  • Barsat Ke Waterproof Tents (German Hangar)
                </a>
              </li>
              <li>
                <a href="#utensils" className="hover:text-gold-300 transition-colors">
                  • Halwai Utensils: Bhagone, Kadai, Bhati
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-300 transition-colors">
                  • Sangeet Stage & Ambient Lighting
                </a>
              </li>
              <li>
                <a href="#utensils" className="hover:text-gold-300 transition-colors">
                  • 200L Water Drums & Chaffing Sets
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h4 className="font-serif-royal text-lg font-bold text-gold-300 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Visit / Contact Us</span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-semibold text-gold-200">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-200 underline underline-offset-4"
                >
                  <span>Open in Google Maps →</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Action & Admin Link */}
          <div className="space-y-4">
            <h4 className="font-serif-royal text-lg font-bold text-gold-300 mb-4">
              Direct Booking
            </h4>
            <p className="text-xs text-slate-400">
              Need urgent tent or utensils delivery in Bijoliya or nearby villages? Call us anytime.
            </p>
            <a
              href={`tel:${settings.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {settings.phone}</span>
            </a>

            <div className="pt-4 border-t border-maroon-900">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-gold-400 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff & Admin Control Panel</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved. Bijoliya, Bhilwara (Rajasthan).</p>
          <p className="flex items-center gap-1">
            <span>Proprietor:</span>
            <strong className="text-gold-300 font-semibold">{settings.ownerName}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
