import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PESANTREN_INFO } from '../data/pesantrenData';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [berandaContent, setBerandaContent] = useState<string>(PESANTREN_INFO.tagline);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetch('/api/web-sections')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const beranda = data.find(s => s.id === 'beranda');
          if (beranda && beranda.content) {
            setBerandaContent(beranda.content);
          }
        }
      })
      .catch(err => {
        console.warn('Gagal memuat dynamic beranda content:', err);
      });

    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const activeBanners = data.filter(b => b.isActive);
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      })
      .catch(err => {
        console.warn('Gagal memuat banners:', err);
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const stats = [
    { value: PESANTREN_INFO.foundedYear, label: 'Tahun Berdiri' },
    { value: '1,500+', label: 'Santri Aktif' },
    { value: '60+', label: 'Asatidzah Bersanad' },
    { value: '100%', label: 'Ahlussunnah wal Jama\'ah' },
  ];

  const currentBannerImage = banners.length > 0 
    ? banners[currentBannerIndex].imageUrl 
    : 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 pt-16 group"
    >
      {/* Visual background pattern & blend */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url('${currentBannerImage}')` }}
          />
        </AnimatePresence>
        
        {/* Decorative Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Background fade to blend seamlessly with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-950 to-transparent pointer-events-none" />
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevBanner}
            className="absolute left-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={handleNextBanner}
            className="absolute right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        {/* Heading */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight"
        >
          <span className="block text-3xl sm:text-4xl md:text-5xl mb-2">Pondok Pesantren</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 font-serif">
            Darul Mushthofa Assunniyyah
          </span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.div
          id="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed wysiwyg-content wysiwyg-hero"
          dangerouslySetInnerHTML={{ __html: berandaContent }}
        />

        {/* CTA Buttons */}
        <motion.div
          id="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            id="hero-cta-profile"
            onClick={() => onNavigate('profile')}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-amber-400/10 hover:scale-102"
          >
            Jelajahi Profil Pesantren
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            id="hero-cta-psb"
            onClick={() => onNavigate('psb')}
            className="w-full sm:w-auto bg-emerald-900/60 hover:bg-emerald-800/80 text-white font-semibold px-8 py-4 rounded-2xl border border-emerald-700 hover:border-emerald-500 shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-102"
          >
            Daftar Santri Baru (PSB)
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          id="hero-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-5xl mx-auto bg-emerald-950/60 backdrop-blur-md border border-emerald-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y-0 divide-x-0 md:divide-x divide-emerald-800/50">
            {stats.map((stat, i) => (
              <div
                key={i}
                id={`stat-item-${i}`}
                className="flex flex-col items-center text-center justify-center px-4"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-tight font-serif">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs sm:text-sm text-emerald-200 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
