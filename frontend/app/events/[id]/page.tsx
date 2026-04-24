'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventDetail {
  id: number;
  title_ar: string;
  description_ar: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location_ar: string;
  address_ar: string;
  organizer_ar: string;
  contact_phone: string;
  contact_email: string;
  is_free: boolean;
  fee_ar: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvent(data.data);
        else router.push('/events');
        setLoading(false);
      })
      .catch(() => router.push('/events'));
  }, [params.id, router]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{event.title_ar}</h1>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div><span className="font-semibold">📅 التاريخ:</span> {new Date(event.start_date).toLocaleDateString('ar-EG')}{event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('ar-EG')}`}</div>
            <div><span className="font-semibold">⏰ الوقت:</span> {event.start_time}{event.end_time && ` - ${event.end_time}`}</div>
            <div><span className="font-semibold">📍 الموقع:</span> {event.location_ar}</div>
            <div><span className="font-semibold">🏢 العنوان:</span> {event.address_ar}</div>
            <div><span className="font-semibold">👤 المنظم:</span> {event.organizer_ar}</div>
            <div><span className="font-semibold">💰 الرسوم:</span> {event.is_free ? 'مجاني' : event.fee_ar}</div>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{event.description_ar}</p>
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div><span className="font-semibold">📞 للاستفسار:</span> {event.contact_phone} | ✉️ {event.contact_email}</div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">تسجيل حضور</button>
          </div>
        </div>
      </div>
    </div>
  );
}