import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data/pesantrenData';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Fasilitas' | 'Kegiatan' | 'Santri' | 'Prestasi'>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['Semua', 'Fasilitas', 'Kegiatan', 'Santri', 'Prestasi'];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'Semua') return true;
    return item.category === activeCategory;
  });

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = GALLERY_ITEMS.findIndex((x) => x.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const nextIdx = (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
      setLightboxIndex(nextIdx);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const nextIdx = (lightboxIndex + 1) % GALLERY_ITEMS.length;
      setLightboxIndex(nextIdx);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-bold text-sm tracking-widest uppercase">
            Dokumentasi Visual
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Galeri Kegiatan & Fasilitas
          </h2>
          <p className="text-neutral-500 mt-3 text-sm sm:text-base">
            Ulasan visual aktivitas harian, kenyamanan sarana asrama, serta kebersamaan kekeluargaan di pesantren kami.
          </p>
          <div className="w-16 h-1 bg-emerald-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Gallery Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat}`}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                id={`gallery-item-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleOpenLightbox(item)}
                className="group relative aspect-4/3 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-neutral-100"
              >
                {/* Photo */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-amber-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1.5">
                    {item.category}
                  </span>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-4 flex justify-between items-center text-emerald-300 text-xs font-semibold border-t border-emerald-800/60 pt-3">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4" />
                      Perbesar
                    </span>
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal slider */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              id="gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            >
              {/* Lightbox Top Control */}
              <div className="flex justify-between items-center text-white p-2">
                <div>
                  <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest block">
                    {GALLERY_ITEMS[lightboxIndex].category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">
                    {GALLERY_ITEMS[lightboxIndex].title}
                  </h3>
                </div>
                <button
                  id="btn-close-lightbox"
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Central Lightbox Viewer */}
              <div className="relative flex items-center justify-center max-w-5xl mx-auto w-full h-[65vh] sm:h-[75vh]">
                {/* Previous Button */}
                <button
                  id="btn-prev-lightbox"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-12 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-800 hover:text-white text-neutral-300 z-10 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Photo Viewer */}
                <div className="max-w-full max-h-full aspect-auto shadow-2xl rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                  <img
                    src={GALLERY_ITEMS[lightboxIndex].imageUrl}
                    alt={GALLERY_ITEMS[lightboxIndex].title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
                  />
                </div>

                {/* Next Button */}
                <button
                  id="btn-next-lightbox"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-12 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-800 hover:text-white text-neutral-300 z-10 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Lightbox Bottom Indicator */}
              <div className="text-center text-neutral-400 text-xs font-semibold py-2">
                Foto {lightboxIndex + 1} dari {GALLERY_ITEMS.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
