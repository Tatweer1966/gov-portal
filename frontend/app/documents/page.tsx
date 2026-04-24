'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';

interface Document {
  id: number;
  title_ar: string;
  category: string;
  file_url: string;
  publish_date: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDocs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Ù…Ø±ÙƒØ² Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§Øª</h1>
        <div className="grid gap-4">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{doc.title_ar}</h2>
                <p className="text-sm text-gray-500">{doc.category} â€“ {new Date(doc.publish_date).toLocaleDateString('ar-EG')}</p>
              </div>
              <a href={doc.file_url} download className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">ØªØ­Ù…ÙŠÙ„</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
