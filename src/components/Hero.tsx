import React from 'react';
import { ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PESANTREN_INFO } from '../data/pesantrenData';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { value: PESANTREN_INFO.foundedYear, label: 'Tahun Berdiri' },
    { value: '1,500+', label: 'Santri Aktif' },
    { value: '60+', label: 'Asatidzah Bersanad' },
    { value: '100%', label: 'Ahlussunnah wal Jama\'ah' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 pt-16"
    >
      {/* Visual background pattern & blend */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Decorative Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Eyebrow Label */}
        <motion.div
          id="hero-eyebrow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 px-4 py-1.5 rounded-full text-amber-300 text-xs sm:text-sm font-medium mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Penerimaan Santri Baru (PSB) Tahun Ajaran 2026/2027 Telah Dibuka
        </motion.div>

        {/* Heading */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight"
        >
          Selamat Datang di Pondok Pesantren <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 font-serif">
            Darul Mushtofa Assunniyyah
          </span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.p
          id="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          {PESANTREN_INFO.tagline}
        </motion.p>

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

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none" />
    </section>
  );
}
