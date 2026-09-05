import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Heart,
  Users,
  CheckCircle,
  GraduationCap,
  Building2,
  Sparkles,
  School,
  Shield,
  Music,
  Camera,
  Mic,
  PenTool,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PESANTREN_INFO,
  HISTORY_TEXT,
  VISION_MISSION,
  CORE_VALUES,
  LEADERSHIP_TEAM,
  INSTITUTIONS_DATA,
  EXTRACURRICULARS_DATA,
} from '../data/pesantrenData';

export type ProfileTabType = 'history' | 'vision' | 'institutions' | 'extracurricular' | 'values';

interface ProfileProps {
  initialTab?: ProfileTabType;
}

export default function Profile({ initialTab = 'history' }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabType>(initialTab);
  const [sdmList, setSdmList] = useState<any[]>(LEADERSHIP_TEAM);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    fetch('/api/sdm')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Only show members where showOnWeb is true or undefined
          const visible = data.filter(m => m.showOnWeb !== false);
          setSdmList(visible);
        }
      })
      .catch(err => {
        console.warn('Menggunakan data pengasuh default:', err);
      });
  }, []);

  useEffect(() => {
    fetch('/api/web-sections')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSections(data);
        }
      })
      .catch(err => {
        console.warn('Gagal memuat web-sections dinamis:', err);
      });
  }, []);

  const tabs = [
    { id: 'history', label: 'Sejarah Singkat', icon: BookOpen },
    { id: 'vision', label: 'Visi & Misi', icon: Compass },
    { id: 'institutions', label: 'Lembaga Pendidikan', icon: Building2 },
    { id: 'extracurricular', label: 'Ekstrakurikuler', icon: Sparkles },
    { id: 'values', label: 'Nilai Pesantren', icon: Heart },
  ];

  return (
    <section id="profile" className="py-24 bg-neutral-50 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
            Profil Lembaga
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Mengenal Lebih Dekat PP Darul Mushtofa Assunniyyah
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-neutral-100 border border-neutral-200/60 rounded-2xl shadow-inner max-w-full overflow-x-auto gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as ProfileTabType)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-xl p-6 sm:p-10 mb-20 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                <div className="lg:col-span-7">
                  <h3 className="text-2xl font-bold text-neutral-900 font-serif mb-4">
                    {sections.find(s => s.id === 'sejarah')?.title || `Sanad Keilmuan Kokoh Sejak ${PESANTREN_INFO.foundedYear}`}
                  </h3>
                  <div 
                    className="space-y-4 text-neutral-600 leading-relaxed text-sm sm:text-base wysiwyg-content"
                    dangerouslySetInnerHTML={{ __html: sections.find(s => s.id === 'sejarah')?.content || HISTORY_TEXT }}
                  />
                </div>
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-emerald-500/10 rounded-2xl transform rotate-3 scale-102 -z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80"
                    alt="Sejarah Pesantren"
                    referrerPolicy="no-referrer"
                    className="w-full h-[320px] object-cover rounded-2xl shadow-lg border border-neutral-200"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-emerald-950 text-white p-4 rounded-2xl shadow-lg border border-emerald-800 flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-amber-300 font-serif">28</span>
                    <div className="text-xs font-semibold leading-tight text-emerald-100">
                      Tahun Berkhidmah <br /> Untuk Bangsa
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vision' && (
              <motion.div
                key="vision"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {sections.find(s => s.id === 'visi_misi') ? (
                  <div className="p-6 sm:p-8 bg-emerald-50/40 border border-emerald-100 rounded-2xl shadow-2xs">
                    <h3 className="text-lg font-bold text-emerald-950 tracking-wide uppercase mb-4 flex items-center gap-2 font-serif border-b border-emerald-100 pb-2">
                      <Compass className="h-5 w-5 text-emerald-800" /> {sections.find(s => s.id === 'visi_misi')?.title || 'Visi dan Misi'}
                    </h3>
                    <div 
                      className="text-neutral-700 leading-relaxed text-sm sm:text-base wysiwyg-content"
                      dangerouslySetInnerHTML={{ __html: sections.find(s => s.id === 'visi_misi')?.content || '' }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Vision Box */}
                    <div className="p-6 sm:p-8 bg-amber-50/50 border border-amber-200/50 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-bold text-amber-800 tracking-wide uppercase mb-3 flex items-center gap-2 font-serif">
                        <Compass className="h-5 w-5 text-amber-600" /> Visi Pesantren
                      </h3>
                      <p className="text-neutral-800 font-medium text-base sm:text-lg leading-relaxed italic">
                        "{VISION_MISSION.vision}"
                      </p>
                    </div>

                    {/* Mission Box */}
                    <div>
                      <h3 className="text-lg font-bold text-emerald-850 tracking-wide uppercase mb-4 flex items-center gap-2 font-serif">
                        <CheckCircle className="h-5 w-5 text-emerald-600" /> Misi Pesantren
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {VISION_MISSION.missions.map((mission, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 transition-all duration-200"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </span>
                            <p className="text-neutral-600 text-sm leading-relaxed">{mission}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'institutions' && (
              <motion.div
                key="institutions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif">
                    {sections.find(s => s.id === 'lembaga')?.title || 'Unit Lembaga Pendidikan di Bawah Naungan Yayasan'}
                  </h3>
                  <div 
                    className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed wysiwyg-content"
                    dangerouslySetInnerHTML={{ __html: sections.find(s => s.id === 'lembaga')?.content || 'Memadukan kurikulum nasional terakreditasi unggul dengan kurikulum pesantren salafiyah.' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {INSTITUTIONS_DATA.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                            <School className="h-5 w-5" />
                          </div>
                          {inst.accreditation && (
                            <span className="px-3 py-1 bg-emerald-800 text-white font-bold text-[11px] rounded-full shadow-sm">
                              {inst.accreditation}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900 leading-snug">
                          {inst.name}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-700 mt-1">
                          {inst.level}
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
                          {inst.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-neutral-200/60 text-xs text-neutral-500 space-y-1">
                          <p><span className="font-semibold text-neutral-700">Kurikulum:</span> {inst.curriculum}</p>
                          <p><span className="font-semibold text-neutral-700">Kepala Lembaga:</span> {inst.lead}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200/60">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Program Keunggulan:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inst.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-white text-emerald-900 border border-neutral-200 px-2.5 py-1 rounded-lg"
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'extracurricular' && (
              <motion.div
                key="extracurricular"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif">
                    {sections.find(s => s.id === 'ekstrakulikuler')?.title || 'Kegiatan Ekstrakurikuler & Pengembangan Bakat Santri'}
                  </h3>
                  <div 
                    className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed wysiwyg-content"
                    dangerouslySetInnerHTML={{ __html: sections.find(s => s.id === 'ekstrakulikuler')?.content || 'Mengasah potensi minat bakat, kepemimpinan, seni Islam, dan bela diri tradisional para santri.' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {EXTRACURRICULARS_DATA.map((extra) => (
                    <div
                      key={extra.id}
                      className="p-5 rounded-2xl border border-neutral-200/80 bg-white hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                            {extra.category}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            ⏱ {extra.schedule}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                          {extra.name}
                        </h4>
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {extra.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
                        <p className="text-neutral-500">
                          <span className="font-semibold text-neutral-700">Pembina:</span> {extra.coach}
                        </p>
                        <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50/70 p-2 rounded-lg text-[11px] font-medium border border-amber-200/50">
                          <Trophy className="h-3.5 w-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
                          <span>{extra.achievements}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'values' && (
              <motion.div
                key="values"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {CORE_VALUES.map((value, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-neutral-150 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 bg-neutral-50/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Users className="h-4 w-4" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-neutral-900">
                        {value.title}
                      </h4>
                    </div>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leadership Section */}
        <div className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-emerald-700 font-bold text-sm tracking-widest uppercase">
              Ulama & Pimpinan
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-serif">
              Dewan Pengasuh Pondok Pesantren
            </h3>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">
              Dibimbing langsung oleh para ulama berkompeten di bidang syariat, Al-Qur'an, dan akhlak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sdmList.map((leader) => (
              <div
                key={leader.id}
                id={`leader-card-${leader.id}`}
                className="group bg-white rounded-3xl border border-neutral-200/60 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Photo container */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-neutral-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  <img
                    src={leader.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'}
                    alt={leader.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <span className="inline-block px-2.5 py-1 bg-amber-400 text-emerald-950 font-bold text-[10px] sm:text-xs rounded-full uppercase tracking-wider shadow">
                      {leader.role?.split('/')[0]?.trim() || 'SDM Pesantren'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                    {leader.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
                    {leader.role}
                  </p>

                  {leader.description && (
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                      {leader.description}
                    </p>
                  )}

                  {leader.education && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-neutral-600 text-xs sm:text-sm">
                      <GraduationCap className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{leader.education}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
