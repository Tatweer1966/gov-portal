'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { IdCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyIdPage() {
  const [nationalId, setNationalId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!nationalId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/digital-eg/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ valid: false, message: 'حدث خطأ في الاتصال بالخادم' });
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
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            مصر الرقمية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">التحقق من الرقم القومي</h1>
          <p className="text-muted-foreground">خدمة التحقق من صحة الرقم القومي (تكامل مع بوابة مصر الرقمية)</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <div className="text-center mb-6">
            <IdCard className="w-16 h-16 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">أدخل الرقم القومي للتحقق من صحته وسحب البيانات الأساسية</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الرقم القومي (14 رقم)</label>
              <input
                type="text"
                placeholder="أدخل الرقم القومي هنا"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={14}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {loading ? 'جاري التحقق...' : 'تحقق'}
            </button>

            {result && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                result.valid
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {result.valid ? (
                  <CheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">{result.valid ? 'الرقم القومي صالح' : 'الرقم القومي غير صالح'}</p>
                  {result.name && <p className="text-sm mt-1">الاسم: {result.name}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            هذه الخدمة متكاملة مع بوابة مصر الرقمية للتحقق من صحة البيانات.
          </div>
        </motion.div>
      </div>
    </div>
  );
}