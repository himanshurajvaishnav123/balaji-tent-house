import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import type { SiteSettings } from "../types";

interface QuickActionsProps {
  settings: SiteSettings | null;
}

const QuickActions = ({ settings }: QuickActionsProps) => {
  const whatsappNumber = (settings?.whatsappNumber || "").replace(/\D/g, "");
  const phone = settings?.phone || "";
  const message = encodeURIComponent(
    "Hi Balaji Tent House, I'd like to enquire about tent booking for my event."
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {phone && (
        <motion.a
          href={`tel:${phone}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Call Balaji Tent House"
          className="h-14 w-14 rounded-full bg-maroon shadow-lg flex items-center justify-center text-ivory"
        >
          <Phone className="h-6 w-6" />
        </motion.a>
      )}
      {whatsappNumber && (
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chat on WhatsApp"
          className="h-14 w-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center text-white"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
            <path d="M16.02 3C9.4 3 4 8.37 4 15c0 2.29.64 4.44 1.75 6.28L4 29l7.9-1.71A11.9 11.9 0 0016.02 27C22.65 27 28 21.63 28 15S22.65 3 16.02 3zm0 21.6c-1.9 0-3.68-.53-5.2-1.44l-.37-.22-4.68 1.02 1.05-4.55-.24-.38A9.55 9.55 0 016.4 15c0-5.3 4.32-9.6 9.62-9.6 5.3 0 9.6 4.3 9.6 9.6s-4.3 9.6-9.6 9.6zm5.27-7.2c-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.9-2.15-.24-.57-.48-.5-.65-.5h-.56c-.2 0-.51.07-.78.37-.26.29-1.02 1-1.02 2.44s1.05 2.82 1.2 3.02c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.2-.55-.34z"/>
          </svg>
        </motion.a>
      )}
    </div>
  );
};

export default QuickActions;
