'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Search, Landmark, FileCheck, Home, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 'lookup',
    title: 'الاستعلام عن الرقم القومي للعقار',
    description: 'الحصول على الرقم القومي الموحد للعقار وفقاً لقانون 88/2025',
    icon: Search,
    href: '/property-lookup',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'reconciliation',
    title: 'التصالح في مخالفات البناء',
    description: 'تقديم طلب تصالح في مخالفات البناء (قانون 187/2023)',
    icon: FileCheck,
    href: '/property/building-reconciliation',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'possession',
    title: 'تقنين وضع اليد',
    description: 'تقديم طلب لتقنين وضع اليد على العقارات',
    icon: Home,
    href: '/property/hand-possession',
    color: 'from-green-500 to-green-600',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function PropertyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            خدمات عقارية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">خدمات العقارات والتوثيق</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            استعلام، تصالح، تقنين – خدمات إلكترونية متكاملة لشؤون العقارات والأراضي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={service.href} className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all h-full">
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
        </div>
      </div>
    </div>
  );
}