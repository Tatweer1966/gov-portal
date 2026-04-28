'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  IdCard,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StateFundedTreatmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    citizenName: '',
    citizenNationalId: '',
    citizenPhone: '',
    citizenEmail: '',
    governorate: 'الجيزة',
    district: '',
    address: '',
    diagnosis: '',
    requiredTreatment: '',
    hospitalName: '',
    urgencyLevel: 'normal',
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
      submitData.append('data', JSON.stringify({ ...form, userId: localStorage.getItem('userId') || '1' }));
      if (files) {
        for (let i = 0; i < files.length; i++) {
          submitData.append('medicalReports', files[i]);
        }
      }
      const res = await fetch('/api/health/treatment', {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">تم استلام الطلب</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{requestNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم التواصل معك بعد دراسة الطلب من قبل اللجنة الطبية.</p>
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
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            الصحة
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">العلاج على نفقة الدولة</h1>
          <p className="text-muted-foreground">تقديم طلب علاج على نفقة الدولة للمواطنين غير القادرين</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> بيانات المريض
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={form.citizenName}
                    onChange={e => setForm({ ...form, citizenName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={form.citizenNationalId}
                    onChange={e => setForm({ ...form, citizenNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={form.citizenPhone}
                    onChange={e => setForm({ ...form, citizenPhone: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.citizenEmail}
                    onChange={e => setForm({ ...form, citizenEmail: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المحافظة</label>
                  <select
                    value={form.governorate}
                    onChange={e => setForm({ ...form, governorate: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option>الجيزة</option>
                    <option>القاهرة</option>
                    <option>الإسكندرية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المنطقة / الحي</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">العنوان بالتفصيل</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" /> البيانات الطبية
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">التشخيص الطبي *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.diagnosis}
                    onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                    placeholder="وصف الحالة المرضية والتشخيص"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">العلاج / العملية المطلوبة *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.requiredTreatment}
                    onChange={e => setForm({ ...form, requiredTreatment: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                    placeholder="اسم العلاج أو العملية الجراحية المطلوبة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المستشفى المطلوب</label>
                  <input
                    type="text"
                    value={form.hospitalName}
                    onChange={e => setForm({ ...form, hospitalName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">درجة الإلحاح</label>
                  <select
                    value={form.urgencyLevel}
                    onChange={e => setForm({ ...form, urgencyLevel: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="normal">عادي</option>
                    <option value="high">مرتفع</option>
                    <option value="emergency">طارئ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> المستندات الطبية
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
                  يمكنك رفع التقارير الطبية، الأشعة، التحاليل (PDF، صور، مستندات)
                </p>
                {files && files.length > 0 && (
                  <ul className="mt-3 text-sm text-left text-muted-foreground">
                    {Array.from(files).map((f, i) => <li key={i}>📄 {f.name}</li>)}
                  </ul>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </form>
        </motion.div>

        {/* Info Note */}
        <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> سيتم دراسة الطلب من قبل اللجنة الطبية والتواصل معك خلال 30 يوم عمل.
        </div>
      </div>
    </div>
  );
}