'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceDetail {
  id: number;
  name_ar: string;
  description_ar: string;
  required_documents: string[];
  fees_ar: string;
  processing_time_ar: string;
  service_type: string;
  department_name_ar: string;
  department_phone: string;
  department_email: string;
  location_address_ar: string;
  application_steps_ar: string[];
  eligibility_criteria_ar: string;
  legal_basis_ar: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setService(data.data);
        else router.push('/services');
        setLoading(false);
      })
      .catch(() => router.push('/services'));
  }, [params.slug, router]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/services" className="hover:text-primary">الخدمات</Link> / {service.name_ar}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{service.name_ar}</h1>
          <p className="text-gray-700 mb-6">{service.description_ar}</p>
          {service.legal_basis_ar && (
            <div className="bg-amber-50 p-3 rounded mb-4 text-sm text-amber-800">📖 القانون المنظم: {service.legal_basis_ar}</div>
          )}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">المستندات المطلوبة</h2>
              <ul className="list-disc list-inside space-y-1">
                {service.required_documents?.map((doc, i) => <li key={i}>{doc}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">معلومات الخدمة</h2>
              <p><strong>الرسوم:</strong> {service.fees_ar}</p>
              <p><strong>مدة المعالجة:</strong> {service.processing_time_ar}</p>
              <p><strong>نوع الخدمة:</strong> {service.service_type === 'online' ? 'إلكتروني' : service.service_type === 'hybrid' ? 'مختلط' : 'حضوري'}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">خطوات التقديم</h2>
            <ol className="list-decimal list-inside space-y-1">
              {service.application_steps_ar?.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">شروط الأهلية</h2>
            <p>{service.eligibility_criteria_ar}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold">الجهة المسؤولة</h3>
            <p>{service.department_name_ar}</p>
            <p>📞 {service.department_phone}</p>
            <p>✉️ {service.department_email}</p>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90">
            تقديم طلب الخدمة
          </button>
        </div>
      </div>
    </div>
  );
}