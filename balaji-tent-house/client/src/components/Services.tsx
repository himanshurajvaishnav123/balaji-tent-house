import { motion } from "framer-motion";
import { Tent, CloudRain, UtensilsCrossed, Check } from "lucide-react";

const SERVICES = [
  {
    icon: Tent,
    title: "Tent Setup & Event Decoration",
    description:
      "Complete tent installation and decor for weddings, birthdays, social gatherings, and corporate or private meetings — sized and styled to match your guest count and occasion.",
    features: [
      "Mandap, stage, and entrance gate decoration",
      "Fabric draping, lighting, and floral or LED backdrops",
      "Seating arrangements for small meetings to large baraat lawns",
      "Custom colour themes to match invitations or family preference",
    ],
  },
  {
    icon: CloudRain,
    title: "Waterproof / Monsoon Tents",
    description:
      "Barsat ke tent built with reinforced waterproof sheeting and sturdy framing, so an unexpected shower never has to move your event indoors or cut it short.",
    features: [
      "Fully sealed waterproof canopies and side walls",
      "Reinforced poles rated for wind and heavy rain",
      "Elevated, water-resistant flooring options",
      "Quick setup so events stay on schedule even in the monsoon",
    ],
  },
  {
    icon: UtensilsCrossed,
    title: "Catering Utensils Rental",
    description:
      "Every piece of cooking and serving equipment your caterer needs for the day — cleaned, counted, and delivered on time, then collected once the event wraps up.",
    features: [
      "Bhagone, kadai, and parat in multiple sizes",
      "Chamach, serving spoons, and ladles in bulk",
      "Bhati (stoves) and other large-batch cooking equipment",
      "Flexible rental duration for single-day or multi-day functions",
    ],
  },
];

const Services = () => {
  return (
    <section id="services" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-brass font-semibold text-sm tracking-wide">What we offer</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-charcoal">
            Everything an event needs, under one roof
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-charcoal/10 bg-white p-7 hover:border-marigold/60 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="h-12 w-12 rounded-xl bg-maroon flex items-center justify-center">
                <service.icon className="h-6 w-6 text-marigold" />
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold text-charcoal">
                {service.title}
              </h3>
              <p className="mt-2.5 text-charcoal/70 leading-relaxed">
                {service.description}
              </p>
              <ul className="mt-5 space-y-2.5 pt-5 border-t border-charcoal/10">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-charcoal/75">
                    <Check className="h-4 w-4 text-brass mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;