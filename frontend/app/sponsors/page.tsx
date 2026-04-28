'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Heart } from 'lucide-react';
import Image from 'next/image';

const sponsors = [
  {
    id: 1,
    name: 'البنك الأهلي المصري',
    level: 'platinum',
    since: 2025,
    description: 'دعم التحول الرقمي والبنية التحتية التكنولوجية',
    icon: Award,
    logo: 'https://placehold.co/80x80?text=NBE', // Placeholder – replace with actual logo URL
  },
  {
    id: 2,
    name: 'فودافون مصر',
    level: 'platinum',
    since: 2025,
    description: 'راعي خدمات الاتصالات وتقنية المعلومات',
    icon: Award,
    logo: 'https://placehold.co/80x80?text=Vodafone',
  },
  {
    id: 3,
    name: 'مجموعة طلعت مصطفى',
    level: 'gold',
    since: 2025,
    description: 'دعم مشروعات الإسكان والتنمية العمرانية',
    icon: Star,
    logo: 'https://placehold.co/80x80?text=Talaat',
  },
  {
    id: 4,
    name: 'WE المصرية للاتصالات',
    level: 'gold',
    since: 2025,
    description: 'توفير البنية التحتية للاتصالات',
    icon: Star,
    logo: 'https://placehold.co/80x80?text=WE',
  },
  {
    id: 5,
    name: 'شركة مياه الشرب بالقاهرة الكبرى',
    level: 'silver',
    since: 2025,
    description: 'راعي حملات التوعية المائية',
    icon: Trophy,
    logo: 'https://placehold.co/80x80?text=Water',
  },
  {
    id: 6,
    name: 'أوراسكوم للتنمية',
    level: 'silver',
    since: 2025,
    description: 'دعم التطوير العقاري والسياحي',
    icon: Trophy,
    logo: 'https://placehold.co/80x80?text=Orascom',
  },
];

const levelConfig = {
  platinum: { label: 'راعي رئيسي', color: 'from-slate-400 to-slate-600', bgBadge: 'bg-slate-100 text-slate-700' },
  gold: { label: 'راعي ذهبي', color: 'from-amber-500 to-amber-700', bgBadge: 'bg-amber-100 text-amber-700' },
  silver: { label: 'راعي فضي', color: 'from-gray-400 to-gray-500', bgBadge: 'bg-gray-100 text-gray-700' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function SponsorsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            شركاء النجاح
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">شركاء الرعاية</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نوجه الشكر إلى شركائنا على دعمهم المستمر لبوابة الخدمات الإلكترونية لمحافظة الجيزة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor, idx) => {
            const Icon = sponsor.icon;
            const config = levelConfig[sponsor.level as keyof typeof levelConfig];
            return (
              <motion.div
                key={sponsor.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                    />
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-4 mx-auto shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge className={`${config.bgBadge} border-0 mb-3 block w-fit mx-auto`}>{config.label}</Badge>
                  <h3 className="text-xl font-bold text-foreground mb-1 text-center">{sponsor.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 text-center">{sponsor.description}</p>
                  <p className="text-xs text-muted-foreground text-center">شريك منذ {sponsor.since}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
          <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-1">انضم كشريك رعاية</h3>
          <p className="text-muted-foreground text-sm">
            إذا كنت ترغب في دعم منظومة الخدمات الإلكترونية، يرجى التواصل معنا على البريد الإلكتروني:
            <strong className="text-primary block mt-1">sponsorship@giza.gov.eg</strong>
          </p>
        </div>
      </div>
    </div>
  );
}