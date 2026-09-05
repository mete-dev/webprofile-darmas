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
  Printer,
  ExternalLink,
  UploadCloud,
  CheckSquare,
  Square,
  Sparkles,
  Copy,
  MessageSquare,
  Pin,
  PinOff,
  ChevronDown,
  ChevronUp,
  Share2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';
import { PesantrenEvent } from './EventCalendar';
import ImageUploadWithCompression from './ImageUploadWithCompression';
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background', 'align',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

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
  showOnWeb?: boolean;
  canAccessDashboard?: boolean;
  username?: string;
  password?: string;
  permissions?: string;
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

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
}

type CategoryTab = 'laman_web' | 'sdm' | 'announcements' | 'news' | 'agenda' | 'gallery' | 'banners' | 'santri' | 'psb';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('laman_web');
  const [currentUser, setCurrentUser] = useState<string>('devdarmas@gmail.com');
  const [userPermissions, setUserPermissions] = useState<string>('all');

  // Active Admin / Writer Account (Automatic author for news)
  const [activeWriterAccount, setActiveWriterAccount] = useState<string>('Ust. Ahmad Fauzan, M.Pd. (Admin Humas)');
  
  // Data States
  const [webSections, setWebSections] = useState<WebSection[]>([]);
  const [sdmMembers, setSdmMembers] = useState<SDMMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<PesantrenEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
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
  const [editingSdm, setEditingSdm] = useState<SDMMember | null>(null);

  // Search & Filters
  const [santriSearch, setSantriSearch] = useState('');
  const [santriGenderFilter, setSantriGenderFilter] = useState('Semua');

  // Form States with new requirements:
  // 1. SDM: showOnWeb, canAccessDashboard, compressed image, username, password, permissions
  const [newSdm, setNewSdm] = useState({
    name: '',
    role: 'Pengasuh Utama',
    description: '',
    imageUrl: '',
    showOnWeb: true,
    canAccessDashboard: false,
    username: '',
    password: '',
    permissions: 'all'
  });

  // 2. Gallery: compressed image
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Kegiatan',
    imageUrl: ''
  });

  // 3. News: author automatically bound to activeWriterAccount, compressed image
  const [newNews, setNewNews] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Berita',
    image: '',
    author: 'Ust. Ahmad Fauzan, M.Pd. (Admin Humas)',
    readTime: '3 menit baca'
  });

  // User-friendly News Management State
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');
  const [previewingNews, setPreviewingNews] = useState<NewsArticle | null>(null);

  // User-friendly Gallery Management State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('Semua');

  // Banner Management State
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', isActive: true });

  // 4. Announcements: googleDriveUrl added
  const [newAnn, setNewAnn] = useState({
    title: '',
    referenceNumber: '',
    category: 'Penting',
    priority: 'normal',
    summary: '',
    content: '',
    targetAudience: 'Seluruh Wali Santri & Santri',
    issuer: 'Majelis Pengasuh PP Darul Mushtofa',
    validUntil: '',
    attachmentName: '',
    attachmentSize: '',
    isPinned: false,
    googleDriveUrl: 'https://drive.google.com/drive/folders/1-official-pp-darulmushtofa-files'
  });

  // User-friendly Announcement Management State
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] = useState('Semua');
  const [announcementPinnedOnly, setAnnouncementPinnedOnly] = useState(false);
  const [previewingAnnouncement, setPreviewingAnnouncement] = useState<Announcement | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: '', category: 'Kajian', speaker: '', targetAudience: 'Seluruh Santri & Umum'
  });

  // User-friendly Agenda Management State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('Semua');

  const [newSantriForm, setNewSantriForm] = useState({
    fullName: '', nisn: '', className: 'Kelas 10-A (Ulya)', gender: 'Laki-laki', address: '', guardianName: '', whatsapp: ''
  });

  // Verify Admin credentials or SDM member dashboard accounts
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'devdarmas@gmail.com' && password === 'darmas2011') {
      setIsAuthenticated(true);
      setAuthError('');
      setCurrentUser('devdarmas@gmail.com');
      setUserPermissions('all');
      loadData();
      return;
    }

    // Check if an SDM member with dashboard access has matching credentials
    try {
      const res = await fetch('/api/sdm');
      if (res.ok) {
        const sdmList: SDMMember[] = await res.json();
        const foundMember = sdmList.find(
          (m) =>
            m.canAccessDashboard &&
            m.username &&
            m.username.trim().toLowerCase() === username.trim().toLowerCase() &&
            m.password &&
            m.password === password
        );

        if (foundMember) {
          setIsAuthenticated(true);
          setAuthError('');
          setCurrentUser(foundMember.username || foundMember.name);
          setUserPermissions(foundMember.permissions || 'all');
          
          // Automatically set active writer account to their name and role
          setActiveWriterAccount(`${foundMember.name} (${foundMember.role})`);
          
          loadData();

          // Set active tab to the first allowed tab if they do not have full access ('all') and 'laman_web' is not allowed
          const allowedTabs = foundMember.permissions ? foundMember.permissions.split(',') : ['all'];
          if (allowedTabs[0] !== 'all' && !allowedTabs.includes('laman_web')) {
            setActiveTab(allowedTabs[0] as CategoryTab);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Error authenticating with SDM members:', err);
    }

    setAuthError('Nama pengguna atau kata sandi admin salah. Silakan coba lagi.');
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
        statusData,
        bannerData
      ] = await Promise.all([
        safeFetchJson<WebSection[]>('/api/web-sections'),
        safeFetchJson<SDMMember[]>('/api/sdm'),
        safeFetchJson<Announcement[]>('/api/announcements'),
        safeFetchJson<NewsArticle[]>('/api/news'),
        safeFetchJson<PesantrenEvent[]>('/api/events'),
        safeFetchJson<GalleryItem[]>('/api/gallery'),
        safeFetchJson<SantriRecord[]>('/api/santri'),
        safeFetchJson<PSBRegistrant[]>('/api/registrations'),
        safeFetchJson<{ connected: boolean; usingFallback: boolean }>('/api/db-status'),
        safeFetchJson<Banner[]>('/api/banners')
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
      if (bannerData) setBanners(bannerData);
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
    const payload = editingSdm ? { ...newSdm, id: editingSdm.id } : newSdm;
    try {
      const res = await fetch('/api/sdm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(editingSdm ? 'Data SDM berhasil diperbarui!' : 'Anggota SDM Baru berhasil ditambahkan!');
        setEditingSdm(null);
        setNewSdm({
          name: '',
          role: 'Pengasuh Utama',
          description: '',
          imageUrl: '',
          showOnWeb: true,
          canAccessDashboard: false,
          username: '',
          password: '',
          permissions: 'all'
        });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError(editingSdm ? 'Gagal memperbarui SDM' : 'Gagal menyimpan SDM');
    }
  };

  const handleEditSdmClick = (member: SDMMember) => {
    setEditingSdm(member);
    setNewSdm({
      name: member.name,
      role: member.role,
      description: member.description,
      imageUrl: member.imageUrl,
      showOnWeb: member.showOnWeb !== false,
      canAccessDashboard: member.canAccessDashboard === true,
      username: member.username || '',
      password: member.password || '',
      permissions: member.permissions || 'all'
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSdmSetting = async (member: SDMMember, field: 'showOnWeb' | 'canAccessDashboard') => {
    const currentValue = member[field] !== undefined ? member[field] : (field === 'showOnWeb' ? true : false);
    const updated = {
      ...member,
      [field]: !currentValue
    };
    try {
      const res = await fetch('/api/sdm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const label = field === 'showOnWeb' ? 'Tampilkan di Web' : 'Hak Akses Dashboard';
        showToast(`${label} untuk ${member.name} berhasil diubah!`);
        setSdmMembers(prev => prev.map(m => m.id === member.id ? { ...m, [field]: updated[field] } : m));
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal mengubah pengaturan SDM');
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
        setIsAddingGallery(false);
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan galeri');
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      if (res.ok) {
        showToast('Banner Utama berhasil dipublikasikan!');
        setNewBanner({ title: '', imageUrl: '', isActive: true });
        setIsAddingBanner(false);
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal menyimpan banner');
    }
  };

  const handleToggleBannerActive = async (banner: Banner) => {
    try {
      const updated = { ...banner, isActive: !banner.isActive };
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        showToast(`Banner ${updated.isActive ? 'diaktifkan' : 'dinonaktifkan'}!`);
        setBanners(prev => prev.map(b => b.id === banner.id ? updated : b));
      } else {
        throw new Error();
      }
    } catch (err) {
      showError('Gagal mengubah status banner');
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const articleToSubmit = editingNews || {
        ...newNews,
        author: activeWriterAccount
      };
      
      const url = editingNews ? `/api/news/${editingNews.id}` : '/api/news';
      const method = editingNews ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleToSubmit)
      });
      if (res.ok) {
        showToast(editingNews ? `Artikel Berita berhasil diperbarui!` : `Artikel Berita berhasil dipublikasikan oleh ${activeWriterAccount}!`);
        
        setEditingNews(null);
        setIsAddingNews(false);
        setNewNews({
          title: '',
          summary: '',
          content: '',
          category: 'Berita',
          image: '',
          author: activeWriterAccount,
          readTime: '3 menit baca'
        });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError(editingNews ? 'Gagal memperbarui berita' : 'Gagal mempublikasikan berita');
    }
  };

  const handleEditNewsClick = (newsItem: NewsArticle) => {
    setEditingNews(newsItem);
    setIsAddingNews(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingAnnouncement || { 
      ...newAnn, 
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
    };

    try {
      const url = editingAnnouncement ? `/api/announcements/${editingAnnouncement.id}` : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast(editingAnnouncement ? 'Pengumuman resmi berhasil diperbarui!' : 'Pengumuman resmi berhasil diterbitkan!');
        
        // Reset state
        setEditingAnnouncement(null);
        setIsAddingAnnouncement(false);
        setNewAnn({
          title: '', referenceNumber: '', category: 'Penting', priority: 'normal',
          summary: '', content: '', targetAudience: 'Seluruh Wali Santri & Santri',
          issuer: 'Majelis Pengasuh PP Darul Mushtofa', validUntil: '', attachmentName: '', attachmentSize: '', isPinned: false,
          googleDriveUrl: 'https://drive.google.com/drive/folders/1-official-pp-darulmushtofa-files'
        });
        
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError(editingAnnouncement ? 'Gagal memperbarui pengumuman' : 'Gagal menerbitkan pengumuman');
    }
  };

  const handleEditAnnouncementClick = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setIsAddingAnnouncement(true);
    // Scroll to form (optional, could use a ref)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventToSave = editingEvent || newEvent;
      
      // Format date beautifully if a raw ISO date was inputted
      let formattedDate = eventToSave.date;
      if (formattedDate.includes('-')) {
        const dateParts = formattedDate.split('-');
        if (dateParts.length === 3) {
          const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      }

      const payload = { ...eventToSave, date: formattedDate };
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(editingEvent ? 'Agenda acara berhasil diperbarui!' : 'Agenda acara berhasil dijadwalkan!');
        setEditingEvent(null);
        setIsAddingEvent(false);
        setNewEvent({ title: '', date: '', time: '', location: '', description: '', category: 'Kajian', speaker: '', targetAudience: 'Seluruh Santri & Umum' });
        loadData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError(editingEvent ? 'Gagal memperbarui agenda acara' : 'Gagal menyimpan agenda acara');
    }
  };

  const handleEditEventClick = (ev: any) => {
    let isoDate = '';
    try {
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const parts = ev.date.split(' ');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const monthIndex = months.indexOf(parts[1]);
        const month = String(monthIndex + 1).padStart(2, '0');
        const year = parts[2];
        if (monthIndex !== -1) {
          isoDate = `${year}-${month}-${day}`;
        }
      }
    } catch (e) {
      console.warn('Gagal memparsing tanggal:', e);
    }

    setEditingEvent({
      ...ev,
      date: isoDate || ev.date
    });
    setIsAddingEvent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-emerald-950 font-serif">Admin Portal</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Silakan masuk ke akun Anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Nama Pengguna
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="Ketik email..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 text-sm bg-neutral-50"
                />
              </div>
            </div>
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
    { id: 'banners', name: '7. Banner Utama', icon: ImageIcon, count: banners.length },
    { id: 'santri', name: '8. Database Santri (PSB)', icon: Database, count: registrations.length }
  ];

  const allowedTabs = userPermissions === 'all'
    ? tabs
    : tabs.filter(t => userPermissions.split(',').map(p => p.trim()).includes(t.id));

  return (
    <div className="py-12 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-emerald-950 font-serif tracking-tight">
              Portal Admin
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Kelola data website, civitas pengasuh, informasi, serta database santri.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border shadow-xs ${
              dbStatus.connected 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {dbStatus.connected ? '⚡ Supabase Connected' : '🔌 Local Fallback'}
            </span>
            
            {/* Akun Aktif Penulis Berita */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/80 rounded-full text-xs text-neutral-800 shadow-xs">
              <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-[10px] text-neutral-500 font-medium">Penulis:</span>
              <select
                value={activeWriterAccount}
                onChange={(e) => {
                  setActiveWriterAccount(e.target.value);
                  setNewNews(prev => ({ ...prev, author: e.target.value }));
                }}
                className="bg-transparent text-[11px] font-bold text-emerald-900 focus:outline-none cursor-pointer outline-none"
              >
                <option value="Ust. Ahmad Fauzan, M.Pd. (Admin Humas)">Ust. Ahmad Fauzan, M.Pd. (Admin Humas)</option>
                <option value="KH. Ahmad Husain (Pengasuh Utama)">KH. Ahmad Husain (Pengasuh Utama)</option>
                <option value="Ust. Muhammad Syafi'i (Sekretariat)">Ust. Muhammad Syafi'i (Sekretariat)</option>
                <option value="Redaksi Berita & Media Pondok">Redaksi Berita & Media Pondok</option>
                {sdmMembers.filter(m => m.canAccessDashboard).map(m => (
                  <option key={m.id} value={`${m.name} (${m.role})`}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="px-4 py-1.5 rounded-full text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors shadow-xs"
            >
              Keluar Sesi
            </button>
          </div>
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
              {allowedTabs.map(tab => {
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
                          <label className="block text-[10px] font-bold text-neutral-750 uppercase mb-1">Konten Utama (Editor Visual)</label>
                          <div className="rounded-xl overflow-hidden border border-neutral-200 focus-within:ring-1 focus-within:ring-emerald-800 focus-within:border-emerald-800 transition-all bg-white quill-wrapper">
                            <ReactQuill 
                              theme="snow"
                              value={editingWebSection.content}
                              onChange={(content: string) => setEditingWebSection({...editingWebSection, content})}
                              modules={quillModules}
                              formats={quillFormats}
                              className="w-full text-xs"
                            />
                          </div>
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
                              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">{sec.content.replace(/<[^>]*>?/gm, '')}</p>
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

                    <form onSubmit={handleAddSdm} className="p-5 rounded-2xl border border-emerald-150 bg-emerald-50/20 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <h3 className="font-bold text-xs text-emerald-950 uppercase border-b border-emerald-150 pb-1.5 md:col-span-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Shield className="h-4 w-4 text-emerald-800" />
                          {editingSdm ? 'Ubah Data & Kelola Hak Akses SDM' : 'Tambah SDM / Pengasuh Baru'}
                        </span>
                        {editingSdm && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSdm(null);
                              setNewSdm({
                                name: '',
                                role: 'Pengasuh Utama',
                                description: '',
                                imageUrl: '',
                                showOnWeb: true,
                                canAccessDashboard: false,
                                username: '',
                                password: '',
                                permissions: 'all'
                              });
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                          >
                            Batalkan Edit
                          </button>
                        )}
                      </h3>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: KH. Ahmad Syafi'i, Lc., M.Ag."
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
                          placeholder="Contoh: Pengasuh Utama / Dewan Fikih & Qur'an"
                          value={newSdm.role}
                          onChange={e => setNewSdm({...newSdm, role: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Deskripsi Singkat / Biografi</label>
                        <textarea
                          rows={2}
                          placeholder="Pendidikan alumni Hadramaut / Al-Azhar, mengajar kitab apa..."
                          value={newSdm.description}
                          onChange={e => setNewSdm({...newSdm, description: e.target.value})}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                        />
                      </div>

                      {/* Photo upload with compression guaranteed < 100 KB */}
                      <div className="md:col-span-2">
                        <ImageUploadWithCompression
                          value={newSdm.imageUrl}
                          onChange={(compressedBase64) => setNewSdm({ ...newSdm, imageUrl: compressedBase64 })}
                          label="Foto Profil SDM / Pengasuh (Otomatis Kompresi < 100 KB)"
                          helperText="Unggah foto langsung dari HP / laptop. Gambar akan dikompresi otomatis hingga < 100 KB demi kecepatan website."
                          aspectRatio="square"
                        />
                      </div>

                      {/* Checkboxes requested: Tampilkan di Web & Hak Akses ke Dasbord Web */}
                      <div className="md:col-span-2 p-4 bg-white rounded-2xl border border-emerald-200/80 space-y-3">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                          Hak Akses & Pengaturan Visibilitas Web
                        </span>
                        
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newSdm.showOnWeb}
                            onChange={(e) => setNewSdm({ ...newSdm, showOnWeb: e.target.checked })}
                            className="mt-0.5 w-4 h-4 text-emerald-800 rounded focus:ring-emerald-800 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">
                              Ceklis Tampilkan di Web
                            </span>
                            <p className="text-[11px] text-neutral-500">
                              Profil dan foto pengasuh akan ditampilkan pada halaman publik Profil & Tokoh Pesantren.
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none pt-2.5 border-t border-neutral-100">
                          <input
                            type="checkbox"
                            checked={newSdm.canAccessDashboard}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewSdm(prev => ({ 
                                ...prev, 
                                canAccessDashboard: checked,
                                username: checked && !prev.username ? `${prev.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@darmas.id` : prev.username
                              }));
                            }}
                            className="mt-0.5 w-4 h-4 text-emerald-800 rounded focus:ring-emerald-800 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">
                              Ceklis Hak Akses ke Dasbord Web
                            </span>
                            <p className="text-[11px] text-neutral-500">
                              Mengizinkan SDM ini sebagai akun penulis berita resmi dan pengelola Dashboard Web.
                            </p>
                          </div>
                        </label>
                        
                        {newSdm.canAccessDashboard && (
                          <div className="pt-4 border-t border-neutral-100 pl-7 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Nama Pengguna (Username untuk Login)</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Misal: ustadz@darmas.id"
                                  value={newSdm.username}
                                  onChange={e => setNewSdm({...newSdm, username: e.target.value})}
                                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kata Sandi (Password)</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Masukkan Kata Sandi"
                                  value={newSdm.password}
                                  onChange={e => setNewSdm({...newSdm, password: e.target.value})}
                                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none bg-white"
                                />
                              </div>
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60">
                              <span className="text-[10px] font-black text-emerald-950 uppercase tracking-wider block mb-2">
                                Kelola Hak Akses Dashboard (Pilih Menu yang Diizinkan):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {[
                                  { id: 'laman_web', name: 'Laman Web (Beranda, Sejarah, dsb)' },
                                  { id: 'sdm', name: 'SDM (Pengasuh & Akses)' },
                                  { id: 'announcements', name: 'Pengumuman Resmi' },
                                  { id: 'news', name: 'Artikel & Berita Berkala' },
                                  { id: 'agenda', name: 'Agenda Acara & Kegiatan' },
                                  { id: 'gallery', name: 'Galeri Foto Kegiatan' },
                                  { id: 'santri', name: 'Database Pendaftaran Santri (PSB)' }
                                ].map(menu => {
                                  const isPermitted = newSdm.permissions === 'all' || 
                                    (newSdm.permissions || '').split(',').map(s => s.trim()).includes(menu.id);
                                  
                                  return (
                                    <label key={menu.id} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-neutral-800 select-none py-1">
                                      <input
                                        type="checkbox"
                                        checked={isPermitted}
                                        onChange={() => {
                                          let currentPerms = newSdm.permissions === 'all'
                                            ? ['laman_web', 'sdm', 'announcements', 'news', 'agenda', 'gallery', 'santri']
                                            : (newSdm.permissions || '').split(',').map(s => s.trim()).filter(Boolean);
                                          
                                          if (currentPerms.includes(menu.id)) {
                                            currentPerms = currentPerms.filter(id => id !== menu.id);
                                          } else {
                                            currentPerms.push(menu.id);
                                          }
                                          
                                          if (currentPerms.length === 7) {
                                            setNewSdm(prev => ({ ...prev, permissions: 'all' }));
                                          } else {
                                            setNewSdm(prev => ({ ...prev, permissions: currentPerms.join(',') }));
                                          }
                                        }}
                                        className="w-4 h-4 text-emerald-850 rounded border-neutral-300 focus:ring-emerald-850 cursor-pointer"
                                      />
                                      <span>{menu.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                        >
                          {editingSdm ? 'Simpan Perubahan SDM' : 'Simpan Data SDM'}
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sdmMembers.map(m => {
                        const isVisibleOnWeb = m.showOnWeb !== false;
                        const hasDashboardAccess = m.canAccessDashboard === true;

                        return (
                          <div key={m.id} className="p-4 rounded-2xl border border-neutral-200/80 bg-white flex flex-col justify-between gap-3 hover:shadow-xs transition-shadow">
                            <div className="flex gap-3.5 items-start">
                              <img 
                                src={m.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                                alt={m.name} 
                                className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 flex-shrink-0 bg-neutral-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-neutral-900 text-xs leading-tight truncate">{m.name}</h4>
                                <span className="text-[10px] text-emerald-850 font-bold block mt-0.5 truncate">{m.role}</span>
                                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{m.description || 'SDM Pengasuh Pesantren'}</p>
                              </div>
                              <div className="flex flex-col gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleEditSdmClick(m)}
                                  className="p-1.5 text-neutral-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Edit Data SDM & Hak Akses"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('/api/sdm', m.id, setSdmMembers, 'Data SDM berhasil dihapus!')}
                                  className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Data SDM"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Status Badges & Quick Toggles */}
                            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Badge Tampilkan di Web */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSdmSetting(m, 'showOnWeb')}
                                  title="Klik untuk mengubah status tampil di web"
                                  className={`px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 border ${
                                    isVisibleOnWeb 
                                      ? 'bg-emerald-50 text-emerald-850 border-emerald-200 hover:bg-emerald-100' 
                                      : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isVisibleOnWeb ? 'bg-emerald-600' : 'bg-neutral-400'}`}></span>
                                  {isVisibleOnWeb ? 'Tampil di Web: Ya' : 'Tampil di Web: Tidak'}
                                </button>

                                {/* Badge Akses Dashboard */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSdmSetting(m, 'canAccessDashboard')}
                                  title="Klik untuk mengubah hak akses ke dashboard"
                                  className={`px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 border ${
                                    hasDashboardAccess 
                                      ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100' 
                                      : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                                  }`}
                                >
                                  <Shield className="h-3 w-3" />
                                  {hasDashboardAccess ? 'Akses Dasbord: Ya' : 'Akses Dasbord: Tidak'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CATEGORY 3: ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-100 pb-4 mb-6 gap-4">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">3. Kelola Pengumuman Resmi</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Unggah pengumuman, surat edaran berkala, maklumat, atau info libur pesantren.</p>
                      </div>
                      {!isAddingAnnouncement && (
                        <button
                          onClick={() => {
                            setEditingAnnouncement(null);
                            setNewAnn({
                              title: '', referenceNumber: '', category: 'Penting', priority: 'normal',
                              summary: '', content: '', targetAudience: 'Seluruh Wali Santri & Santri',
                              issuer: 'Majelis Pengasuh PP Darul Mushtofa', validUntil: '', attachmentName: '', attachmentSize: '', isPinned: false,
                              googleDriveUrl: 'https://drive.google.com/drive/folders/1-official-pp-darulmushtofa-files'
                            });
                            setIsAddingAnnouncement(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900 text-white font-bold text-[11px] rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Publikasikan Pengumuman Baru
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isAddingAnnouncement ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={handleSaveAnnouncement} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingAnnouncement(false);
                                setEditingAnnouncement(null);
                              }}
                              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            
                            <h3 className="font-bold text-sm text-neutral-800 border-b border-neutral-100 pb-3 md:col-span-2 flex items-center gap-2">
                              {editingAnnouncement ? <Edit2 className="h-4 w-4 text-amber-600" /> : <Plus className="h-4 w-4 text-emerald-700" />}
                              {editingAnnouncement ? 'Perbarui Pengumuman' : 'Publikasikan Pengumuman Baru'}
                            </h3>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Judul Pengumuman</label>
                              <input
                                type="text"
                                required
                                placeholder="Misal: Maklumat Libur Ramadhan"
                                value={editingAnnouncement ? editingAnnouncement.title : newAnn.title}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value });
                                  else setNewAnn({ ...newAnn, title: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Nomor Surat / Referensi</label>
                              <input
                                type="text"
                                placeholder="Misal: 025/PP-DM/IX/2026"
                                value={editingAnnouncement ? (editingAnnouncement.referenceNumber || '') : newAnn.referenceNumber}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, referenceNumber: e.target.value });
                                  else setNewAnn({ ...newAnn, referenceNumber: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Kategori</label>
                              <select
                                value={editingAnnouncement ? editingAnnouncement.category : newAnn.category}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value });
                                  else setNewAnn({ ...newAnn, category: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                              >
                                <option value="Penting">Penting</option>
                                <option value="Informasi">Informasi</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Kegiatan">Kegiatan</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Penerbit</label>
                              <input
                                type="text"
                                value={editingAnnouncement ? (editingAnnouncement.issuer || '') : newAnn.issuer}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, issuer: e.target.value });
                                  else setNewAnn({ ...newAnn, issuer: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Ringkasan Singkat</label>
                              <input
                                type="text"
                                required
                                placeholder="Ringkasan satu baris tentang pengumuman ini..."
                                value={editingAnnouncement ? editingAnnouncement.summary : newAnn.summary}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, summary: e.target.value });
                                  else setNewAnn({ ...newAnn, summary: e.target.value });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">Isi Lengkap Pengumuman (Editor Visual)</label>
                              <div className="rounded-xl overflow-hidden border border-neutral-200 focus-within:ring-2 focus-within:ring-emerald-900/20 focus-within:border-emerald-900 transition-all bg-white quill-wrapper">
                                <ReactQuill 
                                  theme="snow"
                                  value={editingAnnouncement ? editingAnnouncement.content : newAnn.content}
                                  onChange={(content: string) => {
                                    if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, content });
                                    else setNewAnn({ ...newAnn, content });
                                  }}
                                  modules={quillModules}
                                  formats={quillFormats}
                                  className="w-full text-xs"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1.5">
                                Tautan Berkas Google Drive (Untuk Diunduh Wali Santri / Publik)
                              </label>
                              <div className="relative">
                                <ExternalLink className="absolute left-3.5 top-2.5 h-4 w-4 text-emerald-700" />
                                <input
                                  type="url"
                                  placeholder="https://drive.google.com/file/d/... atau https://drive.google.com/drive/folders/..."
                                  value={editingAnnouncement ? (editingAnnouncement.googleDriveUrl || '') : newAnn.googleDriveUrl}
                                  onChange={e => {
                                    if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, googleDriveUrl: e.target.value });
                                    else setNewAnn({ ...newAnn, googleDriveUrl: e.target.value });
                                  }}
                                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all"
                                />
                              </div>
                              <span className="text-[10px] text-neutral-400 mt-1.5 block">
                                Masukkan URL Google Drive agar muncul tombol khusus untuk mengunduh lampiran surat/maklumat.
                              </span>
                            </div>

                            <div className="md:col-span-2 flex items-center gap-2 mt-2">
                              <input
                                type="checkbox"
                                id="isPinned"
                                checked={editingAnnouncement ? editingAnnouncement.isPinned : newAnn.isPinned}
                                onChange={e => {
                                  if (editingAnnouncement) setEditingAnnouncement({ ...editingAnnouncement, isPinned: e.target.checked });
                                  else setNewAnn({ ...newAnn, isPinned: e.target.checked });
                                }}
                                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                              />
                              <label htmlFor="isPinned" className="text-xs font-bold text-neutral-700 select-none cursor-pointer">
                                Sematkan Pengumuman ini di Atas (Pin Announcement)
                              </label>
                            </div>
                            
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingAnnouncement(false);
                                  setEditingAnnouncement(null);
                                }}
                                className="px-5 py-2.5 text-neutral-600 font-bold text-xs hover:bg-neutral-100 rounded-xl transition-colors"
                              >
                                Batal
                              </button>
                              <button type="submit" className="px-6 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all">
                                {editingAnnouncement ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row p-2 gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="Cari judul atau isi pengumuman..."
                                value={announcementSearch}
                                onChange={(e) => setAnnouncementSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none"
                              />
                            </div>
                            <div className="w-full md:w-px bg-neutral-200" />
                            <div className="flex gap-2 w-full md:w-auto">
                              <select
                                value={announcementCategoryFilter}
                                onChange={(e) => setAnnouncementCategoryFilter(e.target.value)}
                                className="px-3 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none flex-1 md:w-36 font-medium text-neutral-700"
                              >
                                <option value="Semua">Semua Kategori</option>
                                <option value="Penting">Penting</option>
                                <option value="Informasi">Informasi</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Kegiatan">Kegiatan</option>
                              </select>
                              <button
                                onClick={() => setAnnouncementPinnedOnly(!announcementPinnedOnly)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center ${
                                  announcementPinnedOnly 
                                    ? 'bg-amber-100 text-amber-900' 
                                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                                }`}
                                title="Tampilkan Hanya yang Disematkan"
                              >
                                <Pin className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {announcements
                              .filter(a => announcementCategoryFilter === 'Semua' || a.category === announcementCategoryFilter)
                              .filter(a => !announcementPinnedOnly || a.isPinned)
                              .filter(a => 
                                a.title.toLowerCase().includes(announcementSearch.toLowerCase()) || 
                                a.summary.toLowerCase().includes(announcementSearch.toLowerCase())
                              )
                              .map((ann) => (
                                <div key={ann.id} className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all flex flex-col relative h-full">
                                  {ann.isPinned && (
                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-sm border border-amber-300">
                                      <Pin className="h-3.5 w-3.5" />
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-3 gap-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                      ann.category === 'Penting' ? 'bg-red-50 text-red-700 border-red-100' :
                                      ann.category === 'Akademik' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                      'bg-neutral-100 text-neutral-600 border-neutral-200'
                                    }`}>
                                      {ann.category}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleEditAnnouncementClick(ann)}
                                        className="p-1.5 bg-neutral-100 text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                        title="Edit Pengumuman"
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteItem('/api/announcements', ann.id, setAnnouncements, 'Pengumuman resmi berhasil dihapus!')}
                                        className="p-1.5 bg-neutral-100 text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Pengumuman"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-bold text-neutral-900 text-sm mb-1.5 line-clamp-2">{ann.title}</h4>
                                  <span className="text-[10px] text-neutral-400 flex items-center gap-1.5 mb-2.5">
                                    <Clock className="h-3 w-3" /> {ann.date} {ann.referenceNumber && `| No: ${ann.referenceNumber}`}
                                  </span>
                                  
                                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                                    {ann.summary}
                                  </p>
                                  
                                  <div className="pt-3 border-t border-neutral-100 mt-auto flex justify-between items-center">
                                    {ann.googleDriveUrl ? (
                                      <a
                                        href={ann.googleDriveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 hover:text-emerald-800"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Buka Lampiran
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-neutral-400">Tidak ada lampiran</span>
                                    )}
                                    <button 
                                      onClick={() => setPreviewingAnnouncement(ann)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-900"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      Pratinjau
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {announcements.length === 0 && (
                              <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-2xl border border-neutral-200 border-dashed">
                                <Bell className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-neutral-500">Belum ada pengumuman.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pratinjau Modal */}
                    <AnimatePresence>
                      {previewingAnnouncement && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                          onClick={() => setPreviewingAnnouncement(null)}
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center p-5 border-b border-neutral-100 bg-neutral-50/50">
                              <h3 className="font-bold text-neutral-900 text-sm">Pratinjau Pengumuman</h3>
                              <button onClick={() => setPreviewingAnnouncement(null)} className="p-2 text-neutral-400 hover:bg-neutral-200 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="p-6 md:p-8 overflow-y-auto">
                              <div className="mb-6 pb-6 border-b border-neutral-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{previewingAnnouncement.category}</span>
                                  {previewingAnnouncement.isPinned && (
                                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                      <Pin className="h-3 w-3" /> Pinned
                                    </span>
                                  )}
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-emerald-950 font-serif leading-tight mb-3">
                                  {previewingAnnouncement.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {previewingAnnouncement.date}</span>
                                  <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> No: {previewingAnnouncement.referenceNumber || '-'}</span>
                                  <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> Oleh: {previewingAnnouncement.issuer || 'Pengurus'}</span>
                                </div>
                              </div>
                              
                              <div className="prose prose-sm max-w-none text-neutral-700">
                                <p className="text-sm font-medium text-neutral-900 mb-6 italic border-l-2 border-emerald-500 pl-4 py-1 bg-emerald-50/50">
                                  "{previewingAnnouncement.summary}"
                                </p>
                                <div 
                                  className="leading-relaxed text-sm wysiwyg-content"
                                  dangerouslySetInnerHTML={{ __html: previewingAnnouncement.content }}
                                />
                              </div>
                              
                              {previewingAnnouncement.googleDriveUrl && (
                                <div className="mt-8 pt-6 border-t border-neutral-100">
                                  <h4 className="text-xs font-bold text-neutral-800 uppercase mb-3 flex items-center gap-2">
                                    <UploadCloud className="h-4 w-4" /> Lampiran Berkas
                                  </h4>
                                  <a
                                    href={previewingAnnouncement.googleDriveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-between w-full p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-700">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-sm font-bold text-emerald-950">Unduh Dokumen Lampiran</p>
                                        <p className="text-[10px] text-emerald-700/80 mt-0.5">Disimpan di Google Drive</p>
                                      </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  handleEditAnnouncementClick(previewingAnnouncement);
                                  setPreviewingAnnouncement(null);
                                }}
                                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1.5"
                              >
                                <Edit2 className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => setPreviewingAnnouncement(null)}
                                className="px-5 py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-black transition-all"
                              >
                                Tutup Pratinjau
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CATEGORY 4: ARTIKEL BERITA */}
                {activeTab === 'news' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">4. Artikel & Berita Kegiatan</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Kelola publikasi berita kegiatan harian santri, opini pengasuh, kabar madrasah, dan prestasi.</p>
                      </div>
                      {!isAddingNews && (
                        <button
                          onClick={() => setIsAddingNews(true)}
                          className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="h-4 w-4" /> Publikasi Baru
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isAddingNews ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={handleSaveNews} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-2 mb-2 md:col-span-2 flex items-center gap-1.5">
                              {editingNews ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
                              {editingNews ? 'Edit Artikel Berita' : 'Publikasikan Artikel Berita Baru'}
                            </h3>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul Artikel Berita</label>
                              <input
                                type="text"
                                required
                                placeholder="Misal: Pembukaan Kajian Kitab Kuning Ramadhan"
                                value={editingNews ? editingNews.title : newNews.title}
                                onChange={e => {
                                  if (editingNews) setEditingNews({...editingNews, title: e.target.value});
                                  else setNewNews({...newNews, title: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori Berita</label>
                              <select
                                value={editingNews ? editingNews.category : newNews.category}
                                onChange={e => {
                                  if (editingNews) setEditingNews({...editingNews, category: e.target.value});
                                  else setNewNews({...newNews, category: e.target.value});
                                }}
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
                                value={editingNews ? editingNews.summary : newNews.summary}
                                onChange={e => {
                                  if (editingNews) setEditingNews({...editingNews, summary: e.target.value});
                                  else setNewNews({...newNews, summary: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Isi Artikel Berita (Editor Visual)</label>
                              <div className="rounded-xl overflow-hidden border border-neutral-200 focus-within:ring-1 focus-within:ring-emerald-850 transition-all bg-white quill-wrapper">
                                <ReactQuill 
                                  theme="snow"
                                  value={editingNews ? editingNews.content : newNews.content}
                                  onChange={(content: string) => {
                                    if (editingNews) setEditingNews({...editingNews, content});
                                    else setNewNews({...newNews, content});
                                  }}
                                  modules={quillModules}
                                  formats={quillFormats}
                                  className="w-full text-xs"
                                />
                              </div>
                            </div>
                            {/* Cover photo upload with compression < 100 KB */}
                            <div className="md:col-span-2">
                              <ImageUploadWithCompression
                                value={editingNews ? editingNews.image : newNews.image}
                                onChange={(compressedBase64) => {
                                  if (editingNews) setEditingNews({ ...editingNews, image: compressedBase64 });
                                  else setNewNews({ ...newNews, image: compressedBase64 });
                                }}
                                label="Foto Sampul Berita / Artikel (Otomatis Kompresi < 100 KB)"
                                helperText="Unggah foto langsung dari perangkat Anda. Gambar akan dikompresi berulang hingga < 100 KB secara otomatis."
                                aspectRatio="video"
                              />
                            </div>

                            {/* Penulis otomatis dari akun yang menulis */}
                            <div className="md:col-span-2 p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center flex-shrink-0">
                                  <UserCheck className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-emerald-850 uppercase tracking-wider block">
                                    Penulis Artikel Berita
                                  </span>
                                  <span className="text-xs font-black text-emerald-950">
                                    {editingNews ? editingNews.author : activeWriterAccount}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold self-start sm:self-auto border border-emerald-200/60">
                                {editingNews ? 'Penulis Disimpan' : '✓ Otomatis Dari Akun'}
                              </span>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingNews(false);
                                  setEditingNews(null);
                                }}
                                className="px-5 py-2.5 text-neutral-600 font-bold text-xs hover:bg-neutral-100 rounded-xl transition-colors"
                              >
                                Batal
                              </button>
                              <button type="submit" className="px-6 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all">
                                {editingNews ? 'Simpan Perubahan' : 'Publikasikan Berita'}
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row p-2 gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="Cari judul atau isi berita..."
                                value={newsSearch}
                                onChange={(e) => setNewsSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none"
                              />
                            </div>
                            <div className="w-full md:w-px bg-neutral-200" />
                            <div className="flex gap-2 w-full md:w-auto">
                              <select
                                value={newsCategoryFilter}
                                onChange={(e) => setNewsCategoryFilter(e.target.value)}
                                className="px-3 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none flex-1 md:w-40 font-medium text-neutral-700"
                              >
                                <option value="Semua">Semua Kategori</option>
                                <option value="Berita">Berita</option>
                                <option value="Kegiatan">Kegiatan</option>
                                <option value="Prestasi">Prestasi</option>
                                <option value="Opini">Opini</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {news
                              .filter(a => newsCategoryFilter === 'Semua' || a.category === newsCategoryFilter)
                              .filter(a => 
                                a.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                                a.summary.toLowerCase().includes(newsSearch.toLowerCase())
                              )
                              .map((art) => (
                                <div key={art.id} className="group p-4 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all flex flex-col relative h-full">
                                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 mb-3 border border-neutral-100">
                                    <img 
                                      src={art.image || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300'} 
                                      alt={art.title} 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-white/20">
                                      {art.category}
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-bold text-neutral-900 text-sm mb-1.5 line-clamp-2">{art.title}</h4>
                                  <span className="text-[10px] text-neutral-400 block mb-2 font-medium">Oleh: {art.author} | {art.date}</span>
                                  
                                  <p className="text-xs text-neutral-600 line-clamp-3 mb-4 flex-1">
                                    {art.summary}
                                  </p>
                                  
                                  <div className="pt-3 border-t border-neutral-100 mt-auto flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => setPreviewingNews(art)}
                                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1.5 rounded-lg"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> Pratinjau
                                    </button>
                                    <div className="flex gap-1.5">
                                      <button 
                                        onClick={() => handleEditNewsClick(art)}
                                        className="p-1.5 bg-neutral-100 text-neutral-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Berita"
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteItem('/api/news', art.id, setNews, 'Artikel berita berhasil dihapus!')}
                                        className="p-1.5 bg-neutral-100 text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Berita"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {news.length === 0 && (
                              <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-2xl border border-neutral-200 border-dashed">
                                <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-neutral-500">Belum ada artikel berita.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pratinjau Modal Berita */}
                    <AnimatePresence>
                      {previewingNews && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                          onClick={() => setPreviewingNews(null)}
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center p-5 border-b border-neutral-100 bg-neutral-50/50">
                              <h3 className="font-bold text-neutral-900 text-sm">Pratinjau Artikel</h3>
                              <button onClick={() => setPreviewingNews(null)} className="p-2 text-neutral-400 hover:bg-neutral-200 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="overflow-y-auto">
                              {previewingNews.image && (
                                <img 
                                  src={previewingNews.image} 
                                  alt={previewingNews.title} 
                                  className="w-full h-48 md:h-64 object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div className="p-6 md:p-8">
                                <div className="mb-6 pb-6 border-b border-neutral-100">
                                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
                                    {previewingNews.category}
                                  </span>
                                  <h2 className="text-2xl md:text-3xl font-black text-emerald-950 font-serif leading-tight mb-4">
                                    {previewingNews.title}
                                  </h2>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
                                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {previewingNews.date}</span>
                                    <span className="flex items-center gap-1.5"><UserCheck className="h-4 w-4" /> Ditulis oleh: {previewingNews.author}</span>
                                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {previewingNews.readTime}</span>
                                  </div>
                                </div>
                                
                                <div className="prose prose-sm md:prose-base max-w-none text-neutral-700">
                                  <p className="text-base md:text-lg font-medium text-neutral-900 mb-6 font-serif leading-relaxed italic border-l-4 border-emerald-500 pl-5">
                                    {previewingNews.summary}
                                  </p>
                                  <div 
                                    className="leading-loose wysiwyg-content"
                                    dangerouslySetInnerHTML={{ __html: previewingNews.content }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 shrink-0">
                              <button
                                onClick={() => {
                                  handleEditNewsClick(previewingNews);
                                  setPreviewingNews(null);
                                }}
                                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1.5"
                              >
                                <Edit2 className="h-3.5 w-3.5" /> Edit Artikel
                              </button>
                              <button
                                onClick={() => setPreviewingNews(null)}
                                className="px-6 py-2 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 transition-all"
                              >
                                Tutup
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CATEGORY 5: AGENDA */}
                {activeTab === 'agenda' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">5. Agenda & Acara Kegiatan</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Kelola jadwal kalender kegiatan pondok pesantren, hari libur, kajian akbar, maupun ujian semester.</p>
                      </div>
                      {!isAddingEvent && (
                        <button
                          onClick={() => {
                            setEditingEvent(null);
                            setIsAddingEvent(true);
                          }}
                          className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="h-4 w-4" /> Jadwalkan Agenda Baru
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isAddingEvent ? (
                        <motion.div
                          key="event-form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={handleSaveEvent} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
                            <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-2 mb-2 md:col-span-2 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                {editingEvent ? <Edit2 className="h-4 w-4 text-emerald-800" /> : <Plus className="h-4 w-4 text-emerald-800" />}
                                {editingEvent ? 'Ubah Agenda Kegiatan' : 'Jadwalkan Agenda Kegiatan Baru'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingEvent(false);
                                  setEditingEvent(null);
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                              >
                                Batalkan
                              </button>
                            </h3>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul Agenda / Acara</label>
                              <input
                                type="text"
                                required
                                placeholder="Misal: Haflah Akhirussanah Pesantren"
                                value={editingEvent ? editingEvent.title : newEvent.title}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, title: e.target.value});
                                  else setNewEvent({...newEvent, title: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Tanggal Acara</label>
                              <input
                                type="date"
                                required
                                value={editingEvent ? editingEvent.date : newEvent.date}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, date: e.target.value});
                                  else setNewEvent({...newEvent, date: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Waktu Acara</label>
                              <input
                                type="text"
                                required
                                placeholder="Contoh: 08:00 WIB - Selesai"
                                value={editingEvent ? editingEvent.time : newEvent.time}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, time: e.target.value});
                                  else setNewEvent({...newEvent, time: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Lokasi Tempat</label>
                              <input
                                type="text"
                                required
                                placeholder="Contoh: Masjid Jami PP Darul Mushtofa"
                                value={editingEvent ? editingEvent.location : newEvent.location}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, location: e.target.value});
                                  else setNewEvent({...newEvent, location: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Pembicara / Narasumber (Opsional)</label>
                              <input
                                type="text"
                                placeholder="Contoh: Al-Habib Salim bin Umar"
                                value={(editingEvent ? editingEvent.speaker : newEvent.speaker) || ''}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, speaker: e.target.value});
                                  else setNewEvent({...newEvent, speaker: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Kategori Agenda</label>
                              <select
                                value={editingEvent ? editingEvent.category : newEvent.category}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, category: e.target.value});
                                  else setNewEvent({...newEvent, category: e.target.value});
                                }}
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
                                rows={3}
                                placeholder="Deskripsi agenda atau maklumat tambahan..."
                                value={editingEvent ? editingEvent.description : newEvent.description}
                                onChange={e => {
                                  if (editingEvent) setEditingEvent({...editingEvent, description: e.target.value});
                                  else setNewEvent({...newEvent, description: e.target.value});
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none leading-relaxed"
                              />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingEvent(false);
                                  setEditingEvent(null);
                                }}
                                className="px-5 py-2.5 text-neutral-600 font-bold text-xs hover:bg-neutral-100 rounded-xl transition-colors"
                              >
                                Batal
                              </button>
                              <button type="submit" className="px-6 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all">
                                {editingEvent ? 'Simpan Perubahan' : 'Jadwalkan Agenda'}
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="event-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {/* Search & Filter bar */}
                          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row p-2 gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="Cari agenda atau lokasi..."
                                value={eventSearch}
                                onChange={(e) => setEventSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none"
                              />
                            </div>
                            <div className="w-full md:w-px bg-neutral-200" />
                            <div className="flex gap-2 w-full md:w-auto">
                              <select
                                value={eventCategoryFilter}
                                onChange={(e) => setEventCategoryFilter(e.target.value)}
                                className="px-3 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none flex-1 md:w-40 font-medium text-neutral-700"
                              >
                                <option value="Semua">Semua Kategori</option>
                                <option value="Kajian">Kajian Rutin</option>
                                <option value="Ujian">Ujian / Madrasah</option>
                                <option value="Penting">Hari Penting</option>
                                <option value="Sosial">Khidmat Sosial</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {events
                              .filter(ev => eventCategoryFilter === 'Semua' || ev.category === eventCategoryFilter)
                              .filter(ev => 
                                ev.title.toLowerCase().includes(eventSearch.toLowerCase()) || 
                                ev.location.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                (ev.speaker && ev.speaker.toLowerCase().includes(eventSearch.toLowerCase()))
                              )
                              .map(ev => (
                                <div key={ev.id} className="p-4 rounded-2xl border border-neutral-200/80 bg-white flex justify-between items-start gap-4 hover:border-emerald-200 hover:shadow-2xs transition-all">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-bold text-neutral-900 text-xs leading-tight">{ev.title}</h4>
                                      <span className="text-[8px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">{ev.category}</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-850 font-bold block mt-1.5">{ev.date} • {ev.time} • {ev.location}</span>
                                    {ev.speaker && <span className="text-[10px] text-neutral-500 block mt-1 font-medium bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 inline-block">Pembicara: {ev.speaker}</span>}
                                    <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">{ev.description}</p>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <button 
                                      onClick={() => handleEditEventClick(ev)}
                                      className="p-1.5 text-neutral-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                      title="Edit Agenda"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem('/api/events', ev.id, setEvents, 'Agenda kegiatan berhasil dihapus!')}
                                      className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus Agenda"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {events.length === 0 && (
                              <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-2xl border border-neutral-200 border-dashed">
                                <CalendarIcon className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-neutral-500">Belum ada agenda kegiatan.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CATEGORY 6: GALERI */}
                {activeTab === 'gallery' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">6. Galeri Foto Kegiatan</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Unggah foto-foto dokumentasi fasilitas, majelis sholawat, aktivitas kajian kitab, dan sarana pondok.</p>
                      </div>
                      {!isAddingGallery && (
                        <button
                          onClick={() => {
                            setIsAddingGallery(true);
                          }}
                          className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="h-4 w-4" /> Unggah Foto Baru
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isAddingGallery ? (
                        <motion.div
                          key="gallery-form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={handleAddGallery} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
                            <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-2 mb-2 md:col-span-2 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Plus className="h-4 w-4 text-emerald-800" /> Publikasikan Foto Galeri Baru
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsAddingGallery(false)}
                                className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                              >
                                Batalkan
                              </button>
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
                            {/* Photo upload with compression < 100 KB */}
                            <div className="md:col-span-2">
                              <ImageUploadWithCompression
                                value={newGallery.imageUrl}
                                onChange={(compressedBase64) => setNewGallery({ ...newGallery, imageUrl: compressedBase64 })}
                                label="Foto Galeri Dokumentasi (Otomatis Kompresi < 100 KB)"
                                helperText="Unggah foto langsung dari perangkat Anda. Gambar akan dikompresi berulang hingga < 100 KB secara otomatis."
                                aspectRatio="video"
                              />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => setIsAddingGallery(false)}
                                className="px-5 py-2.5 text-neutral-600 font-bold text-xs hover:bg-neutral-100 rounded-xl transition-colors"
                              >
                                Batal
                              </button>
                              <button type="submit" className="px-6 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all">
                                Unggah ke Galeri
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="gallery-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {/* Search & Filter bar */}
                          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row p-2 gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="Cari foto berdasarkan judul..."
                                value={gallerySearch}
                                onChange={(e) => setGallerySearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none"
                              />
                            </div>
                            <div className="w-full md:w-px bg-neutral-200" />
                            <div className="flex gap-2 w-full md:w-auto">
                              <select
                                value={galleryCategoryFilter}
                                onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                                className="px-3 py-2 text-xs border-none bg-neutral-50 rounded-xl focus:ring-1 focus:ring-emerald-900 outline-none flex-1 md:w-40 font-medium text-neutral-700"
                              >
                                <option value="Semua">Semua Kategori</option>
                                <option value="Kegiatan">Kegiatan</option>
                                <option value="Fasilitas">Fasilitas</option>
                                <option value="Prestasi">Prestasi</option>
                                <option value="Ziarah">Ziarah / Safari</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {gallery
                              .filter(item => galleryCategoryFilter === 'Semua' || item.category === galleryCategoryFilter)
                              .filter(item => item.title.toLowerCase().includes(gallerySearch.toLowerCase()))
                              .map(item => (
                                <div key={item.id} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-2xs group relative hover:border-emerald-200 hover:shadow-md transition-all flex flex-col h-full">
                                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.title} 
                                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-white/20">
                                      {item.category}
                                    </div>
                                  </div>
                                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                                    <div>
                                      <h4 className="font-bold text-neutral-900 text-xs leading-snug line-clamp-2 mb-1">{item.title}</h4>
                                      <span className="text-[10px] text-neutral-400 block font-medium">Diupload: {item.date}</span>
                                    </div>
                                    <div className="pt-3 border-t border-neutral-100 mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleDeleteItem('/api/gallery', item.id, setGallery, 'Foto galeri berhasil dihapus!')}
                                        className="p-1.5 bg-neutral-50 hover:bg-red-50 hover:text-red-700 text-neutral-500 rounded-lg shadow-2xs transition-colors border border-neutral-100 hover:border-red-100"
                                        title="Hapus Foto"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {gallery.length === 0 && (
                              <div className="sm:col-span-2 md:col-span-3 text-center py-12 bg-white rounded-2xl border border-neutral-200 border-dashed">
                                <ImageIcon className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-neutral-500">Belum ada foto dokumentasi.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CATEGORY 7: BANNER UTAMA */}
                {activeTab === 'banners' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black text-emerald-950 font-serif">7. Banner Utama</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Kelola gambar banner berputar yang tampil di halaman utama.</p>
                      </div>
                      {!isAddingBanner && (
                        <button
                          onClick={() => setIsAddingBanner(true)}
                          className="px-5 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="h-4 w-4" /> Tambah Banner Baru
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isAddingBanner ? (
                        <motion.div
                          key="banner-form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <form onSubmit={handleAddBanner} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
                            <h3 className="font-bold text-xs text-neutral-800 uppercase border-b border-neutral-200 pb-2 mb-2 md:col-span-2 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Plus className="h-4 w-4 text-emerald-800" /> Publikasikan Banner Baru
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsAddingBanner(false)}
                                className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                              >
                                Batalkan
                              </button>
                            </h3>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-700 uppercase mb-1">Judul / Keterangan Banner</label>
                              <input
                                type="text"
                                required
                                placeholder="Contoh: Haul Ibu Nyai Hj. Zuhriyyah"
                                value={newBanner.title}
                                onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-emerald-850 focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <ImageUploadWithCompression
                                value={newBanner.imageUrl}
                                onChange={(compressedBase64) => setNewBanner({ ...newBanner, imageUrl: compressedBase64 })}
                                label="Foto Banner (Rasio Landscape Lebar Disarankan)"
                                helperText="Unggah foto langsung dari perangkat Anda. Direkomendasikan gambar landscape resolusi tinggi."
                                aspectRatio="video"
                              />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => setIsAddingBanner(false)}
                                className="px-5 py-2.5 text-neutral-600 font-bold text-xs hover:bg-neutral-100 rounded-xl transition-colors"
                              >
                                Batal
                              </button>
                              <button type="submit" className="px-6 py-2.5 bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 active:scale-95 transition-all">
                                Publikasikan Banner
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="banner-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {banners.map(banner => (
                              <div key={banner.id} className={`border rounded-2xl overflow-hidden bg-white shadow-2xs group relative flex flex-col h-full transition-all ${banner.isActive ? 'border-emerald-200 ring-1 ring-emerald-500/20' : 'border-neutral-200 opacity-60'}`}>
                                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                                  <img 
                                    src={banner.imageUrl} 
                                    alt={banner.title} 
                                    className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-2.5 left-2.5">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border ${banner.isActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-neutral-500 text-white border-neutral-600'}`}>
                                      {banner.isActive ? 'AKTIF' : 'NONAKTIF'}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                  <h4 className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2 mb-1">{banner.title}</h4>
                                  <div className="pt-4 border-t border-neutral-100 mt-3 flex justify-between items-center">
                                    <button
                                      onClick={() => handleToggleBannerActive(banner)}
                                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${banner.isActive ? 'text-neutral-500 hover:bg-neutral-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'}`}
                                    >
                                      {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem('/api/banners', banner.id, setBanners, 'Banner berhasil dihapus!')}
                                      className="p-1.5 bg-neutral-50 hover:bg-red-50 hover:text-red-700 text-neutral-500 rounded-lg shadow-2xs transition-colors border border-neutral-100 hover:border-red-100"
                                      title="Hapus Banner"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {banners.length === 0 && (
                              <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-neutral-200 border-dashed">
                                <ImageIcon className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-neutral-500">Belum ada banner.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CATEGORY 8: DATABASE SANTRI (PENDAFTAR PSB) */}
                {(activeTab === 'santri' || activeTab === 'psb') && (
                  <div>
                    <div className="border-b border-neutral-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black text-emerald-950 font-serif">7. Database Santri (Pendaftar PSB)</h2>
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {registrations.length} Santri Terdaftar
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Basis data induk santri resmi yang terdaftar melalui formulir Pendaftaran Santri Baru (PSB) online.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-700" />
                          Cetak / Ekspor Laporan
                        </button>
                      </div>
                    </div>

                    {/* Ringkasan Statistik Database Santri PSB */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-neutral-450 block">Total Santri PSB</span>
                        <div className="text-2xl font-black text-emerald-950 mt-1">{registrations.length}</div>
                        <span className="text-[10px] text-emerald-700 font-medium">Santri Baru Terdaftar</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-neutral-450 block">Jenjang Ulya (Aliyah)</span>
                        <div className="text-2xl font-black text-blue-900 mt-1">
                          {registrations.filter(r => r.programType?.toLowerCase().includes('ulya') || r.programType?.toLowerCase().includes('aliyah')).length}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium">Tingkat Menengah Atas</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-neutral-450 block">Jenjang Wustha (MTs)</span>
                        <div className="text-2xl font-black text-emerald-900 mt-1">
                          {registrations.filter(r => r.programType?.toLowerCase().includes('wustha') || r.programType?.toLowerCase().includes('tsanawiyah')).length}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium">Tingkat Pertama</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-neutral-450 block">Pilihan Asrama Mukim</span>
                        <div className="text-2xl font-black text-amber-900 mt-1">
                          {registrations.filter(r => r.boardingChoice?.toLowerCase().includes('mukim') || r.boardingChoice?.toLowerCase().includes('asrama')).length}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium">Santri Asrama Penuh</span>
                      </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Cari santri berdasarkan Nama Lengkap, NISN, atau No. Registrasi..."
                          value={santriSearch}
                          onChange={e => setSantriSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-650 bg-white px-3 py-2 rounded-xl border border-neutral-200">
                          <Filter className="h-3.5 w-3.5 text-emerald-800" />
                          <span>Filter:</span>
                        </div>
                        <select
                          value={santriGenderFilter}
                          onChange={e => setSantriGenderFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 cursor-pointer"
                        >
                          <option value="Semua">Semua Jenjang</option>
                          <option value="Ulya">Madrasah Aliyah (Ulya)</option>
                          <option value="Wustha">Madrasah Tsanawiyah (Wustha)</option>
                          <option value="Tahfidz">Tahfizh Al-Qur'an</option>
                        </select>
                      </div>
                    </div>

                    {/* Tabel Master Database Santri (PSB) */}
                    <div className="overflow-x-auto border border-neutral-200 rounded-2xl bg-white shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-650 font-bold uppercase tracking-wider text-[10px]">
                            <th className="p-4">No. Registrasi</th>
                            <th className="p-4">Nama Santri & NISN</th>
                            <th className="p-4">Jenjang Pendidikan</th>
                            <th className="p-4">Pilihan Pondok</th>
                            <th className="p-4">Kontak Wali Santri</th>
                            <th className="p-4 text-center">Aksi & Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {registrations
                            .filter(r => {
                              const q = santriSearch.toLowerCase();
                              const matchSearch = r.fullName.toLowerCase().includes(q) || 
                                (r.nisn && r.nisn.includes(q)) || 
                                (r.id && r.id.toLowerCase().includes(q));
                              const matchFilter = santriGenderFilter === 'Semua' || 
                                (r.programType && r.programType.toLowerCase().includes(santriGenderFilter.toLowerCase()));
                              return matchSearch && matchFilter;
                            })
                            .map(reg => (
                              <tr key={reg.id} className="hover:bg-neutral-50/70 transition-colors">
                                <td className="p-4 font-mono font-bold text-emerald-800">
                                  <span className="px-2 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-[11px]">
                                    {reg.id}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-neutral-900 text-xs">{reg.fullName}</div>
                                  <span className="text-[10px] text-neutral-450 font-mono">NISN: {reg.nisn || '-'}</span>
                                </td>
                                <td className="p-4">
                                  <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-full font-bold border border-emerald-200/80 text-[10px] inline-block">
                                    {reg.programType}
                                  </span>
                                </td>
                                <td className="p-4 text-neutral-700 font-medium">
                                  <span className="text-xs">{reg.boardingChoice}</span>
                                </td>
                                <td className="p-4">
                                  <a 
                                    href={`https://wa.me/${reg.whatsapp.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100 text-[11px]"
                                  >
                                    <span>WA: {reg.whatsapp}</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      onClick={() => setSelectedRegistrant(reg)}
                                      className="px-2.5 py-1.5 text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors font-bold text-[11px] flex items-center gap-1"
                                      title="Lihat Formulir Lengkap"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      <span>Lihat Formulir</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem('/api/registrations', reg.id, setRegistrations, 'Data registrasi santri berhasil dihapus!')}
                                      className="p-1.5 text-neutral-400 hover:text-red-750 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus Dari Database"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {registrations.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-16 text-neutral-450">
                                Belum ada data santri pendaftar PSB saat ini.
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
