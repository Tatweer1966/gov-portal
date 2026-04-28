'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { School, User, IdCard, GraduationCap, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface School {
  id: number;
  name_ar: string;
  district: string;
  capacity: number;
  current_enrollment: number;
  grades: string[];
}

export default function SchoolTransferPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [form, setForm] = useState({
    studentName: '',
    studentNationalId: '',
    currentGrade: '',
    currentSchoolId: '',
    requestedSchoolId: '',
    reason: '',
  });
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSchools(data.data);
        setLoadingSchools(false);
      })
      .catch(() => setLoadingSchools(false));
  }, []);

  const handleSchoolChange = (schoolId: string) => {
    setForm({ ...form, requestedSchoolId: schoolId });
    const school = schools.find(s => s.id === parseInt(schoolId));
    setSelectedSchool(school || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/schools/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userId: localStorage.getItem('userId') || '1',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingNumber(data.requestNumber);
        setSubmitted(true);
      } else {
        setError(data.error || 'حدث خطأ');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-bold mb-2">تم استلام طلب التحويل</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{trackingNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم دراسة الطلب والتواصل معكم.</p>
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

  const grades = ['KG1', 'KG2', 'ابتدائي', 'إعدادي', 'ثانوي'];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            التعليم
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">طلب تحويل مدرسي</h1>
          <p className="text-muted-foreground">تقديم طلب نقل الطالب من مدرسة إلى أخرى (جميع المراحل)</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> بيانات الطالب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={e => setForm({ ...form, studentName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={form.studentNationalId}
                    onChange={e => setForm({ ...form, studentNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الصف الدراسي الحالي *</label>
                  <select
                    required
                    value={form.currentGrade}
                    onChange={e => setForm({ ...form, currentGrade: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="">اختر الصف</option>
                    {grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Current School */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-primary" /> المدرسة الحالية
              </h2>
              <select
                required
                value={form.currentSchoolId}
                onChange={e => setForm({ ...form, currentSchoolId: e.target.value })}
                className="w-full border border-border rounded-lg p-2 bg-background"
                disabled={loadingSchools}
              >
                <option value="">اختر المدرسة الحالية</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name_ar} ({s.district})</option>)}
              </select>
            </div>

            {/* Requested School */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-primary" /> المدرسة المطلوب التحويل إليها
              </h2>
              <select
                required
                value={form.requestedSchoolId}
                onChange={e => handleSchoolChange(e.target.value)}
                className="w-full border border-border rounded-lg p-2 bg-background"
                disabled={loadingSchools}
              >
                <option value="">اختر المدرسة المطلوبة</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name_ar} ({s.district})</option>)}
              </select>
              {selectedSchool && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <p><strong>الطاقة الاستيعابية:</strong> {selectedSchool.current_enrollment} / {selectedSchool.capacity}</p>
                  <p><strong>المراحل المتاحة:</strong> {selectedSchool.grades.join(' - ')}</p>
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> سبب التحويل (اختياري)
              </h2>
              <textarea
                rows={3}
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                placeholder="اذكر سبب الرغبة في التحويل"
                className="w-full border border-border rounded-lg p-2 bg-background"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال طلب التحويل'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}