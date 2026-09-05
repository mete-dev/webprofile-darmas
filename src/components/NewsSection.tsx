import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, X, Sparkles, Bell, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEWS_ARTICLES } from '../data/pesantrenData';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  initialCategory?: 'Semua' | 'Berita' | 'Opini' | 'Kegiatan' | 'Prestasi';
  initialArticleId?: string;
  onNavigate?: (sectionId: string, subParam?: string) => void;
}

export default function NewsSection({ initialCategory = 'Semua', initialArticleId, onNavigate }: NewsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Berita' | 'Opini' | 'Kegiatan' | 'Prestasi'>(initialCategory);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          // If database is empty, seed it with initial news articles
          console.log('News table is empty, seeding...');
          await fetch('/api/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ news: NEWS_ARTICLES })
          });
          // Attempt refetch
          const refetchRes = await fetch('/api/news');
          const refetchData = await refetchRes.json();
          if (refetchData && refetchData.length > 0) {
            setArticles(refetchData);
          }
        }
      } catch (err) {
        console.warn('Using offline static news data:', err);
        setArticles(NEWS_ARTICLES);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (initialArticleId) {
      const found = articles.find(a => a.id === initialArticleId);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [initialArticleId, articles]);

  const categories: ('Semua' | 'Berita' | 'Opini' | 'Kegiatan' | 'Prestasi')[] = [
    'Semua',
    'Berita',
    'Opini',
    'Kegiatan',
    'Prestasi',
  ];

  // Filter logic
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (activeArticle) {
    return (
      <div className="py-12 bg-neutral-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <button
            onClick={() => {
              setActiveArticle(null);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="mb-8 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-all bg-white px-4 py-2.5 rounded-xl border border-neutral-200/80 shadow-sm hover:shadow active:scale-95"
          >
            ← Kembali ke Semua Artikel
          </button>

          {/* Standalone Article Content */}
          <article className="bg-white rounded-3xl border border-neutral-200/80 shadow-md p-6 sm:p-10 space-y-6">
            {/* Category badge */}
            <div>
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                activeArticle.category === 'Prestasi'
                  ? 'bg-amber-400 text-emerald-950 font-bold'
                  : activeArticle.category === 'Berita'
                  ? 'bg-emerald-900 text-white'
                  : activeArticle.category === 'Kegiatan'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}>
                Kategori: {activeArticle.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight font-serif">
              {activeArticle.title}
            </h1>

            {/* Author info & date metadata */}
            <div className="flex flex-wrap gap-4 items-center text-xs sm:text-sm text-neutral-500 border-y border-neutral-200/60 py-3.5">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                <User className="h-4 w-4 text-emerald-700" />
                Penulis: {activeArticle.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-700" />
                Tanggal Terbit: {activeArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-700" />
                Waktu Baca: {activeArticle.readTime}
              </span>
            </div>

            {/* Big Featured Image */}
            <div className="w-full h-64 sm:h-[420px] bg-neutral-100 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Body */}
            <div 
              className="prose max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed space-y-6 pt-4 font-sans wysiwyg-content"
              dangerouslySetInnerHTML={{ __html: activeArticle.content }}
            />
          </article>

          {/* Bottom Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setActiveArticle(null);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2"
            >
              ← Kembali ke Daftar Artikel & Berita
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="news" className="py-20 sm:py-24 bg-neutral-50 scroll-mt-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Announcement Cross-Link */}
        {onNavigate && (
          <div className="mb-10 bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Pemberitahuan Khusus
                </p>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium mt-0.5">
                  Mencari Surat Edaran resmi, jadwal kepulangan santri, atau ketentuan PSB?
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Buka Halaman Pengumuman</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-900 uppercase tracking-wider mb-4">
            <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
            <span>Kanal Warta & Tulisan Santri</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Artikel & Kabar Berita
          </h2>
          <p className="text-neutral-600 mt-3 text-sm sm:text-base leading-relaxed">
            Kumpulan liputan aktivitas harian santri, opini keilmuan para asatidz, dokumentasi prestasi, dan kajian keislaman tradisional di Pondok Pesantren Darul Mushthofa Assunniyyah.
          </p>
        </div>

        {/* Search and Category Filter Panel */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-4 sm:p-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`news-filter-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              id="news-search-input"
              type="text"
              placeholder="Cari artikel, opini, atau berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 text-sm bg-neutral-50/50"
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
        </div>

        {/* News Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                id={`news-card-${article.id}`}
                onClick={() => setActiveArticle(article)}
                className="group bg-white rounded-3xl border border-neutral-200/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col md:flex-row h-full cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative md:w-2/5 h-48 md:h-full bg-neutral-100 flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shadow ${
                      article.category === 'Prestasi'
                        ? 'bg-amber-400 text-emerald-950 font-bold'
                        : article.category === 'Berita'
                        ? 'bg-emerald-900 text-white'
                        : article.category === 'Kegiatan'
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-emerald-700" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="font-bold text-neutral-900 text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2 font-serif">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-neutral-500 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-600">
                      {article.author}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca Selengkapnya
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <p className="text-neutral-500">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
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
        )}
      </div>
    </section>
  );
}
