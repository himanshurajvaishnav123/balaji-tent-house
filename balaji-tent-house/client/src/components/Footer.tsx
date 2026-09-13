import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Tent } from "lucide-react";
import { getLogoDisplay } from "../utils/logo";
import type { SiteSettings } from "../types";

interface FooterProps {
  settings: SiteSettings | null;
}

const Footer = ({ settings }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-16 md:scroll-mt-20 bg-charcoal text-ivory/80 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 md:grid-cols-3 gap-10"
      >
        <div>
          <div className="flex items-center gap-2">
            {settings?.logoUrl ? (
              <span className={`shrink-0 ${getLogoDisplay(settings.logoShape).wrapper}`}>
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName}
                  className={getLogoDisplay(settings.logoShape).img}
                />
              </span>
            ) : (
              <span className="h-9 w-9 rounded-full bg-marigold flex items-center justify-center shrink-0">
                <Tent className="h-4 w-4 text-maroon" />
              </span>
            )}
            <span className="font-display font-semibold text-ivory text-lg">
              {settings?.businessName || "BALAJI TENT HOUSE"}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Tent setup, decoration, and catering utensil rental for weddings
            and events across Bhilwara.
          </p>
        </div>

        <div>
          <h4 className="text-ivory font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#services" className="hover:text-marigold">Services</a></li>
            <li><a href="#gallery" className="hover:text-marigold">Gallery</a></li>
            <li><a href="#owner" className="hover:text-marigold">About Owner</a></li>
            <li><a href="#enquiry" className="hover:text-marigold">Enquiry</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-ivory font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-marigold" />
              <span>{settings?.address || "Malka Khera, Sarkari Samiti Ke Samne, Bijoliya, Bhilwara"}</span>
            </li>
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-marigold" />
                <a href={`tel:${settings.phone}`} className="hover:text-marigold">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-marigold" />
                <a href={`mailto:${settings.email}`} className="hover:text-marigold">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </motion.div>

      <div className="mt-12 pt-6 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-ivory/50">
        <span>
          &copy; {year} {settings?.businessName || "Balaji Tent House"}. All rights reserved.
        </span>
        <span className="hidden sm:inline">·</span>
        <Link to="/admin/login" className="hover:text-marigold underline underline-offset-2">
          Admin Login
        </Link>
      </div>
    </footer>
  );
};

export default Footer;