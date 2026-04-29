'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const serviceOptions = [
  { slug: 'home-care', label: 'طلب رعاية منزلية' },
  { slug: 'book-appointment', label: 'حجز كشف طبي' },
  { slug: 'ambulance', label: 'طلب سيارة إسعاف' },
  { slug: 'emergency-aid', label: 'إعانات طارئة' },
  { slug: 'national-id-home', label: 'بطاقة رقم قومي (منزلية)' },
  { slug: 'license-renewal', label: 'تجديد رخصة بدون حضور' },
  { slug: 'home-maintenance', label: 'صيانة منزلية' },
  { slug: 'medicine-delivery', label: 'توصيل أدوية' },
  { slug: 'counseling', label: 'جلسات دعم نفسي' },
  { slug: 'social-activities', label: 'أنشطة اجتماعية' },
  { slug: 'transport-discounts', label: 'خصومات مواصلات' },
  { slug: 'privilege-cards', label: 'بطاقات امتياز' },
];

export default function SeniorRequestPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    citizenName: '',
    citizenPhone: '',
    citizenAddress: '',
    serviceSlug: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceSlug) return alert('يرجى اختيار الخدمة');
    setLoading(true);
    const userId = localStorage.getItem('userId') || '1';
    const res = await fetch('/api/seniors/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }),
    });
    const data = await res.json();
    alert(data.success ? 'تم تقديم الطلب بنجاح' : data.error || 'حدث خطأ');
    if (data.success) router.push('/seniors/my-requests');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/seniors" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى خدمات كبار السن
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">طلب خدمة لكبار السن</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              required
              className="w-full border rounded-lg p-2"
              value={form.serviceSlug}
              onChange={e => setForm({...form, serviceSlug: e.target.value})}
            >
              <option value="">اختر الخدمة</option>
              {serviceOptions.map(opt => (
                <option key={opt.slug} value={opt.slug}>{opt.label}</option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="الاسم الكامل *"
              className="w-full border rounded-lg p-2"
              onChange={e => setForm({...form, citizenName: e.target.value})}
            />
            <input
              type="tel"
              required
              placeholder="رقم الهاتف *"
              className="w-full border rounded-lg p-2"
              onChange={e => setForm({...form, citizenPhone: e.target.value})}
            />
            <input
              type="text"
              placeholder="العنوان (اختياري)"
              className="w-full border rounded-lg p-2"
              onChange={e => setForm({...form, citizenAddress: e.target.value})}
            />
            <textarea
              rows={3}
              placeholder="ملاحظات إضافية"
              className="w-full border rounded-lg p-2"
              onChange={e => setForm({...form, notes: e.target.value})}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}