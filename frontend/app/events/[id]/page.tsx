'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, CreditCard } from 'lucide-react';

interface Event {
  id: number;
  title_ar: string;
  description_ar: string;
  start_date: string;
  end_date: string;
  location_ar: string;
  price: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
    ticketCount: 1,
    paymentMethod: 'card',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvent(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setMessage('');
    const res = await fetch(`/api/events/${event.id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`تم التسجيل بنجاح! رقم الطلب: ${data.registrationNumber} - المبلغ: ${data.totalPrice} جنيه`);
      setTimeout(() => router.push('/events'), 3000);
    } else {
      setMessage(data.error || 'حدث خطأ في التسجيل');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;
  if (!event) return <div className="text-center py-12">الفعالية غير موجودة</div>;

  const totalPrice = (event.price || 0) * form.ticketCount;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/events" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى الفعاليات
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{event.title_ar}</h1>
          <p className="text-gray-600 mb-4">{event.description_ar}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.start_date).toLocaleDateString('ar-EG')}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location_ar}</span>
            <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> السعر: {event.price || 0} جنيه</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">تسجيل حضور</h2>
          {message && <div className="mb-4 p-2 rounded bg-blue-50 text-blue-700">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="الاسم الكامل *"
              className="w-full border rounded-lg p-2"
              value={form.citizenName}
              onChange={e => setForm({...form, citizenName: e.target.value})}
            />
            <input
              type="tel"
              required
              placeholder="رقم الهاتف *"
              className="w-full border rounded-lg p-2"
              value={form.citizenPhone}
              onChange={e => setForm({...form, citizenPhone: e.target.value})}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full border rounded-lg p-2"
              value={form.citizenEmail}
              onChange={e => setForm({...form, citizenEmail: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">عدد التذاكر</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full border rounded-lg p-2"
                  value={form.ticketCount}
                  onChange={e => setForm({...form, ticketCount: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">طريقة الدفع</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={form.paymentMethod}
                  onChange={e => setForm({...form, paymentMethod: e.target.value})}
                >
                  <option value="card">بطاقة ائتمان (محاكاة)</option>
                  <option value="instapay">InstaPay</option>
                  <option value="cash">كاش عند الباب</option>
                </select>
              </div>
            </div>
            <div className="text-lg font-semibold">الإجمالي: {totalPrice} جنيه</div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              {submitting ? 'جاري المعالجة...' : 'تأكيد الحجز والدفع'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4">* الدفع يتم بشكل محاكاة – لا توجد عملية مالية حقيقية.</p>
        </div>
      </div>
    </div>
  );
}