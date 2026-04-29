'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  title_ar: string;
  description_ar: string;
  start_date: string;
  location_ar: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvents(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الفعاليات القادمة</h1>
          <Link
            href="/events/my-registrations"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            تسجيلاتي
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد فعاليات حالياً</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Link key={event.id} href={`/events/${event.id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
                <h2 className="text-xl font-semibold text-primary">{event.title_ar}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{event.description_ar}</p>
                <div className="mt-3 text-sm text-gray-500">📅 {new Date(event.start_date).toLocaleDateString('ar-EG')}</div>
                <div className="text-sm text-gray-500">📍 {event.location_ar}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}