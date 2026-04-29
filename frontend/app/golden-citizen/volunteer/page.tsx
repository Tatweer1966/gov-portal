'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Volunteer {
  id: number;
  full_name: string;
  profession: string;
  specialization: string;
  bio: string;
}

export default function VolunteerListPage() {
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
          <h1 className="text-3xl font-bold">المواطن الذهبي</h1>
          <p className="text-gray-600">منصة التكافل المجتمعي – تطوع وخدمات مجانية</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/golden-citizen/volunteer/register" className="bg-primary text-white px-6 py-2 rounded-lg">
              انضم كمتطوع
            </Link>
            <Link href="/golden-citizen/volunteer/request-service" className="border border-primary text-primary px-6 py-2 rounded-lg">
              اطلب خدمة مجانية
            </Link>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">المتطوعون المتاحون</h2>
        {loading ? (
          <p className="text-center">جاري التحميل...</p>
        ) : volunteers.length === 0 ? (
          <p className="text-center">لا يوجد متطوعون حالياً</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {volunteers.map(v => (
              <div key={v.id} className="bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold">{v.full_name}</h3>
                <p className="text-primary text-sm">{v.profession} - {v.specialization}</p>
                <p className="text-gray-600 text-sm mt-1">{v.bio}</p>
                <Link href={`/golden-citizen/volunteer/request-service?volunteerId=${v.id}`} className="inline-block mt-3 text-primary hover:underline">
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