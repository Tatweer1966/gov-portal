'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programType = searchParams.get('type') || 'child_protection';
  const [formData, setFormData] = useState({
    fullName: '', nationalId: '', phone: '', email: '', governorate: 'الجيزة',
    district: '', description: '', urgencyLevel: 'normal'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/social-assistance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programType, ...formData, userId: localStorage.getItem('userId') || '1' }),
    });
    const data = await res.json();
    alert(data.success ? 'تم استلام طلب المساعدة' : 'حدث خطأ');
    if (data.success) router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">تقديم طلب مساعدة اجتماعية</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="الاسم الكامل *" required onChange={e => setFormData({...formData, fullName: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="الرقم القومي *" required onChange={e => setFormData({...formData, nationalId: e.target.value})} className="border rounded-lg p-2" />
              <input type="tel" placeholder="رقم الهاتف *" required onChange={e => setFormData({...formData, phone: e.target.value})} className="border rounded-lg p-2" />
              <input type="email" placeholder="البريد الإلكتروني" onChange={e => setFormData({...formData, email: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="المنطقة" onChange={e => setFormData({...formData, district: e.target.value})} className="border rounded-lg p-2" />
              <select onChange={e => setFormData({...formData, urgencyLevel: e.target.value})} className="border rounded-lg p-2">
                <option value="normal">عادي</option>
                <option value="high">عالي</option>
                <option value="emergency">طارئ</option>
              </select>
            </div>
            <textarea rows={4} placeholder="تفاصيل الطلب *" required onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2" />
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg">{loading ? 'جاري الإرسال...' : 'إرسال الطلب'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">جاري التحميل...</div>}>
      <RequestForm />
    </Suspense>
  );
}