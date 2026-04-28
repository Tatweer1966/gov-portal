'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  Heart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FamilyCounselingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    requestType: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requestType || !formData.description) {
      setError('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/family-counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: localStorage.getItem('userId') || '1',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingNumber(data.requestNumber);
        setSubmitted(true);
      } else {
        setError(data.error || 'فشل في إرسال الطلب');
      }
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">تم استلام طلب الاستشارة</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{trackingNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم التواصل معكم لتأكيد الموعد.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            متابعة الطلب
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            دعم اجتماعي
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الاستشارات الأسرية</h1>
          <p className="text-muted-foreground">احصل على استشارات نفسية وأسرية مجانية من متخصصين</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">نوع الاستشارة *</label>
              <select
                required
                value={formData.requestType}
                onChange={e => setFormData({ ...formData, requestType: e.target.value })}
                className="w-full border border-border rounded-lg p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">اختر نوع الاستشارة</option>
                <option value="parenting">استشارات تربوية</option>
                <option value="marital">استشارات زوجية</option>
                <option value="child_behavior">مشاكل سلوكية للأطفال</option>
                <option value="adolescent">مشاكل المراهقة</option>
                <option value="elderly">رعاية كبار السن</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">وصف المشكلة *</label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="يرجى وصف المشكلة التي ترغب في مناقشتها مع المستشار"
                className="w-full border border-border rounded-lg p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">التاريخ المفضل</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pr-10 pl-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوقت المفضل</label>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? 'جاري الإرسال...' : <><Send className="w-5 h-5" /> إرسال الطلب</>}
            </button>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          جميع الاستشارات تتم بسرية تامة. سيتم التواصل معكم خلال 24 ساعة لتأكيد الموعد.
        </div>
      </div>
    </div>
  );
}