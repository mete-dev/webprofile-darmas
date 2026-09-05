import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
}

interface LatestNewsWidgetProps {
  onNavigate: (sectionId: string, subParam?: string) => void;
}

export default function LatestNewsWidget({ onNavigate }: LatestNewsWidgetProps) {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Data is already ordered DESC by ID from the API
          setLatestNews(data.slice(0, 4));
        }
      })
      .catch(err => console.error('Failed to fetch latest news:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-white flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (latestNews.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <div className="py-20 sm:py-32 bg-neutral-50 relative overflow-hidden">
      {/* Top subtle fade from the previous dark section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-900 to-transparent opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Kabar Pesantren
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-4 font-serif">
              Berita Terbaru
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="group flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Lihat Semua Berita
            <span className="bg-emerald-100 p-1 rounded-full group-hover:bg-emerald-200 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onNavigate('news', article.id)}
              className="group cursor-pointer bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {article.summary}
                </p>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-neutral-500">{article.author}</span>
                  <ArrowRight className="h-4 w-4 text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
