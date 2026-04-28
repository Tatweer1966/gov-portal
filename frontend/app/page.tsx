'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  GraduationCap,
  HeartPulse,
  Building2,
  Landmark,
  Zap,
  ShieldCheck,
  Users,
  Star,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Globe,
  Phone,
  MapPin,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

interface TenantTheme {
  logoUrl: string;
  footerText: string;
  contactPhone: string;
  address: string;
  tenantName: string;
}

// ── Constants ──────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'تسجيل عقار', icon: Building2, href: '/property/building-reconciliation' },
  { label: 'التأمين الصحي', icon: HeartPulse, href: '/health/comprehensive-insurance' },
  { label: 'الدعم الاجتماعي', icon: Users, href: '/social-services/request?type=psychological_support' },
  { label: 'المرافق', icon: Zap, href: '/tech-centers' },
];

const STATS = [
  { value: '٢٠٠+', label: 'خدمة إلكترونية' },
  { value: '٥٠٠٠+', label: 'طلب يومياً' },
  { value: '١.٢M', label: 'مواطن مسجل' },
  { value: '٩٨٪', label: 'رضا المواطنين' },
];

const HOW_IT_WORKS = [
  { icon: Globe, title: 'ادخل البوابة', desc: 'سجّل دخولك أو أنشئ حساباً جديداً بخطوة واحدة' },
  { icon: Search, title: 'ابحث عن خدمتك', desc: 'تصفّح أكثر من ٢٠٠ خدمة أو ابحث مباشرة عبر شريط البحث' },
  { icon: FileText, title: 'قدّم طلبك', desc: 'أكمل النموذج الإلكتروني وأرفق المستندات المطلوبة' },
  { icon: CheckCircle2, title: 'تابع وأنجز', desc: 'تابع حالة طلبك في الوقت الفعلي واستلم نتيجتك إلكترونياً' },
];

const categoryIconMap: Record<number, React.ElementType> = {
  1: ShieldCheck,
  2: HeartPulse,
  3: Users,
  4: GraduationCap,
  5: Building2,
  6: Zap,
};

// ── Animation Variants ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<TenantTheme | null>(null);

  useEffect(() => {
    // Fetch tenant theme (logo, name, contact)
    fetch('/api/tenant/theme')
      .then(res => res.json())
      .then(data => setTheme(data))
      .catch(console.error);

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(console.error);

    // Fetch services
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

  // Use tenant name or fallback
  const governorateName = theme?.tenantName || 'الجيزة';
  const contactPhone = theme?.contactPhone || '١٦١٦١';
  const contactAddress = theme?.address || 'ميدان الجيزة، القاهرة، مصر';

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans">
      {/* Navbar (fixed) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
              {theme?.logoUrl ? (
                <img src={theme.logoUrl} alt="شعار المحافظة" className="w-7 h-7 object-contain" />
              ) : (
                <Landmark className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-foreground text-sm leading-tight">محافظة {governorateName}</p>
              <p className="text-xs text-muted-foreground">بوابة الخدمات الإلكترونية</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">الخدمات</a>
            <a href="#how" className="hover:text-primary transition-colors">كيف يعمل</a>
            <a href="#contact" className="hover:text-primary transition-colors">تواصل معنا</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/5 px-4 py-1.5 rounded-lg transition">
              تسجيل دخول
            </Link>
            {/* ✅ FIXED: Changed from "/dashboard" to "/register" */}
            <Link href="/register" className="text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-lg transition">
              حساب جديد
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section (unchanged) */}
      <section className="relative overflow-hidden min-h-[580px] md:min-h-[660px] flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541769740-098e80269166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/80 to-primary/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div variants={fadeUp}>
              <Badge className="bg-accent/90 text-accent-foreground border-0 mb-5 text-xs px-3 py-1 rounded-full font-semibold tracking-wide shadow">
                بوابة الخدمات الحكومية الرسمية
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              خدمات محافظة <span className="text-accent drop-shadow-sm">{governorateName}</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/85 text-base md:text-xl mb-8 leading-relaxed max-w-lg">
              أكثر من ٢٠٠ خدمة حكومية في متناول يدك. أنجز معاملاتك بسهولة وأمان من أي مكان وفي أي وقت.
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeUp} className="relative max-w-xl mb-6">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن الخدمة التي تحتاجها..."
                className="w-full pr-12 pl-28 h-14 text-base bg-white border-0 shadow-2xl rounded-xl focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-400"
              />
              <button className="absolute left-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition shadow">
                بحث
              </button>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <span className="text-white/60 text-sm self-center ml-1">الأكثر طلباً:</span>
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-1.5 rounded-lg transition backdrop-blur-sm border border-white/10"
                >
                  <q.icon className="w-3.5 h-3.5 text-accent" />
                  {q.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeIn}>
                <p className="text-3xl md:text-4xl font-black text-accent">{s.value}</p>
                <p className="text-sm text-white/70 mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
        >
          <div>
            <p className="text-primary font-bold text-sm mb-1 tracking-widest uppercase">الخدمات</p>
            <h2 className="text-2xl md:text-4xl font-black text-foreground">الخدمات الإلكترونية</h2>
            <p className="text-muted-foreground mt-1.5 text-base">
              تصفح جميع الخدمات المتاحة لمواطني محافظة {governorateName}
            </p>
          </div>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:gap-3 transition-all text-sm shrink-0">
            عرض جميع الخدمات <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card text-foreground border border-border hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            <Landmark className="w-4 h-4" />
            الكل
          </button>
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.id] ?? Landmark;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-foreground border border-border hover:border-primary/40 hover:shadow-sm'
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
          <div className="text-center py-24 text-muted-foreground">جاري التحميل...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-25" />
            <p className="text-lg font-semibold">لا توجد خدمات مطابقة لبحثك</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredServices.map((service, idx) => {
              const Icon = categoryIconMap[service.category_id] ?? Landmark;
              return (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, delay: idx * 0.04, ease: 'easeOut' as const } },
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group bg-card rounded-2xl border p-6 hover:shadow-xl hover:border-primary/30 transition-all h-full flex flex-col gap-3 ${
                      service.is_featured
                        ? 'border-accent/50 bg-gradient-to-br from-white to-amber-50/60'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          service.is_featured
                            ? 'bg-accent/20 text-amber-600'
                            : 'bg-primary/8 text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {service.is_featured && (
                        <Badge className="bg-accent/20 text-amber-700 border-0 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" /> مميز
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug text-base">
                        {service.name_ar}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {service.description_ar || 'اضغط لعرض التفاصيل'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
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

      {/* How It Works */}
      <section id="how" className="bg-primary/5 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-primary font-bold text-sm mb-1 tracking-widest uppercase">خطوات بسيطة</p>
            <h2 className="text-2xl md:text-4xl font-black text-foreground">كيف تستخدم البوابة؟</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeIn}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="relative inline-flex mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-black flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-base mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-primary py-20 mt-0">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-accent/20 text-accent-foreground border-0 mb-5 text-xs px-3 py-1 rounded-full font-semibold">
              سريع · آمن · موثوق
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 text-balance">
              ابدأ رحلتك مع الخدمات الإلكترونية
            </h2>
            <p className="text-white/75 text-base md:text-lg mb-10 max-w-xl mx-auto">
              سجّل الآن مجاناً وتمتع بجميع خدمات محافظة {governorateName} من راحة منزلك على مدار الساعة
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3.5 rounded-xl transition shadow-lg text-base"
              >
                سجّل الآن مجاناً
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl transition text-base font-semibold"
              >
                تعرف على الخدمات
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-foreground text-background/80 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  {theme?.logoUrl ? (
                    <img src={theme.logoUrl} alt="شعار المحافظة" className="w-7 h-7 object-contain" />
                  ) : (
                    <Landmark className="w-5 h-5 text-accent-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-black text-background text-sm leading-tight">محافظة {governorateName}</p>
                  <p className="text-xs text-background/50">بوابة الخدمات الإلكترونية</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-background/60">
                {theme?.footerText || `نقدم أفضل الخدمات الحكومية الإلكترونية لمواطني محافظة ${governorateName}.`}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-background mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/services" className="hover:text-accent transition-colors">الخدمات الإلكترونية</Link></li>
                <li><Link href="/news" className="hover:text-accent transition-colors">الأخبار والإعلانات</Link></li>
                <li><Link href="/about-governorate" className="hover:text-accent transition-colors">تواصل معنا</Link></li>
                <li><Link href="/open-source" className="hover:text-accent transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-background mb-4">تواصل معنا</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent shrink-0" /> {contactPhone}</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent shrink-0" /> {contactAddress}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center text-xs text-background/40">
            &copy; {new Date().getFullYear()} محافظة {governorateName} — جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}