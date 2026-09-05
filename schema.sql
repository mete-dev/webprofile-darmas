-- Schema SQL Database untuk Pondok Pesantren Darul Mushtofa Assunniyyah

-- 1. Pendaftaran Santri Baru (PSB)
CREATE TABLE IF NOT EXISTS psb_registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  nisn TEXT NOT NULL,
  nis TEXT,
  school_name TEXT,
  major_program TEXT,
  school_address TEXT,
  nickname TEXT,
  birth_place TEXT,
  birth_date TEXT,
  gender TEXT,
  religion TEXT,
  citizenship TEXT,
  child_order TEXT,
  siblings_count TEXT,
  step_siblings_count TEXT,
  adopted_siblings_count TEXT,
  orphan_status TEXT,
  daily_language TEXT,
  program_type TEXT,
  living_with TEXT,
  distance_to_school TEXT,
  transport_mode TEXT,
  blood_type TEXT,
  illness_history TEXT,
  hospital_treatment TEXT,
  physical_disability TEXT,
  height_cm TEXT,
  weight_kg TEXT,
  prev_school_level TEXT,
  sttb_number TEXT,
  study_duration TEXT,
  father_name TEXT,
  mother_name TEXT,
  parent_job TEXT,
  whatsapp TEXT,
  address TEXT,
  previous_school TEXT,
  report_score TEXT,
  boarding_choice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pengumuman
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  reference_number TEXT,
  date TEXT,
  category TEXT,
  priority TEXT,
  summary TEXT,
  content TEXT,
  target_audience TEXT,
  issuer TEXT,
  valid_until TEXT,
  attachment_name TEXT,
  attachment_size TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  google_drive_url TEXT
);

-- 3. Berita & Artikel
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  image TEXT,
  date TEXT,
  author TEXT,
  read_time TEXT
);

-- 4. Kalender Acara / Event
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT,
  description TEXT,
  category TEXT,
  speaker TEXT,
  target_audience TEXT
);

-- 5. Bagian Website (Sejarah, Visi Misi, dll)
CREATE TABLE IF NOT EXISTS web_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  last_updated TEXT
);

-- 6. Pengurus & Asatidz (SDM) / Akun Admin
CREATE TABLE IF NOT EXISTS sdm_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  show_on_web BOOLEAN DEFAULT TRUE,
  can_access_dashboard BOOLEAN DEFAULT FALSE,
  username TEXT,
  password TEXT,
  permissions TEXT
);

-- 7. Galeri Foto
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT
);

-- 8. Data Santri Aktif
CREATE TABLE IF NOT EXISTS santri_records (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  nisn TEXT NOT NULL,
  class_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  address TEXT,
  guardian_name TEXT,
  whatsapp TEXT
);

-- 9. Hero Banners (Gambar Slide Beranda)
CREATE TABLE IF NOT EXISTS hero_banners (
  id TEXT PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
