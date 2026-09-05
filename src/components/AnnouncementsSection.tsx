import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  FileText,
  Calendar,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  ChevronRight,
  Building2,
  ShieldCheck,
  Filter,
  X,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ANNOUNCEMENTS_DATA } from '../data/announcementsData';
import { Announcement } from '../types';
import PesantrenLogo from './PesantrenLogo';

interface AnnouncementsSectionProps {
  initialAnnouncementId?: string;
  initialCategory?: string;
  onNavigate?: (sectionId: string, subParam?: string) => void;
}

export default function AnnouncementsSection({
  initialAnnouncementId,
  initialCategory = 'Semua',
  onNavigate
}: AnnouncementsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS_DATA);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
          // If database is empty, seed it with initial announcements data
          console.log('Announcements table is empty, seeding...');
          await fetch('/api/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ announcements: ANNOUNCEMENTS_DATA })
          });
          // Attempt refetch
          const refetchRes = await fetch('/api/announcements');
          const refetchData = await refetchRes.json();
          if (refetchData && refetchData.length > 0) {
            setAnnouncements(refetchData);
          }
        }
      } catch (err) {
        console.warn('Using offline static announcements data:', err);
        setAnnouncements(ANNOUNCEMENTS_DATA);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (initialAnnouncementId) {
      const found = announcements.find(a => a.id === initialAnnouncementId);
      if (found) {
        setActiveAnnouncement(found);
      }
    }
  }, [initialAnnouncementId, announcements]);

  const categories = ['Semua', 'Penting', 'PSB', 'Wali Santri', 'Akademik', 'Umum'];

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCategory =
      selectedCategory === 'Semua' || ann.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ann.title.toLowerCase().includes(query) ||
      ann.referenceNumber.toLowerCase().includes(query) ||
      ann.summary.toLowerCase().includes(query) ||
      ann.content.toLowerCase().includes(query) ||
      ann.targetAudience.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (ann: Announcement) => {
    const text = `*PENGUMUMAN RESMI PP. DARUL MUSHTOFA ASSUNNIYYAH*\n\n*${ann.title}*\nNo. Surat: ${ann.referenceNumber}\nTanggal: ${ann.date}\nSasaran: ${ann.targetAudience}\n\n${ann.summary}\n\nBaca selengkapnya di website resmi pesantren.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Detail View: Official Notice Letter Format
  if (activeAnnouncement) {
    return (
      <div className="py-10 sm:py-16 bg-neutral-100/60 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => {
                setActiveAnnouncement(null);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-900 bg-white px-4 py-2.5 rounded-xl border border-neutral-200/90 shadow-sm hover:bg-neutral-50 active:scale-95 transition-all"
            >
              ← Kembali ke Daftar Pengumuman
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/90 shadow-sm transition-all"
                title="Cetak Surat Maklumat"
              >
                <Printer className="h-4 w-4 text-emerald-700" />
                <span className="hidden sm:inline">Cetak</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(activeAnnouncement)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 rounded-xl border border-emerald-200 shadow-sm transition-all"
              >
                <Share2 className="h-4 w-4 text-emerald-700" />
                <span>Bagikan WA</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/90 shadow-sm transition-all"
              >
                {copiedNotification ? 'Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </div>

          {/* Official Letter Paper Document Layout */}
          <div className="bg-white rounded-3xl border border-neutral-300/80 shadow-xl overflow-hidden print:border-none print:shadow-none">
            {/* Top Official Banner with Islamic Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 border-b-4 border-amber-400">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="w-16 h-16 bg-white rounded-2xl p-1.5 shadow-lg flex items-center justify-center flex-shrink-0">
                  <PesantrenLogo variant="emerald" className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                    MAKLUMAT & SURAT EDARAN RESMI
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                    Pondok Pesantren Darul Mushthofa Assunniyyah
                  </h2>
                  <p className="text-emerald-200/90 text-xs sm:text-sm mt-0.5">
                    Jl. Kyai Mukmin, Dusun Krajan, Desa Yosowilangun Kidul, Kec. Yosowilangun, Kab. Lumajang, Jawa Timur 67382
                  </p>
                </div>
              </div>
            </div>

            {/* Official Reference Metadata Grid */}
            <div className="bg-neutral-50 border-b border-neutral-200/80 px-6 sm:px-8 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 font-medium block">Nomor Surat:</span>
                  <span className="font-mono font-bold text-emerald-950">{activeAnnouncement.referenceNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium block">Tanggal Terbit:</span>
                  <span className="font-semibold text-neutral-800">{activeAnnouncement.date}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium block">Ditujukan Kepada:</span>
                  <span className="font-semibold text-emerald-850">{activeAnnouncement.targetAudience}</span>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Category & Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  activeAnnouncement.category === 'Penting'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : activeAnnouncement.category === 'PSB'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  Kategori: {activeAnnouncement.category}
                </span>

                {activeAnnouncement.isPinned && (
                  <span className="bg-amber-400 text-emerald-950 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                    ★ Pengumuman Utama
                  </span>
                )}

                <span className="bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 border border-neutral-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Penerbit: {activeAnnouncement.issuer}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif leading-snug">
                {activeAnnouncement.title}
              </h1>

              {/* Summary Highlight Box */}
              <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-4 sm:p-5 text-sm text-emerald-950 leading-relaxed font-medium">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-600 text-white mt-0.5 flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-emerald-900 font-bold mb-1">Ringkasan Inti Maklumat:</strong>
                    {activeAnnouncement.summary}
                  </div>
                </div>
              </div>

              {/* Formatted Content Text */}
              <div 
                className="text-neutral-800 text-sm sm:text-base leading-relaxed font-normal pt-2 wysiwyg-content"
                dangerouslySetInnerHTML={{ __html: activeAnnouncement.content }}
              />

              {/* Attachment Download Box with Google Drive Link */}
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Unduh Dokumen & Berkas Pengumuman:
                </h4>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <Download className="h-5 w-5 text-emerald-800" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">
                        {activeAnnouncement.attachmentName || `Dokumen_${activeAnnouncement.title.substring(0, 25)}.pdf`}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Arsip Dokumen Resmi ({activeAnnouncement.attachmentSize || 'Google Drive File'})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={activeAnnouncement.googleDriveUrl || 'https://drive.google.com/drive/folders/1official-pp-darulmushtofa'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto justify-center"
                      title="Buka dan unduh dokumen dari Google Drive"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Unduh via Google Drive</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Official Verification Seal & Sign-off */}
              <div className="mt-10 pt-6 border-t border-neutral-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-800">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 text-sm">Dokumen Terverifikasi Sah</h5>
                    <p className="text-xs text-neutral-500">Dikeluarkan oleh Sekretariat PP. Darul Mushtofa Assunniyyah</p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-neutral-200 sm:pl-6 w-full sm:w-auto">
                  <p className="text-xs text-neutral-400">Yosowilangun, Lumajang</p>
                  <p className="text-xs font-bold text-emerald-950 mt-1">{activeAnnouncement.issuer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View: Official Notice Board Layout
  return (
    <div className="py-12 sm:py-16 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wider mb-4 shadow-sm">
            <Bell className="h-3.5 w-3.5 text-amber-700" />
            <span>Papan Pengumuman Resmi Pesantren</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif tracking-tight">
            Maklumat & Surat Edaran
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-3 leading-relaxed">
            Kanal resmi publikasi surat edaran, tata tertib santri, jadwal akademik, pengumuman PSB, dan pemberitahuan penting bagi segenap wali santri serta masyarakat.
          </p>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor surat, perihal, atau kata kunci..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-xs sm:text-sm placeholder-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    selectedCategory === cat
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notice Info Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100">
            <span>
              Menampilkan <strong>{filteredAnnouncements.length}</strong> surat maklumat resmi
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-850 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Dipublikasikan oleh Sekretariat PP. Darul Mushtofa
            </span>
          </div>
        </div>

        {/* Announcements List / Cards */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-neutral-800 text-base">Tidak Ada Pengumuman Ditemukan</h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Coba gunakan kata kunci pencarian yang lain atau ganti kategori filter di atas.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => {
              const isPinned = ann.isPinned;
              const isHighPriority = ann.priority === 'high';

              return (
                <div
                  key={ann.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg p-5 sm:p-6 ${
                    isPinned
                      ? 'border-amber-400/90 shadow-md ring-1 ring-amber-400/30'
                      : 'border-neutral-200/90 hover:border-emerald-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="space-y-2 flex-1">
                      {/* Top Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {isPinned && (
                          <span className="bg-amber-400 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-sm">
                            ★ PENTING
                          </span>
                        )}

                        <span className="font-mono text-emerald-950 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          {ann.referenceNumber}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          ann.category === 'Penting'
                            ? 'bg-red-50 text-red-700'
                            : ann.category === 'PSB'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {ann.category}
                        </span>

                        <span className="text-neutral-400 flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3" />
                          {ann.date}
                        </span>

                        <span className="text-neutral-500 text-[11px] bg-neutral-100 px-2 py-0.5 rounded">
                          Sasaran: <strong>{ann.targetAudience}</strong>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => {
                          setActiveAnnouncement(ann);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="text-base sm:text-lg font-bold text-neutral-900 hover:text-emerald-800 cursor-pointer transition-colors font-serif leading-snug"
                      >
                        {ann.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-4xl line-clamp-2">
                        {ann.summary}
                      </p>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                      <button
                        onClick={() => {
                          setActiveAnnouncement(ann);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="flex-1 md:flex-initial bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span>Baca Maklumat</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>

                      <a
                        href={ann.googleDriveUrl || 'https://drive.google.com/drive/folders/1official-pp-darulmushtofa'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-initial bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all border border-emerald-200"
                        title="Unduh berkas dokumen via Google Drive"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-emerald-700" />
                        <span className="text-[11px] font-bold">Drive Unduh</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Official Secretariat Contact Banner */}
        <div className="mt-12 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl flex-shrink-0">
                📢
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-base">Butuh Klarifikasi Surat atau Pengumuman?</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Hubungi Sekretariat Pondok Pesantren Darul Mushtofa Assunniyyah untuk informasi lebih lanjut mengenai tata tertib dan perizinan santri.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Assalamu%27alaikum%20Admin%20Sekretariat%20PP%20Darul%20Mushtofa,%20saya%20ingin%20menanyakan%20mengenai%20surat%20edaran%20pengumuman"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Hubungi Sekretariat WA</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
