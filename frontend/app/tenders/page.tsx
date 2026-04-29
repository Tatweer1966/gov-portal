'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, FileText, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tender {
  id: number;
  tender_number: string;
  title_ar: string;
  description_ar: string;
  category: string;
  type: string;
  status: string;
  submission_deadline: string;
  opening_date: string;
  budget_ar: string;
  is_featured: boolean;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/tenders?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setTenders(data.data);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="container mx-auto py-12 text-center">جاري التحميل...</div>;

  return (
    <div dir="rtl" className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">المزايدات والمناقصات</h1>
      <div className="grid gap-6">
        {tenders.map(tender => (
          <Link key={tender.id} href={`/tenders/${tender.id}`} className="block border rounded-lg p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-primary">{tender.title_ar}</h2>
                <p className="text-gray-600 mt-1">{tender.description_ar?.slice(0, 120)}...</p>
              </div>
              {tender.is_featured && <Badge className="bg-yellow-100 text-yellow-800">مميز</Badge>}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(tender.submission_deadline).toLocaleDateString('ar-EG')}</span>
              <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {tender.category}</span>
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {tender.type === 'public' ? 'عامة' : 'خاصة'}</span>
              {tender.budget_ar && <span className="flex items-center gap-1">الميزانية: {tender.budget_ar}</span>}
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-primary text-white' : 'bg-gray-200'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}