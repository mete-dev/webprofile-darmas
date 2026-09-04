import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Profile, { ProfileTabType } from './components/Profile';
import Programs from './components/Programs';
import NewsSection from './components/NewsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import PSBRegistration from './components/PSBRegistration';
import PrayerTimes from './components/PrayerTimes';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EventCalendar from './components/EventCalendar';
import GlobalSearchModal from './components/GlobalSearchModal';
import AdminPanel from './components/AdminPanel';

import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [profileTab, setProfileTab] = useState<ProfileTabType>('history');
  const [newsCategory, setNewsCategory] = useState<'Semua' | 'Berita' | 'Opini' | 'Kegiatan' | 'Prestasi'>('Semua');
  const [newsArticleId, setNewsArticleId] = useState<string | undefined>(undefined);
  const [announcementCategory, setAnnouncementCategory] = useState<string>('Semua');
  const [announcementId, setAnnouncementId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialKeyword, setSearchInitialKeyword] = useState('');

  // Support secret admin route `/kelolainfo` or hash `#kelolainfo` with no visible button links
  useEffect(() => {
    const handleLocationCheck = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (
        pathname === '/kelolainfo' ||
        pathname.endsWith('/kelolainfo') ||
        hash === '#kelolainfo' ||
        hash === '#/kelolainfo'
      ) {
        setActiveSection('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    // Check immediately on load
    handleLocationCheck();

    // Listen to changes
    window.addEventListener('hashchange', handleLocationCheck);
    window.addEventListener('popstate', handleLocationCheck);

    return () => {
      window.removeEventListener('hashchange', handleLocationCheck);
      window.removeEventListener('popstate', handleLocationCheck);
    };
  }, []);

  const handleOpenSearch = (initialKeyword?: string) => {
    setSearchInitialKeyword(initialKeyword || '');
    setIsSearchOpen(true);
  };

  // Page navigation handler with instant top scroll and deep-linking support
  const handleNavigate = (sectionId: string, subParam?: string) => {
    if (sectionId === 'profile') {
      if (
        subParam === 'history' ||
        subParam === 'vision' ||
        subParam === 'institutions' ||
        subParam === 'extracurricular' ||
        subParam === 'values'
      ) {
        setProfileTab(subParam);
      } else {
        setProfileTab('history');
      }
    }

    if (sectionId === 'announcements') {
      if (subParam && subParam.startsWith('ann-')) {
        setAnnouncementId(subParam);
      } else if (subParam) {
        setAnnouncementCategory(subParam);
        setAnnouncementId(undefined);
      } else {
        setAnnouncementCategory('Semua');
        setAnnouncementId(undefined);
      }
    }

    if (sectionId === 'news') {
      if (subParam === 'Berita' || subParam === 'Opini' || subParam === 'Kegiatan' || subParam === 'Prestasi') {
        setNewsCategory(subParam);
        setNewsArticleId(undefined);
      } else if (subParam && subParam.startsWith('n')) {
        setNewsArticleId(subParam);
      } else {
        setNewsCategory('Semua');
        setNewsArticleId(undefined);
      }
    }

    setActiveSection(sectionId);
    window.scrollTo({
      top: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  };

  return (
    <div id="root-layout" className="min-h-screen bg-neutral-50 text-neutral-800 antialiased font-sans selection:bg-amber-400 selection:text-emerald-950 flex flex-col justify-between">
      <div>
        {/* Floating Header with Dropdowns and Search Bar */}
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenSearch={handleOpenSearch}
        />

        {/* Global Keyword Search Dialog Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          initialKeyword={searchInitialKeyword}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Main Body with Transition Routing */}
        <main id="main-content" className="min-h-[70vh]">
          <AnimatePresence mode="wait">
            {activeSection === 'hero' && (
              <motion.div
                key="hero-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Hero Banner */}
                <Hero onNavigate={handleNavigate} />
                
                {/* Jadwal Sholat Section on Main Homepage */}
                <PrayerTimes />

                {/* Portal Directory Section */}
                <div id="portal-directory" className="py-16 sm:py-20 bg-neutral-100/70">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                      <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                        Portal Informasi Terpadu
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-3 font-serif">
                        Layanan Akademik & Kanal Pesantren
                      </h2>
                      <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                        Jelajahi seluruh layanan, profil, lembaga pendidikan, dan kabar kegiatan santri.
                      </p>
                    </div>

                    {/* Interactive Keyword Search Bar on Homepage */}
                    <div className="max-w-2xl mx-auto mb-12">
                      <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-md border border-neutral-200/90 flex items-center gap-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all">
                        <div className="pl-2.5 text-neutral-400 flex items-center">
                          <Search className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        </div>
                        <input
                          type="text"
                          id="portal-keyword-input"
                          placeholder="Ketik kata kunci pencarian (misal: syarat santri baru, biaya, jadwal libur, kitab)..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleOpenSearch((e.target as HTMLInputElement).value);
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent py-1.5 px-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('portal-keyword-input') as HTMLInputElement;
                            handleOpenSearch(input?.value || '');
                          }}
                          className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex-shrink-0"
                        >
                          Cari Kata Kunci
                        </button>
                      </div>

                      {/* Quick Keyword Suggestions */}
                      <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3 text-[11px] text-neutral-500">
                        <span className="font-semibold text-neutral-600">Kata kunci populer:</span>
                        {[
                          'Syarat Pendaftaran',
                          'Biaya Syahriyah',
                          'Surat Libur',
                          'Kitab Kuning',
                          'Tahfidz Al-Qur\'an',
                          'MTs',
                          'Hadrah'
                        ].map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleOpenSearch(kw)}
                            className="text-emerald-850 hover:text-emerald-950 font-semibold px-2 py-0.5 rounded-full bg-white hover:bg-emerald-100 border border-neutral-200/80 transition-colors shadow-2xs"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Card 1: Profil */}
                      <button
                        onClick={() => handleNavigate('profile', 'history')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          📖
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Profil & Sejarah
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Mengenal lebih dekat PP Darul Mushtofa Assunniyyah, sejarah berdiri, visi misi, serta jajaran pengasuh.
                        </p>
                        <span className="text-xs font-semibold text-emerald-750 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lihat Profil →
                        </span>
                      </button>

                      {/* Card 2: Lembaga Pendidikan */}
                      <button
                        onClick={() => handleNavigate('profile', 'institutions')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          🏫
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Lembaga Pendidikan
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Unit formal MTs, MA, Madrasah Diniyah Salafiyah, dan Lembaga Tahfidzul Qur'an terakreditasi unggul.
                        </p>
                        <span className="text-xs font-semibold text-emerald-750 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lihat Lembaga →
                        </span>
                      </button>

                      {/* Card 3: Ekstrakulikuler */}
                      <button
                        onClick={() => handleNavigate('profile', 'extracurricular')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                          ✨
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Ekstrakulikuler Santri
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Seni Hadrah Al-Banjari, Beladiri Pagar Nusa, Kaligrafi Khat, Muhadhoroh 3 Bahasa, dan Pramuka.
                        </p>
                        <span className="text-xs font-semibold text-amber-700 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lihat Ekstrakulikuler →
                        </span>
                      </button>

                      {/* Card 4: Pengumuman Resmi */}
                      <button
                        onClick={() => handleNavigate('announcements')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                          📢
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <h3 className="font-bold text-emerald-950 text-base group-hover:text-amber-800 transition-colors">
                            Papan Pengumuman
                          </h3>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            Resmi
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Maklumat kedatangan, surat edaran perpulangan, tata tertib, dan informasi biro pesantren.
                        </p>
                        <span className="text-xs font-semibold text-amber-800 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Buka Pengumuman →
                        </span>
                      </button>

                      {/* Card 5: Artikel & Berita */}
                      <button
                        onClick={() => handleNavigate('news')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          📰
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Artikel & Berita
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Liputan kegiatan harian santri, opini asatidz, kajian keilmuan, dan kabar prestasi santri.
                        </p>
                        <span className="text-xs font-semibold text-emerald-750 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Baca Artikel →
                        </span>
                      </button>

                      {/* Card 5: Agenda & Kegiatan */}
                      <button
                        onClick={() => handleNavigate('calendar')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          📅
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Agenda & Kegiatan
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Jadwal pengajian rutin kitab kuning, kalender akademik madrasah, dan peringatan hari besar Islam.
                        </p>
                        <span className="text-xs font-semibold text-purple-700 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Buka Kalender →
                        </span>
                      </button>

                      {/* Card 6: Galeri Foto */}
                      <button
                        onClick={() => handleNavigate('gallery')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          🖼️
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Galeri Foto & Fasilitas
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Dokumentasi suasana asrama santri, sarana masjid terpadu, laboratorium, dan aktivitas harian.
                        </p>
                        <span className="text-xs font-semibold text-teal-700 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lihat Dokumentasi →
                        </span>
                      </button>

                      {/* Card 7: PSB (Pendaftaran Santri Baru) */}
                      <button
                        onClick={() => handleNavigate('psb')}
                        className="group bg-amber-50/50 p-6 rounded-2xl border border-amber-300 text-left hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-2"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                              📋
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded">
                                Pendaftaran Online Dibuka
                              </span>
                              <h3 className="font-bold text-emerald-950 text-base sm:text-lg mt-1">
                                Penerimaan Santri Baru (PSB) Tahun Ajaran 2026/2027
                              </h3>
                              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed max-w-xl">
                                Registrasi online mandiri, unduh brosur, jadwal tes seleksi, serta panduan syarat berkas santri putra dan putri.
                              </p>
                            </div>
                          </div>
                          <span className="bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-sm">
                            Daftar Sekarang →
                          </span>
                        </div>
                      </button>

                      {/* Card 8: Kontak & Lokasi */}
                      <button
                        onClick={() => handleNavigate('contact')}
                        className="group bg-white p-6 rounded-2xl border border-neutral-200/80 text-left hover:border-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          📞
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mt-4 group-hover:text-emerald-800 transition-colors">
                          Hubungi Kami
                        </h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                          Alamat lengkap Yosowilangun Kidul, nomor WhatsApp sekretariat, dan peta petunjuk arah.
                        </p>
                        <span className="text-xs font-semibold text-emerald-700 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Buka Kontak →
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'profile' && (
              <motion.div
                key="profile-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <Profile initialTab={profileTab} />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'programs' && (
              <motion.div
                key="programs-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <Programs onNavigate={handleNavigate} />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'announcements' && (
              <motion.div
                key="announcements-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <AnnouncementsSection
                  initialAnnouncementId={announcementId}
                  initialCategory={announcementCategory}
                  onNavigate={handleNavigate}
                />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'news' && (
              <motion.div
                key="news-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <NewsSection
                  initialCategory={newsCategory}
                  initialArticleId={newsArticleId}
                  onNavigate={handleNavigate}
                />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'calendar' && (
              <motion.div
                key="calendar-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <EventCalendar />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'gallery' && (
              <motion.div
                key="gallery-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <Gallery />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'psb' && (
              <motion.div
                key="psb-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <PSBRegistration />
                <div className="bg-neutral-100 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-200 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'prayer' && (
              <motion.div
                key="prayer-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20 bg-neutral-900 min-h-screen py-12"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <PrayerTimes />
                </div>
                <div className="pt-12 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'contact' && (
              <motion.div
                key="contact-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <Contact />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'admin' && (
              <motion.div
                key="admin-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-20"
              >
                <AdminPanel />
                <div className="bg-neutral-50 pb-16 text-center">
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
                  >
                    ← Kembali ke Beranda
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
