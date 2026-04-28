'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Star, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: number;
  name_ar: string;
  slug: string;
  description_ar: string;
  is_featured: boolean;
  category_name?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (featuredOnly) params.append('featured', 'true');
      const res = await fetch(`/api/services?${params.toString()}`);
      const data = await res.json();
      if (data.success) setServices(data.data);
      setLoading(false);
    };
    fetchServices();
  }, [search, featuredOnly]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            خدمات حكومية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الخدمات الإلكترونية</h1>
          <p className="text-muted-foreground">تصفح جميع الخدمات المتاحة للمواطنين</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن خدمة..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg cursor-pointer hover:border-primary/40 transition">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={e => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm font-medium">الخدمات المميزة فقط</span>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد خدمات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all h-full"
              >
                <Link href={`/services/${service.slug}`} className="block p-5 h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {service.name_ar}
                    </h2>
                    {service.is_featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                    {service.description_ar || 'اضغط لعرض التفاصيل'}
                  </p>
                  {service.category_name && (
                    <Badge className="mt-3 bg-gray-100 text-gray-600 border-0 text-xs">
                      {service.category_name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all mt-3 translate-x-1 group-hover:translate-x-0">
                    عرض التفاصيل <ChevronLeft className="w-4 h-4" />
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