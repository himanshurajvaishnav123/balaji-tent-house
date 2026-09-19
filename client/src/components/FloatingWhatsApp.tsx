import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSettings();

  // Strip non-digit characters for WhatsApp international URL
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

  const message = encodeURIComponent(
    `Namaste Yamuna Shankar ji! I want to inquire about Tent setup / Catering Utensils rental for an upcoming event in Bijoliya.`
  );

  const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group border-2 border-white"
      aria-label="Chat with Balaji Tent House on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </div>
      <span className="text-xs sm:text-sm tracking-wide hidden sm:inline">
        WhatsApp Us
      </span>
    </a>
  );
};
