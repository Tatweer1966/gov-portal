'use client';

import { useState } from 'react';  // ✅ Added missing import

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Star, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const activities = [
  {
    id: 1,
    name: 'أهرامات الجيزة وأبو الهول',
    category: 'historical',
    description: 'أحد عجائب الدنيا السبع، مقصد سياحي عالمي.',
    hours: '8ص – 5م يومياً',
    price: '200 جنيه (مصريين)',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'هضبة الأهرامات، الجيزة',
  },
  {
    id: 2,
    name: 'حديقة الأورمان النباتية',
    category: 'nature',
    description: 'حديقة نباتية عريقة تضم آلاف الأنواع النادرة.',
    hours: '9ص – 10م',
    price: '20 جنيه',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1582389188816-2b9b75a16b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'الهرم، الجيزة',
  },
  {
    id: 3,
    name: 'مركز المنارة للمؤتمرات',
    category: 'entertainment',
    description: 'أكبر مركز مؤتمرات في أفريقيا، يستضيف الفعاليات الكبرى.',
    hours: 'حسب الفعاليات',
    price: 'حسب الفعالية',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'مدينة نصر، القاهرة (بالقرب من الجيزة)',
  },
  {
    id: 4,
    name: 'شارع النيل (كورنيش الجيزة)',
    category: 'leisure',
    description: 'منطقة ترفيهية مطلة على النيل تضم مطاعم وكافيهات وحدائق.',
    hours: '24 ساعة',
    price: 'مجاني',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1545021130-5c2c8c5f23f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'كورنيش النيل، الجيزة',
  },
  {
    id: 5,
    name: 'قرية الفراعنة',
    category: 'cultural',
    description: 'قرية سياحية تحاكي الحياة الفرعونية القديمة بعروض تفاعلية.',
    hours: '9ص – 8م',
    price: '120 جنيه',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1566564630074-8c9c610e60c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'الوراق، الجيزة',
  },
  {
    id: 6,
    name: 'حديقة الحيوان بالجيزة',
    category: 'nature',
    description: 'أقدم حدائق الحيوان في أفريقيا، تضم مجموعة متنوعة من الحيوانات.',
    hours: '9ص – 5م (ما عدا الأربعاء)',
    price: '10 جنيه',
    rating: 3,
    image: 'https://images.unsplash.com/photo-1584793269200-f5e2a2f3a152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'شارع مراد، الجيزة',
  },
];

const categories = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'historical', label: 'تاريخي' },
  { id: 'nature', label: 'طبيعة' },
  { id: 'entertainment', label: 'ترفيه' },
  { id: 'cultural', label: 'ثقافي' },
  { id: 'leisure', label: 'استجمام' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function ThingsToDoPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = selectedCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            سياحة وترفيه
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">أنشطة في الجيزة</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اكتشف أفضل الأماكن والأنشطة – من المعالم التاريخية إلى المنتزهات والمراكز الترفيهية
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card text-foreground border border-border hover:border-primary/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">لا توجد أنشطة في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                      {activity.category === 'historical' ? 'تاريخي' : 
                       activity.category === 'nature' ? 'طبيعة' :
                       activity.category === 'entertainment' ? 'ترفيه' :
                       activity.category === 'cultural' ? 'ثقافي' : 'استجمام'}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">
                    {activity.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-muted-foreground">{activity.rating}.0</span>
                    <span className="text-muted-foreground text-xs">(تقييم)</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs">{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-xs">{activity.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-xs">{activity.price}</span>
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
                  >
                    تفاصيل أكثر <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Travel Tips */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
          <h3 className="font-bold text-lg mb-2">💡 نصائح للزوار</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>✓ يفضل زيارة الأهرامات في الصباح الباكر لتجنب الزحام</span>
            <span>✓ استخدم تطبيقات النقل الذكي للتنقل</span>
            <span>✓ احضر قبعة وواقي شمس في المواقع المكشوفة</span>
          </div>
        </div>
      </div>
    </div>
  );
}