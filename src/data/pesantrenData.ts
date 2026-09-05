import { NewsArticle, Program, GalleryItem, FAQ, Testimonial, Teacher } from '../types';

export const PESANTREN_INFO = {
  name: 'PP Darul Mushtofa Assunniyyah',
  tagline: 'Membentuk Generasi Qurani, Berakhlaqul Karimah, Berwawasan Luas, dan Teguh dalam Manhaj Ahlussunnah wal Jama\'ah',
  address: 'Jl Pesantren No 1 Rowosugo, Yosowilangun Kidul, Yosowilangun, Lumajang, Jawa Timur',
  phone: '+62 331 7591234',
  email: 'info@darulmushtofa.or.id',
  whatsapp: '+62 812 3456 7890',
  foundedYear: '1998',
  founder: 'KH Ali Sibro Mulisi',
  currentLeader: 'KH Ali Sibro Mulisi dan Nyai Hj. Ummu Muhammad Ali',
  coordinates: { lat: -8.2596, lng: 113.314 },
  socials: {
    facebook: 'https://facebook.com/darulmushtofa.assunniyyah',
    instagram: 'https://instagram.com/darulmushtofa.assunniyyah',
    youtube: 'https://youtube.com/c/darulmushtofa.assunniyyah',
    twitter: 'https://twitter.com/darulmushtofa',
  }
};

export const HISTORY_TEXT = `Pondok Pesantren Darul Mushtofa Assunniyyah didirikan pada tahun 1998 oleh ulama kharismatik KH Ali Sibro Mulisi bersama keluarga. Berawal dari sebuah musholla kecil dan beberapa santri kalong yang mengaji kitab kuning secara tradisional di wilayah Yosowilangun, kini pesantren telah tumbuh subur menjadi lembaga pendidikan Islam terpadu yang membimbing ribuan santri dari berbagai penjuru nusantara.

Dengan memadukan kemurnian sistem pendidikan Salafiyah (pengkajian kitab-kitab muktabarah) dan tuntutan pendidikan modern (sains, bahasa, dan teknologi), PP Darul Mushtofa Assunniyyah berkomitmen melahirkan kader-kader ulama, profesional, dan pemimpin umat yang tafaqquh fid-din (memiliki kedalaman ilmu agama) sekaligus tangguh dalam menghadapi tantangan zaman modern di bawah asuhan hangat KH Ali Sibro Mulisi dan Nyai Hj. Ummu Muhammad Ali.`;

export const VISION_MISSION = {
  vision: 'Terwujudnya lembaga pendidikan Islam panutan yang mencetak generasi unggul berkepribadian Islami, hafal Al-Qur\'an, menguasai khazanah kitab kuning, dan berkontribusi aktif bagi kemaslahatan masyarakat luas.',
  missions: [
    'Menyelenggarakan pendidikan pesantren salaf berbasis penguasaan kitab kuning (Tafaqquh fid Din) secara mendalam.',
    'Menyelenggarakan program akselerasi Tahfidzul Qur\'an yang mutqin (kuat hafalan) bersanad.',
    'Menyelenggarakan pendidikan formal berakreditasi unggul guna mencetak intelektual muslim profesional.',
    'Mendidik akhlaqul karimah (karakter mulia) berbasis keteladanan salafus shalih dan nilai kesantunan pesantren.',
    'Membekali santri dengan keterampilan bahasa asing (Arab & Inggris) serta penguasaan teknologi informasi dasar.',
    'Berperan aktif dalam pemberdayaan sosial, dakwah Islam rahmatan lil \'alamin, dan pengabdian masyarakat.'
  ]
};

export const CORE_VALUES = [
  {
    title: 'Keikhlasan (Al-Ikhlas)',
    description: 'Menjadikan keridaan Allah SWT sebagai satu-satunya tujuan dalam belajar, mengajar, beramal, dan berkhidmah.'
  },
  {
    title: 'Akhlaqul Karimah',
    description: 'Mengedepankan adab di atas ilmu, menghormati guru, sesama teman, serta menjunjung tinggi sopan santun.'
  },
  {
    title: 'Kemandirian (Al-Istiqlaliyyah)',
    description: 'Melatih kedisiplinan diri, tanggung jawab sosial, kebersihan, dan kemandirian finansial sejak dini.'
  },
  {
    title: 'Tawasuth & Tasamuh',
    description: 'Menanamkan sikap moderat (tawasuth) dan toleran (tasamuh) dalam bingkai manhaj Ahlussunnah wal Jama\'ah.'
  }
];

export const LEADERSHIP_TEAM: Teacher[] = [
  {
    id: 'l1',
    name: 'KH Ali Sibro Mulisi',
    role: 'Pengasuh Utama / Pimpinan Umum',
    education: 'PP. Al-Anwar Sarang & Universitas Al-Azhar',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'l2',
    name: 'Nyai Hj. Ummu Muhammad Ali',
    role: 'Ketua Umum Yayasan & Pembina Santri Putri',
    education: 'PP. Lirboyo & STAI Al-Falah',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: 'l3',
    name: 'Ust. H. Ahmad Fauzan, M.Pd.',
    role: 'Kepala Bidang Pendidikan & Pengajaran',
    education: 'UIN Maulana Malik Ibrahim Malang',
    imageUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'p1',
    title: 'Madrasah Diniyah (MDT)',
    category: 'Diniyah',
    description: 'Pendidikan non-formal sore hingga malam yang khusus mengkaji kitab kuning (Salaf) berjenjang, mulai dari tingkat Ula, Wustha, hingga Ulya.',
    iconName: 'BookOpen',
    features: [
      'Kajian Nahwu-Shorof praktis dan mendalam',
      'Fiqih madzhab Syafi\'i (Safinah, Fathul Qarib, Fathul Mu\'in)',
      'Tauhid & Aqidah Asy\'ariyah Maturidiyah',
      'Tarikh Islam & Akhlaq (Adabul \'Alim wal Muta\'allim)'
    ]
  },
  {
    id: 'p2',
    title: 'Tahfidzul Qur\'an Al-Karim',
    category: 'Formal',
    description: 'Program menghafal Al-Qur\'an secara intensif dengan bimbingan ustadz-ustadzah bersanad, dilengkapi dengan ilmu tajwid dan tahsin makhorijul huruf.',
    iconName: 'Award',
    features: [
      'Target hafalan terstruktur (30 Juz dalam 2-3 tahun)',
      'Setoran hafalan 2 kali sehari (Pagi & Maghrib)',
      'Ujian berkala per-juz dan per-fana\'',
      'Pemberian Sanad Qira\'ah bagi santri yang mutqin'
    ]
  },
  {
    id: 'p3',
    title: 'Pendidikan Formal Terpadu',
    category: 'Formal',
    description: 'Sekolah umum di bawah naungan Kemendikbud dan Kemenag dengan kurikulum nasional terakreditasi A, bersinergi dengan kurikulum pesantren.',
    iconName: 'GraduationCap',
    features: [
      'MTs Darul Mushtofa (Akreditasi A)',
      'MA Darul Mushtofa (Peminatan IPA, IPS & Keagamaan)',
      'Laboratorium Komputer & Sains Modern',
      'Bimbingan kelulusan masuk Perguruan Tinggi Negeri'
    ]
  },
  {
    id: 'p4',
    title: 'Bahasa Asing Intensif',
    category: 'Ekstrakurikuler',
    description: 'Program wajib pembiasaan bahasa Arab dan Inggris dalam percakapan sehari-hari santri, didukung oleh Language Club pesantren.',
    iconName: 'Languages',
    features: [
      'Muhadloroh (Latihan pidato 3 bahasa)',
      'Pemberian kosa kata (Mufrodat) setiap pagi',
      'Arabic & English Zone di lingkungan asrama',
      'Lomba debat bahasa tingkat regional'
    ]
  },
  {
    id: 'p5',
    title: 'Keterampilan & Kewirausahaan',
    category: 'Ekstrakurikuler',
    description: 'Pembekalan hardskill agar santri mandiri secara finansial dan memiliki mental wirausaha yang kuat setelah lulus.',
    iconName: 'Briefcase',
    features: [
      'Pelatihan Agribisnis (Hidroponik & Peternakan)',
      'Seni Kaligrafi Islam (Khattat)',
      'Desain Grafis & Multimedia',
      'Koperasi Santri & Tata Boga'
    ]
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Gedung Asrama Putra Darul Mushtofa',
    category: 'Fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g2',
    title: 'Kajian Rutin Kitab Fathul Mu\'in di Masjid',
    category: 'Kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d00f18?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g3',
    title: 'Santri Menghafal Al-Qur\'an Ba\'da Subuh',
    category: 'Santri',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g4',
    title: 'Penyerahan Piala Juara Umum MQK Jember',
    category: 'Prestasi',
    imageUrl: 'https://images.unsplash.com/photo-1496469888073-80de7e9b252c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g5',
    title: 'Laboratorium Komputer Madrasah Aliyah',
    category: 'Fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g6',
    title: 'Kegiatan Ekstrakurikuler Kaligrafi Indah',
    category: 'Kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80'
  }
];

export const FAQS: FAQ[] = [
  {
    question: 'Bagaimana cara mendaftar sebagai santri baru di PP Darul Mushtofa?',
    answer: 'Pendaftaran dapat dilakukan dengan dua cara: secara offline dengan mendatangi langsung Sekretariat PSB PP Darul Mushtofa Assunniyyah, atau secara online melalui website ini pada bagian formulir kontak pendaftaran. Setelah mendaftar, calon santri wajib mengikuti ujian seleksi sesuai tanggal yang ditentukan.'
  },
  {
    question: 'Apakah santri diperkenankan membawa gadget / HP di lingkungan pesantren?',
    answer: 'Demi menjaga konsentrasi, kekhusyukan belajar, serta kenyamanan batin santri, santri dilarang keras membawa smartphone atau gadget pribadi lainnya. Komunikasi dengan orang tua difasilitasi melalui telepon asrama atau kantor pengurus pada jadwal-jadwal tertentu.'
  },
  {
    question: 'Apa saja jenjang pendidikan formal yang tersedia di pesantren?',
    answer: 'Tersedia jenjang Madrasah Tsanawiyah (MTs) setingkat SMP dan Madrasah Aliyah (MA) setingkat SMA yang terakreditasi A oleh Kementerian Agama. Pembelajaran formal berlangsung pagi hari, dilanjutkan dengan program Diniyah dan Tahfidz pada sore dan malam hari.'
  },
  {
    question: 'Bagaimana sistem pembayaran syahriyah (iuran bulanan) santri?',
    answer: 'Biaya bulanan santri (meliputi biaya makan 3 kali sehari, asrama, air, dan kebersihan) sangat terjangkau. Pembayaran syahriyah dapat ditransfer langsung melalui rekening resmi bank syariah pesantren atau dibayarkan tunai melalui loket keuangan pesantren paling lambat tanggal 10 setiap bulannya.'
  },
  {
    question: 'Apakah santri boleh dijenguk oleh wali santri?',
    answer: 'Boleh. Wali santri dapat menjenguk putra-putrinya pada hari libur resmi pesantren, yaitu setiap hari Jumat genap atau sesuai jadwal kalender akademik pesantren yang ditetapkan pengurus, guna menjaga kedisipilnan mengaji santri.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. H. Mukhlas Adib, M.A.',
    role: 'Alumni (Angkatan 2005) / Dosen UIN KHAS Jember',
    content: 'Pondok Pesantren Darul Mushtofa tidak hanya mengajarkan saya cara membaca kitab kuning secara mendalam, tapi menanamkan integritas moral, keikhlasan mengabdi, serta kedisiplinan yang menjadi fondasi kesuksesan karier akademis saya.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 't2',
    name: 'H. Bambang Hermanto',
    role: 'Wali Santri dari Surabaya',
    content: 'Sebagai orang tua, saya sangat tenang menitipkan anak saya di sini. Perkembangan akhlaknya sangat terasa sopan santunnya ketika pulang ke rumah, hafalannya pun melampaui ekspektasi kami. Matur nuwun sanget kiai dan ustadz.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
  }
];

export interface InstitutionItem {
  id: string;
  name: string;
  level: string;
  accreditation?: string;
  description: string;
  curriculum: string;
  lead: string;
  icon: string;
  highlights: string[];
}

export const INSTITUTIONS_DATA: InstitutionItem[] = [
  {
    id: 'inst-1',
    name: 'Madrasah Tsanawiyah (MTs) Darul Mushtofa',
    level: 'Pendidikan Menengah Pertama (Setingkat SMP)',
    accreditation: 'Terakreditasi A (Unggul)',
    description: 'Pendidikan formal tingkat menengah pertama yang mengintegrasikan kurikulum nasional Kementerian Agama dengan penguatan diniyah salafiyah dan tahfidz.',
    curriculum: 'Kurikulum Merdeka Kemenag + Kurikulum Muatan Lokal Pesantren',
    lead: 'Ust. Nur Hidayat, M.Pd.',
    icon: 'School',
    highlights: ['Kelas Digital & Lab Komputer', 'Tahfidz Juz 30 & Pilihan', 'Bimbingan Olimpiade Sains & PAI', 'Asrama Terbina 24 Jam']
  },
  {
    id: 'inst-2',
    name: 'Madrasah Aliyah (MA) Darul Mushtofa',
    level: 'Pendidikan Menengah Atas (Setingkat SMA)',
    accreditation: 'Terakreditasi A (Unggul)',
    description: 'Madrasah Aliyah dengan peminatan Keagamaan (Madrasah Aliyah Keagamaan/MAK), IPA, dan IPS yang berfokus mengantarkan santri ke perguruan tinggi unggulan dalam dan luar negeri.',
    curriculum: 'Kemenag RI + Pengkajian Kitab Kuning Fathul Mu\'in & Balaghah',
    lead: 'Drs. H. M. Zainuddin, M.Pd.I.',
    icon: 'GraduationCap',
    highlights: ['Program Khusus Beasiswa Timur Tengah', 'Bimbingan SNBP & UTBK-SNBT', 'Bahasa Arab & Inggris Aktif', 'Lab IPA & Multimedia']
  },
  {
    id: 'inst-3',
    name: 'Madrasah Diniyah Salafiyah (MDT)',
    level: 'Non-Formal Berjenjang (Ula, Wustha, Ulya)',
    description: 'Kawah candradimuka pengkajian ilmu turats Islam berhaluan Ahlussunnah wal Jama\'ah An-Nahdliyyah dengan sanad keilmuan yang bersambung hingga Rasulullah SAW.',
    curriculum: 'Kitab Kuning Salaf (Nahwu, Shorof, Fiqih Syafi\'i, Tauhid Asy\'ari, Hadits Kutubus Sittah)',
    lead: 'K.H. Ahmad Shodiq',
    icon: 'BookOpen',
    highlights: ['Metode Sorogan & Bandongan', 'Muthala\'ah & Bahtsul Masa\'il Mingguan', 'Hafalan Nadhom Imrithi & Alfiyah', 'Ujian Syahadah Kitab']
  },
  {
    id: 'inst-4',
    name: 'Lembaga Tahfidzul Qur\'an Al-Karim',
    level: 'Program Khusus Santri Huffadh',
    description: 'Wadah akselerasi hafalan Al-Qur\'an dengan metode tasmi\' berkala, muraja\'ah teratur, dan bimbingan tajwid makharijul huruf dari para hafidz bersanad.',
    curriculum: 'Tahfidz 30 Juz Bersanad, Matan Jazariyyah, Tuhfatul Athfal',
    lead: 'Ust. H. Hafidz Zarkasyi, Al-Hafidz',
    icon: 'Award',
    highlights: ['Target Mutqin 30 Juz', 'Setoran 2x Sehari (Subuh & Maghrib)', 'Wisuda Akbar & Sanad Qira\'ah', 'Karantina Tahfidz Liburan']
  }
];

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Seni & Budaya' | 'Bela Diri & Olahraga' | 'Bahasa & Keilmuan' | 'Keterampilan & Organisasi';
  schedule: string;
  description: string;
  coach: string;
  achievements: string;
  icon: string;
}

export const EXTRACURRICULARS_DATA: ExtracurricularItem[] = [
  {
    id: 'extra-1',
    name: 'Seni Hadrah & Sholawat Al-Banjari',
    category: 'Seni & Budaya',
    schedule: 'Malam Rabu & Malam Jumat',
    description: 'Pelatihan vokal sholawat, teknik pukulan terbang banjari klasik dan modern untuk menumbuhkan mahabbah kepada Baginda Nabi Muhammad SAW.',
    coach: 'Ust. M. Rifa\'i & Tim Hadrah Santri',
    achievements: 'Juara 1 Festival Banjari Tingkat Karesidenan Besuki',
    icon: 'Music'
  },
  {
    id: 'extra-2',
    name: 'Pencak Silat Pagar Nusa (Gasmi)',
    category: 'Bela Diri & Olahraga',
    schedule: 'Selasa & Sabtu Sore',
    description: 'Bela diri tradisional kebanggaan Nahdlatul Ulama yang melatih ketangkasan fisik, mental kesatria, kedisiplinan, dan spiritualitas penjaga ulama.',
    coach: 'Pendekar M. Syamsuri (Pelatih Pengcab PN Lumajang)',
    achievements: 'Peraih Medali Emas Kejurkab Pencak Silat Pelajar Lumajang',
    icon: 'Shield'
  },
  {
    id: 'extra-3',
    name: 'Khot & Seni Kaligrafi Islam',
    category: 'Seni & Budaya',
    schedule: 'Kamis Siang & Ahad Pagi',
    description: 'Pembelajaran kaidah khat Naskhi, Riq\'ah, Diwani, Tsuluts, dan Kufi untuk memperindah penulisan mushaf ayat suci Al-Qur\'an.',
    coach: 'Ust. Ridwanulloh (Khattat bersertifikat)',
    achievements: 'Juara 2 Kaligrafi Kontemporer MTQ Tingkat Jatim',
    icon: 'PenTool'
  },
  {
    id: 'extra-4',
    name: 'Muhadloroh / Khitobah 3 Bahasa',
    category: 'Bahasa & Keilmuan',
    schedule: 'Malam Ahad (Minggu Malam)',
    description: 'Latihan pidato dan public speaking dalam bahasa Arab, Inggris, dan Indonesia untuk mencetak dai dan orator santri yang berwawasan global.',
    coach: 'Lembaga Pengembangan Bahasa Asing (LPBA)',
    achievements: 'Finalis Debat Bahasa Arab Nasional Antar Pesantren',
    icon: 'Mic'
  },
  {
    id: 'extra-5',
    name: 'Jurnalistik, Multimedia & Fotografi',
    category: 'Keterampilan & Organisasi',
    schedule: 'Ahad Sore',
    description: 'Pelatihan teknik penulisan berita, fotografi syiar dakwah, desain grafis, editing video, dan pengelolaan majalah dinding santri.',
    coach: 'Tim Media Center Darul Mushtofa',
    achievements: 'Penerbitan Buletin Bulanan Santri "Al-Mushtofa"',
    icon: 'Camera'
  },
  {
    id: 'extra-6',
    name: 'Pramuka Santri Gugus Depan Darul Mushtofa',
    category: 'Keterampilan & Organisasi',
    schedule: 'Jumat Pagi',
    description: 'Kegiatan kepanduan berkarakter islami yang melatih survival, tali-temali, kepemimpinan, kepedulian sosial, dan kecintaan tanah air.',
    coach: 'Pembina Gudep Kak Mansur, S.Pd.',
    achievements: 'Juara Umum Kemah Santri Nusantara Kabupaten',
    icon: 'Compass'
  }
];

