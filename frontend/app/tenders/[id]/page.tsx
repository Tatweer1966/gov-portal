'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, FileText, Building2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TenderDetail() {
  const params = useParams();
  const router = useRouter();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tenders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTender(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto py-12 text-center">جاري التحميل...</div>;
  if (!tender) return <div className="container mx-auto py-12 text-center">المناقصة غير موجودة</div>;

  return (
    <div dir="rtl" className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/tenders" className="inline-flex items-center gap-1 text-primary mb-6"><ArrowLeft className="w-4 h-4" /> عودة إلى القائمة</Link>
      <div className="border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{tender.title_ar}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge>{tender.category}</Badge>
          <Badge variant="outline">{tender.type === 'public' ? 'عامة' : 'خاصة'}</Badge>
          {tender.is_featured && <Badge className="bg-yellow-100">مميز</Badge>}
        </div>
        <p className="text-gray-700 mb-6">{tender.description_ar}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold">رقم المناقصة:</span> {tender.tender_number}</div>
          <div><span className="font-semibold">آخر موعد للتقديم:</span> {new Date(tender.submission_deadline).toLocaleDateString('ar-EG')}</div>
          {tender.opening_date && <div><span className="font-semibold">موعد فتح المظاريف:</span> {new Date(tender.opening_date).toLocaleDateString('ar-EG')}</div>}
          {tender.budget_ar && <div><span className="font-semibold">الميزانية التقريبية:</span> {tender.budget_ar}</div>}
          {tender.documents_url && <div><span className="font-semibold">وثائق المناقصة:</span> <a href={tender.documents_url} target="_blank" className="text-primary underline">تحميل</a></div>}
        </div>
        <div className="mt-8">
          <Link href={`/tenders/${tender.id}/apply`} className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">تقديم طلب</Link>
        </div>
      </div>
    </div>
  );
}