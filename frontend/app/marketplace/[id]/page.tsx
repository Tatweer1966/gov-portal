'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, User, ArrowLeft, Tag, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!listing) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" /> العودة إلى السوق
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{listing.title_ar}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary border-0">{listing.category_name}</Badge>
              <Badge className="bg-gray-100 text-gray-600 border-0">
                {listing.condition === 'new' ? 'جديد' : listing.condition === 'good' ? 'جيد' : 'مستعمل'}
              </Badge>
              {listing.price_negotiable && <Badge className="bg-accent/20 text-accent-foreground border-0">قابل للتفاوض</Badge>}
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-primary">{listing.price} ج.م</span>
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <h2 className="text-lg font-bold mb-3">الوصف</h2>
              <p className="text-muted-foreground whitespace-pre-line">{listing.description_ar}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> الموقع</h3>
              <p className="text-muted-foreground">{listing.district}, {listing.location || 'الجيزة'}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowContact(!showContact)}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <Phone className="w-5 h-5" /> إظهار بيانات التواصل
              </button>
              {showContact && (
                <div className="mt-5 p-4 bg-gray-50 rounded-xl space-y-2">
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {listing.seller_phone}</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {listing.seller_email}</p>
                  <p className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {listing.seller_name}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}