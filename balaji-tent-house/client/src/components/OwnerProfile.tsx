import { motion } from "framer-motion";
import type { SiteSettings } from "../types";

interface OwnerProfileProps {
  settings: SiteSettings | null;
}

const OwnerProfile = ({ settings }: OwnerProfileProps) => {
  return (
    <section id="owner" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[280px_1fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto md:mx-0"
        >
          <div className="h-56 w-56 rounded-full overflow-hidden border-4 border-marigold shadow-lg">
            <img
              src={
                settings?.ownerPhoto ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80"
              }
              alt={settings?.ownerName || "Owner"}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-brass font-semibold text-sm tracking-wide">
            Meet the owner
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-charcoal">
            {settings?.ownerName || "Yamuna Shankar Bairagi"}
          </h2>
          <p className="mt-5 text-charcoal/75 text-lg leading-relaxed max-w-2xl">
            {settings?.ownerBio ||
              "Welcome! We've been setting up tents and managing catering essentials for weddings and celebrations across Bhilwara for years. Every event is handled personally, start to finish."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OwnerProfile;