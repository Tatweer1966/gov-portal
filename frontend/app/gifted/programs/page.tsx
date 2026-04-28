'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Target,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface GiftedProgram {
  id: number;
  program_code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category_id: number;
  category_name?: string;
  program_type: string;
  duration_hours: number;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  is_active: boolean;
}

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

export default function GiftedProgramsPage() {
  const [programs, setPrograms] = useState<GiftedProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gifted/programs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPrograms(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case 'academic': return 'أكاديمي';
      case 'enrichment': return 'إثرائي';
      case 'training': return 'تدريبي';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            برامج رعاية الموهوبين
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">البرامج التأهيلية</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم برامج متخصصة لتطوير مهارات الطلاب الموهوبين في مختلف المجالات
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">لا توجد برامج حالياً</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {programs.map((program, idx) => (
              <motion.div
                key={program.id}
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-primary/10 text-primary border-0">
                      {getProgramTypeLabel(program.program_type)}
                    </Badge>
                    {program.category_name && (
                      <span className="text-xs text-muted-foreground">{program.category_name}</span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{program.name_ar}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {program.description_ar}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>المدة: {program.duration_hours} ساعة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(program.start_date).toLocaleDateString('ar-EG')} – {new Date(program.end_date).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>الحد الأقصى: {program.max_participants} مشارك</span>
                    </div>
                  </div>

                  <Link
                    href={`/gifted/apply?program=${program.id}`}
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                  >
                    سجل الآن <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/gifted/apply"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg"
          >
            <Award className="w-5 h-5" /> ترشيح طالب موهوب
          </Link>
        </div>
      </div>
    </div>
  );
}