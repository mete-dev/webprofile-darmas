import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, ChevronRight, Info, AlertCircle, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { UPCOMING_EVENTS } from '../data/eventsData';

export interface PesantrenEvent {
  id: string;
  title: string;
  date: string; // Format e.g., '2026-09-15'
  time: string;
  location: string;
  description: string;
  category: 'Kajian' | 'Akademik' | 'Perayaan' | 'Sosial';
  speaker?: string;
  targetAudience: string;
}

export default function EventCalendar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Kajian' | 'Akademik' | 'Perayaan' | 'Sosial'>('Semua');
  const [events, setEvents] = useState<PesantrenEvent[]>(UPCOMING_EVENTS);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('Using offline static events data:', err);
        setEvents(UPCOMING_EVENTS);
      }
    };
    fetchEvents();
  }, []);

  const categories: ('Semua' | 'Kajian' | 'Akademik' | 'Perayaan' | 'Sosial')[] = [
    'Semua',
    'Kajian',
    'Akademik',
    'Perayaan',
    'Sosial'
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'Semua' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="event-calendar" className="py-12 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Informatif */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-850 rounded-3xl text-white p-8 sm:p-12 mb-12 relative overflow-hidden shadow-xl border border-emerald-800">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Calendar className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-800/80 text-emerald-300 font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-emerald-700 inline-flex items-center gap-1.5 mb-4">
              <Bell className="h-3 w-3 text-amber-400 animate-bounce" /> Agenda Terbaru
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif leading-tight">
              Kalender Kegiatan Pesantren
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mt-4">
              Daftar jadwal kajian, perayaan keagamaan, UTS/UAS akademik, dan agenda bakti sosial resmi Pondok Pesantren Darul Mushtofa Assunniyyah Yosowilangun, Lumajang.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-5 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Categories Selector */}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari nama kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 text-sm bg-neutral-50/50"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredEvents.map((ev, index) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Badge & Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      ev.category === 'Kajian'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200/60'
                        : ev.category === 'Akademik'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200/60'
                        : ev.category === 'Perayaan'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
                        : 'bg-purple-100 text-purple-900 border border-purple-200/60'
                    }`}>
                      {ev.category}
                    </span>
                    
                    {/* Urgency indicators or sequence */}
                    <span className="text-[11px] font-medium text-neutral-400">
                      ID: {ev.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight leading-snug">
                    {ev.title}
                  </h3>

                  {/* Speaker (if Kajian/Perayaan) */}
                  {ev.speaker && (
                    <p className="text-xs text-neutral-600 font-semibold mt-1 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200/40 inline-block">
                      🎙️ Narasumber/Pengisi: {ev.speaker}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-neutral-500 text-sm leading-relaxed mt-3">
                    {ev.description}
                  </p>
                </div>

                {/* Details Section */}
                <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <span className="font-medium">{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2 mt-1 bg-emerald-50/50 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-100/50">
                    <Info className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span className="font-semibold text-[11px]">Sasaran: {ev.targetAudience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-neutral-200/60 rounded-2xl p-8 max-w-lg mx-auto shadow-sm mb-12">
            <AlertCircle className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Kegiatan Tidak Ditemukan</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Kami tidak menemukan kegiatan yang cocok dengan kata kunci atau kategori yang Anda pilih. Silakan gunakan penyaring lainnya.
            </p>
          </div>
        )}

        {/* Prosedur & Catatan Kegiatan */}
        <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-6 mb-8 text-neutral-700 text-xs sm:text-sm">
          <h4 className="font-bold text-amber-950 flex items-center gap-2 mb-2">
            ⚠️ Catatan Penting Mengenai Jadwal Agenda:
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-neutral-600">
            <li>Jadwal di atas dapat disesuaikan kembali mengikuti instruksi Pengasuh Utama.</li>
            <li>Santri diharapkan hadir 15 menit sebelum acara dimulai dengan memakai busana sopan/busana muslim lengkap.</li>
            <li>Untuk informasi lengkap mengenai perizinan wali santri menghadiri acara sosial/perayaan, silakan hubungi kesekretariatan melalui halaman <strong>Hubungi Kami</strong>.</li>
          </ul>
        </div>

      </div>
    </section>
  );
}
