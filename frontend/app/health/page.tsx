'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HeartPulse,
  ShieldCheck,
  Search,
  FileText,
  ArrowLeft,
  Stethoscope,
  Syringe,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 'state-funded-treatment',
    title: 'العلاج على نفقة الدولة',
    description: 'تقديم طلب علاج على نفقة الدولة للمواطنين غير القادرين',
    icon: Stethoscope,
    href: '/health/state-funded-treatment',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'comprehensive-insurance',
    title: 'التأمين الصحي الشامل',
    description: 'التسجيل في منظومة التأمين الصحي الشامل للأسرة',
    icon: ShieldCheck,
    href: '/health/comprehensive-insurance',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'insurance-inquiry',
    title: 'الاستعلام عن التأمين الصحي',
    description: 'الاستعلام عن حالة طلب التأمين الصحي باستخدام الرقم القومي',
    icon: Search,
    href: '/health/insurance-inquiry',
    color: 'from-green-500 to-green-600',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export default function HealthServicesPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 🔹 Back link to all services (fixes the non-working "all services" button) */}
        <div className="mb-4 text-right">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> جميع الخدمات
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            وزارة الصحة
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الخدمات الصحية</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات الصحية لضمان رعاية صحية متميزة لجميع المواطنين
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Link
                  href={service.href}
                  className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all h-full"
                >
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      ابدأ الخدمة <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold mb-2">خدمات صحية إضافية</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Syringe className="w-4 h-4 text-primary" /> التطعيمات</span>
            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> الفحوصات الوقائية</span>
            <span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-primary" /> التثقيف الصحي</span>
          </div>
        </div>
      </div>
    </div>
  );
}