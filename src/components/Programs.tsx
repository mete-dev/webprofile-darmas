import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  GraduationCap,
  Languages,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS } from '../data/pesantrenData';
import { Program } from '../types';

const iconMap: Record<string, React.ComponentType<any>> = {
  BookOpen,
  Award,
  GraduationCap,
  Languages,
  Briefcase,
};

export default function Programs() {
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Formal' | 'Diniyah' | 'Ekstrakurikuler'>('Semua');

  const toggleExpand = (id: string) => {
    setExpandedProgramId(expandedProgramId === id ? null : id);
  };

  const categories = ['Semua', 'Diniyah', 'Formal', 'Ekstrakurikuler'];

  const filteredPrograms = PROGRAMS.filter((prog) => {
    if (activeCategory === 'Semua') return true;
    return prog.category === activeCategory;
  });

  return (
    <section id="programs" className="py-24 bg-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-bold text-sm tracking-widest uppercase">
            Program Unggulan
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Sistem Pendidikan Berkelanjutan & Komprehensif
          </h2>
          <p className="text-neutral-500 mt-3 text-sm sm:text-base">
            Mengintegrasikan kemurnian ajaran Salafiah Ahlussunnah wal Jama'ah dengan kurikulum Nasional terakreditasi unggul.
          </p>
          <div className="w-16 h-1 bg-emerald-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`prog-filter-${cat}`}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((prog) => {
              const IconComponent = iconMap[prog.iconName] || BookOpen;
              const isExpanded = expandedProgramId === prog.id;

              return (
                <motion.div
                  key={prog.id}
                  id={`program-card-${prog.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-neutral-50 rounded-3xl border border-neutral-200/60 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:bg-white hover:border-emerald-200 transition-all duration-300"
                >
                  <div>
                    {/* Icon and Category Tag */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        prog.category === 'Formal'
                          ? 'bg-blue-50 text-blue-800 border border-blue-150'
                          : prog.category === 'Diniyah'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-150'
                          : 'bg-purple-50 text-purple-800 border border-purple-150'
                      }`}>
                        {prog.category}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3 tracking-tight">
                      {prog.title}
                    </h3>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {prog.description}
                    </p>
                  </div>

                  {/* Expandable Section */}
                  <div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-neutral-200/60 pt-4 mb-4"
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-800 mb-3 uppercase tracking-wide">
                            Materi / Layanan Unggulan:
                          </h4>
                          <ul className="space-y-2.5">
                            {prog.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand Trigger Button */}
                    <button
                      id={`btn-expand-${prog.id}`}
                      onClick={() => toggleExpand(prog.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-200/40 hover:bg-emerald-50 hover:text-emerald-800 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <>
                          Sembunyikan Kurikulum <ChevronUp className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Lihat Kurikulum Unggulan <ChevronDown className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
