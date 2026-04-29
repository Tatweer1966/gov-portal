'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Registration {
  id: number;
  registration_number: string;
  event_id: number;
  event_title: string;
  citizen_name: string;
  citizen_phone: string;
  ticket_count: number;
  total_price: number;
  payment_status: string;
  registration_date: string;
}

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1'; // placeholder – replace with real user ID
    fetch(`/api/events/my-registrations?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRegistrations(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/events" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى الفعاليات
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">تسجيلاتي في الفعاليات</h1>
          {registrations.length === 0 ? (
            <p className="text-gray-500">لا توجد تسجيلات بعد</p>
          ) : (
            <div className="space-y-4">
              {registrations.map(reg => (
                <div key={reg.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{reg.event_title}</h3>
                      <p className="text-sm text-gray-600">الاسم: {reg.citizen_name}</p>
                      <p className="text-sm text-gray-600">الهاتف: {reg.citizen_phone}</p>
                      <p className="text-sm">عدد التذاكر: {reg.ticket_count} | الإجمالي: {reg.total_price} جنيه</p>
                      <p className="text-xs text-gray-400 mt-1">رقم التسجيل: {reg.registration_number}</p>
                    </div>
                    <div>
                      {reg.payment_status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> مدفوع</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> غير مدفوع</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">تاريخ التسجيل: {new Date(reg.registration_date).toLocaleDateString('ar-EG')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}