'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DomesticViolenceReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    reporterName: '', reporterPhone: '', victimName: '', victimAge: '',
    victimGender: '', incidentLocation: '', violenceType: '', description: '', isUrgent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/domestic-violence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.success ? 'تم استلام البلاغ' : 'حدث خطأ');
    if (data.success) router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-700 mb-2">الإبلاغ عن حالة عنف أسري</h1>
          <p className="text-gray-600 mb-6">يمكنك الإبلاغ بشكل سري، وسيتم التعامل مع البلاغ بسرية تامة.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="اسم المبلغ (اختياري)" onChange={e => setFormData({...formData, reporterName: e.target.value})} className="border rounded-lg p-2" />
              <input type="tel" placeholder="رقم هاتف المبلغ (اختياري)" onChange={e => setFormData({...formData, reporterPhone: e.target.value})} className="border rounded-lg p-2" />
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">بيانات الضحية (إن وجدت)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="اسم الضحية" onChange={e => setFormData({...formData, victimName: e.target.value})} className="border rounded-lg p-2" />
                <input type="number" placeholder="العمر" onChange={e => setFormData({...formData, victimAge: e.target.value})} className="border rounded-lg p-2" />
                <select onChange={e => setFormData({...formData, victimGender: e.target.value})} className="border rounded-lg p-2">
                  <option value="">الجنس</option><option>ذكر</option><option>أنثى</option>
                </select>
              </div>
            </div>
            <input type="text" placeholder="مكان الحادث *" required onChange={e => setFormData({...formData, incidentLocation: e.target.value})} className="w-full border rounded-lg p-2" />
            <select required onChange={e => setFormData({...formData, violenceType: e.target.value})} className="w-full border rounded-lg p-2">
              <option value="">نوع العنف</option><option>جسدي</option><option>نفسي</option><option>جنسي</option><option>اقتصادي</option>
            </select>
            <textarea rows={4} placeholder="تفاصيل الحالة *" required onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2" />
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={e => setFormData({...formData, isUrgent: e.target.checked})} /> هذه حالة طارئة
            </label>
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 rounded-lg">{loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}