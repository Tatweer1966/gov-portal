'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, IdCard, Phone, Mail, MapPin, Heart, AlertCircle, CheckCircle2, Upload, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SpecialNeedsEnrollPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childName: '',
    childNationalId: '',
    childBirthDate: '',
    disabilityType: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    previousSchool: '',
    medicalReport: '',
    notes: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Mock submission – replace with actual API call when ready
      // For now, simulate success
      setTimeout(() => {
        setTrackingNumber(`SP-${Date.now()}`);
        setSubmitted(true);
        setLoading(false);
      }, 1000);
      // Uncomment when API is ready:
      /*
      const submitData = new FormData();
      submitData.append('data', JSON.stringify({ ...formData, userId: localStorage.getItem('userId') || '1' }));
      if (files) {
        for (let i = 0; i < files.length; i++) {
          submitData.append('documents', files[i]);
        }
      }
      const res = await fetch('/api/special-needs/enroll', {
        method: 'POST',
        body: submitData,
      });
      const data = await res.json();
      if (data.success) {
        setTrackingNumber(data.trackingNumber);
        setSubmitted(true);
      } else {
        setError(data.error || 'فشل في إرسال الطلب');
      }
      */
    } catch (err) {
      setError('حدث خطأ في الاتصال');
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
          <h2 className="text-2xl font-bold mb-2">تم استلام طلب الالتحاق</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{trackingNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم التواصل معكم لتأكيد القبول والإجراءات.</p>
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

  const disabilityTypes = [
    'إعاقة بصرية',
    'إعاقة سمعية',
    'إعاقة حركية',
    'إعاقة ذهنية',
    'صعوبات تعلم',
    'اضطراب طيف التوحد',
    'إعاقة متعددة',
    'أخرى',
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            التربية الخاصة
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">طلب التحاق لطفل من ذوي الاحتياجات الخاصة</h1>
          <p className="text-muted-foreground">سجل طلب التحاق لطفلك في أحد مدارس التربية الخاصة بمحافظة الجيزة</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> بيانات الطفل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل للطفل *</label>
                  <input
                    type="text"
                    required
                    value={formData.childName}
                    onChange={e => setFormData({ ...formData, childName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={formData.childNationalId}
                    onChange={e => setFormData({ ...formData, childNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الميلاد *</label>
                  <input
                    type="date"
                    required
                    value={formData.childBirthDate}
                    onChange={e => setFormData({ ...formData, childBirthDate: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">نوع الإعاقة *</label>
                  <select
                    required
                    value={formData.disabilityType}
                    onChange={e => setFormData({ ...formData, disabilityType: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="">اختر نوع الإعاقة</option>
                    {disabilityTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> بيانات ولي الأمر
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم ولي الأمر *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">العنوان بالتفصيل *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-primary" /> معلومات إضافية
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">المدرسة السابقة (إن وجدت)</label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">التقارير الطبية (PDF، صور)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.png"
                      onChange={e => setFiles(e.target.files)}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-2">يمكنك رفع التقارير الطبية والتشخيصية</p>
                    {files && files.length > 0 && (
                      <ul className="mt-2 text-sm text-left">{Array.from(files).map((f, i) => <li key={i}>📄 {f.name}</li>)}</ul>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ملاحظات إضافية</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                    placeholder="أي معلومات إضافية عن احتياجات الطفل"
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
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب الالتحاق'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}