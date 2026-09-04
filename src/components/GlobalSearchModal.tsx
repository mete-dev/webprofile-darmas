import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Calendar,
  FileText,
  Phone,
  School,
  Sparkles,
  ChevronRight,
  ClipboardList,
  Compass,
  MapPin,
  Clock,
  Tag,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Building2,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PESANTREN_INFO,
  PROGRAMS,
  NEWS_ARTICLES,
  INSTITUTIONS_DATA,
  EXTRACURRICULARS_DATA,
  VISION_MISSION,
  CORE_VALUES,
} from '../data/pesantrenData';
import { ANNOUNCEMENTS_DATA } from '../data/announcementsData';
import { UPCOMING_EVENTS } from '../data/eventsData';

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  fullKeywords: string[];
  category: 'Pengumuman' | 'Berita' | 'Pendidikan' | 'PSB' | 'Ekstrakurikuler' | 'Agenda' | 'Profil' | 'Fasilitas' | 'Kontak';
  targetSection: string;
  subParam?: string;
  badgeColor: string;
  metaText?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string, subParam?: string) => void;
  initialKeyword?: string;
}

// Popular keyword suggestions for quick search
const POPULAR_KEYWORDS = [
  'PSB 2026',
  'Syarat Pendaftaran',
  'Biaya Syahriyah',
  'Surat Libur Santri',
  'Maklumat Kedatangan',
  'Kitab Kuning Salaf',
  'Tahfidz Al-Qur\'an',
  'Madrasah Diniyah',
  'MTs Darul Mushtofa',
  'MA Darul Mushtofa',
  'Ekstrakurikuler Hadrah',
  'Jadwal Kunjungan Walisantri',
  'Tata Tertib Santri',
  'KH Ali Sibro Mulisi',
  'Lokasi Yosowilangun',
];

// Helper to highlight matching keywords safely
function HighlightedText({ text, searchTerms }: { text: string; searchTerms: string[] }) {
  if (!searchTerms.length || !text) return <span>{text}</span>;

  // Filter terms with length > 1 and escape regex special characters
  const validTerms = searchTerms
    .filter((t) => t.trim().length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!validTerms.length) return <span>{text}</span>;

  try {
    const regex = new RegExp(`(${validTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => {
          const isMatch = validTerms.some(
            (term) => part.toLowerCase() === term.toLowerCase()
          );
          return isMatch ? (
            <mark
              key={i}
              className="bg-amber-200 text-emerald-950 font-bold px-1 py-0.5 rounded shadow-sm mx-0.5 inline-block"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
  initialKeyword = '',
}: GlobalSearchModalProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initialKeyword when opened
  useEffect(() => {
    if (isOpen) {
      if (initialKeyword) {
        setKeyword(initialKeyword);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    } else {
      setKeyword('');
      setActiveTab('Semua');
    }
  }, [isOpen, initialKeyword]);

  // Global ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Comprehensive index of all searchable content across the pesantren
  const searchIndex: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Pengumuman Resmi (Surat Edaran, Maklumat)
    ANNOUNCEMENTS_DATA.forEach((ann) => {
      items.push({
        id: `ann-${ann.id}`,
        title: ann.title,
        snippet: `${ann.referenceNumber} • Diterbitkan: ${ann.date} • ${ann.summary}`,
        fullKeywords: [
          'pengumuman',
          'surat edaran',
          'maklumat',
          ann.referenceNumber,
          ann.category,
          ann.issuer,
          ann.priority,
          ann.summary,
          ann.content,
          ann.validUntil || '',
          'perihal',
          'resmi'
        ],
        category: 'Pengumuman',
        targetSection: 'announcements',
        subParam: ann.id,
        badgeColor: 'bg-amber-300 text-emerald-950 font-bold',
        metaText: `Surat Edaran No. ${ann.referenceNumber}`
      });
    });

    // 2. Artikel & Berita Kegiatan Pesantren
    NEWS_ARTICLES.forEach((art) => {
      items.push({
        id: `news-${art.id}`,
        title: art.title,
        snippet: `${art.date} • Oleh ${art.author} (${art.readTime}) • ${art.summary}`,
        fullKeywords: [
          'berita',
          'artikel',
          'kabar',
          art.category,
          art.author,
          art.summary,
          art.content,
          'kajian',
          'liputan',
          'opini'
        ],
        category: 'Berita',
        targetSection: 'news',
        subParam: art.id,
        badgeColor: 'bg-emerald-100 text-emerald-900 font-semibold',
        metaText: `Kategori: ${art.category} • ${art.date}`
      });
    });

    // 3. Program Pendidikan & Kitab Kuning
    PROGRAMS.forEach((prog) => {
      items.push({
        id: `prog-${prog.id}`,
        title: prog.title,
        snippet: `${prog.description} • Kategori: ${prog.category}`,
        fullKeywords: [
          'program',
          'kurikulum',
          'pendidikan',
          'kitab kuning',
          'salaf',
          'tahfidz',
          prog.title,
          prog.category,
          prog.description,
          ...prog.features,
          'fathul qorib',
          'jurumiyah',
          'imrithi',
          'alfiyah',
          'nahwu',
          'sharaf',
          'fiqih'
        ],
        category: 'Pendidikan',
        targetSection: 'programs',
        badgeColor: 'bg-blue-100 text-blue-900 font-semibold',
        metaText: `Kategori: ${prog.category}`
      });
    });

    // 4. Lembaga Pendidikan Formal & Non-Formal
    INSTITUTIONS_DATA.forEach((inst) => {
      items.push({
        id: `inst-${inst.id}`,
        title: inst.name,
        snippet: `${inst.level} • Akreditasi: ${inst.accreditation || '-'} • Pimpinan: ${inst.lead} • ${inst.description}`,
        fullKeywords: [
          'lembaga',
          'sekolah',
          'madrasah',
          inst.name,
          inst.level,
          inst.accreditation || '',
          inst.lead,
          inst.curriculum,
          inst.description,
          ...inst.highlights,
          'mts',
          'ma',
          'madin',
          'tpq',
          'formal',
          'non formal'
        ],
        category: 'Pendidikan',
        targetSection: 'profile',
        subParam: 'institutions',
        badgeColor: 'bg-blue-100 text-blue-900 font-semibold',
        metaText: `Jenjang: ${inst.level}`
      });
    });

    // 5. Ekstrakurikuler Santri
    EXTRACURRICULARS_DATA.forEach((extra) => {
      items.push({
        id: `extra-${extra.id}`,
        title: extra.name,
        snippet: `Kategori: ${extra.category} • Jadwal: ${extra.schedule} • Pembina: ${extra.coach} • ${extra.description}`,
        fullKeywords: [
          'ekstrakurikuler',
          'kegiatan santri',
          'minat bakat',
          extra.name,
          extra.category,
          extra.schedule,
          extra.coach,
          extra.description,
          extra.achievements,
          'hadrah',
          'sholawat',
          'pagar nusa',
          'silat',
          'kaligrafi',
          'muhadhoroh',
          'pramuka'
        ],
        category: 'Ekstrakurikuler',
        targetSection: 'profile',
        subParam: 'extracurricular',
        badgeColor: 'bg-amber-100 text-amber-900 font-semibold',
        metaText: `Jadwal: ${extra.schedule}`
      });
    });

    // 6. Kalender & Agenda Kegiatan
    UPCOMING_EVENTS.forEach((ev) => {
      items.push({
        id: `ev-${ev.id}`,
        title: ev.title,
        snippet: `Tanggal: ${ev.date} • Pukul ${ev.time} • Lokasi: ${ev.location} • ${ev.description}`,
        fullKeywords: [
          'agenda',
          'jadwal',
          'kalender',
          'kegiatan',
          'acara',
          ev.title,
          ev.date,
          ev.category,
          ev.location,
          ev.description,
          'ujian',
          'haul',
          'libur',
          'maulid'
        ],
        category: 'Agenda',
        targetSection: 'calendar',
        badgeColor: 'bg-purple-100 text-purple-900 font-semibold',
        metaText: `${ev.date} (${ev.time})`
      });
    });

    // 7. Informasi PSB & Pendaftaran Santri Baru
    items.push({
      id: 'psb-alur-syarat',
      title: 'Penerimaan Santri Baru (PSB) 2026/2027: Alur & Persyaratan Berkas',
      snippet: 'Persyaratan: Mengisi formulir, fotokopi Kartu Keluarga (KK), Akta Kelahiran, Ijazah/SKL, pas foto santri, tes baca Al-Qur\'an dan wawancara walisantri.',
      fullKeywords: [
        'psb',
        'penerimaan santri baru',
        'pendaftaran',
        'syarat pendaftaran',
        'berkas',
        'ijazah',
        'akta kelahiran',
        'kartu keluarga',
        'pas foto',
        'tes baca quran',
        'wawancara',
        'formulir',
        'santri baru',
        'gelombang 1',
        'gelombang 2',
        'online'
      ],
      category: 'PSB',
      targetSection: 'psb',
      badgeColor: 'bg-amber-300 text-emerald-950 font-bold',
      metaText: 'Portal Resmi PSB 2026'
    });

    items.push({
      id: 'psb-biaya-rincian',
      title: 'Rincian Biaya PSB, Infaq Pembangunan & Syahriyah Bulanan',
      snippet: 'Informasi lengkap biaya pendaftaran santri baru, seragam pesantren, kitab panduan, kasur asrama, infaq jariyah pembangunan, dan syahriyah (SPP) bulanan.',
      fullKeywords: [
        'biaya',
        'biaya pendaftaran',
        'biaya masuk',
        'syahriyah',
        'spp bulanan',
        'seragam',
        'infaq',
        'pembangunan',
        'asrama',
        'kitab',
        'uang makan',
        'keuangan',
        'beasiswa',
        'santri yatim',
        'keringanan'
      ],
      category: 'PSB',
      targetSection: 'psb',
      badgeColor: 'bg-amber-300 text-emerald-950 font-bold',
      metaText: 'Keuangan & Biaya Masuk'
    });

    // 8. Profil, Sejarah, Pengasuh & Nilai Luhur Pesantren
    items.push({
      id: 'prof-history',
      title: 'Sejarah PP Darul Mushtofa Assunniyyah Yosowilangun',
      snippet: `Didirikan tahun ${PESANTREN_INFO.foundedYear} oleh ${PESANTREN_INFO.founder} bersama Nyai Hj. Ummu Muhammad Ali di Yosowilangun Kidul, Lumajang, Jawa Timur.`,
      fullKeywords: [
        'sejarah',
        'profil',
        'pendiri',
        'pengasuh',
        'kh ali sibro mulisi',
        'nyai ummu muhammad ali',
        'yosowilangun',
        'lumajang',
        'rowosugo',
        '1998',
        'salafiyah',
        'ahlussunnah wal jamaah'
      ],
      category: 'Profil',
      targetSection: 'profile',
      subParam: 'history',
      badgeColor: 'bg-emerald-100 text-emerald-900 font-semibold',
      metaText: `Didirikan Tahun ${PESANTREN_INFO.foundedYear}`
    });

    items.push({
      id: 'prof-vision',
      title: 'Visi, Misi & Tujuan Pendidikan Pesantren',
      snippet: `${VISION_MISSION.vision} Melahirkan generasi ulama tafaqquh fid-din yang berakhlaqul karimah.`,
      fullKeywords: [
        'visi',
        'misi',
        'tujuan',
        'filosofi',
        'karakter',
        'akhlak',
        'tafaqquh fid din',
        'qurani',
        'mutqin'
      ],
      category: 'Profil',
      targetSection: 'profile',
      subParam: 'vision',
      badgeColor: 'bg-emerald-100 text-emerald-900 font-semibold',
      metaText: 'Visi Misi Pesantren'
    });

    items.push({
      id: 'prof-values',
      title: 'Panca Jiwa & Nilai Luhur PP Darul Mushtofa Assunniyyah',
      snippet: CORE_VALUES.map((v) => `${v.title}: ${v.description}`).join(' • '),
      fullKeywords: [
        'nilai luhur',
        'panca jiwa',
        'karakter santri',
        'keikhlasan',
        'al-ikhlas',
        'akhlaqul karimah',
        'kemandirian',
        'kesederhanaan',
        'ukhuwah'
      ],
      category: 'Profil',
      targetSection: 'profile',
      subParam: 'values',
      badgeColor: 'bg-emerald-100 text-emerald-900 font-semibold',
      metaText: 'Panca Jiwa Pesantren'
    });

    // 9. Fasilitas Pesantren
    items.push({
      id: 'fasilitas-pesantren',
      title: 'Fasilitas & Sarana Prasarana Santri',
      snippet: 'Masjid Jami\' Darul Mushtofa, Kompleks Asrama Putra & Putri, Gedung Madrasah, Laboratorium Komputer & Bahasa, Perpustakaan Kitab Salaf, Klinik Kesehatan Santri, dan Kantin Koperasi.',
      fullKeywords: [
        'fasilitas',
        'sarana',
        'gedung',
        'masjid',
        'asrama',
        'perpustakaan',
        'laboratorium',
        'klinik',
        'koperasi',
        'lapangan',
        'kamar santri'
      ],
      category: 'Fasilitas',
      targetSection: 'gallery',
      badgeColor: 'bg-teal-100 text-teal-900 font-semibold',
      metaText: 'Sarana & Lingkungan Pesantren'
    });

    // 10. Kontak, Lokasi & Rute Kedatangan
    items.push({
      id: 'contact-location',
      title: 'Alamat Lengkap, Nomor WhatsApp & Lokasi Google Maps',
      snippet: `${PESANTREN_INFO.address}. Call Center / WA Resmi: ${PESANTREN_INFO.whatsapp}, Email: ${PESANTREN_INFO.email}.`,
      fullKeywords: [
        'kontak',
        'alamat',
        'telepon',
        'whatsapp',
        'lokasi',
        'peta',
        'maps',
        'rute',
        'yosowilangun',
        'lumajang',
        'rowosugo',
        'email',
        'jam layanan'
      ],
      category: 'Kontak',
      targetSection: 'contact',
      badgeColor: 'bg-teal-100 text-teal-900 font-semibold',
      metaText: `${PESANTREN_INFO.address}`
    });

    return items;
  }, []);

  // Split query into keywords/terms (filtering empty words)
  const searchTerms = useMemo(() => {
    return keyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length >= 2);
  }, [keyword]);

  // Keyword Matching & Relevance Scoring Algorithm
  const searchResults = useMemo(() => {
    if (searchTerms.length === 0) {
      return [];
    }

    const scoredItems: { item: SearchResultItem; score: number }[] = [];

    searchIndex.forEach((item) => {
      // Tab Category Filtering
      if (activeTab !== 'Semua') {
        if (activeTab === 'Pengumuman' && item.category !== 'Pengumuman') return;
        if (activeTab === 'Berita' && item.category !== 'Berita') return;
        if (activeTab === 'Pendidikan' && item.category !== 'Pendidikan') return;
        if (activeTab === 'PSB' && item.category !== 'PSB') return;
        if (activeTab === 'Ekstrakurikuler' && item.category !== 'Ekstrakurikuler') return;
        if (activeTab === 'Agenda' && item.category !== 'Agenda') return;
        if (activeTab === 'Profil' && item.category !== 'Profil' && item.category !== 'Fasilitas' && item.category !== 'Kontak') return;
      }

      const titleLower = item.title.toLowerCase();
      const snippetLower = item.snippet.toLowerCase();
      const categoryLower = item.category.toLowerCase();
      const fullKeywordsLower = item.fullKeywords.join(' ').toLowerCase();
      const combinedText = `${titleLower} ${snippetLower} ${categoryLower} ${fullKeywordsLower}`;

      let matchCount = 0;
      let relevanceScore = 0;

      for (const term of searchTerms) {
        if (combinedText.includes(term)) {
          matchCount++;
          // Higher score if matched in title
          if (titleLower.includes(term)) {
            relevanceScore += 40;
          }
          // Score for matching in explicit keywords/tags
          if (fullKeywordsLower.includes(term)) {
            relevanceScore += 25;
          }
          // Score for matching in snippet
          if (snippetLower.includes(term)) {
            relevanceScore += 15;
          }
          // Score for matching category
          if (categoryLower.includes(term)) {
            relevanceScore += 10;
          }
        }
      }

      // Check full phrase match
      const fullPhrase = searchTerms.join(' ');
      if (titleLower.includes(fullPhrase)) {
        relevanceScore += 60;
      } else if (snippetLower.includes(fullPhrase)) {
        relevanceScore += 30;
      }

      // If at least one keyword matched, include it
      if (matchCount > 0) {
        // Boost if all search terms matched
        if (matchCount === searchTerms.length) {
          relevanceScore += 50;
        }
        scoredItems.push({
          item,
          score: relevanceScore + matchCount * 15,
        });
      }
    });

    // Sort by highest relevance score first
    return scoredItems
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [searchTerms, searchIndex, activeTab]);

  const handleSelectItem = (item: SearchResultItem) => {
    onNavigate(item.targetSection, item.subParam);
    onClose();
  };

  const handleKeywordClick = (suggestedKeyword: string) => {
    setKeyword(suggestedKeyword);
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Keep focus or blur as needed
  };

  const filterTabs = [
    { label: 'Semua', key: 'Semua' },
    { label: 'Pengumuman Resmi', key: 'Pengumuman' },
    { label: 'Artikel & Berita', key: 'Berita' },
    { label: 'Program Pendidikan', key: 'Pendidikan' },
    { label: 'PSB & Biaya', key: 'PSB' },
    { label: 'Ekstrakurikuler', key: 'Ekstrakurikuler' },
    { label: 'Agenda & Kegiatan', key: 'Agenda' },
    { label: 'Profil & Fasilitas', key: 'Profil' },
  ];

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Pengumuman':
        return <Bell className="h-4 w-4 text-amber-800" />;
      case 'Berita':
        return <FileText className="h-4 w-4 text-emerald-800" />;
      case 'Pendidikan':
        return <School className="h-4 w-4 text-blue-800" />;
      case 'Ekstrakurikuler':
        return <Sparkles className="h-4 w-4 text-amber-800" />;
      case 'Agenda':
        return <Calendar className="h-4 w-4 text-purple-800" />;
      case 'Profil':
        return <Compass className="h-4 w-4 text-emerald-850" />;
      case 'PSB':
        return <ClipboardList className="h-4 w-4 text-amber-800" />;
      case 'Fasilitas':
        return <Building2 className="h-4 w-4 text-teal-800" />;
      case 'Kontak':
        return <Phone className="h-4 w-4 text-teal-800" />;
      default:
        return <BookOpen className="h-4 w-4 text-neutral-700" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="keyword-search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:pt-14 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="keyword-search-modal"
            initial={{ scale: 0.95, y: -15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -15, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Distinct Keyword Search Identity */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white border-b border-emerald-800/80">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md flex-shrink-0">
                    <Search className="h-6 w-6 text-emerald-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                        Pencarian Berdasarkan Keyword
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold font-serif text-white mt-1">
                      Pencarian Kata Kunci Terpadu
                    </h2>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      Cari informasi pesantren menggunakan kata kunci spesifik (syarat, biaya, jadwal libur, kitab salaf, tahfidz, dll).
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-keyword-search"
                  onClick={onClose}
                  className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors flex-shrink-0"
                  aria-label="Tutup pencarian"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Real Keyword Search Form Input */}
              <form onSubmit={handleFormSubmit} className="mt-5 relative flex items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                    <Search className="h-5 w-5 text-amber-400" />
                  </div>
                  <input
                    ref={inputRef}
                    id="keyword-search-input"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Ketik kata kunci pencarian (misal: syarat santri baru, biaya, jadwal libur, kitab fiqih)..."
                    className="w-full bg-white/95 text-neutral-900 placeholder-neutral-500 text-sm sm:text-base font-medium pl-12 pr-10 py-3.5 rounded-2xl border-2 border-emerald-700/60 focus:border-amber-400 focus:outline-none focus:bg-white shadow-inner transition-all"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword('');
                        inputRef.current?.focus();
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                      title="Hapus kata kunci"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="ml-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 sm:px-5 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Cari</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Popular Keyword Suggestions Bar */}
            <div className="px-5 py-3 bg-neutral-100/90 border-b border-neutral-200/80">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                  <Tag className="h-3 w-3 text-amber-600" />
                  Kata Kunci Populer:
                </span>
                {POPULAR_KEYWORDS.map((item) => {
                  const isCurrent = keyword.toLowerCase() === item.toLowerCase();
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleKeywordClick(item)}
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-150 border ${
                        isCurrent
                          ? 'bg-emerald-900 text-amber-300 border-emerald-800 font-bold shadow-sm'
                          : 'bg-white text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 border-neutral-200/90 hover:border-emerald-300'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Tabs by Category */}
            <div className="px-5 py-2.5 bg-white border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-neutral-400 text-[11px] font-semibold mr-1 flex-shrink-0 flex items-center gap-1">
                <Filter className="h-3 w-3 text-neutral-500" />
                Filter:
              </span>
              {filterTabs.map((tab) => {
                const isSelected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Results Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-[260px]">
              {searchTerms.length > 0 ? (
                searchResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs text-neutral-500 pb-1 border-b border-neutral-100">
                      <span>
                        Ditemukan <strong className="text-emerald-900 font-bold">{searchResults.length} hasil</strong> untuk kata kunci:{' '}
                        <strong className="text-amber-800">"{keyword}"</strong>
                      </span>
                      <span className="text-[11px] text-neutral-400 hidden sm:inline">
                        Klik kartu untuk membuka halaman
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          className="w-full text-left p-4 rounded-2xl border border-neutral-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-md transition-all duration-150 flex items-start justify-between gap-3 group bg-white"
                        >
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            <div className="mt-0.5 p-2.5 rounded-xl bg-neutral-100 group-hover:bg-white group-hover:shadow-sm transition-colors flex-shrink-0">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.badgeColor}`}>
                                  {item.category}
                                </span>
                                {item.metaText && (
                                  <span className="text-[11px] text-neutral-400 font-medium truncate">
                                    • {item.metaText}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-emerald-950 transition-colors leading-snug">
                                <HighlightedText text={item.title} searchTerms={searchTerms} />
                              </h3>

                              <p className="text-xs text-neutral-600 line-clamp-2 mt-1.5 leading-relaxed">
                                <HighlightedText text={item.snippet} searchTerms={searchTerms} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-3 sm:mt-2">
                            <span className="hidden sm:inline">Buka</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  // No results state
                  <div className="text-center py-12 px-4 bg-neutral-50/80 rounded-2xl border border-dashed border-neutral-300 my-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Tidak ada hasil untuk kata kunci "{keyword}"
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                      Kata kunci yang Anda masukkan tidak cocok dengan data surat pengumuman, kurikulum, artikel, atau PSB.
                    </p>

                    <div className="mt-5 p-3.5 bg-white rounded-xl border border-neutral-200 max-w-sm mx-auto text-left">
                      <span className="text-[11px] font-bold text-neutral-700 block mb-1.5">
                        💡 Tips Pencarian Kata Kunci:
                      </span>
                      <ul className="text-xs text-neutral-500 space-y-1 list-disc pl-4">
                        <li>Gunakan kata dasar seperti <strong className="text-emerald-800">"biaya"</strong> atau <strong className="text-emerald-800">"syarat"</strong></li>
                        <li>Coba kata kunci alternatif (misal: <strong className="text-emerald-800">"tahfidz"</strong> atau <strong className="text-emerald-800">"hadrah"</strong>)</li>
                        <li>Klik salah satu tombol <em>Kata Kunci Populer</em> di atas.</li>
                      </ul>
                    </div>
                  </div>
                )
              ) : (
                // Initial prompt state when input is empty
                <div className="py-8 px-4 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                      <Tag className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Pencarian Berdasarkan Kata Kunci
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Silakan ketik kata kunci yang ingin Anda cari pada kotak pencarian di atas, atau klik salah satu rekomendasi kata kunci populer berikut:
                    </p>

                    {/* Quick Suggestions Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5 text-left">
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Syarat Pendaftaran')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-amber-500">📝</span> Syarat Pendaftaran
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Biaya Syahriyah')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-emerald-600">💰</span> Biaya Syahriyah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Surat Libur Santri')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-amber-600">📢</span> Surat Libur Santri
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Kitab Kuning')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-blue-600">📚</span> Kitab Kuning
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Tahfidz Al-Qur\'an')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-emerald-700">📖</span> Tahfidz Qur'an
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeywordClick('Jadwal Kunjungan')}
                        className="p-2.5 rounded-xl border border-neutral-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-xs text-neutral-800 font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-purple-600">🗓️</span> Jadwal Kunjungan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Indeks Database PP Darul Mushtofa Assunniyyah
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
