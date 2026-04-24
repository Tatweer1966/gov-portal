'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Phone,
  MapPin,
  Clock,
  ChevronLeft,
  GraduationCap,
  HeartPulse,
  Building2,
  Landmark,
  Zap,
  ShieldCheck,
  TreePine,
  Users,
  Star,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ── Types ──────────────────────────────────────────────────────────────
interface Service {
  id: number;
  name_ar: string;
  slug: string;
  description_ar: string;
  category_id: number;
  is_featured: boolean;
}

interface Category {
  id: number;
  name_ar: string;
}

// ── Constants ──────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'تسجيل عقار', icon: Building2, href: '/property/building-reconciliation' },
  { label: 'التأمين الصحي', icon: HeartPulse, href: '/health/comprehensive-insurance' },
  { label: 'الدعم النفسي', icon: Users, href: '/social-services/request?type=psychological_support' },
  { label: 'المراكز التكنولوجية', icon: Zap, href: '/tech-centers' },
];

const STATS = [
  { value: '٢٠٠+', label: 'خدمة إلكترونية' },
  { value: '٥٠٠٠+', label: 'طلب يومياً' },
  { value: '١.٢M', label: 'مواطن مسجل' },
  { value: '٩٨٪', label: 'رضا المواطنين' },
];

const categoryIconMap: Record<number, React.ElementType> = {
  1: Building2,   // تراخيص
  2: HeartPulse, // صحة
  3: Users,      // اجتماعية
  4: GraduationCap, // تعليم
  5: Landmark,      // عقار
  6: Zap,           // مرافق
  7: ShieldCheck,   // تراخيص
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(console.error);

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success) setServices(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category_id === activeCategory;
    const matchSearch = !search || s.name_ar.includes(search) || s.description_ar.includes(search);
    return matchCat && matchSearch;
  });

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };
  const statItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541769740-098e80269166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/75 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-4 text-sm px-3 py-1 rounded-full">
              بوابة الخدمات الحكومية
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              خدمات محافظة <span className="text-yellow-300">الجيزة</span>
            </h1>
            <p className="text-white/85 text-lg md:text-xl mb-8 leading-relaxed">
              أكثر من ٢٠٠ خدمة حكومية في متناول يدك. أنجز معاملاتك بسهولة ويسر من أي مكان.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-xl"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن الخدمة التي تحتاجها..."
              className="pr-12 pl-4 h-14 text-base bg-white border-0 shadow-xl rounded-xl focus:ring-2 focus:ring-primary"
            />
            <Button className="absolute left-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-lg shadow-md bg-primary hover:bg-primary/90">
              بحث
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            <span className="text-white/70 text-sm self-center">الأكثر طلباً:</span>
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-1.5 rounded-lg transition backdrop-blur-sm"
              >
                <q.icon className="w-3.5 h-3.5" />
                {q.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={statItem}>
                <p className="text-3xl md:text-4xl font-extrabold text-yellow-300">{s.value}</p>
                <p className="text-sm text-white/80 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">الخدمات الإلكترونية</h2>
            <p className="text-gray-500 mt-1">تصفح جميع الخدمات المتاحة لمواطني محافظة الجيزة</p>
          </div>
          <Link href="/services" className="mt-3 md:mt-0 inline-flex items-center gap-1 text-primary hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            <Landmark className="w-4 h-4" />
            الكل
          </button>
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.id] || Landmark;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/40 hover:shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name_ar}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد خدمات مطابقة لبحثك</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredServices.map((service, idx) => {
              const Icon = categoryIconMap[service.category_id] || Landmark;
              return (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: idx * 0.03 } },
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-primary/30 transition-all h-full flex flex-col gap-3 ${
                      service.is_featured ? 'border-yellow-400/40 bg-gradient-to-br from-white to-yellow-50' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          service.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {service.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> مميز
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug">
                        {service.name_ar}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {service.description_ar || 'اضغط لعرض التفاصيل'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      ابدأ الخدمة
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-l from-primary to-primary/80 text-white py-16 mt-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">ابدأ رحلتك مع الخدمات الإلكترونية</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              سجّل الآن وتمتع بجميع خدمات محافظة الجيزة من راحة منزلك
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg transition shadow-md"
              >
                سجّل الآن مجاناً
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-lg transition"
              >
                تعرف على الخدمات
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}