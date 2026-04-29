'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Request {
  id: number;
  request_number: string;
  service_slug: string;
  citizen_name: string;
  citizen_phone: string;
  citizen_address: string;
  notes: string;
  status: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  'home-care': 'رعاية منزلية',
  'book-appointment': 'كشف طبي',
  'ambulance': 'إسعاف',
  'emergency-aid': 'إعانات طارئة',
  'national-id-home': 'بطاقة رقم قومي',
  'license-renewal': 'تجديد رخصة',
  'home-maintenance': 'صيانة منزلية',
  'medicine-delivery': 'توصيل أدوية',
  'counseling': 'دعم نفسي',
  'social-activities': 'أنشطة اجتماعية',
  'transport-discounts': 'خصومات مواصلات',
  'privilege-cards': 'بطاقات امتياز',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1';
    fetch(`/api/seniors/requests?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRequests(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/seniors" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى خدمات كبار السن
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">طلباتي</h1>
          {loading ? (
            <p className="text-center">جاري التحميل...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد طلبات بعد</p>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{serviceLabels[req.service_slug] || req.service_slug}</p>
                      <p className="text-sm text-gray-600">الاسم: {req.citizen_name}</p>
                      <p className="text-sm text-gray-600">الهاتف: {req.citizen_phone}</p>
                      {req.citizen_address && <p className="text-sm text-gray-600">العنوان: {req.citizen_address}</p>}
                      {req.notes && <p className="text-sm text-gray-500 mt-1">ملاحظات: {req.notes}</p>}
                      <p className="text-xs text-gray-400 mt-2">رقم الطلب: {req.request_number}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100'}`}>
                        {req.status === 'pending' ? 'قيد المراجعة' :
                         req.status === 'in_progress' ? 'قيد التنفيذ' :
                         req.status === 'completed' ? 'مكتمل' :
                         req.status === 'rejected' ? 'مرفوض' : req.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{new Date(req.created_at).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}