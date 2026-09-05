export interface Announcement {
  id: string;
  title: string;
  referenceNumber: string;
  date: string;
  category: 'Penting' | 'Akademik' | 'PSB' | 'Wali Santri' | 'Umum';
  priority: 'high' | 'normal';
  summary: string;
  content: string;
  targetAudience: string;
  issuer: string;
  validUntil?: string;
  attachmentName?: string;
  attachmentSize?: string;
  isPinned?: boolean;
  googleDriveUrl?: string;
}

export interface SDMMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  showOnWeb: boolean;
  canAccessDashboard: boolean;
  username?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Berita' | 'Opini' | 'Kegiatan' | 'Prestasi';
  image: string;
  date: string;
  author: string;
  readTime: string;
  tags?: string[];
}

export interface Program {
  id: string;
  title: string;
  category: 'Formal' | 'Diniyah' | 'Ekstrakurikuler';
  description: string;
  iconName: string;
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Fasilitas' | 'Kegiatan' | 'Santri' | 'Prestasi';
  imageUrl: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  imageUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  education?: string;
  imageUrl: string;
}
