'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ListingDetail {
  id: number;
  title_ar: string;
  description_ar: string;
  price: number;
  price_negotiable: boolean;
  condition: string;
  location: string;
  district: string;
  seller_name: string;
  seller_phone: string;
  seller_email: string;
  category_name: string;
}

export default function MarketplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/marketplace/listings/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setListing(data.data);
        else router.push('/marketplace');
        setLoading(false);
      })
      .catch(() => router.push('/marketplace'));
  }, [params.id, router]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-2">{listing.title_ar}</h1>
          <p className="text-gray-500 text-sm mb-4">{listing.category_name} - {listing.district}</p>
          <div className="text-2xl text-primary font-bold mb-4">{listing.price} ج.م {listing.price_negotiable && <span className="text-sm text-gray-500">(قابل للتفاوض)</span>}</div>
          <p className="text-gray-700 whitespace-pre-line mb-4">{listing.description_ar}</p>
          <p className="text-gray-600">الحالة: {listing.condition === 'new' ? 'جديد' : listing.condition === 'good' ? 'جيد' : 'مستعمل'}</p>
          <div className="mt-6 pt-4 border-t">
            <button onClick={() => setShowContact(!showContact)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
              📞 إظهار رقم التواصل
            </button>
            {showContact && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p>📞 {listing.seller_phone}</p>
                <p>✉️ {listing.seller_email}</p>
                <p>👤 {listing.seller_name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}