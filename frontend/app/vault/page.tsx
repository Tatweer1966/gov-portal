'use client';

import { useEffect, useState } from 'react';

interface Document {
  id: number;
  title_ar: string;
  file_path: string;
  created_at: string;
  document_number?: string;
}

export default function VaultPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get userId from localStorage (or session)
    const storedUserId = localStorage.getItem('userId') || '1';
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/vault/documents?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDocs(data.data);
          else console.error(data.error);
        })
        .catch(console.error);
    }
  }, [userId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploadTitle) {
      alert('يرجى إدخال عنوان واختيار ملف');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId || '1');
    formData.append('title', uploadTitle);
    try {
      const res = await fetch('/api/vault/documents', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        alert('تم رفع المستند بنجاح');
        setShowUpload(false);
        setUploadTitle('');
        setFile(null);
        // Refresh list
        const refreshRes = await fetch(`/api/vault/documents?userId=${userId}`);
        const refreshData = await refreshRes.json();
        if (refreshData.success) setDocs(refreshData.data);
      } else {
        alert(data.error || 'فشل في رفع المستند');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ في الاتصال');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <span className="text-3xl">📁</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">خزينة المستندات الرقمية</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            {showUpload ? 'إلغاء' : '+ رفع مستند'}
          </button>
        </div>

        {showUpload && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">عنوان المستند</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="مثال: بطاقة الرقم القومي"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">الملف (PDF/صورة)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png,.jpeg"
                  required
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg w-full">
                رفع المستند
              </button>
            </form>
          </div>
        )}

        {docs.length === 0 && !showUpload && (
          <div className="text-center text-gray-500 mt-8">
            لا توجد مستندات مرفوعة. استخدم الزر أعلاه لرفع مستند.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-4 transition hover:shadow-lg">
              <h3 className="font-semibold text-lg">{doc.title_ar}</h3>
              <p className="text-sm text-gray-500 mt-1">
                تاريخ الرفع: {new Date(doc.created_at).toLocaleDateString('ar-EG')}
              </p>
              <a
                href={doc.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-primary text-sm hover:underline"
              >
                عرض المستند 📄
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}