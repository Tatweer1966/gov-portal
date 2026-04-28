'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface QA {
  id: number;
  question_text: string;
  answer_text?: string;
  answered_by_title?: string;
  answer_date?: string;
}

export default function GovernorQAPage() {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/governor-qa/questions')
      .then(res => res.json())
      .then(data => {
        if (data.success) setQaList(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><span className="text-3xl">❓</span></div>
          <h1 className="text-3xl font-bold mb-2">انت تسأل والمحافظ يجيب</h1>
          <Link href="/governor-qa/ask" className="inline-block bg-primary text-white px-6 py-2 rounded-lg">اطرح سؤالاً</Link>
        </div>
        {qaList.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد أسئلة منشورة</div>
        ) : (
          <div className="space-y-6">
            {qaList.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-5 border-r-4 border-primary">
                <p className="text-gray-800 font-medium">{item.question_text}</p>
                {item.answer_text && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg border-r-4 border-green-500">
                    <p className="text-green-700 font-semibold">إجابة المحافظ:</p>
                    <p>{item.answer_text}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.answered_by_title} -- {item.answer_date ? new Date(item.answer_date).toLocaleDateString('ar-EG') : ''}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}