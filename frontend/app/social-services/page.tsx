'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Phone, Shield, Heart, Users, Brain, Home, ArrowLeft } from 'lucide-react';

const programs = [
  {
    id: 'child-protection',
    title: 'حماية الطفل',
    icon: Shield,
    desc: 'خدمات الدعم والحماية للأطفال',
    link: '/social-services/request?type=child_protection',
    hotline: '16000',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'addiction',
    title: 'مكافحة الإدمان',
    icon: Heart,
    desc: 'علاج وتأهيل مجاني',
    link: '/social-services/request?type=addiction',
    hotline: '16023',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'women',
    title: 'حماية المرأة',
    icon: Users,
    desc: 'حماية من العنف الأسري',
    link: '/social-services/domestic-violence-report',
    hotline: '15115',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'elderly',
    title: 'رعاية كبار السن',
    icon: Home,
    desc: 'خدمات الرعاية المنزلية',
    link: '/social-services/request?type=elderly_care',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'psychological',
    title: 'الدعم النفسي',
    icon: Brain,
    desc: 'جلسات استشارية',
    link: '/social-services/request?type=psychological_support',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'family',
    title: 'التوعية الأسرية',
    icon: Users,
    desc: 'برامج توعوية',
    link: '/social-services/family-counseling',
    color: 'from-amber-500 to-amber-600',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function SocialServicesPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            خدمات اجتماعية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الخدمات الاجتماعية</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            برامج حماية الأسرة المصرية – دعم واستشارات مجانية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, idx) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={program.link} className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all h-full">
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{program.desc}</p>
                    {program.hotline && (
                      <div className="flex items-center gap-2 text-sm text-primary mb-3">
                        <Phone className="w-4 h-4" />
                        <span className="font-semibold">الخط الساخن: {program.hotline}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      تقديم طلب <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Emergency Note */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
          <h3 className="font-bold text-lg mb-2">في حالات الطوارئ</h3>
          <p className="text-muted-foreground text-sm">
            يمكنك الاتصال على الخط الساخن الموحد للمحافظة: <strong className="text-primary">١٦١٦١</strong> على مدار الساعة.
          </p>
        </div>
      </div>
    </div>
  );
}