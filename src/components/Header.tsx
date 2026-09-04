import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  BookOpen,
  Compass,
  Building2,
  Sparkles,
  FileText,
  Bell,
  Calendar,
  Image as ImageIcon,
  ClipboardList,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PesantrenLogo from './PesantrenLogo';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string, subParam?: string) => void;
  onOpenSearch: (initialKeyword?: string) => void;
}

export default function Header({ activeSection, onNavigate, onOpenSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'profile' | 'info' | null>(null);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [headerKeyword, setHeaderKeyword] = useState('');
  const [mobileKeyword, setMobileKeyword] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menu: 'profile' | 'info') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleNavigation = (sectionId: string, subParam?: string) => {
    onNavigate(sectionId, subParam);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const profileMenuItems = [
    { label: 'Sejarah', icon: BookOpen, target: 'profile', subParam: 'history', desc: 'Latar belakang & sanad keilmuan' },
    { label: 'Visi Misi', icon: Compass, target: 'profile', subParam: 'vision', desc: 'Arah perjuangan & target lulusan' },
    { label: 'Lembaga', icon: Building2, target: 'profile', subParam: 'institutions', desc: 'MTs, MA, Diniyah & Tahfidz' },
    { label: 'Ekstrakulikuler', icon: Sparkles, target: 'profile', subParam: 'extracurricular', desc: 'Hadrah, Pagar Nusa, Kaligrafi' },
  ];

  const infoMenuItems: { label: string; icon: React.ComponentType<{ className?: string }>; target: string; subParam?: string; desc: string }[] = [
    { label: 'Pengumuman', icon: Bell, target: 'announcements', desc: 'Surat edaran & maklumat resmi' },
    { label: 'Artikel & Berita', icon: FileText, target: 'news', desc: 'Kabar dan liputan kegiatan santri' },
    { label: 'Agenda', icon: Calendar, target: 'calendar', desc: 'Jadwal kajian & kalender akademik' },
    { label: 'Galeri', icon: ImageIcon, target: 'gallery', desc: 'Dokumentasi foto sarana & santri' },
  ];

  return (
    <header
      id="main-header"
      ref={dropdownRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-emerald-950/95 backdrop-blur-md shadow-lg border-b border-emerald-850 py-2.5'
          : 'bg-gradient-to-b from-emerald-950/90 via-emerald-950/70 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          
          {/* Logo / Branding */}
          <div
            id="header-brand"
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => handleNavigation('hero')}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-2xl p-1.5 shadow-md shadow-emerald-950/40 border border-white/90 ring-1 ring-emerald-500/10 flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
              <PesantrenLogo variant="emerald" className="w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h1 className="text-emerald-200/90 font-medium text-xs sm:text-[13px] tracking-wide leading-tight group-hover:text-emerald-100 transition-colors duration-200">
                  Pondok Pesantren
                </h1>
              </div>
              <p className="text-white font-bold text-sm sm:text-base tracking-tight leading-tight group-hover:text-amber-300 transition-colors duration-200 mt-0.5">
                Darul Mushthofa Assunniyyah
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav"
            className="hidden md:flex items-center gap-1 bg-emerald-900/35 border border-emerald-800/60 backdrop-blur-md px-2 py-1 rounded-full shadow-inner"
          >
            {/* Beranda Link */}
            <button
              id="nav-item-hero"
              onClick={() => handleNavigation('hero')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeSection === 'hero'
                  ? 'text-amber-300 bg-emerald-800/90 shadow-sm border border-emerald-700/60'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              Beranda
            </button>

            {/* Profil Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('profile')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-dropdown-profile"
                onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeSection === 'profile' || openDropdown === 'profile'
                    ? 'text-amber-300 bg-emerald-800/90 shadow-sm border border-emerald-700/60'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <span>Profil</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2.5 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Profil Pesantren
                      </span>
                    </div>
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleNavigation(item.target, item.subParam)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-neutral-700 hover:text-emerald-950 transition-colors flex items-start gap-3 group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-800 group-hover:bg-emerald-900 group-hover:text-white transition-colors mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-snug text-neutral-900 group-hover:text-emerald-950">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Update Info Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('info')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-dropdown-info"
                onClick={() => setOpenDropdown(openDropdown === 'info' ? null : 'info')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeSection === 'announcements' || activeSection === 'news' || activeSection === 'calendar' || activeSection === 'gallery' || openDropdown === 'info'
                    ? 'text-amber-300 bg-emerald-800/90 shadow-sm border border-emerald-700/60'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <span>Informasi</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'info' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'info' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2.5 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Kanal Informasi
                      </span>
                    </div>
                    {infoMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleNavigation(item.target, item.subParam)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-neutral-700 hover:text-emerald-950 transition-colors flex items-start gap-3 group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-snug text-neutral-900 group-hover:text-emerald-950">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PSB Link */}
            <button
              id="nav-item-psb"
              onClick={() => handleNavigation('psb')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeSection === 'psb'
                  ? 'text-amber-300 bg-emerald-800/90 shadow-sm border border-emerald-700/60'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              PSB
            </button>

            {/* Hubungi Kami Link */}
            <button
              id="nav-item-contact"
              onClick={() => handleNavigation('contact')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeSection === 'contact'
                  ? 'text-amber-300 bg-emerald-800/90 shadow-sm border border-emerald-700/60'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              Kontak
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Keyword Search Bar (xl screens) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onOpenSearch(headerKeyword.trim());
              }}
              className="hidden xl:flex items-center relative"
            >
              <input
                type="text"
                value={headerKeyword}
                onChange={(e) => setHeaderKeyword(e.target.value)}
                placeholder="Cari kata kunci..."
                className="bg-emerald-900/60 hover:bg-emerald-900/90 focus:bg-emerald-950 text-white placeholder-emerald-300/70 text-xs px-3.5 py-1.5 pr-8 rounded-full border border-emerald-700/60 focus:border-amber-400 focus:outline-none transition-all w-36 focus:w-56 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2.5 text-amber-400 hover:text-amber-200 transition-colors"
                title="Cari berdasarkan kata kunci"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Keyword Search Button (lg screens) */}
            <button
              onClick={() => onOpenSearch(headerKeyword.trim())}
              className="hidden lg:flex xl:hidden items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800/90 text-emerald-100 hover:text-white px-3.5 py-1.5 rounded-full text-xs border border-emerald-700/70 transition-all shadow-sm group"
              title="Pencarian Berdasarkan Kata Kunci"
            >
              <Search className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-xs">Cari Kata Kunci</span>
            </button>

            {/* Keyword Search Button (Mobile/Tablet) */}
            <button
              id="btn-search-mobile-trigger"
              onClick={() => onOpenSearch()}
              className="lg:hidden p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-900/40 transition-colors"
              aria-label="Pencarian berdasarkan kata kunci"
              title="Pencarian Berdasarkan Kata Kunci"
            >
              <Search className="h-5 w-5 text-amber-300" />
            </button>

            {/* PSB CTA Button */}
            <div className="hidden sm:block">
              <button
                id="cta-psb-header"
                onClick={() => handleNavigation('psb')}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm shadow-md shadow-amber-950/20 hover:shadow-amber-400/20 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
              >
                <span>Daftar PSB</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-emerald-100 p-2 rounded-xl hover:bg-emerald-900/40 focus:outline-none transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-emerald-950 border-b border-emerald-900 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              
              {/* Mobile Keyword Search Form */}
              <div className="bg-emerald-900/80 border border-emerald-800/80 p-3 rounded-2xl mb-3 shadow-inner">
                <div className="text-[11px] font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-amber-400" />
                  <span>Pencarian Berdasarkan Kata Kunci</span>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    onOpenSearch(mobileKeyword.trim());
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={mobileKeyword}
                    onChange={(e) => setMobileKeyword(e.target.value)}
                    placeholder="Ketik kata kunci pencarian..."
                    className="bg-emerald-950/90 border border-emerald-700/80 text-white placeholder-emerald-400/60 text-xs px-3.5 py-2 rounded-xl flex-1 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow flex-shrink-0"
                  >
                    Cari
                  </button>
                </form>
              </div>

              {/* Beranda */}
              <button
                onClick={() => handleNavigation('hero')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === 'hero' ? 'bg-emerald-900 text-amber-300 font-bold' : 'text-emerald-100'
                }`}
              >
                Beranda
              </button>

              {/* Profil Accordion */}
              <div className="border border-emerald-900/80 rounded-xl overflow-hidden bg-emerald-900/30">
                <button
                  onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-emerald-100"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-amber-300" />
                    <span>Profil</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileProfileOpen && (
                  <div className="px-2 pb-2 space-y-1 bg-emerald-950/60 pt-1">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.target, item.subParam)}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-emerald-200 hover:text-amber-200 hover:bg-emerald-900/50 flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] text-emerald-400">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Update Info Accordion */}
              <div className="border border-emerald-900/80 rounded-xl overflow-hidden bg-emerald-900/30">
                <button
                  onClick={() => setMobileInfoOpen(!mobileInfoOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-emerald-100"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-300" />
                    <span>Update Info</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileInfoOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileInfoOpen && (
                  <div className="px-2 pb-2 space-y-1 bg-emerald-950/60 pt-1">
                    {infoMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.target, item.subParam)}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-emerald-200 hover:text-amber-200 hover:bg-emerald-900/50 flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] text-emerald-400">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PSB */}
              <button
                onClick={() => handleNavigation('psb')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === 'psb' ? 'bg-emerald-900 text-amber-300 font-bold' : 'text-emerald-100'
                }`}
              >
                Pendaftaran PSB
              </button>

              {/* Hubungi Kami */}
              <button
                onClick={() => handleNavigation('contact')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === 'contact' ? 'bg-emerald-900 text-amber-300 font-bold' : 'text-emerald-100'
                }`}
              >
                Hubungi Kami
              </button>

              {/* Mobile CTA */}
              <div className="pt-2">
                <button
                  onClick={() => handleNavigation('psb')}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3 rounded-xl shadow-md text-center text-sm"
                >
                  Daftar Santri Baru (PSB)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
