// app/seniors/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const serviceTitles: Record<string, string> = {
  'home-care': 'طلب رعاية منزلية',
  'book-appointment': 'حجز كشف طبي لكبار السن',
  'ambulance': 'طلب سيارة إسعاف',
  'emergency-aid': 'إعانات طارئة',
  'national-id-home': 'استخراج بطاقة رقم قومي (منزلية)',
  'license-renewal': 'تجديد رخصة بدون حضور',
  'home-maintenance': 'صيانة منزلية',
  'medicine-delivery': 'توصيل أدوية',
  'counseling': 'جلسات دعم نفسي',
  'social-activities': 'أنشطة اجتماعية',
  'transport-discounts': 'خصومات مواصلات',
  'privilege-cards': 'بطاقات امتياز',
};

export default function SeniorServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const title = serviceTitles[slug] || 'خدمة كبار السن';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/seniors" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى خدمات كبار السن
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">هذه الخدمة قيد التطوير. سيتم توفير النموذج قريباً.</p>
          <p className="text-sm text-gray-500">للحصول على الخدمة حالياً، يرجى الاتصال على الرقم الموحد ١٦١٦١.</p>
        </div>
      </div>
    </div>
  );
}