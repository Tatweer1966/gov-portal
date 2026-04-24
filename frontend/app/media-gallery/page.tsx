'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';

interface MediaItem {
  id: number;
  title_ar: string;
  url: string;
  type: string;
  category: string;
}

export default function MediaGalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/media?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMedia(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Ù…Ø¹Ø±Ø¶ Ø§Ù„ÙˆØ³Ø§Ø¦Ø·</h1>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-full ${category === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Ø§Ù„ÙƒÙ„</button>
          <button onClick={() => setCategory('infographic')} className={`px-4 py-2 rounded-full ${category === 'infographic' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Ø¥Ù†ÙÙˆØ¬Ø±Ø§ÙÙŠÙƒ</button>
          <button onClick={() => setCategory('video')} className={`px-4 py-2 rounded-full ${category === 'video' ? 'bg-primary text-white' : 'bg-gray-200'}`}>ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª</button>
        </div>
        {loading ? (
          <div className="text-center">Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>
        ) : media.length === 0 ? (
          <div className="text-center text-gray-500">Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ³Ø§Ø¦Ø·</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {media.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {item.type === 'image' ? <img src={item.url} alt={item.title_ar} className="w-full h-full object-cover" /> : <span className="text-4xl">ðŸ“·</span>}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold">{item.title_ar}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
