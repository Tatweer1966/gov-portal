'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    applicantName: '',
    applicantType: 'company',
    nationalId: '',
    registrationNumber: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tenders/${params.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('تم تقديم طلبكم بنجاح. رقم الطلب: ' + data.applicationNumber);
        setTimeout(() => router.push('/tenders'), 3000);
      } else {
        setMessage(data.error || 'حدث خطأ');
      }
    } catch {
      setMessage('فشل الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href={`/tenders/${params.id}`} className="inline-flex items-center gap-1 text-primary mb-6"><ArrowLeft className="w-4 h-4" /> عودة إلى التفاصيل</Link>
      <div className="border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">تقديم طلب للمناقصة</h1>
        {message && <div className={`p-3 rounded mb-4 ${message.includes('نجاح') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block font-medium mb-1">الاسم / اسم الشركة *</label><input type="text" required className="w-full border rounded px-3 py-2" value={form.applicantName} onChange={e => setForm({...form, applicantName: e.target.value})} /></div>
          <div><label className="block font-medium mb-1">نوع المتقدم *</label><select className="w-full border rounded px-3 py-2" value={form.applicantType} onChange={e => setForm({...form, applicantType: e.target.value})}><option value="individual">فرد</option><option value="company">شركة</option></select></div>
          <div><label className="block font-medium mb-1">الرقم القومي (للفرد)</label><input type="text" className="w-full border rounded px-3 py-2" value={form.nationalId} onChange={e => setForm({...form, nationalId: e.target.value})} /></div>
          <div><label className="block font-medium mb-1">السجل التجاري (للشركة)</label><input type="text" className="w-full border rounded px-3 py-2" value={form.registrationNumber} onChange={e => setForm({...form, registrationNumber: e.target.value})} /></div>
          <div><label className="block font-medium mb-1">البريد الإلكتروني *</label><input type="email" required className="w-full border rounded px-3 py-2" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
          <div><label className="block font-medium mb-1">رقم الهاتف *</label><input type="tel" required className="w-full border rounded px-3 py-2" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
          <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 w-full">{submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}</button>
        </form>
      </div>
    </div>
  );
}