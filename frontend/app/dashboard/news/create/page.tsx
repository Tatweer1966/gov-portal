'use client';

export const dynamic = 'force-dynamic';



import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    published_at: '',
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/directus/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) return data.fileId;
    alert('ÙØ´Ù„ Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±Ø©: ' + (data.error || ''));
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    try {
      let featuredId = null;
      if (featuredImage) {
        featuredId = await uploadFile(featuredImage);
        if (!featuredId) return;
      }

      const galleryIds: string[] = [];
      for (const img of galleryImages) {
        const id = await uploadFile(img);
        if (id) galleryIds.push(id);
        else return;
      }

      const payload = {
        ...form,
        featured_image: featuredId,
        gallery_images: galleryIds,
      };

      const res = await fetch('/api/directus/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert('ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø®Ø¨Ø± Ø¨Ù†Ø¬Ø§Ø­');
        router.push('/dashboard');
      } else {
        alert('Ø®Ø·Ø£: ' + (data.error || 'ÙØ´Ù„ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø®Ø¨Ø±'));
      }
    } catch (err) {
      alert('Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">Ø¥Ù†Ø´Ø§Ø¡ Ø®Ø¨Ø± Ø¬Ø¯ÙŠØ¯</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ø¹Ù†ÙˆØ§Ù† (Ø¹Ø±Ø¨ÙŠ) *</label>
          <input type="text" required className="w-full border p-2 rounded" value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ø¹Ù†ÙˆØ§Ù† (Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ)</label>
          <input type="text" className="w-full border p-2 rounded" value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ø±Ø§Ø¨Ø· (slug) *</label>
          <input type="text" required className="w-full border p-2 rounded" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          <p className="text-xs text-gray-500">Ù…Ø«Ø§Ù„: Ø§ÙØªØªØ§Ø­-Ù…Ø´Ø±ÙˆØ¹-Ø¬Ø¯ÙŠØ¯</p>
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ù…Ù„Ø®Øµ (Ø¹Ø±Ø¨ÙŠ)</label>
          <textarea rows={2} className="w-full border p-2 rounded" value={form.summary_ar} onChange={e => setForm({ ...form, summary_ar: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ù…Ù„Ø®Øµ (Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ)</label>
          <textarea rows={2} className="w-full border p-2 rounded" value={form.summary_en} onChange={e => setForm({ ...form, summary_en: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ù…Ø­ØªÙˆÙ‰ (Ø¹Ø±Ø¨ÙŠ) *</label>
          <textarea rows={6} required className="w-full border p-2 rounded" value={form.content_ar} onChange={e => setForm({ ...form, content_ar: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„Ù…Ø­ØªÙˆÙ‰ (Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ)</label>
          <textarea rows={6} className="w-full border p-2 rounded" value={form.content_en} onChange={e => setForm({ ...form, content_en: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Ø§Ù„ØªØµÙ†ÙŠÙ</label>
            <input type="text" className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ø§Ù„Ø£ÙˆÙ„ÙˆÙŠØ©</label>
            <input type="number" className="w-full border p-2 rounded" value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
            Ø®Ø¨Ø± Ù…Ù…ÙŠØ²
          </label>
        </div>
        <div>
          <label className="block mb-1 font-medium">ØªØ§Ø±ÙŠØ® Ø§Ù„Ù†Ø´Ø±</label>
          <input type="datetime-local" className="w-full border p-2 rounded" value={form.published_at} onChange={e => setForm({ ...form, published_at: e.target.value })} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</label>
          <input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ù…Ø¹Ø±Ø¶ Ø§Ù„ØµÙˆØ±</label>
          <input type="file" multiple accept="image/*" onChange={e => setGalleryImages(Array.from(e.target.files || []))} />
        </div>
        <button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
          {loading || uploading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„...' : 'Ù†Ø´Ø± Ø§Ù„Ø®Ø¨Ø±'}
        </button>
      </form>
    </div>
  );
}
