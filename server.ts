import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Import initial data for seeding & fallback
import { ANNOUNCEMENTS_DATA } from './src/data/announcementsData';
import { NEWS_ARTICLES } from './src/data/pesantrenData';
import { UPCOMING_EVENTS } from './src/data/eventsData';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Connection String Parsing & Robust Fallback
  let sql: ReturnType<typeof postgres> | null = null;
  const dbUrl = process.env.SUPABASE_DB_URL || '';

  if (dbUrl) {
    console.log(`[Supabase DB] Parsing database connection URL...`);
    const match = dbUrl.match(/postgresql:\/\/([^:]+):(.*)@([^:]+):(\d+)\/(.+)/);
    
    let optionsCandidates: any[] = [];
    if (match) {
      const [, username, rawPassword, host, portStr, database] = match;
      const port = parseInt(portStr, 10);
      
      // Candidate A: Strip outer square brackets if they wrap the password (e.g. [darmas2011@1] -> darmas2011@1)
      let pwdStripped = rawPassword;
      if (rawPassword.startsWith('[') && rawPassword.endsWith(']')) {
        pwdStripped = rawPassword.slice(1, -1);
      }
      
      optionsCandidates.push({
        host,
        port,
        database,
        username,
        password: pwdStripped,
        ssl: 'require',
        connect_timeout: 5
      });

      if (pwdStripped !== rawPassword) {
        optionsCandidates.push({
          host,
          port,
          database,
          username,
          password: rawPassword,
          ssl: 'require',
          connect_timeout: 5
        });
      }
    }

    // Always fallback to trying url-encoded candidate string or raw string
    const stringCandidates = [
      dbUrl.replace('[darmas2011@1]', 'darmas2011%401'),
      dbUrl
    ];

    const allCandidates = [...optionsCandidates, ...stringCandidates];

    for (const cand of allCandidates) {
      try {
        console.log(`[Supabase DB] Attempting connection candidate...`);
        if (typeof cand === 'string') {
          sql = postgres(cand, {
            ssl: 'require',
            connect_timeout: 5,
          });
        } else {
          sql = postgres(cand);
        }
        
        // Test query
        await sql`SELECT 1`;
        console.log(`[Supabase DB] Successfully connected!`);
        break;
      } catch (err: any) {
        console.warn(`[Supabase DB] Connection candidate failed: ${err.message || err}`);
        sql = null;
      }
    }
  } else {
    console.error(`[Supabase DB] No SUPABASE_DB_URL found in process.env`);
  }

  // Schema initialization
  if (sql) {
    try {
      console.log(`[Supabase DB] Checking & creating schema...`);
      
      // 1. psb_registrations
      await sql`
        CREATE TABLE IF NOT EXISTS psb_registrations (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          nisn TEXT NOT NULL,
          birth_place TEXT,
          birth_date TEXT,
          gender TEXT,
          program_type TEXT,
          father_name TEXT,
          mother_name TEXT,
          parent_job TEXT,
          whatsapp TEXT,
          address TEXT,
          previous_school TEXT,
          report_score TEXT,
          boarding_choice TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // Add Lembar Buku Induk Siswa columns if not yet present
      await sql`
        ALTER TABLE psb_registrations
        ADD COLUMN IF NOT EXISTS nis TEXT,
        ADD COLUMN IF NOT EXISTS school_name TEXT,
        ADD COLUMN IF NOT EXISTS major_program TEXT,
        ADD COLUMN IF NOT EXISTS school_address TEXT,
        ADD COLUMN IF NOT EXISTS nickname TEXT,
        ADD COLUMN IF NOT EXISTS religion TEXT,
        ADD COLUMN IF NOT EXISTS citizenship TEXT,
        ADD COLUMN IF NOT EXISTS child_order TEXT,
        ADD COLUMN IF NOT EXISTS siblings_count TEXT,
        ADD COLUMN IF NOT EXISTS step_siblings_count TEXT,
        ADD COLUMN IF NOT EXISTS adopted_siblings_count TEXT,
        ADD COLUMN IF NOT EXISTS orphan_status TEXT,
        ADD COLUMN IF NOT EXISTS daily_language TEXT,
        ADD COLUMN IF NOT EXISTS living_with TEXT,
        ADD COLUMN IF NOT EXISTS distance_to_school TEXT,
        ADD COLUMN IF NOT EXISTS transport_mode TEXT,
        ADD COLUMN IF NOT EXISTS blood_type TEXT,
        ADD COLUMN IF NOT EXISTS illness_history TEXT,
        ADD COLUMN IF NOT EXISTS hospital_treatment TEXT,
        ADD COLUMN IF NOT EXISTS physical_disability TEXT,
        ADD COLUMN IF NOT EXISTS height_cm TEXT,
        ADD COLUMN IF NOT EXISTS weight_kg TEXT,
        ADD COLUMN IF NOT EXISTS prev_school_level TEXT,
        ADD COLUMN IF NOT EXISTS sttb_number TEXT,
        ADD COLUMN IF NOT EXISTS study_duration TEXT
      `;

      // 2. announcements
      await sql`
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
          is_pinned BOOLEAN DEFAULT FALSE
        )
      `;

      // 3. news_articles
      await sql`
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
        )
      `;

      // 4. events
      await sql`
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
        )
      `;

      // 5. web_sections
      await sql`
        CREATE TABLE IF NOT EXISTS web_sections (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          last_updated TEXT
        )
      `;

      // 6. sdm_members
      await sql`
        CREATE TABLE IF NOT EXISTS sdm_members (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          description TEXT,
          image_url TEXT
        )
      `;

      // 7. gallery_items
      await sql`
        CREATE TABLE IF NOT EXISTS gallery_items (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          image_url TEXT NOT NULL,
          date TEXT
        )
      `;

      // 8. santri_records
      await sql`
        CREATE TABLE IF NOT EXISTS santri_records (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          nisn TEXT NOT NULL,
          class_name TEXT NOT NULL,
          gender TEXT NOT NULL,
          address TEXT,
          guardian_name TEXT,
          whatsapp TEXT
        )
      `;

      console.log(`[Supabase DB] Tables verified/created successfully.`);

      // Seeding - checking if tables are empty
      const annCount = await sql`SELECT count(*) FROM announcements`;
      if (parseInt(annCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding announcements...`);
        for (const ann of ANNOUNCEMENTS_DATA) {
          await sql`
            INSERT INTO announcements (
              id, title, reference_number, date, category, priority, summary, content, target_audience, issuer, valid_until, attachment_name, attachment_size, is_pinned
            ) VALUES (
              ${ann.id}, ${ann.title}, ${ann.referenceNumber}, ${ann.date}, ${ann.category}, ${ann.priority}, ${ann.summary}, ${ann.content}, ${ann.targetAudience}, ${ann.issuer}, ${ann.validUntil || null}, ${ann.attachmentName || null}, ${ann.attachmentSize || null}, ${ann.isPinned || false}
            )
          `;
        }
      }

      const newsCount = await sql`SELECT count(*) FROM news_articles`;
      if (parseInt(newsCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding news...`);
        for (const news of NEWS_ARTICLES) {
          await sql`
            INSERT INTO news_articles (
              id, title, summary, content, category, image, date, author, read_time
            ) VALUES (
              ${news.id}, ${news.title}, ${news.summary}, ${news.content}, ${news.category}, ${news.image}, ${news.date}, ${news.author}, ${news.readTime}
            )
          `;
        }
      }

      const eventsCount = await sql`SELECT count(*) FROM events`;
      if (parseInt(eventsCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding events...`);
        for (const ev of UPCOMING_EVENTS) {
          await sql`
            INSERT INTO events (
              id, title, date, time, location, description, category, speaker, target_audience
            ) VALUES (
              ${ev.id}, ${ev.title}, ${ev.date}, ${ev.time}, ${ev.location}, ${ev.description}, ${ev.category}, ${ev.speaker || null}, ${ev.targetAudience}
            )
          `;
        }
      }

      // Seed Web Sections
      const webCount = await sql`SELECT count(*) FROM web_sections`;
      if (parseInt(webCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding web_sections...`);
        const sections = [
          { id: 'sejarah', title: 'Sejarah Darul Mushtofa', content: 'Pondok Pesantren Darul Mushtofa Assunniyyah didirikan pada tahun 2011 di bawah asuhan para kiai sepuh guna membina moralitas bangsa, mencetak santri yang tafaqquh fiddin dan mandiri.', last_updated: '2026-09-04' },
          { id: 'profil', title: 'Profil Umum', content: 'Lembaga pendidikan Islam modern berbasis salafiah yang menyatukan keluhuran akhlak pesantren dengan keunggulan teknologi.', last_updated: '2026-09-04' },
          { id: 'visi_misi', title: 'Visi dan Misi', content: 'Visi: Terbentuknya generasi rabbani, mulia akhlak, luas ilmu, serta siap berkhidmat untuk umat.', last_updated: '2026-09-04' }
        ];
        for (const s of sections) {
          await sql`INSERT INTO web_sections (id, title, content, last_updated) VALUES (${s.id}, ${s.title}, ${s.content}, ${s.last_updated})`;
        }
      }

      // Seed SDM Members
      const sdmCount = await sql`SELECT count(*) FROM sdm_members`;
      if (parseInt(sdmCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding sdm_members...`);
        const members = [
          { id: 'sdm-1', name: 'KH. Ahmad Husain', role: 'Pengasuh Utama', description: 'Alumni Rubat Tarim Hadramaut, pembimbing kajian kitab kuning fikh dan tasawuf.', image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300' },
          { id: 'sdm-2', name: 'Ust. Muhammad Syafi\'i', role: 'Kepala Madrasah Diniyah', description: 'Pengajar Senior Nahwu Shorof dan Fathul Qorib.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' }
        ];
        for (const m of members) {
          await sql`INSERT INTO sdm_members (id, name, role, description, image_url) VALUES (${m.id}, ${m.name}, ${m.role}, ${m.description}, ${m.image_url})`;
        }
      }

      // Seed Gallery
      const galCount = await sql`SELECT count(*) FROM gallery_items`;
      if (parseInt(galCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding gallery_items...`);
        const items = [
          { id: 'gal-1', title: 'Kajian Kitab Bulanan', category: 'Kegiatan', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600', date: '12 Agustus 2026' },
          { id: 'gal-2', title: 'Wisuda Santri Madin', category: 'Prestasi', image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', date: '25 Agustus 2026' }
        ];
        for (const i of items) {
          await sql`INSERT INTO gallery_items (id, title, category, image_url, date) VALUES (${i.id}, ${i.title}, ${i.category}, ${i.image_url}, ${i.date})`;
        }
      }

      // Seed Santri
      const santriCount = await sql`SELECT count(*) FROM santri_records`;
      if (parseInt(santriCount[0].count) === 0) {
        console.log(`[Supabase DB] Seeding santri_records...`);
        const records = [
          { id: 'san-2026-001', full_name: 'Ahmad Fauzi', nisn: '0098765432', class_name: 'Kelas 10-A (Ulya)', gender: 'Laki-laki', address: 'Kec. Lowokwaru, Kota Malang', guardian_name: 'Sutrisno', whatsapp: '081234567890' },
          { id: 'san-2026-002', full_name: 'Nayla Az-Zahra', nisn: '0098765455', class_name: 'Kelas 11-B (Wustha)', gender: 'Perempuan', address: 'Kab. Jember', guardian_name: 'Abdul Halim', whatsapp: '085732111000' }
        ];
        for (const r of records) {
          await sql`INSERT INTO santri_records (id, full_name, nisn, class_name, gender, address, guardian_name, whatsapp) VALUES (${r.id}, ${r.full_name}, ${r.nisn}, ${r.class_name}, ${r.gender}, ${r.address}, ${r.guardian_name}, ${r.whatsapp})`;
        }
      }

      console.log(`[Supabase DB] Seeding completed or skipped (data already exists).`);

    } catch (err: any) {
      console.error(`[Supabase DB] Schema init / seeding failed:`, err.message || err);
    }
  }

  // --- API ROUTES ---

  // 1. Announcements API
  app.get('/api/announcements', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM announcements ORDER BY is_pinned DESC, id DESC`;
        const mapped = rows.map(r => ({
          id: r.id,
          title: r.title,
          referenceNumber: r.reference_number,
          date: r.date,
          category: r.category,
          priority: r.priority,
          summary: r.summary,
          content: r.content,
          targetAudience: r.target_audience,
          issuer: r.issuer,
          validUntil: r.valid_until,
          attachmentName: r.attachment_name,
          attachmentSize: r.attachment_size,
          isPinned: r.is_pinned
        }));
        return res.json(mapped);
      } catch (err: any) {
        console.error(`[API] Failed to fetch announcements from DB:`, err.message);
      }
    }
    res.json(ANNOUNCEMENTS_DATA);
  });

  // Create Announcement
  app.post('/api/announcements', async (req, res) => {
    const { title, referenceNumber, date, category, priority, summary, content, targetAudience, issuer, validUntil, attachmentName, attachmentSize, isPinned } = req.body;
    const id = `ann-${Date.now()}`;
    if (sql) {
      try {
        await sql`
          INSERT INTO announcements (
            id, title, reference_number, date, category, priority, summary, content, target_audience, issuer, valid_until, attachment_name, attachment_size, is_pinned
          ) VALUES (
            ${id}, ${title}, ${referenceNumber}, ${date}, ${category}, ${priority}, ${summary}, ${content}, ${targetAudience}, ${issuer}, ${validUntil || null}, ${attachmentName || null}, ${attachmentSize || null}, ${isPinned || false}
          )
        `;
        return res.json({ success: true, id });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  // Delete Announcement
  app.delete('/api/announcements/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM announcements WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // 2. News API
  app.get('/api/news', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM news_articles ORDER BY id DESC`;
        const mapped = rows.map(r => ({
          id: r.id,
          title: r.title,
          summary: r.summary,
          content: r.content,
          category: r.category,
          image: r.image,
          date: r.date,
          author: r.author,
          readTime: r.read_time
        }));
        return res.json(mapped);
      } catch (err: any) {
        console.error(`[API] Failed to fetch news from DB:`, err.message);
      }
    }
    res.json(NEWS_ARTICLES);
  });

  // 3. Events API
  app.get('/api/events', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM events ORDER BY id ASC`;
        const mapped = rows.map(r => ({
          id: r.id,
          title: r.title,
          date: r.date,
          time: r.time,
          location: r.location,
          description: r.description,
          category: r.category,
          speaker: r.speaker,
          targetAudience: r.target_audience
        }));
        return res.json(mapped);
      } catch (err: any) {
        console.error(`[API] Failed to fetch events from DB:`, err.message);
      }
    }
    res.json(UPCOMING_EVENTS);
  });

  // Create Event
  app.post('/api/events', async (req, res) => {
    const { title, date, time, location, description, category, speaker, targetAudience } = req.body;
    const id = `ev-${Date.now()}`;
    if (sql) {
      try {
        await sql`
          INSERT INTO events (
            id, title, date, time, location, description, category, speaker, target_audience
          ) VALUES (
            ${id}, ${title}, ${date}, ${time}, ${location}, ${description}, ${category}, ${speaker || null}, ${targetAudience}
          )
        `;
        return res.json({ success: true, id });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  // Delete Event
  app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM events WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // In-memory fallback for registrations when database is offline/unreachable
  let fallbackRegistrations: any[] = [
    {
      id: 'REG-2026-MTS-8192',
      fullName: 'Muhammad Raihan Pratama',
      nisn: '0089123456',
      nis: '260101',
      schoolName: 'PP Darul Mushtofa Assunniyyah',
      majorProgram: 'MTs',
      schoolAddress: 'Jl. Sunan Kalijaga No. 11, Wonorejo, Kencong, Jember, Jawa Timur',
      nickname: 'Raihan',
      birthPlace: 'Jember',
      birthDate: '2012-05-14',
      gender: 'Laki-laki',
      religion: 'Islam',
      citizenship: 'WNI',
      childOrder: '2',
      siblingsCount: '2',
      stepSiblingsCount: '0',
      adoptedSiblingsCount: '0',
      orphanStatus: 'Bukan',
      dailyLanguage: 'Bahasa Indonesia, Madura',
      livingWith: 'Bersama Orang Tua',
      distanceToSchool: '4 km',
      transportMode: 'Sepeda Motor',
      bloodType: 'O',
      illnessHistory: 'Asma ringan',
      hospitalTreatment: 'Pernah',
      physicalDisability: 'Tidak ada',
      heightCm: '152',
      weightKg: '45',
      prevSchoolLevel: 'SD Negeri 1 Kencong',
      sttbNumber: 'DN-05/D-SD/13/0012891',
      studyDuration: '6 Tahun',
      programType: 'MTs',
      fatherName: 'H. Abdullah Pratama',
      motherName: 'Hj. Siti Mariam',
      parentJob: 'Wiraswasta / Pedagang',
      whatsapp: '081234567890',
      address: 'Jl. Diponegoro No. 45, RT 02 / RW 04, Kencong, Jember',
      previousSchool: 'SD Negeri 1 Kencong',
      reportScore: '88.5',
      boardingChoice: 'Asrama Putra',
      createdAt: new Date().toISOString()
    }
  ];

  // 4. PSB Registrations API
  app.get('/api/registrations', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM psb_registrations ORDER BY created_at DESC`;
        const mapped = rows.map(r => ({
          id: r.id,
          fullName: r.full_name,
          nisn: r.nisn,
          nis: r.nis || '',
          schoolName: r.school_name || 'PP Darul Mushtofa Assunniyyah',
          majorProgram: r.major_program || r.program_type || '',
          schoolAddress: r.school_address || 'Jl. Sunan Kalijaga No. 11, Wonorejo, Kencong, Jember, Jawa Timur',
          nickname: r.nickname || '',
          birthPlace: r.birth_place,
          birthDate: r.birth_date,
          gender: r.gender,
          religion: r.religion || 'Islam',
          citizenship: r.citizenship || 'WNI',
          childOrder: r.child_order || '1',
          siblingsCount: r.siblings_count || '0',
          stepSiblingsCount: r.step_siblings_count || '0',
          adoptedSiblingsCount: r.adopted_siblings_count || '0',
          orphanStatus: r.orphan_status || 'Bukan',
          dailyLanguage: r.daily_language || 'Bahasa Indonesia / Daerah',
          livingWith: r.living_with || 'Bersama Orang Tua',
          distanceToSchool: r.distance_to_school || '',
          transportMode: r.transport_mode || '',
          bloodType: r.blood_type || '-',
          illnessHistory: r.illness_history || '-',
          hospitalTreatment: r.hospital_treatment || '-',
          physicalDisability: r.physical_disability || 'Tidak ada',
          heightCm: r.height_cm || '',
          weightKg: r.weight_kg || '',
          prevSchoolLevel: r.prev_school_level || r.previous_school || '',
          sttbNumber: r.sttb_number || '',
          studyDuration: r.study_duration || '',
          programType: r.program_type,
          fatherName: r.father_name,
          motherName: r.mother_name,
          parentJob: r.parent_job,
          whatsapp: r.whatsapp,
          address: r.address,
          previousSchool: r.previous_school,
          reportScore: r.report_score,
          boardingChoice: r.boarding_choice,
          createdAt: r.created_at
        }));
        return res.json(mapped);
      } catch (err: any) {
        console.warn(`[API] Failed to fetch registrations from DB, using fallback:`, err.message);
      }
    }
    // Return fallback registrations so the admin panel never encounters 503
    return res.json(fallbackRegistrations);
  });

  const handleRegister = async (req: express.Request, res: express.Response) => {
    const {
      fullName, nisn, nis, schoolName, majorProgram, schoolAddress,
      nickname, birthPlace, birthDate, gender, religion, citizenship,
      childOrder, siblingsCount, stepSiblingsCount, adoptedSiblingsCount,
      orphanStatus, dailyLanguage, address, whatsapp, livingWith,
      distanceToSchool, transportMode, bloodType, illnessHistory,
      hospitalTreatment, physicalDisability, heightCm, weightKg,
      previousSchool, prevSchoolLevel, sttbNumber, studyDuration,
      programType, fatherName, motherName, parentJob,
      reportScore, boardingChoice
    } = req.body;

    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const codeMap: Record<string, string> = {
      'MTs': 'MTS',
      'MA': 'MA',
      'Tahfidz': 'THF',
      'Diniyah': 'MDT'
    };
    const prefix = codeMap[programType] || 'PSB';
    const generatedId = `REG-2026-${prefix}-${uniqueNum}`;

    if (sql) {
      try {
        await sql`
          INSERT INTO psb_registrations (
            id, full_name, nisn, nis, school_name, major_program, school_address,
            nickname, birth_place, birth_date, gender, religion, citizenship,
            child_order, siblings_count, step_siblings_count, adopted_siblings_count,
            orphan_status, daily_language, address, whatsapp, living_with,
            distance_to_school, transport_mode, blood_type, illness_history,
            hospital_treatment, physical_disability, height_cm, weight_kg,
            previous_school, prev_school_level, sttb_number, study_duration,
            program_type, father_name, mother_name, parent_job,
            report_score, boarding_choice
          ) VALUES (
            ${generatedId}, ${fullName || ''}, ${nisn || ''}, ${nis || null}, 
            ${schoolName || 'PP Darul Mushtofa Assunniyyah'}, 
            ${majorProgram || programType || ''}, 
            ${schoolAddress || 'Jl. Sunan Kalijaga No. 11, Wonorejo, Kencong, Jember, Jawa Timur'},
            ${nickname || null}, ${birthPlace || null}, ${birthDate || null}, ${gender || null}, 
            ${religion || 'Islam'}, ${citizenship || 'WNI'},
            ${childOrder || '1'}, ${siblingsCount || '0'}, ${stepSiblingsCount || '0'}, ${adoptedSiblingsCount || '0'},
            ${orphanStatus || 'Bukan'}, ${dailyLanguage || 'Bahasa Indonesia'}, 
            ${address || null}, ${whatsapp || null}, ${livingWith || 'Bersama Orang Tua'},
            ${distanceToSchool || null}, ${transportMode || null}, 
            ${bloodType || null}, ${illnessHistory || null},
            ${hospitalTreatment || null}, ${physicalDisability || 'Tidak ada'}, 
            ${heightCm || null}, ${weightKg || null},
            ${previousSchool || null}, ${prevSchoolLevel || previousSchool || null}, 
            ${sttbNumber || null}, ${studyDuration || null},
            ${programType || 'Umum'}, ${fatherName || null}, ${motherName || null}, ${parentJob || null},
            ${reportScore || null}, ${boardingChoice || 'Asrama'}
          )
        `;
        return res.json({ success: true, id: generatedId, registrationId: generatedId });
      } catch (err: any) {
        console.error(`[API] DB insertion failed for registration:`, err.message);
        // If specific column error occurs, fallback to basic insert
        try {
          await sql`
            INSERT INTO psb_registrations (
              id, full_name, nisn, birth_place, birth_date, gender, program_type,
              father_name, mother_name, parent_job, whatsapp, address,
              previous_school, report_score, boarding_choice
            ) VALUES (
              ${generatedId}, ${fullName || ''}, ${nisn || ''}, ${birthPlace || null}, ${birthDate || null}, ${gender || null}, ${programType || 'Umum'},
              ${fatherName || null}, ${motherName || null}, ${parentJob || null}, ${whatsapp || null}, ${address || null},
              ${previousSchool || null}, ${reportScore || null}, ${boardingChoice || 'Asrama'}
            )
          `;
          return res.json({ success: true, id: generatedId, registrationId: generatedId });
        } catch (innerErr: any) {
          console.warn(`[API] DB basic insert also failed, using fallback in-memory:`, innerErr.message);
        }
      }
    }

    // Fallback: save into fallbackRegistrations in-memory
    const newReg = {
      id: generatedId,
      fullName: fullName || '',
      nisn: nisn || '',
      nis: nis || '',
      schoolName: schoolName || 'PP Darul Mushtofa Assunniyyah',
      majorProgram: majorProgram || programType || '',
      schoolAddress: schoolAddress || 'Jl. Sunan Kalijaga No. 11, Wonorejo, Kencong, Jember, Jawa Timur',
      nickname: nickname || '',
      birthPlace: birthPlace || '',
      birthDate: birthDate || '',
      gender: gender || 'Laki-laki',
      religion: religion || 'Islam',
      citizenship: citizenship || 'WNI',
      childOrder: childOrder || '1',
      siblingsCount: siblingsCount || '0',
      stepSiblingsCount: stepSiblingsCount || '0',
      adoptedSiblingsCount: adoptedSiblingsCount || '0',
      orphanStatus: orphanStatus || 'Bukan',
      dailyLanguage: dailyLanguage || 'Bahasa Indonesia',
      livingWith: livingWith || 'Bersama Orang Tua',
      distanceToSchool: distanceToSchool || '',
      transportMode: transportMode || '',
      bloodType: bloodType || '-',
      illnessHistory: illnessHistory || '-',
      hospitalTreatment: hospitalTreatment || '-',
      physicalDisability: physicalDisability || 'Tidak ada',
      heightCm: heightCm || '',
      weightKg: weightKg || '',
      prevSchoolLevel: prevSchoolLevel || previousSchool || '',
      sttbNumber: sttbNumber || '',
      studyDuration: studyDuration || '',
      programType: programType || 'Umum',
      fatherName: fatherName || '',
      motherName: motherName || '',
      parentJob: parentJob || '',
      whatsapp: whatsapp || '',
      address: address || '',
      previousSchool: previousSchool || '',
      reportScore: reportScore || '',
      boardingChoice: boardingChoice || 'Asrama',
      createdAt: new Date().toISOString()
    };
    fallbackRegistrations.unshift(newReg);

    res.json({ success: true, id: generatedId, registrationId: generatedId });
  };

  app.post('/api/register', handleRegister);
  app.post('/api/psb/register', handleRegister);

  app.delete('/api/registrations/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM psb_registrations WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        console.warn(`[API] DB delete failed:`, err.message);
      }
    }
    fallbackRegistrations = fallbackRegistrations.filter(r => r.id !== id);
    res.json({ success: true });
  });

  // 5. Laman Web API (web_sections)
  app.get('/api/web-sections', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM web_sections ORDER BY id ASC`;
        return res.json(rows.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          lastUpdated: r.last_updated
        })));
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    // Static Fallback
    res.json([
      { id: 'sejarah', title: 'Sejarah Darul Mushtofa', content: 'Pondok Pesantren Darul Mushtofa Assunniyyah didirikan pada tahun 2011 di bawah asuhan para kiai sepuh guna membina moralitas bangsa, mencetak santri yang tafaqquh fiddin dan mandiri.', lastUpdated: '2026-09-04' },
      { id: 'profil', title: 'Profil Umum', content: 'Lembaga pendidikan Islam modern berbasis salafiah yang menyatukan keluhuran akhlak pesantren dengan keunggulan teknologi.', lastUpdated: '2026-09-04' },
      { id: 'visi_misi', title: 'Visi dan Misi', content: 'Visi: Terbentuknya generasi rabbani, mulia akhlak, luas ilmu, serta siap berkhidmat untuk umat.', lastUpdated: '2026-09-04' }
    ]);
  });

  app.post('/api/web-sections', async (req, res) => {
    const { id, title, content } = req.body;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (sql) {
      try {
        await sql`
          INSERT INTO web_sections (id, title, content, last_updated)
          VALUES (${id}, ${title}, ${content}, ${today})
          ON CONFLICT (id) DO UPDATE
          SET title = EXCLUDED.title, content = EXCLUDED.content, last_updated = EXCLUDED.last_updated
        `;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  // 6. SDM Members API
  app.get('/api/sdm', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM sdm_members ORDER BY id ASC`;
        return res.json(rows.map(r => ({
          id: r.id,
          name: r.name,
          role: r.role,
          description: r.description,
          imageUrl: r.image_url
        })));
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    // Fallback
    res.json([
      { id: 'sdm-1', name: 'KH. Ahmad Husain', role: 'Pengasuh Utama', description: 'Alumni Rubat Tarim Hadramaut, pembimbing kajian kitab kuning fikh dan tasawuf.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300' },
      { id: 'sdm-2', name: 'Ust. Muhammad Syafi\'i', role: 'Kepala Madrasah Diniyah', description: 'Pengajar Senior Nahwu Shorof dan Fathul Qorib.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' }
    ]);
  });

  app.post('/api/sdm', async (req, res) => {
    const { name, role, description, imageUrl } = req.body;
    const id = `sdm-${Date.now()}`;
    if (sql) {
      try {
        await sql`
          INSERT INTO sdm_members (id, name, role, description, image_url)
          VALUES (${id}, ${name}, ${role}, ${description}, ${imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'})
        `;
        return res.json({ success: true, id });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  app.delete('/api/sdm/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM sdm_members WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // 7. Gallery Items API
  app.get('/api/gallery', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM gallery_items ORDER BY id DESC`;
        return res.json(rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          imageUrl: r.image_url,
          date: r.date
        })));
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.json([
      { id: 'gal-1', title: 'Kajian Kitab Bulanan', category: 'Kegiatan', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600', date: '12 Agustus 2026' },
      { id: 'gal-2', title: 'Wisuda Santri Madin', category: 'Prestasi', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', date: '25 Agustus 2026' }
    ]);
  });

  app.post('/api/gallery', async (req, res) => {
    const { title, category, imageUrl } = req.body;
    const id = `gal-${Date.now()}`;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (sql) {
      try {
        await sql`
          INSERT INTO gallery_items (id, title, category, image_url, date)
          VALUES (${id}, ${title}, ${category}, ${imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'}, ${today})
        `;
        return res.json({ success: true, id });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  app.delete('/api/gallery/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM gallery_items WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // 8. Santri Records API
  app.get('/api/santri', async (req, res) => {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM santri_records ORDER BY id DESC`;
        return res.json(rows.map(r => ({
          id: r.id,
          fullName: r.full_name,
          nisn: r.nisn,
          className: r.class_name,
          gender: r.gender,
          address: r.address,
          guardianName: r.guardian_name,
          whatsapp: r.whatsapp
        })));
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.json([
      { id: 'san-2026-001', fullName: 'Ahmad Fauzi', nisn: '0098765432', className: 'Kelas 10-A (Ulya)', gender: 'Laki-laki', address: 'Kec. Lowokwaru, Kota Malang', guardianName: 'Sutrisno', whatsapp: '081234567890' },
      { id: 'san-2026-002', fullName: 'Nayla Az-Zahra', nisn: '0098765455', className: 'Kelas 11-B (Wustha)', gender: 'Perempuan', address: 'Kab. Jember', guardianName: 'Abdul Halim', whatsapp: '085732111000' }
    ]);
  });

  app.post('/api/santri', async (req, res) => {
    const { id, fullName, nisn, className, gender, address, guardianName, whatsapp } = req.body;
    const finalId = id || `san-${Date.now()}`;
    if (sql) {
      try {
        await sql`
          INSERT INTO santri_records (id, full_name, nisn, class_name, gender, address, guardian_name, whatsapp)
          VALUES (${finalId}, ${fullName}, ${nisn}, ${className}, ${gender}, ${address || ''}, ${guardianName || ''}, ${whatsapp || ''})
          ON CONFLICT (id) DO UPDATE
          SET full_name = EXCLUDED.full_name, nisn = EXCLUDED.nisn, class_name = EXCLUDED.class_name, gender = EXCLUDED.gender, address = EXCLUDED.address, guardian_name = EXCLUDED.guardian_name, whatsapp = EXCLUDED.whatsapp
        `;
        return res.json({ success: true, id: finalId });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database service unavailable' });
  });

  app.delete('/api/santri/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM santri_records WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // News write endpoints
  app.post('/api/news', async (req, res) => {
    const { title, summary, content, category, image, author, readTime } = req.body;
    const id = `n-${Date.now()}`;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (sql) {
      try {
        await sql`
          INSERT INTO news_articles (id, title, summary, content, category, image, date, author, read_time)
          VALUES (${id}, ${title}, ${summary}, ${content}, ${category}, ${image || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600'}, ${today}, ${author || 'Humas Pesantren'}, ${readTime || '3 menit baca'})
        `;
        return res.json({ success: true, id });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(553).json({ error: 'Database unavailable' });
  });

  app.delete('/api/news/:id', async (req, res) => {
    const { id } = req.params;
    if (sql) {
      try {
        await sql`DELETE FROM news_articles WHERE id = ${id}`;
        return res.json({ success: true });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(503).json({ error: 'Database unavailable' });
  });

  // DB connection status API
  app.get('/api/db-status', (req, res) => {
    res.json({
      connected: !!sql,
      usingFallback: !sql
    });
  });

  // Catch-all for API routes: any unknown /api route returns JSON 404, never Vite HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // --- Vite Middleware or Static Assets ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
