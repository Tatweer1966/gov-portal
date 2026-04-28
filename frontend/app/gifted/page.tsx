'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  GraduationCap,
  Users,
  Star,
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Award,
  Brain,
  Palette,
  Music,
  Microscope,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────
interface TalentCategory {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  assessment_methods: string[];
  is_active: boolean;
}

interface GiftedProgram {
  id: number;
  program_code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category_id: number;
  program_type: string;
  duration_hours: number;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  is_active: boolean;
  category_name?: string;
}

// ── Constants ──────────────────────────────────────────────────────────
const categoryIconMap: Record<number, React.ElementType> = {
  1: Brain,      // Scientific
  2: Palette,    // Artistic
  3: Music,      // Musical
  4: Microscope, // STEM
  5: Trophy,     // Sports
};

const defaultIcon = Sparkles;

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

export default function GiftedPage() {
  const [categories, setCategories] = useState<TalentCategory[]>([]);
  const [programs, setPrograms] = useState<GiftedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'programs'>('categories');

  useEffect(() => {
    Promise.all([
      fetch('/api/gifted/categories').then(res => res.json()),
      fetch('/api/gifted/programs').then(res => res.json()),
    ])
      .then(([catsData, progsData]) => {
        if (catsData.success) setCategories(catsData.data);
        if (progsData.success) setPrograms(progsData.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary to-primary/80 text-white py-20">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-accent/20 text-accent-foreground border-0 mb-4 text-xs px-3 py-1 rounded-full">
              رعاية الموهوبين
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4">برنامج رعاية الموهوبين</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              نكتشف ونرعى الطلاب الموهوبين في مختلف المجالات العلمية والأدبية والفنية، ونقدم لهم برامج تأهيلية متطورة.
            </p>
            <Link
              href="/gifted/apply"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
              <Star className="w-5 h-5" /> ترشيح طالب موهوب
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-foreground border border-border hover:border-primary/40'
            }`}
          >
            مجالات الموهبة
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === 'programs'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-foreground border border-border hover:border-primary/40'
            }`}
          >
            البرامج التأهيلية
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((cat, idx) => {
              const Icon = categoryIconMap[cat.id] || defaultIcon;
              return (
                <motion.div
                  key={cat.id}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{cat.name_ar}</h3>
                      <p className="text-sm text-muted-foreground">{cat.name_en}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{cat.description_ar}</p>
                  {cat.assessment_methods?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-primary mb-1">طرق التقييم:</p>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                        {cat.assessment_methods.map((method, i) => (
                          <li key={i}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <motion.div
            key="programs"
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {programs.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                لا توجد برامج حالياً
              </div>
            ) : (
              programs.map((prog, idx) => (
                <motion.div
                  key={prog.id}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-primary/10 text-primary border-0">
                      {prog.program_type === 'academic' ? 'أكاديمي' : prog.program_type === 'enrichment' ? 'إثرائي' : 'تدريبي'}
                    </Badge>
                    {prog.category_name && (
                      <span className="text-xs text-muted-foreground">{prog.category_name}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{prog.name_ar}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{prog.description_ar}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>المدة: {prog.duration_hours} ساعة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(prog.start_date).toLocaleDateString('ar-EG')} – {new Date(prog.end_date).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{prog.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>الحد الأقصى: {prog.max_participants} مشارك</span>
                    </div>
                  </div>
                  <Link
                    href={`/gifted/apply?program=${prog.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                  >
                    سجل الآن <ChevronLeft className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">هل تعرف طالباً موهوباً؟</h2>
          <p className="text-muted-foreground mb-6">ساعدنا في اكتشاف المواهب الواعدة ودعمها من خلال برامجنا المتخصصة.</p>
          <Link
            href="/gifted/apply"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            <Award className="w-5 h-5" /> ترشيح طالب موهوب
          </Link>
        </div>
      </section>
    </div>
  );
}