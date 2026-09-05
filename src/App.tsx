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

import LatestNewsWidget from './components/LatestNewsWidget';

import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useLocation, useNavigate, useSearchParams, Navigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialKeyword, setSearchInitialKeyword] = useState('');
  
  // Derive active section from location
  let activeSection = 'hero';
  const path = location.pathname;
  if (path === '/') activeSection = 'hero';
  else if (path === '/profil') activeSection = 'profile';
  else if (path === '/pendidikan') activeSection = 'programs';
  else if (path === '/pengumuman') activeSection = 'announcements';
  else if (path === '/berita') activeSection = 'news';
  else if (path === '/agenda') activeSection = 'calendar';
  else if (path === '/galeri') activeSection = 'gallery';
  else if (path === '/psb') activeSection = 'psb';
  else if (path === '/jadwal-sholat') activeSection = 'prayer';
  else if (path === '/kontak') activeSection = 'contact';
  else if (path === '/kelolainfo') activeSection = 'admin';

  // State from URL params
  const profileTab = (searchParams.get('tab') as ProfileTabType) || 'history';
  const newsCategory = (searchParams.get('category') as any) || 'Semua';
  const newsArticleId = searchParams.get('id') || undefined;
  const announcementCategory = searchParams.get('category') || 'Semua';
  const announcementId = searchParams.get('id') || undefined;

  const handleOpenSearch = (initialKeyword?: string) => {
    setSearchInitialKeyword(initialKeyword || '');
    setIsSearchOpen(true);
  };

  const handleNavigate = (sectionId: string, subParam?: string) => {
    let targetPath = '/';
    let queryParams = new URLSearchParams();

    switch (sectionId) {
      case 'hero':
        targetPath = '/';
        break;
      case 'profile':
        targetPath = '/profil';
        if (subParam) queryParams.set('tab', subParam);
        break;
      case 'programs':
        targetPath = '/pendidikan';
        break;
      case 'announcements':
        targetPath = '/pengumuman';
        if (subParam?.startsWith('ann-')) queryParams.set('id', subParam);
        else if (subParam && subParam !== 'Semua') queryParams.set('category', subParam);
        break;
      case 'news':
        targetPath = '/berita';
        if (subParam?.startsWith('n')) queryParams.set('id', subParam);
        else if (subParam && subParam !== 'Semua') queryParams.set('category', subParam);
        break;
      case 'calendar':
        targetPath = '/agenda';
        break;
      case 'gallery':
        targetPath = '/galeri';
        break;
      case 'psb':
        targetPath = '/psb';
        break;
      case 'prayer':
        targetPath = '/jadwal-sholat';
        break;
      case 'contact':
        targetPath = '/kontak';
        break;
      case 'admin':
        targetPath = '/kelolainfo';
        break;
    }

    const searchString = queryParams.toString();
    navigate({
      pathname: targetPath,
      search: searchString ? `?${searchString}` : ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  return (
    <div id="root-layout" className="min-h-screen bg-neutral-50 text-neutral-800 antialiased font-sans selection:bg-amber-400 selection:text-emerald-950 flex flex-col justify-between">
      <div>
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenSearch={handleOpenSearch}
        />

        <GlobalSearchModal
          isOpen={isSearchOpen}
          initialKeyword={searchInitialKeyword}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
        />

        <main id="main-content" className="min-h-[70vh]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  key="hero-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <Hero onNavigate={handleNavigate} />
                  <PrayerTimes />
                  <LatestNewsWidget onNavigate={handleNavigate} />
                </motion.div>
              } />

              <Route path="/profil" element={
                <motion.div key="profile-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <Profile initialTab={profileTab} />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/pendidikan" element={
                <motion.div key="programs-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <Programs onNavigate={handleNavigate} />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/pengumuman" element={
                <motion.div key="announcements-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <AnnouncementsSection initialAnnouncementId={announcementId} initialCategory={announcementCategory} onNavigate={handleNavigate} />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/berita" element={
                <motion.div key="news-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <NewsSection initialCategory={newsCategory} initialArticleId={newsArticleId} onNavigate={handleNavigate} />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/agenda" element={
                <motion.div key="calendar-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <EventCalendar />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/galeri" element={
                <motion.div key="gallery-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <Gallery />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/psb" element={
                <motion.div key="psb-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <PSBRegistration />
                  <div className="bg-neutral-100 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-200 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/jadwal-sholat" element={
                <motion.div key="prayer-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20 bg-neutral-900 min-h-screen py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <PrayerTimes />
                  </div>
                  <div className="pt-12 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/kontak" element={
                <motion.div key="contact-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <Contact />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="/kelolainfo" element={
                <motion.div key="admin-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="pt-20">
                  <AdminPanel />
                  <div className="bg-neutral-50 pb-16 text-center">
                    <button onClick={() => handleNavigate('hero')} className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">← Kembali ke Beranda</button>
                  </div>
                </motion.div>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
