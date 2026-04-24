'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_ar: '',
    title_en: '',
    slug: '',
    summary_ar: '',
    summary_en: '',
    content_ar: '',
    content_en: '',
    category: '',
    priority: 0,
    is_featured: false,
    published_at_custom: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/strapi/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم إنشاء الخبر بنجاح');
        router.push('/dashboard');
      } else {
        alert('خطأ: ' + data.error);
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">إضافة خبر جديد</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">العنوان (عربي) *</label>
              <input type="text" required className="w-full border rounded-lg p-2" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">العنوان (إنجليزي)</label>
              <input type="text" className="w-full border rounded-lg p-2" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرابط (slug) *</label>
              <input type="text" required className="w-full border rounded-lg p-2" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <p className="text-xs text-gray-500">مثال: افتتاح-مشروع-جديد</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الملخص (عربي)</label>
              <textarea rows={2} className="w-full border rounded-lg p-2" value={form.summary_ar} onChange={(e) => setForm({ ...form, summary_ar: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المحتوى (عربي) *</label>
              <textarea rows={6} required className="w-full border rounded-lg p-2" value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <input type="text" className="w-full border rounded-lg p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأولوية</label>
                <input type="number" className="w-full border rounded-lg p-2" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              <label htmlFor="is_featured">خبر مميز</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ النشر</label>
              <input type="datetime-local" className="w-full border rounded-lg p-2" value={form.published_at_custom} onChange={(e) => setForm({ ...form, published_at_custom: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              {loading ? 'جاري النشر...' : 'نشر الخبر'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
