'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Listing {
  id: number;
  title_ar: string;
  description_ar: string;
  price: number;
  district: string;
  category_name: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge className="bg-accent/20 text-accent-foreground border-0 mb-2">سوق المحافظة</Badge>
            <h1 className="text-3xl md:text-4xl font-black text-foreground">سوق المحافظة</h1>
            <p className="text-muted-foreground mt-1">بيع واشتري – إعلانات مبوبة مجانية لأبناء المحافظة</p>
          </div>
          <Link
            href="/marketplace/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
          >
            <Plus className="w-5 h-5" /> أضف إعلانك
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">لا توجد إعلانات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item, idx) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all h-full"
              >
                <Link href={`/marketplace/${item.id}`} className="block p-5 h-full">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.title_ar}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description_ar}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold text-lg">{item.price} ج.م</span>
                    <span className="text-muted-foreground text-sm">{item.district}</span>
                  </div>
                  <Badge className="mt-3 bg-gray-100 text-gray-600 border-0 text-xs">{item.category_name}</Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}