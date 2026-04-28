'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AskQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: 'citizen',
    userName: '',
    userPhone: '',
    userEmail: '',
    questionText: '',
    category: 'عامة',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText.trim()) {
      alert('يرجى كتابة السؤال');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/governor-qa/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.success ? 'تم إرسال سؤالك بنجاح' : 'حدث خطأ');
    if (data.success) router.push('/governor-qa');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">اطرح سؤالك للمحافظ</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">نوع المستخدم</label>
              <select
                value={formData.userType}
                onChange={e => setFormData({ ...formData, userType: e.target.value })}
                className="w-full border rounded-lg p-2"
              >
                <option value="citizen">مواطن</option>
                <option value="investor">مستثمر</option>
                <option value="visitor">زائر</option>
                <option value="tourist">سائح</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الاسم (اختياري)</label>
              <input
                type="text"
                value={formData.userName}
                onChange={e => setFormData({ ...formData, userName: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف (اختياري)</label>
              <input
                type="tel"
                value={formData.userPhone}
                onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={e => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السؤال *</label>
              <textarea
                rows={5}
                required
                value={formData.questionText}
                onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="اكتب سؤالك هنا..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">التصنيف</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-lg p-2"
              >
                <option>عامة</option>
                <option>خدمات</option>
                <option>استثمار</option>
                <option>تعليم</option>
                <option>صحة</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              نشر بشكل مجهول
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال السؤال'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}