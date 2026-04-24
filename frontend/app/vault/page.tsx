'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

interface Document {
  id: number;
  title_ar: string;
  file_path: string;
  created_at: string;
}

export default function VaultPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ categoryId: '1', title: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState('1');

  useEffect(() => {
    // Run only on client
    setUserId(localStorage.getItem('userId') || '1');
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/vault/documents?userId=${userId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setDocs(data.data); });
    }
  }, [userId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('categoryId', uploadForm.categoryId);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    const res = await fetch('/api/vault/documents', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      alert('تم رفع المستند');
      setShowUpload(false);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><span className="text-3xl">📁</span></div>
          <h1 className="text-3xl font-bold mb-2">خزينة المستندات الرقمية</h1>
          <button onClick={() => setShowUpload(!showUpload)} className="bg-primary text-white px-6 py-2 rounded-lg">+ رفع مستند</button>
        </div>
        {showUpload && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleUpload} className="space-y-4">
              <div><label>نوع المستند</label><select onChange={e => setUploadForm({...uploadForm, categoryId: e.target.value})} className="w-full border rounded-lg p-2"><option value="1">بطاقة الرقم القومي</option><option value="2">شهادة ميلاد</option><option value="3">عقد ملكية</option></select></div>
              <div><label>عنوان المستند</label><input type="text" required onChange={e => setUploadForm({...uploadForm, title: e.target.value})} className="w-full border rounded-lg p-2" /></div>
              <div><label>الملف (PDF/صورة)</label><input type="file" accept=".pdf,.jpg,.png" required onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" /></div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">رفع</button>
            </form>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold">{doc.title_ar}</h3>
              <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">عرض المستند</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}