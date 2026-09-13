import { motion } from "framer-motion";
import { PhoneCall, ArrowRight } from "lucide-react";
import type { SiteSettings } from "../types";

interface HeroProps {
  settings: SiteSettings | null;
}

const Hero = ({ settings }: HeroProps) => {
  return (
    <section
      id="home"
      className="scroll-mt-16 md:scroll-mt-20 relative overflow-hidden bg-maroon pt-28 pb-20 md:pt-40 md:pb-28"
    >
      {/* Draped fabric motif */}
      <div className="absolute inset-0 bg-drape-pattern opacity-40" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-marigold/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-brass/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-marigold font-semibold tracking-wide text-sm mb-4">
            Bijoliya, Bhilwara &mdash; Weddings, Parties &amp; Every Occasion
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold text-ivory leading-[1.08]">
            Your event, dressed in colour and ready on time
          </h1>
          <p className="mt-6 text-ivory/80 text-lg max-w-xl">
            From wedding-ready tents to monsoon-proof shelters and every
            utensil your kitchen needs on the day &mdash; Balaji Tent House
            handles the setup so you can host without worry.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-marigold px-7 py-3.5 font-semibold text-maroon-dark hover:bg-marigold-light transition-colors"
            >
              Get Instant Quote
              <ArrowRight className="h-4 w-4" />
            </a>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/30 px-7 py-3.5 font-semibold text-ivory hover:bg-ivory/10 transition-colors"
              >
                <PhoneCall className="h-4 w-4" />
                Call {settings.phone}
              </a>
            )}
          </div>

          <div className="mt-10 flex gap-8 text-ivory/80 text-sm">
            <div>
              <p className="text-2xl font-display font-semibold text-marigold">500+</p>
              <p>Events Set Up</p>
            </div>
            <div>
              <p className="text-2xl font-display font-semibold text-marigold">100%</p>
              <p>Waterproof Options</p>
            </div>
            <div>
              <p className="text-2xl font-display font-semibold text-marigold">On-Time</p>
              <p>Every Single Time</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border-4 border-marigold/40 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"
              alt="Decorated wedding tent setup"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-ivory rounded-2xl shadow-xl px-5 py-4 hidden sm:block">
            <p className="text-charcoal font-display font-semibold">Waterproof Tents</p>
            <p className="text-charcoal/60 text-sm">Ready for any monsoon booking</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;