'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, FileText, Calendar, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InsuranceInquiryPage() {
  const [inquiryType, setInquiryType] = useState<'nationalId' | 'insuranceNumber'>('nationalId');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('يرجى إدخال الرقم القومي أو رقم التأمين');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const param = inquiryType === 'nationalId' ? `nationalId=${searchValue}` : `insuranceNumber=${searchValue}`;
      const res = await fetch(`/api/health/insurance?${param}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'لا توجد بيانات لهذا الرقم');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 border-0">قيد المراجعة</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-700 border-0">موافق عليه</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-0">مرفوض</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-0">{status}</Badge>;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            التأمين الصحي الشامل
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">الاستعلام عن التأمين الصحي</h1>
          <p className="text-muted-foreground">استعلم عن حالة طلب التأمين الصحي باستخدام الرقم القومي أو رقم التأمين</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          {/* Toggle */}
          <div className="flex gap-4 mb-6 border-b border-border pb-3">
            <button
              onClick={() => setInquiryType('nationalId')}
              className={`pb-2 px-2 font-semibold transition-colors ${inquiryType === 'nationalId' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <User className="w-4 h-4 inline ml-1" /> الرقم القومي
            </button>
            <button
              onClick={() => setInquiryType('insuranceNumber')}
              className={`pb-2 px-2 font-semibold transition-colors ${inquiryType === 'insuranceNumber' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <CreditCard className="w-4 h-4 inline ml-1" /> رقم التأمين
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder={inquiryType === 'nationalId' ? 'أدخل الرقم القومي (14 رقم)' : 'أدخل رقم التأمين'}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="flex-1 border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" /> {loading ? 'جاري...' : 'استعلام'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-gray-50 rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">تفاصيل الطلب</h3>
                {getStatusBadge(result.status)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><strong className="text-gray-600">رقم الطلب:</strong> {result.request_number}</div>
                <div><strong className="text-gray-600">رب الأسرة:</strong> {result.head_of_family_name}</div>
                <div><strong className="text-gray-600">المحافظة:</strong> {result.governorate}</div>
                <div><strong className="text-gray-600">المنطقة:</strong> {result.district}</div>
                <div><strong className="text-gray-600">تاريخ التقديم:</strong> {new Date(result.created_at).toLocaleDateString('ar-EG')}</div>
                {result.insurance_number && (
                  <div><strong className="text-gray-600">رقم التأمين:</strong> {result.insurance_number}</div>
                )}
                {result.card_serial_number && (
                  <div><strong className="text-gray-600">الرقم التسلسلي للبطاقة:</strong> {result.card_serial_number}</div>
                )}
                {result.expiry_date && (
                  <div><strong className="text-gray-600">تاريخ انتهاء البطاقة:</strong> {new Date(result.expiry_date).toLocaleDateString('ar-EG')}</div>
                )}
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            إذا لم تجد بياناتك، يرجى الاتصال على ١٦١٦١ أو زيارة أقرب مكتب تأمين صحي.
          </div>
        </motion.div>
      </div>
    </div>
  );
}