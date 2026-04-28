'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Grid3X3, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MediaItem {
  id: number;
  title_ar: string;
  url: string;
  type: string;
  category: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function MediaGalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/media?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMedia(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const categories = [
    { id: 'all', label: 'الكل', icon: Grid3X3 },
    { id: 'infographic', label: 'إنفوجرافيك', icon: Image },
    { id: 'video', label: 'فيديوهات', icon: Video },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            المركز الإعلامي
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">معرض الوسائط</h1>
          <p className="text-muted-foreground">استعرض أحدث الصور والإنفوجرافيك والفيديوهات</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-foreground border border-border hover:border-primary/40 hover:shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد وسائط في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((item, idx) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title_ar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{item.title_ar}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.category === 'infographic' ? 'إنفوجرافيك' : item.type === 'video' ? 'فيديو' : 'صورة'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}