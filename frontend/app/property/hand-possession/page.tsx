'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  IdCard,
  Phone,
  Mail,
  MapPin,
  Building2,
  Ruler,
  Calendar,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Home,
  Landmark,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HandPossessionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantNationalId: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: '',
    propertyType: 'land',
    propertyAddress: '',
    governorate: 'الجيزة',
    district: '',
    landArea: '',
    possessionYears: '',
    possessionDescription: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('data', JSON.stringify({ ...formData, userId: localStorage.getItem('userId') || '1' }));
      if (files) {
        for (let i = 0; i < files.length; i++) {
          submitData.append('documents', files[i]);
        }
      }
      const res = await fetch('/api/property/possession', {
        method: 'POST',
        body: submitData,
      });
      const data = await res.json();
      if (data.success) {
        setRequestNumber(data.requestNumber);
        setSubmitted(true);
      } else {
        alert('فشل في إرسال الطلب: ' + (data.error || ''));
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">تم استلام طلب التقنين</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{requestNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم دراسة الطلب من قبل اللجنة المختصة والتواصل معكم.</p>
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
            قانون 88/2025
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">تقنين وضع اليد</h1>
          <p className="text-muted-foreground">تقديم طلب لتقنين وضع اليد على العقارات وفقاً للقانون رقم 88 لسنة 2025</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Applicant Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> بيانات مقدم الطلب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicantNationalId}
                    onChange={e => setFormData({ ...formData, applicantNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={formData.applicantPhone}
                    onChange={e => setFormData({ ...formData, applicantPhone: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.applicantEmail}
                    onChange={e => setFormData({ ...formData, applicantEmail: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">عنوان مقدم الطلب *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicantAddress}
                    onChange={e => setFormData({ ...formData, applicantAddress: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" /> بيانات العقار
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نوع العقار *</label>
                  <select
                    value={formData.propertyType}
                    onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="land">أرض فضاء</option>
                    <option value="building">مبنى</option>
                    <option value="both">أرض ومباني</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">عنوان العقار *</label>
                  <input
                    type="text"
                    required
                    value={formData.propertyAddress}
                    onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المحافظة</label>
                  <select
                    value={formData.governorate}
                    onChange={e => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option>الجيزة</option>
                    <option>القاهرة</option>
                    <option>الإسكندرية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المنطقة / الحي *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المساحة (م² أو فدان) *</label>
                  <input
                    type="text"
                    required
                    value={formData.landArea}
                    onChange={e => setFormData({ ...formData, landArea: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">مدة وضع اليد (بالسنوات) *</label>
                  <input
                    type="number"
                    required
                    value={formData.possessionYears}
                    onChange={e => setFormData({ ...formData, possessionYears: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Possession Description */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> وصف وضع اليد
              </h2>
              <textarea
                rows={4}
                required
                value={formData.possessionDescription}
                onChange={e => setFormData({ ...formData, possessionDescription: e.target.value })}
                placeholder="كيف تم وضع اليد على العقار؟ (الطريقة، التاريخ، أي مستندات داعمة)"
                className="w-full border border-border rounded-lg p-2 bg-background"
              />
            </div>

            {/* Documents */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> المستندات الداعمة
              </h2>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={e => setFiles(e.target.files)}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  يمكنك رفع المستندات (عقود، إيصالات، شهادات، إلخ)
                </p>
                {files && files.length > 0 && (
                  <ul className="mt-3 text-sm text-left text-muted-foreground">
                    {Array.from(files).map((f, i) => <li key={i}>📄 {f.name}</li>)}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التقنين'}
            </button>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> سيتم دراسة الطلب من قبل اللجنة المختصة والتواصل معكم خلال 30 يوم عمل.
        </div>
      </div>
    </div>
  );
}