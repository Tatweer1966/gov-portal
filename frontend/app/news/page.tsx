'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, Search, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: number;
  title_ar: string;
  summary_ar: string;
  category: string;
  published_at: string;
  views: number;
  featured_image?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    fetch(`/api/news?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setNews(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, search]);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'أخبار عامة', label: 'أخبار عامة' },
    { id: 'خدمات', label: 'خدمات' },
    { id: 'ثقافة', label: 'ثقافة' },
    { id: 'أمن', label: 'أمن' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            المركز الإعلامي
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">آخر الأخبار</h1>
          <p className="text-muted-foreground">تابع المستجدات والبيانات الرسمية الصادرة عن المحافظة</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث في الأخبار..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  category === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-card text-foreground border border-border hover:border-primary/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد أخبار مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all h-full"
              >
                <Link href={`/news/${item.id}`} className="block h-full">
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-primary/10 text-primary border-0">{item.category || 'أخبار'}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{item.views || 0}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title_ar}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {item.summary_ar || 'اضغط لقراءة التفاصيل'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.published_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}