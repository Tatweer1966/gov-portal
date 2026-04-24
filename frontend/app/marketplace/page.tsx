'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Listing {
  id: number;
  title_ar: string;
  description_ar: string;
  price: number;
  district: string;
  category_name: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setListings(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ø³ÙˆÙ‚ Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø©</h1>
          <Link href="/marketplace/create" className="bg-primary text-white px-4 py-2 rounded-lg">+ Ø£Ø¶Ù Ø¥Ø¹Ù„Ø§Ù†Ùƒ</Link>
        </div>
        {listings.length === 0 ? (
          <div className="text-center text-gray-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¥Ø¹Ù„Ø§Ù†Ø§Øª Ø­Ø§Ù„ÙŠØ§Ù‹</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(item => (
              <Link key={item.id} href={`/marketplace/${item.id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
                <h2 className="text-xl font-semibold">{item.title_ar}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description_ar}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-primary font-bold">{item.price} Ø¬.Ù…</span>
                  <span className="text-gray-400 text-sm">{item.district}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
