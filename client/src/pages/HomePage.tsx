import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { OwnerShowcase } from '../components/OwnerShowcase';
import { ServicesSection } from '../components/ServicesSection';
import { UtensilsHighlight } from '../components/UtensilsHighlight';
import { GallerySection } from '../components/GallerySection';
import { BookingSection } from '../components/BookingSection';
import { BookingModal } from '../components/BookingModal';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { CloudRain, CheckCircle, ShieldCheck, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Wedding / Vivah');

  const handleOpenModal = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] flex flex-col selection:bg-maroon selection:text-white">
      {/* Top Navbar */}
      <Navbar onBookClick={() => handleOpenModal()} />

      {/* Main Hero Section */}
      <main className="flex-1">
        <Hero onOpenBooking={() => handleOpenModal()} />

        {/* Dedicated Monsoon / Waterproof Feature Highlight Bar */}
        <section id="waterproof" className="bg-gradient-to-r from-[#300505] via-maroon-900 to-[#300505] text-white py-14 border-y-2 border-gold-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-300 border border-gold-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span>Monsoon Protection Guaranteed</span>
                </div>
                <h3 className="font-serif-royal text-2xl sm:text-3xl font-extrabold text-white">
                  Barsat Ke Waterproof Tents (100% Leak-Proof Guarantee)
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Don't let sudden Rajasthan monsoon showers halt your auspicious ceremonies. Our German hanger waterproof structures and triple-layer tarpaulin shed water completely without a single drop entering your guest dining or mandap area.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-gold-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Heavy-duty galvanized frames
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> High-velocity wind anchor ropes
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Raised waterproof flooring
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  onClick={() => handleOpenModal('Waterproof Tent (Monsoon)')}
                  className="bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-400 text-maroon-950 font-bold py-3.5 px-6 rounded-xl text-center shadow-gold-glow transition-all"
                >
                  Book Monsoon Tent
                </button>
                <a
                  href={`tel:${settings.phone}`}
                  className="bg-maroon-950 hover:bg-maroon-900 border border-gold-500/40 text-white font-semibold py-3 px-6 rounded-xl text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Quick Call: {settings.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Services Grid */}
        <ServicesSection onSelectService={(name) => handleOpenModal(name)} />

        {/* Cooking Utensils & Halwai Equipment Rental Dedicated Section */}
        <UtensilsHighlight onRentClick={() => handleOpenModal('Catering Utensils Rental')} />

        {/* Owner Showcase Section (Yamuna Shankar Bairagi) */}
        <OwnerShowcase />

        {/* Real Events Past Work Gallery */}
        <GallerySection />

        {/* Direct Booking Section */}
        <BookingSection prefilledService={selectedService} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp />

      {/* Modal Lightbox for Booking */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </div>
  );
};
