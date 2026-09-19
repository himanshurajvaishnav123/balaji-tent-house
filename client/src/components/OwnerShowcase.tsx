import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const OwnerShowcase: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section id="owner" className="py-20 bg-gradient-to-b from-[#fcf8f6] to-[#f4ece9] relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gold-400/30 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Owner Photo Side */}
            <div className="lg:col-span-5 relative bg-gradient-to-b from-maroon-900 to-maroon-950 p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="relative">
                {/* Gold glowing frame */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-4 border-gold-400 shadow-gold-glow relative z-10 bg-maroon-950">
                  <img
                    src={
                      settings.ownerPhotoUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
                    }
                    alt={settings.ownerName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-maroon-950 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                  Founder & Proprietor
                </div>
              </div>

              <h3 className="mt-7 font-serif-royal text-2xl sm:text-3xl font-bold text-white">
                {settings.ownerName}
              </h3>
              <p className="text-gold-300 text-sm font-medium mt-1">
                Owner • Balaji Tent House, Bijoliya
              </p>

              <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {settings.ownerName}</span>
                </a>
              </div>
            </div>

            {/* About & Trust Details Side */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14">
              <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-200 px-3.5 py-1 rounded-full text-maroon-800 text-xs font-bold uppercase tracking-wider mb-4">
                <HeartHandshake className="w-4 h-4 text-maroon-700" />
                <span>Our Heritage of Trust</span>
              </div>

              <h2 className="font-serif-royal text-2xl sm:text-4xl font-extrabold text-maroon-950 leading-snug">
                "Hamara Lakshya: Aapke Har Utsav Ko Yaadgar Aur Nirvighna Banana"
              </h2>

              <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                {settings.aboutText}
              </p>

              {/* Core Commitments */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-maroon-50/60 border border-maroon-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-maroon-950 text-sm">Punctual Delivery</h5>
                    <p className="text-xs text-slate-600">Setup completed 12+ hours before your event commences.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gold-50/60 border border-gold-200">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-maroon-950 text-sm">Clean & Hygienic Utensils</h5>
                    <p className="text-xs text-slate-600">Pure sparkling Bhagone, Chamach, and Bhati for feast cooking.</p>
                  </div>
                </div>
              </div>

              {/* Physical Office Address */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-900 text-gold-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Office & Warehouse Location</h6>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {settings.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
