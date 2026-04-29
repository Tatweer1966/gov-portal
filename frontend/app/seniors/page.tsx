'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartPulse, DollarSign, Home, Users, Brain, BellRing, PhoneCall,
  Calendar, HandHelping, Smile, Ticket, Star,
  Ambulance, ClipboardList, Moon, Sun
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SeniorsPage() {
  const [isElderlyMode, setIsElderlyMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('elderlyMode');
    if (saved === 'true') setIsElderlyMode(true);
  }, []);

  const toggleMode = () => {
    const newMode = !isElderlyMode;
    setIsElderlyMode(newMode);
    localStorage.setItem('elderlyMode', String(newMode));
    if (newMode) document.documentElement.classList.add('elderly-mode');
    else document.documentElement.classList.remove('elderly-mode');
  };

  const sections: Array<{
    title: string;
    services: Array<{ name: string; href: string; icon: React.ElementType; badge?: string }>;
  }> = [
    { title: '🏥 الرعاية الصحية', services: [
      { name: 'طلب رعاية منزلية', href: '/seniors/home-care', icon: Home },
      { name: 'حجز كشف طبي', href: '/seniors/book-appointment', icon: Calendar },
      { name: 'طلب سيارة إسعاف', href: '/seniors/ambulance', icon: Ambulance },
      { name: 'متابعة التأمين الصحي', href: '/health/comprehensive-insurance', icon: HeartPulse }
    ] },
    { title: '💰 الدعم المالي', services: [
      { name: 'طلب معاش / دعم اجتماعي', href: '/social-services/request', icon: DollarSign },
      { name: 'متابعة حالة الدعم', href: '/social-services/status', icon: ClipboardList },
      { name: 'إعانات طارئة', href: '/seniors/emergency-aid', icon: HandHelping }
    ] },
    { title: '⚡ خدمات حكومية ذات أولوية', services: [
      { name: 'استخراج بطاقة رقم قومي (منزلية)', href: '/seniors/national-id-home', icon: Users, badge: 'أولوية' },
      { name: 'تجديد رخصة بدون حضور', href: '/seniors/license-renewal', icon: Ticket, badge: 'أولوية' }
    ] },
    { title: '🏠 خدمات منزلية', services: [
      { name: 'صيانة منزلية', href: '/seniors/home-maintenance', icon: Home },
      { name: 'توصيل أدوية', href: '/seniors/medicine-delivery', icon: HeartPulse }
    ] },
    { title: '👥 متطوعون ومجتمع', services: [
      { name: 'طلب متطوع', href: '/golden-citizen/volunteer/request-service', icon: HandHelping },
      { name: 'تسجيل كمتطوع', href: '/golden-citizen/volunteer/register', icon: Users }
    ] },
    { title: '🧠 دعم نفسي واجتماعي', services: [
      { name: 'جلسات دعم نفسي', href: '/seniors/counseling', icon: Brain },
      { name: 'أنشطة اجتماعية', href: '/seniors/social-activities', icon: Smile }
    ] },
    { title: '🎟️ مزايا وخصومات', services: [
      { name: 'خصومات مواصلات', href: '/seniors/transport-discounts', icon: Ticket },
      { name: 'بطاقات امتياز', href: '/seniors/privilege-cards', icon: Star }
    ] },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">خدمات كبار المواطنين</h1>
          <button onClick={toggleMode} className="flex gap-2 px-4 py-2 bg-white rounded-full shadow">
            {isElderlyMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">{isElderlyMode ? 'الوضع العادي' : 'وضع كبار السن'}</span>
          </button>
        </div>

        {/* Emergency Button */}
        <Link href="/seniors/emergency">
          <div className="bg-red-600 text-white rounded-2xl p-5 flex justify-between mb-6">
            <div><BellRing className="inline mr-2 animate-pulse" /> طلب مساعدة عاجلة</div>
            <PhoneCall />
          </div>
        </Link>

        {/* NEW: Request & Track Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/seniors/request" className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition">
            طلب خدمة جديدة
          </Link>
          <Link href="/seniors/my-requests" className="border border-primary text-primary bg-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/10 transition">
            متابعة طلباتي
          </Link>
        </div>

        {/* Service Sections */}
        {sections.map((sec, idx) => (
          <div key={idx} className="mb-10">
            <h2 className="font-bold text-xl mb-4 text-primary border-r-4 border-primary pr-3">{sec.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sec.services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <Link key={i} href={svc.href}>
                    <Card className="h-full hover:shadow-lg transition">
                      <CardHeader>
                        <div className="flex justify-between">
                          <Icon className="w-10 h-10 text-primary" />
                          {svc.badge && <Badge>{svc.badge}</Badge>}
                        </div>
                        <CardTitle>{svc.name}</CardTitle>
                        <CardDescription>اضغط للتفاصيل</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}