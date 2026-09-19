import React from 'react';
import { motion } from 'framer-motion';
import { Phone, CalendarCheck, ShieldCheck, Award, MapPin, Sparkles, Utensils } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { settings } = useSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-maroon-950 text-white">
      {/* Background Banner with Maroon Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroBannerUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop'}
          alt="Balaji Tent House Setup"
          className="w-full h-full object-cover object-center scale-105 filter brightness-50 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a0707]/95 via-[#4a0a0a]/85 to-[#2a0707]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#200404] via-transparent to-transparent" />
      </div>

      {/* Decorative Traditional Pattern / Accent Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-800/25 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-maroon-900/90 border border-gold-400/50 px-4 py-1.5 rounded-full shadow-gold-glow mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-gold-200 uppercase">
            Bijoliya's Premier Event & Tent Specialist
          </span>
        </motion.div>

        {/* Dynamic Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif-royal text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto drop-shadow-lg"
        >
          {settings.heroTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed text-balance"
        >
          {settings.heroSubtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-4"
        >
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2.5 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold px-8 py-4 rounded-xl text-base sm:text-lg shadow-gold-glow hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <CalendarCheck className="w-5 h-5 text-maroon-950" />
            <span>Book Your Date / Get Quote</span>
          </button>

          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2.5 bg-maroon-900/90 hover:bg-maroon-800 border-2 border-gold-400/60 text-white font-semibold px-7 py-3.5 rounded-xl text-base sm:text-lg backdrop-blur-md transition-all transform hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5 text-gold-400" />
            <span>Call: {settings.phone}</span>
          </a>
        </motion.div>

        {/* Feature Pill Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md border border-gold-500/30 p-3 sm:p-4 rounded-xl text-center">
            <Award className="w-6 h-6 text-gold-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-white text-sm sm:text-base">15+ Years</h4>
            <p className="text-xs text-slate-300">Trusted in Bijoliya</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-gold-500/30 p-3 sm:p-4 rounded-xl text-center">
            <ShieldCheck className="w-6 h-6 text-gold-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-white text-sm sm:text-base">100% Monsoon Proof</h4>
            <p className="text-xs text-slate-300">Barsat ke German Tent</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-gold-500/30 p-3 sm:p-4 rounded-xl text-center">
            <Utensils className="w-6 h-6 text-gold-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-white text-sm sm:text-base">Catering Equipment</h4>
            <p className="text-xs text-slate-300">Bhagone, Kadai, Bhati</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-gold-500/30 p-3 sm:p-4 rounded-xl text-center">
            <MapPin className="w-6 h-6 text-gold-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-white text-sm sm:text-base">Prime Location</h4>
            <p className="text-xs text-slate-300">Sarkari Samiti, Bijoliya</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
