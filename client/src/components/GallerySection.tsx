import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ZoomIn, X, Camera } from 'lucide-react';
import { IGalleryItem, GalleryCategory } from '../types';
import { api } from '../api/client';

const fallbackGallery: IGalleryItem[] = [
  {
    _id: 'g1',
    title: 'Grand Royal Mandap & Reception Pavilion',
    description: 'Spectacular maroon & gold thematic tent setup with crystal chandeliers and floral arches for a royal wedding celebration.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    location: 'Bijoliya Royal Palace Grounds',
    category: 'Tent Decoration',
  },
  {
    _id: 'g2',
    title: 'All-Weather Monsoon Waterproof Tent',
    description: 'Complete waterproof shelter built to withstand heavy summer rains, keeping 1,200 guests completely dry and comfortable.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
    location: 'Malka Khera Main Ground, Bijoliya',
    category: 'Waterproof Tents',
  },
  {
    _id: 'g3',
    title: 'Complete Traditional Halwai Utensil Setup',
    description: 'Giant copper & stainless steel Bhagone, Kadai, Bhati, and serving spoons deployed for a 2,000 person community feast (Prasadi).',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    location: 'Bhilwara Road, Bijoliya',
    category: 'Utensils Rental',
  },
  {
    _id: 'g4',
    title: 'Festive Night Illumination & Shamiana',
    description: 'Warm golden fairy lighting, red carpet runways, and VIP sofa lounge for sangeet & ring ceremony.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    location: 'Mandalgarh Road Area',
    category: 'Tent Decoration',
  },
  {
    _id: 'g5',
    title: 'Industrial Waterproof Marquee for Katha',
    description: 'Heavy duty German frame waterproof hangar tent with storm anchoring and side curtains.',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    location: 'Sarkari Samiti Campus, Bijoliya',
    category: 'Waterproof Tents',
  },
  {
    _id: 'g6',
    title: 'Catering Buffet & Cookware Inventory',
    description: 'Stainless steel Parat, heavy frying Kadai, large ladles, and commercial cooking burners ready for dispatch.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    location: 'Balaji Tent House Warehouse, Bijoliya',
    category: 'Utensils Rental',
  },
];

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<IGalleryItem[]>(fallbackGallery);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<IGalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data?.success && res.data?.items?.length > 0) {
          setItems(res.data.items);
        }
      } catch (err) {
        console.warn('Using fallback gallery items.');
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Tent Decoration', 'Waterproof Tents', 'Utensils Rental'];

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#faf7f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300 px-4 py-1 rounded-full text-gold-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-4 h-4 text-gold-700" />
            <span>Our Signature Work</span>
          </div>

          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-black text-maroon-950">
            Real Events Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-400 mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg">
            Explore our grand wedding setups, high-durability monsoon waterproof pavilions, and extensive catering utensils fleet.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-maroon-900 text-gold-300 shadow-festive scale-105 border border-gold-400'
                    : 'bg-white text-slate-700 hover:bg-gold-50 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative h-72 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-maroon-950/90 border border-gold-400/50 text-gold-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    {item.category}
                  </div>

                  {/* Zoom hint icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {/* Title & Location at bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <h3 className="font-serif-royal text-lg sm:text-xl font-bold line-clamp-1 group-hover:text-gold-300 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gold-300/90 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-maroon-950 border border-gold-500/40 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl text-white"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-gold-500 hover:text-maroon-950 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="max-h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-full max-h-[70vh] object-contain"
                  />
                </div>

                <div className="p-6 sm:p-8 bg-[#2a0808]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-gold-400 bg-gold-400/10 border border-gold-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedImage.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span>{selectedImage.location}</span>
                    </div>
                  </div>
                  <h3 className="font-serif-royal text-2xl font-bold text-white">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.description && (
                    <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
