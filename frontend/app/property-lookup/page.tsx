'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Ruler, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PropertyLookupPage() {
  const [nationalId, setNationalId] = useState('');
  const [property, setProperty] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!nationalId) return;
    setLoading(true);
    setError('');
    setProperty(null);
    try {
      const res = await fetch(`/api/property/lookup?nationalId=${nationalId}`);
      const data = await res.json();
      if (data.success) setProperty(data.data);
      else setError(data.error || 'لا توجد بيانات لهذا الرقم');
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            قانون 88 لسنة 2025
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الاستعلام عن الرقم القومي للعقار</h1>
          <p className="text-muted-foreground">أدخل الرقم القومي للعقار للحصول على بياناته الرسمية</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="الرقم القومي للعقار (20 رقم)"
              value={nationalId}
              onChange={e => setNationalId(e.target.value)}
              className="flex-1 border border-border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" /> {loading ? 'جاري...' : 'استعلام'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          {property && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-xl p-5 space-y-2 mt-4"
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">بيانات العقار</span>
              </div>
              <p><strong className="text-gray-700">الرقم الموحد:</strong> {property.unified_id}</p>
              <p><strong className="text-gray-700">العنوان:</strong> {property.address_ar}</p>
              <p><strong className="text-gray-700">المساحة:</strong> {property.area} م²</p>
              <p><strong className="text-gray-700">النوع:</strong> {property.type_ar}</p>
              <p><strong className="text-gray-700">الحالة:</strong> {property.status_ar}</p>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          هذه الخدمة تتيح الاستعلام عن الرقم القومي الموحد للعقار وفقاً للقانون 88 لسنة 2025.
        </div>
      </div>
    </div>
  );
}