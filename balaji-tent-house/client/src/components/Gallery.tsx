import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ImageOff } from "lucide-react";
import { galleryApi } from "../api/client";
import type { GalleryItem } from "../types";

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi
      .getAll()
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-brass font-semibold text-sm tracking-wide">Past work</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-charcoal">
            A look at events we've set up
          </h2>
        </div>

        {loading && (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-charcoal/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center py-16 border border-dashed border-charcoal/20 rounded-2xl">
            <ImageOff className="h-10 w-10 text-charcoal/30" />
            <p className="mt-3 text-charcoal/60">
              Photos from recent events will appear here soon.
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="group rounded-2xl overflow-hidden bg-white border border-charcoal/10 hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-charcoal/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-brass font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.eventLocation}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;