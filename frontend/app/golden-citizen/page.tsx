'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Volunteer {
  id: number;
  full_name: string;
  profession: string;
  specialization: string;
  bio: string;
}

export default function GoldenCitizenPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/golden-citizen/volunteers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVolunteers(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
            <span className="text-3xl">🌟</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">المواطن الذهبي</h1>
          <p className="text-gray-600">منصة التكافل المجتمعي – تطوع وخدمات مجانية</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/golden-citizen/volunteer-register" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
              انضم كمتطوع
            </Link>
            <Link href="/golden-citizen/request-service" className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10">
              اطلب خدمة مجانية
            </Link>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">المتطوعون المتاحون</h2>
        {loading ? (
          <div className="text-center text-gray-500">جاري التحميل...</div>
        ) : volunteers.length === 0 ? (
          <div className="text-center text-gray-500">لا يوجد متطوعون حالياً</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {volunteers.map(v => (
              <div key={v.id} className="bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold">{v.full_name}</h3>
                <p className="text-primary text-sm">{v.profession} - {v.specialization}</p>
                <p className="text-gray-600 text-sm mt-1">{v.bio}</p>
                <Link href={`/golden-citizen/request-service?volunteerId=${v.id}`} className="inline-block mt-3 text-primary hover:underline">
                  طلب خدمة ←
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}