import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Bell, 
  Calendar as CalendarIcon, 
  Database, 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Eye,
  X,
  Lock,
  Loader2,
  BookOpen,
  Image as ImageIcon,
  UserCheck,
  Globe,
  FileText,
  Edit2,
  Search,
  Filter,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';
import { PesantrenEvent } from './EventCalendar';

interface PSBRegistrant {
  id: string;
  fullName: string;
  nisn: string;
  nis?: string;
  schoolName?: string;
  majorProgram?: string;
  schoolAddress?: string;
  nickname?: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  religion?: string;
  citizenship?: string;
  childOrder?: string;
  siblingsCount?: string;
  stepSiblingsCount?: string;
  adoptedSiblingsCount?: string;
  orphanStatus?: string;
  dailyLanguage?: string;
  livingWith?: string;
  distanceToSchool?: string;
  transportMode?: string;
  bloodType?: string;
  illnessHistory?: string;
  hospitalTreatment?: string;
  physicalDisability?: string;
  heightCm?: string;
  weightKg?: string;
  prevSchoolLevel?: string;
  sttbNumber?: string;
  studyDuration?: string;
  programType: string;
  fatherName: string;
  motherName: string;
  parentJob: string;
  whatsapp: string;
  address: string;
  previousSchool: string;
  reportScore: string;
  boardingChoice: string;
  createdAt: string;
}

interface WebSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

interface SDMMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}

interface SantriRecord {
  id: string;
  fullName: string;
  nisn: string;
  className: string;
  gender: string;
  address: string;
  guardianName: string;
  whatsapp: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

type CategoryTab = 'laman_web' | 'sdm' | 'announcements' | 'news' | 'agenda' | 'gallery' | 'santri' | 'psb';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('laman_web');
  
  // Data States
  const [webSections, setWebSections] = useState<WebSection[]>([]);
  const [sdmMembers, setSdmMembers] = useState<SDMMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<PesantrenEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [santri, setSantri] = useState<SantriRecord[]>([]);
  const [registrations, setRegistrations] = useState<PSBRegistrant[]>([]);
  
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; usingFallback: boolean }>({ connected: false, usingFallback: true });
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Selection / Detail / Edit states
  const [selectedRegistrant, setSelectedRegistrant] = useState<PSBRegistrant | null>(null);
  const [editingWebSection, setEditingWebSection] = useState<WebSection | null>(null);
  const [editingSantri, setEditingSantri] = useState<SantriRecord | null>(null);
  const [isAddingSantri, setIsAddingSantri] = useState(false);

  // Search & Filters
  const [santriSearch, setSantriSearch] = useState('');
  const [santriGenderFilter, setSantriGenderFilter] = useState('Semua');

  // Form States
  const [newSdm, setNewSdm] = useState({ name: '', role: 'Pengasuh', description: '', imageUrl: '' });
  const [newGallery, setNewGallery] = useState({ title: '', category: 'Kegiatan', imageUrl: '' });
  const [newNews, setNewNews] = useState({ title: '', summary: '', content: '', category: 'Berita', image: '', author: 'Humas Pesantren', readTime: '3 menit baca' });
  const [newAnn, setNewAnn] = useState({
    title: '', referenceNumber: '', category: 'Penting', priority: 'normal',
    summary: '', content: '', targetAudience: 'Seluruh Wali Santri & Santri',
    issuer: 'Majelis Pengasuh PP Darul Mushtofa', validUntil: '', attachmentName: '', attachmentSize: '', isPinned: false
  });
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: '', category: 'Kajian', speaker: '', targetAudience: 'Seluruh Santri & Umum'
  });
  const [newSantriForm, setNewSantriForm] = useState({
    fullName: '', nisn: '', className: 'Kelas 10-A (Ulya)', gender: 'Laki-laki', address: '', guardianName: '', whatsapp: ''
  });

  // Verify PIN (simple admin access code: darmas2011)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'darmas2011' || password === 'admin2026') {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Kata sandi admin salah. Silakan coba lagi.');
    }
  };

  // Safe JSON fetching helper that guarantees no unexpected token HTML errors
  const safeFetchJson = async <T,>(url: string): Promise<T | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        webData,
        sdmData,
        annData,
        newsData,
        evData,
        galData,
        sanData,
        regData,
        statusData
      ] = await Promise.all([
        safeFetchJson<WebSection[]>('/api/web-sections'),
        safeFetchJson<SDMMember[]>('/api/sdm'),
        safeFetchJson<Announcement[]>('/api/announcements'),
        safeFetchJson<NewsArticle[]>('/api/news'),
        safeFetchJson<PesantrenEvent[]>('/api/events'),
        safeFetchJson<GalleryItem[]>('/api/gallery'),
        safeFetchJson<SantriRecord[]>('/api/santri'),
        safeFetchJson<PSBRegistrant[]>('/api/registrations'),
        safeFetchJson<{ connected: boolean; usingFallback: boolean }>('/api/db-status')
      ]);

      if (webData) setWebSections(webData);
      if (sdmData) setSdmMembers(sdmData);
      if (annData) setAnnouncements(annData);
      if (newsData) setNews(newsData);
      if (evData) setEvents(evData);
      if (galData) setGallery(galData);
      if (sanData) setSantri(sanData);
      if (regData) setRegistrations(regData);
      if (statusData) setDbStatus(statusData);
    } catch (err: any) {
      console.warn('Notice loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4500);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 4500);
  };

  // --- DELETE HANDLERS ---
  const handleDeleteItem = async (endpoint: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>, successMessage: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini? Tindakan ini permanen.')) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(successMessage);
        setter(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menghapus data dari basis data Supabase');
    }
  };

  // --- POST / UPDATE HANDLERS ---
  const handleUpdateWebSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWebSection) return;
    try {
      const res = await fetch('/api/web-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingWebSection)
      });
      if (res.ok) {
        showToast(`Laman Web "${editingWebSection.title}" berhasil diperbarui!`);
        setEditingWebSection(null);
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal memperbarui Laman Web');
    }
  };

  const handleAddSdm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sdm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSdm)
      });
      if (res.ok) {
        showToast('Anggota SDM Baru berhasil ditambahkan!');
        setNewSdm({ name: '', role: 'Pengasuh', description: '', imageUrl: '' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan SDM');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGallery)
      });
      if (res.ok) {
        showToast('Foto Galeri berhasil dipublikasikan!');
        setNewGallery({ title: '', category: 'Kegiatan', imageUrl: '' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan galeri');
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNews)
      });
      if (res.ok) {
        showToast('Artikel Berita berhasil dipublikasikan!');
        setNewNews({ title: '', summary: '', content: '', category: 'Berita', image: '', author: 'Humas Pesantren', readTime: '3 menit baca' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal mempublikasikan berita');
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAnn, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) })
      });
      if (res.ok) {
        showToast('Pengumuman resmi berhasil diterbitkan!');
        setNewAnn({
          title: '', referenceNumber: '', category: 'Penting', priority: 'normal',
          summary: '', content: '', targetAudience: 'Seluruh Wali Santri & Santri',
          issuer: 'Majelis Pengasuh PP Darul Mushtofa', validUntil: '', attachmentName: '', attachmentSize: '', isPinned: false
        });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menerbitkan pengumuman');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateParts = newEvent.date.split('-');
      let formattedDate = newEvent.date;
      if (dateParts.length === 3) {
        const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, date: formattedDate })
      });
      if (res.ok) {
        showToast('Agenda acara berhasil dijadwalkan!');
        setNewEvent({ title: '', date: '', time: '', location: '', description: '', category: 'Kajian', speaker: '', targetAudience: 'Seluruh Santri & Umum' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan agenda acara');
    }
  };

  const handleSaveSantri = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingSantri || { id: `san-${Date.now()}`, ...newSantriForm };
    try {
      const res = await fetch('/api/santri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(editingSantri ? 'Data santri berhasil diperbarui!' : 'Data santri baru berhasil ditambahkan!');
        setEditingSantri(null);
        setIsAddingSantri(false);
        setNewSantriForm({ fullName: '', nisn: '', className: 'Kelas 10-A (Ulya)', gender: 'Laki-laki', address: '', guardianName: '', whatsapp: '' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan data santri');
    }
  };

  // Filtered Santri List
  const filteredSantri = santri.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(santriSearch.toLowerCase()) || s.nisn.includes(santriSearch);
    const matchesGender = santriGenderFilter === 'Semua' || s.gender === santriGenderFilter;
    return matchesSearch && matchesGender;
  });

  // Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-neutral-50 flex items-center justify-center min-h-[85vh] px-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/85 max-w-md w-full shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif">Akses Panel Administrator</h2>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Masukkan kata sandi khusus administrator untuk mengelola database web utama, SDM pengasuh, pengumuman, berita, agenda, galeri, dan database santri.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder="Ketik kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 text-sm bg-neutral-50"
                />
              </div>
              <span className="text-[10px] text-neutral-400 mt-1.5 block">
                Gunakan kata sandi <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-emerald-800">darmas2011</code> atau <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-emerald-800">admin2026</code>
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200/60 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              Masuk ke Panel Admin <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: CategoryTab; name: string; icon: any; count?: number }[] = [
    { id: 'laman_web', name: '1. Laman Web', icon: Globe, count: webSections.length },
    { id: 'sdm', name: '2. SDM (Pengasuh)', icon: Users, count: sdmMembers.length },
    { id: 'announcements', name: '3. Pengumuman', icon: Bell, count: announcements.length },
    { id: 'news', name: '4. Artikel Berita', icon: BookOpen, count: news.length },
    { id: 'agenda', name: '5. Agenda', icon: CalendarIcon, count: events.length },
    { id: 'gallery', name: '6. Galeri', icon: ImageIcon, count: gallery.length },
    { id: 'santri', name: '7. Database Santri', icon: Database, count: santri.length },
    { id: 'psb', name: 'Pendaftar PSB', icon: UserCheck, count: registrations.length }
  ];

  return (
    <div className="py-12 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-200/40">
                Sesi Administrator Aktif
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                dbStatus.connected 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {dbStatus.connected ? '⚡ Supabase Connected' : '🔌 Local Fallback'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-emerald-950 font-serif mt-2.5">
              Kelola Database Pesantren
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Pusat pengelolaan mandiri data website, civitas pengasuh, informasi, serta data induk santri.
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-red-750 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors self-start md:self-center"
          >
            Keluar Sesi Admin
          </button>
        </div>

        {/* Action Status Toasts */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 shadow-xs"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold">{actionSuccess}</span>
            </motion.div>
          )}

          {actionError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-950 rounded-2xl flex items-center gap-3 shadow-xs"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-xs font-bold">{actionError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Layout: Sidebar Navigation + Tab Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Menu */}
          <div className="lg:col-span-3 space-y-2">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 pl-3">
              Kategori Basis Data
            </span>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setEditingWebSection(null);
                      setEditingSantri(null);
                      setIsAddingSantri(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-nowrap lg:w-full ${
                      isSelected
                        ? 'bg-emerald-900 text-white shadow-md font-extrabold'
                        : 'bg-white text-neutral-700 border border-neutral-200/80 hover:border-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-amber-400' : 'text-emerald-800'}`} />
                    <span className="flex-1 text-left">{tab.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-850 text-amber-300' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Working Area */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm min-h-[500px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-800 mb-4" />
                <p className="text-xs font-bold text-neutral-600">Sinkronisasi database...</p>
              </div>
            )}

            {!isLoading && (
              <div>
                
                {/* CATEGORY 1: LAMAN WEB */}
                {activeTab === 'laman_web' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">1. Laman Web (Profil & Visi Misi)</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Kelola isi teks profil, sejarah berdirinya pesantren, serta visi & misi utama.</p>
                    </div>

                    {editingWebSection ? (
                      <form onSubmit={handleUpdateWebSection} className="space-y-4 max-w-3xl bg-neutral-55 p-6 rounded-2xl border border-neutral-200/70">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <h3 className="font-bold text-xs text-emerald-900 uppercase">Mengedit Bagian: {editingWebSection.id.toUpperCase()}</h3>
                          <button type="button" onClick={() => setEditingWebSection(null)} className="text-neutral-450 hover:text-neutral-750">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-750 uppercase mb-1">Judul Laman</label>
                          <input
                            type="text"
                            required
                            value={editingWebSection.title}
                            onChange={e => setEditingWebSection({...editingWebSection, title: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-750 uppercase mb-1">Konten Utama (Dukung Teks Panjang)</label>
                          <textarea
                            required
                            rows={10}
                            value={editingWebSection.content}
                            onChange={e => setEditingWebSection({...editingWebSection, content: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none font-sans leading-relaxed"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingWebSection(null)}
                            className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                          >
                            Simpan Perubahan
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        {webSections.map(sec => (
                          <div key={sec.id} className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-neutral-900 text-sm">{sec.title}</h3>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                                  {sec.id}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">{sec.content}</p>
                              <span className="text-[10px] text-neutral-450 block">Pembaruan Terakhir: {sec.lastUpdated}</span>
                            </div>
                            <button
                              onClick={() => setEditingWebSection(sec)}
                              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 font-bold text-xs text-emerald-900 flex items-center gap-1.5 self-start md:self-auto shadow-2xs"
                            >
                              <Edit2 className="h-3.5 w-3.5" /> Edit Konten
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CATEGORY 2: SDM */}
                {activeTab === 'sdm' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">2. SDM & Pengasuh Pondok</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Daftar asatidzah, guru-guru pembimbing utama, dan dewan pengurus struktural pondok pesantren.</p>
                    </div>

                    <form onSubmit={handleAddSdm} className="p-5 rounded-2xl border border-emerald-100/60 bg-emerald-50/20 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <h3 className="font-bold text-xs text-emerald-950 uppercase border-b border-emerald-100 pb-1.5 md:col-span-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Tambah SDM / Pengasuh Baru
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: KH. Ahmad Syafi'i"
                          value={newSdm.name}
                          onChange={e => setNewSdm({...newSdm, name: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Jabatan / Peran</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Pengasuh Utama / Dewan Fikih"
                          value={newSdm.role}
                          onChange={e => setNewSdm({...newSdm, role: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Deskripsi Singkat / Biografi</label>
                        <textarea
                          rows={2}
                          placeholder="Alumni, membina majelis apa..."
                          value={newSdm.description}
                          onChange={e => setNewSdm({...newSdm, description: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">URL Foto Profil (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newSdm.imageUrl}
                          onChange={e => setNewSdm({...newSdm, imageUrl: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                        >
                          Simpan Pengasuh
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sdmMembers.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl border border-neutral-200/80 bg-white flex gap-3.5 items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <img 
                              src={m.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                              alt={m.name} 
                              className="w-12 h-12 rounded-full object-cover border border-neutral-100 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-neutral-900 text-xs leading-tight">{m.name}</h4>
                              <span className="text-[10px] text-emerald-850 font-bold block mt-0.5">{m.role}</span>
                              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1">{m.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('/api/sdm', m.id, setSdmMembers, 'Data pengasuh berhasil dihapus!')}
                            className="p-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CATEGORY 3: ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">3. Kelola Pengumuman Resmi</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Unggah pengumuman, surat edaran berkala, maklumat, atau info libur pesantren.</p>
                    </div>

                    <form onSubmit={handleAddAnnouncement} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-1.5 md:col-span-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Publikasikan Pengumuman Baru
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul Pengumuman</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Maklumat Libur Ramadhan"
                          value={newAnn.title}
                          onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nomor Surat / Referensi</label>
                        <input
                          type="text"
                          placeholder="Misal: 025/PP-DM/IX/2026"
                          value={newAnn.referenceNumber}
                          onChange={e => setNewAnn({...newAnn, referenceNumber: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori</label>
                        <select
                          value={newAnn.category}
                          onChange={e => setNewAnn({...newAnn, category: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        >
                          <option value="Penting">Penting</option>
                          <option value="Informasi">Informasi</option>
                          <option value="Akademik">Akademik</option>
                          <option value="Kegiatan">Kegiatan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Penerbit</label>
                        <input
                          type="text"
                          value={newAnn.issuer}
                          onChange={e => setNewAnn({...newAnn, issuer: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Ringkasan Singkat</label>
                        <input
                          type="text"
                          required
                          placeholder="Ringkasan satu baris tentang pengumuman ini..."
                          value={newAnn.summary}
                          onChange={e => setNewAnn({...newAnn, summary: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Isi Lengkap Pengumuman</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tulis maklumat lengkap di sini..."
                          value={newAnn.content}
                          onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none leading-relaxed"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPinned"
                          checked={newAnn.isPinned}
                          onChange={e => setNewAnn({...newAnn, isPinned: e.target.checked})}
                          className="rounded text-emerald-800 focus:ring-emerald-800"
                        />
                        <label htmlFor="isPinned" className="text-xs font-bold text-neutral-700 select-none">
                          Sematkan Pengumuman ini di Atas (Pin Announcement)
                        </label>
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-800">
                          Terbitkan Pengumuman
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {announcements.map(ann => (
                        <div key={ann.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              {ann.isPinned && <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[8px] font-bold">PINNED</span>}
                              <h4 className="font-bold text-neutral-900 text-xs">{ann.title}</h4>
                              <span className="text-[9px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-650">{ann.category}</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 block mt-1">No: {ann.referenceNumber || '-'} | Tanggal: {ann.date}</span>
                            <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed">{ann.summary}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('/api/announcements', ann.id, setAnnouncements, 'Pengumuman resmi berhasil dihapus!')}
                            className="p-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CATEGORY 4: ARTIKEL BERITA */}
                {activeTab === 'news' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">4. Artikel & Berita Kegiatan</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Kelola publikasi berita kegiatan harian santri, opini pengasuh, kabar madrasah, dan prestasi.</p>
                    </div>

                    <form onSubmit={handleAddNews} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-1.5 md:col-span-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Publikasikan Artikel Berita Baru
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul Artikel Berita</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Pembukaan Kajian Kitab Kuning Ramadhan"
                          value={newNews.title}
                          onChange={e => setNewNews({...newNews, title: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori Berita</label>
                        <select
                          value={newNews.category}
                          onChange={e => setNewNews({...newNews, category: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        >
                          <option value="Berita">Berita</option>
                          <option value="Kegiatan">Kegiatan</option>
                          <option value="Prestasi">Prestasi</option>
                          <option value="Opini">Opini</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Ringkasan Pendek (Summary)</label>
                        <input
                          type="text"
                          required
                          placeholder="Satu kalimat ringkasan artikel..."
                          value={newNews.summary}
                          onChange={e => setNewNews({...newNews, summary: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Isi Artikel Berita (Dukung Paragraf Panjang)</label>
                        <textarea
                          required
                          rows={6}
                          placeholder="Tulis artikel lengkap di sini..."
                          value={newNews.content}
                          onChange={e => setNewNews({...newNews, content: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">URL Ilustrasi Foto Berita</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newNews.image}
                          onChange={e => setNewNews({...newNews, image: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Penulis (Author)</label>
                        <input
                          type="text"
                          value={newNews.author}
                          onChange={e => setNewNews({...newNews, author: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-800">
                          Publikasikan Berita
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 gap-4">
                      {news.map(art => (
                        <div key={art.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex gap-4 items-start justify-between">
                          <div className="flex gap-4">
                            <img 
                              src={art.image || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300'} 
                              alt={art.title} 
                              className="w-16 h-16 rounded-xl object-cover border border-neutral-100 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-neutral-900 text-xs">{art.title}</h4>
                                <span className="text-[9px] bg-emerald-50 text-emerald-850 border border-emerald-100 font-bold px-2 py-0.2 rounded">{art.category}</span>
                              </div>
                              <span className="text-[10px] text-neutral-400 block mt-1">Oleh: {art.author} | {art.date}</span>
                              <p className="text-xs text-neutral-650 mt-1.5 line-clamp-2">{art.summary}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('/api/news', art.id, setNews, 'Artikel berita berhasil dihapus!')}
                            className="p-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CATEGORY 5: AGENDA */}
                {activeTab === 'agenda' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">5. Agenda & Acara Kegiatan</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Kelola jadwal kalender kegiatan pondok pesantren, hari libur, kajian akbar, maupun ujian semester.</p>
                    </div>

                    <form onSubmit={handleAddEvent} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-1.5 md:col-span-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Jadwalkan Agenda Kegiatan Baru
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul Agenda / Acara</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Haflah Akhirussanah Pesantren"
                          value={newEvent.title}
                          onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Tanggal Acara</label>
                        <input
                          type="date"
                          required
                          value={newEvent.date}
                          onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Waktu Acara</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 08:00 WIB - Selesai"
                          value={newEvent.time}
                          onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Lokasi Tempat</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Masjid Jami PP Darul Mushtofa"
                          value={newEvent.location}
                          onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Pembicara / Narasumber (Optional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Al-Habib Salim bin Umar"
                          value={newEvent.speaker}
                          onChange={e => setNewEvent({...newEvent, speaker: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori Agenda</label>
                        <select
                          value={newEvent.category}
                          onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        >
                          <option value="Kajian">Kajian Rutin</option>
                          <option value="Ujian">Ujian / Madrasah</option>
                          <option value="Penting">Hari Penting</option>
                          <option value="Sosial">Khidmat Sosial</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Keterangan Singkat</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Deskripsi agenda atau maklumat tambahan..."
                          value={newEvent.description}
                          onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-800">
                          Simpan ke Agenda
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {events.map(ev => (
                        <div key={ev.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-neutral-900 text-xs">{ev.title}</h4>
                              <span className="text-[9px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">{ev.category}</span>
                            </div>
                            <span className="text-[10px] text-emerald-850 font-bold block mt-1">{ev.date} • {ev.time} • {ev.location}</span>
                            {ev.speaker && <span className="text-[10px] text-neutral-500 block mt-0.5 font-medium">Pembicara: {ev.speaker}</span>}
                            <p className="text-xs text-neutral-600 mt-2">{ev.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('/api/events', ev.id, setEvents, 'Agenda kegiatan berhasil dihapus!')}
                            className="p-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CATEGORY 6: GALERI */}
                {activeTab === 'gallery' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">6. Galeri Foto Kegiatan</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Unggah foto-foto dokumentasi fasilitas, majelis sholawat, aktivitas kajian kitab, dan sarana pondok.</p>
                    </div>

                    <form onSubmit={handleAddGallery} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-1.5 md:col-span-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Publikasikan Foto Galeri Baru
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul / Keterangan Foto</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Majelis Khataman Qur'an"
                          value={newGallery.title}
                          onChange={e => setNewGallery({...newGallery, title: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori Dokumentasi</label>
                        <select
                          value={newGallery.category}
                          onChange={e => setNewGallery({...newGallery, category: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        >
                          <option value="Kegiatan">Kegiatan</option>
                          <option value="Fasilitas">Fasilitas</option>
                          <option value="Prestasi">Prestasi</option>
                          <option value="Ziarah">Ziarah / Safari</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">URL Sumber Gambar (Image Link)</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newGallery.imageUrl}
                          onChange={e => setNewGallery({...newGallery, imageUrl: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-800">
                          Unggah ke Galeri
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {gallery.map(item => (
                        <div key={item.id} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-2xs group relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-36 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="p-3">
                            <span className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100">{item.category}</span>
                            <h4 className="font-bold text-neutral-900 text-[11px] mt-1.5 leading-tight line-clamp-1">{item.title}</h4>
                            <span className="text-[9px] text-neutral-450 block mt-1">Diupload: {item.date}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteItem('/api/gallery', item.id, setGallery, 'Foto galeri berhasil dihapus!')}
                            className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-red-50 hover:text-red-700 text-neutral-500 rounded-lg shadow-sm transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CATEGORY 7: DATABASE SANTRI */}
                {activeTab === 'santri' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">7. Database Induk Santri</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Kelola seluruh data induk santri resmi yang saat ini mukim dan menempuh pendidikan.</p>
                      </div>
                      
                      {!editingSantri && !isAddingSantri && (
                        <button
                          onClick={() => setIsAddingSantri(true)}
                          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start shadow-xs"
                        >
                          <Plus className="h-4 w-4" /> Tambah Santri Manual
                        </button>
                      )}
                    </div>

                    {isAddingSantri || editingSantri ? (
                      <form onSubmit={handleSaveSantri} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                        <div className="flex items-center justify-between md:col-span-2 border-b border-neutral-200 pb-2">
                          <h3 className="font-bold text-xs text-emerald-950 uppercase">
                            {editingSantri ? 'Ubah Data Induk Santri' : 'Input Data Santri Baru'}
                          </h3>
                          <button 
                            type="button" 
                            onClick={() => { setEditingSantri(null); setIsAddingSantri(false); }} 
                            className="text-neutral-450 hover:text-neutral-750"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nama Lengkap Santri</label>
                          <input
                            type="text"
                            required
                            placeholder="Ahmad Fauzi"
                            value={editingSantri ? editingSantri.fullName : newSantriForm.fullName}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, fullName: e.target.value}) : setNewSantriForm({...newSantriForm, fullName: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">NISN (10 Digit)</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="0098765432"
                            value={editingSantri ? editingSantri.nisn : newSantriForm.nisn}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, nisn: e.target.value}) : setNewSantriForm({...newSantriForm, nisn: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kelas / Madrasah</label>
                          <select
                            value={editingSantri ? editingSantri.className : newSantriForm.className}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, className: e.target.value}) : setNewSantriForm({...newSantriForm, className: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          >
                            <option value="Kelas 10-A (Ulya)">Kelas 10-A (Ulya)</option>
                            <option value="Kelas 10-B (Ulya)">Kelas 10-B (Ulya)</option>
                            <option value="Kelas 11-A (Ulya)">Kelas 11-A (Ulya)</option>
                            <option value="Kelas 12-A (Ulya)">Kelas 12-A (Ulya)</option>
                            <option value="Kelas 7 (Wustha)">Kelas 7 (Wustha)</option>
                            <option value="Kelas 8 (Wustha)">Kelas 8 (Wustha)</option>
                            <option value="Kelas 9 (Wustha)">Kelas 9 (Wustha)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Jenis Kelamin</label>
                          <select
                            value={editingSantri ? editingSantri.gender : newSantriForm.gender}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, gender: e.target.value}) : setNewSantriForm({...newSantriForm, gender: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          >
                            <option value="Laki-laki">Laki-laki (Santriwan)</option>
                            <option value="Perempuan">Perempuan (Santriwati)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nama Wali / Orang Tua</label>
                          <input
                            type="text"
                            required
                            placeholder="Sutrisno"
                            value={editingSantri ? editingSantri.guardianName : newSantriForm.guardianName}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, guardianName: e.target.value}) : setNewSantriForm({...newSantriForm, guardianName: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">WA Wali (Aktif)</label>
                          <input
                            type="text"
                            required
                            placeholder="081234567890"
                            value={editingSantri ? editingSantri.whatsapp : newSantriForm.whatsapp}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, whatsapp: e.target.value}) : setNewSantriForm({...newSantriForm, whatsapp: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Alamat Domisili Lengkap</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Alamat asal daerah..."
                            value={editingSantri ? editingSantri.address : newSantriForm.address}
                            onChange={e => editingSantri ? setEditingSantri({...editingSantri, address: e.target.value}) : setNewSantriForm({...newSantriForm, address: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditingSantri(null); setIsAddingSantri(false); }}
                            className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-850"
                          >
                            Simpan Data
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        {/* Search & Filter bar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <input
                              type="text"
                              placeholder="Cari santri berdasarkan nama / NISN..."
                              value={santriSearch}
                              onChange={e => setSantriSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-650 bg-white px-3 py-1.5 rounded-xl border border-neutral-200">
                              <Filter className="h-3 w-3 text-emerald-800" />
                              Filter Gender:
                            </div>
                            <select
                              value={santriGenderFilter}
                              onChange={e => setSantriGenderFilter(e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            >
                              <option value="Semua">Semua</option>
                              <option value="Laki-laki">Santriwan</option>
                              <option value="Perempuan">Santriwati</option>
                            </select>
                          </div>
                        </div>

                        <div className="overflow-x-auto border border-neutral-150 rounded-2xl bg-white">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-neutral-50 border-b border-neutral-150 text-neutral-650 font-bold uppercase tracking-wider">
                                <th className="p-4">Nama Lengkap</th>
                                <th className="p-4">NISN</th>
                                <th className="p-4">Kelas</th>
                                <th className="p-4">Gender</th>
                                <th className="p-4">Wali Orangtua</th>
                                <th className="p-4 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {filteredSantri.map(s => (
                                <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors">
                                  <td className="p-4 font-bold text-neutral-900">{s.fullName}</td>
                                  <td className="p-4 font-mono text-neutral-600">{s.nisn}</td>
                                  <td className="p-4 font-semibold text-emerald-950">{s.className}</td>
                                  <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      s.gender === 'Laki-laki' ? 'bg-blue-50 text-blue-900 border-blue-200/50' : 'bg-pink-50 text-pink-900 border-pink-200/50'
                                    }`}>
                                      {s.gender}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="text-xs font-semibold">{s.guardianName}</div>
                                    <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-800 hover:underline">{s.whatsapp}</a>
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() => setEditingSantri(s)}
                                        className="p-1.5 text-neutral-600 hover:text-emerald-800 hover:bg-neutral-100 rounded-lg transition-colors"
                                        title="Ubah Data"
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem('/api/santri', s.id, setSantri, 'Data induk santri berhasil dihapus!')}
                                        className="p-1.5 text-neutral-400 hover:text-red-750 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Data"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {filteredSantri.length === 0 && (
                            <div className="text-center py-12 text-neutral-450">
                              Tidak ditemukan data santri yang cocok.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PENDAFTAR PSB (ONLINE) VIEW */}
                {activeTab === 'psb' && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg font-black text-emerald-950 font-serif">Calon Santri Baru (Pendaftar Online)</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Pantau pendaftaran calon santri baru secara real-time yang melakukan pengisian formulir online.</p>
                    </div>

                    <div className="overflow-x-auto border border-neutral-150 rounded-2xl bg-white">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-150 text-neutral-600 font-bold uppercase tracking-wider">
                            <th className="p-4">No. Registrasi</th>
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">NISN</th>
                            <th className="p-4">Jenjang</th>
                            <th className="p-4">Pilihan Asrama</th>
                            <th className="p-4">Kontak Wali</th>
                            <th className="p-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {registrations.map(reg => (
                            <tr key={reg.id} className="hover:bg-neutral-50/55 transition-colors">
                              <td className="p-4 font-mono font-bold text-emerald-800">{reg.id}</td>
                              <td className="p-4 font-bold text-neutral-900">{reg.fullName}</td>
                              <td className="p-4 text-neutral-600">{reg.nisn}</td>
                              <td className="p-4">
                                <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-100">
                                  {reg.programType}
                                </span>
                              </td>
                              <td className="p-4">{reg.boardingChoice}</td>
                              <td className="p-4">
                                <a 
                                  href={`https://wa.me/${reg.whatsapp.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-emerald-800 font-bold hover:underline"
                                >
                                  {reg.whatsapp}
                                </a>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedRegistrant(reg)}
                                    className="p-1.5 text-neutral-600 hover:text-emerald-800 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Lihat Formulir Lengkap"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem('/api/registrations', reg.id, setRegistrations, 'Data registrasi PSB berhasil dihapus!')}
                                    className="p-1.5 text-neutral-400 hover:text-red-750 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Registrasi"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {registrations.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-16 text-neutral-450">
                                Belum ada pendaftar baru saat ini.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* PSB Detail Modal */}
      <AnimatePresence>
        {selectedRegistrant && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-emerald-950 text-white">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-850 px-2 py-0.5 rounded text-amber-300">
                    ID REGISTRASI: {selectedRegistrant.id}
                  </span>
                  <h3 className="text-sm font-bold font-serif mt-1">Formulir Pendaftaran Calon Santri Baru</h3>
                </div>
                <button
                  onClick={() => setSelectedRegistrant(null)}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-emerald-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Header Information */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">NIS / NISN</span>
                      <strong className="text-neutral-900 font-mono">{selectedRegistrant.nis || '-'} / {selectedRegistrant.nisn}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Jenjang / Program</span>
                      <strong className="text-emerald-800">{selectedRegistrant.programType}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Pilihan Asrama</span>
                      <strong className="text-neutral-900">{selectedRegistrant.boardingChoice}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Tanggal Daftar</span>
                      <span className="text-neutral-600 font-mono text-[11px]">{selectedRegistrant.createdAt ? new Date(selectedRegistrant.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                    </div>
                  </div>
                </div>

                {/* A. KETERANGAN PRIBADI */}
                <div>
                  <h4 className="font-black text-xs text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-200">
                    A. Keterangan Pribadi
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Nama Lengkap (Akta):</span>
                      <span className="font-bold text-neutral-900">{selectedRegistrant.fullName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Nama Panggilan:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.nickname || '-'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Jenis Kelamin:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.gender}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Tempat, Tgl Lahir:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.birthPlace}, {selectedRegistrant.birthDate}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Agama & Kewarganegaraan:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.religion || 'Islam'} / {selectedRegistrant.citizenship || 'WNI'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Anak Ke- / Status Yatim:</span>
                      <span className="font-semibold text-neutral-800">Ke-{selectedRegistrant.childOrder || '1'} ({selectedRegistrant.orphanStatus || 'Bukan'})</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-400 block text-[10px]">Saudara (Kandung / Tiri / Angkat):</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedRegistrant.siblingsCount || '0'} kandung, {selectedRegistrant.stepSiblingsCount || '0'} tiri, {selectedRegistrant.adoptedSiblingsCount || '0'} angkat
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Bahasa Sehari-hari:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.dailyLanguage || 'Bahasa Indonesia'}</span>
                    </div>
                  </div>
                </div>

                {/* B. KETERANGAN TEMPAT TINGGAL */}
                <div>
                  <h4 className="font-black text-xs text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-200">
                    B. Keterangan Tempat Tinggal
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-3 bg-neutral-50 p-3 rounded-xl border border-neutral-150">
                      <span className="text-neutral-400 block text-[10px]">Alamat Lengkap Rumah:</span>
                      <span className="font-bold text-neutral-850 leading-relaxed block mt-0.5">{selectedRegistrant.address}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Tinggal Dengan:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.livingWith || 'Orang Tua'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Jarak ke Sekolah:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.distanceToSchool || '-'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Transportasi:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.transportMode || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* C. KETERANGAN KESEHATAN */}
                <div>
                  <h4 className="font-black text-xs text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-200">
                    C. Keterangan Kesehatan
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Golongan Darah:</span>
                      <span className="font-bold text-red-600">{selectedRegistrant.bloodType || '-'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Tinggi / Berat:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.heightCm || '-'} cm / {selectedRegistrant.weightKg || '-'} kg</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Kelainan Jasmani:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.physicalDisability || 'Tidak ada'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Riwayat Sakit / Rawat:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.illnessHistory || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* D. KETERANGAN PENDIDIKAN SEBELUMNYA */}
                <div>
                  <h4 className="font-black text-xs text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-200">
                    D. Keterangan Pendidikan Sebelumnya
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Asal Sekolah (SLTP/SD/MI):</span>
                      <span className="font-bold text-neutral-900">{selectedRegistrant.prevSchoolLevel || selectedRegistrant.previousSchool}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">No. STTB / Ijazah:</span>
                      <span className="font-mono text-neutral-800">{selectedRegistrant.sttbNumber || '-'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Lama Belajar:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.studyDuration || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* E. ORANG TUA / WALI */}
                <div>
                  <h4 className="font-black text-xs text-emerald-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-200">
                    E. Data Orang Tua / Wali
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Nama Ayah:</span>
                      <span className="font-bold text-neutral-900">{selectedRegistrant.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Nama Ibu:</span>
                      <span className="font-bold text-neutral-900">{selectedRegistrant.motherName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Pekerjaan:</span>
                      <span className="font-semibold text-neutral-800">{selectedRegistrant.parentJob}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">No. WhatsApp:</span>
                      <span className="font-mono font-bold text-emerald-800">{selectedRegistrant.whatsapp}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-neutral-150 flex items-center justify-between gap-3 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold text-neutral-700 rounded-xl bg-white hover:bg-neutral-100 flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" /> Cetak Lembar Buku Induk
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRegistrant(null)}
                    className="px-4 py-2 border border-neutral-200 text-xs font-bold text-neutral-600 rounded-xl bg-white hover:bg-neutral-100"
                  >
                    Tutup
                  </button>
                  <a
                    href={`https://wa.me/${selectedRegistrant.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 flex items-center gap-1 shadow-xs"
                  >
                    Hubungi Wali via WA
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
