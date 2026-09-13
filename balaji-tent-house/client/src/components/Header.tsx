import { useState, useEffect } from "react";
import { Menu, X, Tent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLogoDisplay } from "../utils/logo";
import type { SiteSettings } from "../types";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "About Owner", href: "#owner" },
  { label: "Enquiry", href: "#enquiry" },
  { label: "Contact", href: "#contact" },
];

interface HeaderProps {
  settings: SiteSettings | null;
}

const Header = ({ settings }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-maroon shadow-lg" : "bg-maroon/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-2 shrink-0">
            {settings?.logoUrl ? (
              <span className={`shrink-0 ${getLogoDisplay(settings.logoShape).wrapper}`}>
                <img
                  src={settings.logoUrl}
                  alt={settings.businessName}
                  className={getLogoDisplay(settings.logoShape).img}
                />
              </span>
            ) : (
              <span className="h-10 w-10 rounded-full bg-marigold flex items-center justify-center shrink-0">
                <Tent className="h-5 w-5 text-maroon" />
              </span>
            )}
            <span className="font-display text-lg md:text-xl font-semibold text-ivory tracking-tight leading-none">
              {settings?.businessName || "BALAJI TENT HOUSE"}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-ivory/90 hover:text-marigold text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#enquiry"
            className="hidden md:inline-flex items-center rounded-full bg-marigold px-5 py-2.5 text-sm font-semibold text-maroon-dark hover:bg-marigold-light transition-colors"
          >
            Get Instant Quote
          </a>

          <button
            className="md:hidden text-ivory"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-maroon-dark border-t border-ivory/10 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-ivory/90 hover:text-marigold py-2.5 text-base font-medium border-b border-ivory/5 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#enquiry"
                onClick={() => setOpen(false)}
                className="mt-3 text-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-maroon-dark"
              >
                Get Instant Quote
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;