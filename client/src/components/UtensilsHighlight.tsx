import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Check, Phone, Utensils, Shield, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface UtensilsHighlightProps {
  onRentClick: () => void;
}

export const UtensilsHighlight: React.FC<UtensilsHighlightProps> = ({ onRentClick }) => {
  const { settings } = useSettings();

  const utensilItems = [
    {
      name: 'Commercial Bhagone & Deg',
      desc: 'Heavy-gauge aluminium & brass cauldrons for cooking daal, rice, and curries for 100 to 5,000+ people.',
      capacity: '50L to 300L sizes',
    },
    {
      name: 'Heavy Frying Kadai (कढ़ाई)',
      desc: 'High-density iron and steel Kadais ideal for puris, kachoris, jalebis, and gulab jamun frying.',
      capacity: 'Sizes up to 4.5 feet diameter',
    },
    {
      name: 'Large Parat (बड़ी परात)',
      desc: 'Spacious brass and stainless steel Parats for Halwai dough kneading and sweets preparation.',
      capacity: 'Pure food-grade polish',
    },
    {
      name: 'Commercial Bhati & Gas Burners',
      desc: 'High-pressure double/triple ring LPG burners and traditional iron Bhatti setups with regulators.',
      capacity: 'Commercial Heavy Burners',
    },
    {
      name: 'Chamach, Jhara & Ladles',
      desc: 'Stainless steel Halwai ladles, oil strainers, serving spoons, and long-handle frying spoons.',
      capacity: 'Full Cookware Toolset',
    },
    {
      name: 'Water Drums, Thalis & Chaffing Dishes',
      desc: 'Hygienic 200L drinking water drums, buffet warmers, complete steel plates, bowls, and glasses.',
      capacity: 'Feasts of up to 3,000 sets',
    },
  ];

  return (
    <section id="utensils" className="py-20 bg-gradient-to-b from-[#240606] via-[#3a0909] to-[#200404] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 px-4 py-1 rounded-full text-gold-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Complete Catering & Halwai Cookware</span>
          </div>

          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Cooking Utensils & Equipment Rental
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-400 mx-auto my-4 rounded-full" />
          <p className="text-slate-300 text-base sm:text-lg">
            Planning a Wedding Feast, Bhagwat Katha, or Community Bhandara in Bijoliya? Rent thoroughly washed, hygienic, heavy-duty catering utensils and commercial stoves.
          </p>
        </div>

        {/* Utensils Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utensilItems.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-maroon-900/60 border border-gold-500/30 rounded-2xl p-6 hover:border-gold-400 hover:bg-maroon-900/80 transition-all group backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform">
                  <Utensils className="w-5 h-5 text-gold-400" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30">
                  {item.capacity}
                </span>
              </div>

              <h3 className="font-serif-royal text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-5 pt-3 border-t border-maroon-800 flex items-center gap-2 text-xs font-medium text-emerald-400">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Cleaned & Ready for Instant Delivery</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 bg-gradient-to-r from-gold-500/20 via-maroon-800/80 to-gold-500/20 border border-gold-400/50 rounded-2xl p-6 sm:p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="text-left">
            <h4 className="text-xl sm:text-2xl font-bold font-serif-royal text-white">
              Need custom utensils calculation for your guest count?
            </h4>
            <p className="text-sm text-slate-300 mt-1">
              Call Yamuna Shankar Bairagi directly to prepare a custom cookware inventory list.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRentClick}
              className="bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold px-6 py-3 rounded-xl text-sm shadow-gold-glow transition-all"
            >
              Request Utensils Quote
            </button>
            <a
              href={`tel:${settings.phone}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl shadow-md transition-all"
              title="Call for Utensils"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
