'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function ReviewQueuePage() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms/pending-content')
      .then(res => res.json())
      .then(setPending)
      .catch(console.error);
  }, []);

  const handleAction = async (id: number, action: string) => {
    await fetch('/api/cms/pending-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, type: 'page' }),
    });
    setPending(pending.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">قائمة المراجعة – المحتوى المنتظر</h1>
        {pending.length === 0 ? (
          <div className="bg-green-50 p-4 rounded">لا توجد محتويات في قائمة الانتظار</div>
        ) : (
          pending.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-xl font-semibold">{item.title_ar}</h3>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleAction(item.id, 'approve')} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">قبول</button>
                <button onClick={() => handleAction(item.id, 'reject')} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">رفض</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}