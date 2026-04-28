'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, GraduationCap, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface School {
  id: number;
  name: string;
  district: string;
  type: string;
  stages: string[];
}

const schoolsData: School[] = [
  { id: 1, name: 'مدرسة 6 أكتوبر الرسمية المتميزة للغات', district: '6 أكتوبر', type: 'رسمية متميزة للغات', stages: ['KG1', 'KG2', 'ابتدائي', 'إعدادي'] },
  { id: 2, name: 'مدرسة العمرانية التجريبية للغات', district: 'العمرانية', type: 'تجريبية لغات', stages: ['KG1', 'KG2', 'ابتدائي', 'إعدادي', 'ثانوي'] },
  { id: 3, name: 'مدرسة مصطفى كامل الرسمية المتميزة للغات', district: 'العمرانية', type: 'رسمية متميزة للغات', stages: ['ابتدائي', 'إعدادي'] },
  { id: 4, name: 'مدرسة الهرم الثانوية بنين', district: 'الهرم', type: 'رسمية', stages: ['ثانوي'] },
  { id: 5, name: 'مدرسة فيصل الإعدادية بنات', district: 'فيصل', type: 'رسمية', stages: ['إعدادي'] },
];

const districts = ['الكل', '6 أكتوبر', 'العمرانية', 'الهرم', 'فيصل'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function SchoolsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('الكل');

  const filtered = schoolsData.filter(school =>
    (filterDistrict === 'الكل' || school.district === filterDistrict) &&
    school.name.includes(search)
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            التعليم
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">دليل المدارس</h1>
          <p className="text-muted-foreground">دليل شامل للمدارس في محافظة الجيزة – ابحث عن المدرسة المناسبة</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن مدرسة..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={filterDistrict}
            onChange={e => setFilterDistrict(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Schools Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <School className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد مدارس مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((school, idx) => (
              <motion.div
                key={school.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground line-clamp-2">{school.name}</h2>
                      <p className="text-sm text-muted-foreground">{school.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{school.district}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.stages.map(stage => (
                      <Badge key={stage} className="bg-gray-100 text-gray-700 border-0 text-xs">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}