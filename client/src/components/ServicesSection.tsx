import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tent, ShieldCheck, UtensilsCrossed, Sparkles, ArrowRight, Check } from 'lucide-react';
import { IService } from '../types';
import { api } from '../api/client';

interface ServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
}

const fallbackServices: IService[] = [
  {
    _id: '1',
    title: 'Tent Setup & Royal Wedding Decor',
    description: 'Bespoke grand shamianas, royal flower mandap, decorative entry arches, high-end carpets, sofa seating, and ambient festive lighting for weddings, receptions, and birthday celebrations.',
    iconName: 'Tent',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    priceTag: 'Custom Wedding Packages',
    isAvailable: true,
  },
  {
    _id: '2',
    title: 'Waterproof / Monsoon Tents (Barsat ke Tent)',
    description: 'Heavy-duty leak-proof German hanger and galvanized waterproof tarpaulins built to withstand storms and torrential rainfall. Ideal for uninterrupted rainy season events.',
    iconName: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    priceTag: 'Weatherproof Guaranteed',
    isAvailable: true,
  },
  {
    _id: '3',
    title: 'Cooking Utensils & Catering Equipment Rental',
    description: 'Full Halwai cooking equipment sets: Heavy copper/steel Bhagone, Kadai, Parat, Bhati, Chamach, gas burners, hot cases, water drums, and complete dinner sets for 100 to 5,000+ people.',
    iconName: 'UtensilsCrossed',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    priceTag: 'Daily / Event Rental Rates',
    isAvailable: true,
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<IService[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data?.success && res.data?.services?.length > 0) {
          setServices(res.data.services);
        }
      } catch (error) {
        console.warn('Using fallback services list.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-gold-400" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-7 h-7 text-gold-400" />;
      default:
        return <Tent className="w-7 h-7 text-gold-400" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-200 px-4 py-1 rounded-full text-maroon-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-maroon-700" />
            <span>Complete Event Infrastructure</span>
          </div>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-black text-maroon-950">
            Our Premium Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-400 mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg">
            From grand wedding shamianas to heavy-duty monsoon tents and commercial catering equipment, Balaji Tent House is Bijoliya's one-stop solution.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#fdfcfb] rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400 hover:shadow-festive transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Service Card Image */}
                <div className="relative h-56 w-full overflow-hidden bg-maroon-950">
                  <img
                    src={
                      service.imageUrl ||
                      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
                    }
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-maroon-950/90 border border-gold-400/60 backdrop-blur-md flex items-center justify-center shadow-lg">
                    {getIcon(service.iconName)}
                  </div>

                  {/* Price Tag Badge */}
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-gold-500 to-amber-500 text-maroon-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                    {service.priceTag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-maroon-950 group-hover:text-maroon-800 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Available across Bijoliya & Bhilwara region</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectService && onSelectService(service.title)}
                  className="w-full py-3 px-4 rounded-xl bg-maroon-900 hover:bg-maroon-800 text-white font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-maroon-900 group-hover:to-maroon-950 transition-all shadow-sm"
                >
                  <span>Inquire For This Service</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
