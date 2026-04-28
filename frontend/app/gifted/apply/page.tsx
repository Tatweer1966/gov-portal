'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  IdCard,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  School,
  MapPin,
  Award,
  FileText,
  Star,
  Upload,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────
interface TalentCategory {
  id: number;
  name_ar: string;
  name_en: string;
}

export default function GiftedApplyPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<TalentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    applicantType: 'parent',
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    studentName: '',
    studentNationalId: '',
    studentBirthDate: '',
    studentGrade: '',
    studentSchool: '',
    studentGovernorate: 'الجيزة',
    studentDistrict: '',
    talentCategoryId: '',
    talentDescription: '',
    achievements: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);

  useEffect(() => {
    fetch('/api/gifted/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.talentCategoryId) {
      alert('يرجى اختيار مجال الموهبة');
      return;
    }
    setUploading(true);
    setLoading(true);
    const submitData = new FormData();
    submitData.append('data', JSON.stringify(form));
    for (const file of documents) {
      submitData.append('documents', file);
    }
    try {
      const res = await fetch('/api/gifted/apply', {
        method: 'POST',
        body: submitData,
      });
      const data = await res.json();
      if (data.success) {
        alert('تم استلام طلب الترشيح بنجاح');
        router.push('/gifted');
      } else {
        alert('حدث خطأ: ' + (data.error || 'فشل في إرسال الطلب'));
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            رعاية الموهوبين
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">ترشيح طالب موهوب</h1>
          <p className="text-muted-foreground">ساعدنا في اكتشاف ورعاية الطلاب الموهوبين</p>
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
                  <label className="block text-sm font-medium mb-1">نوع مقدم الطلب *</label>
                  <select
                    value={form.applicantType}
                    onChange={e => setForm({ ...form, applicantType: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="parent">ولي أمر</option>
                    <option value="teacher">معلم</option>
                    <option value="school_admin">إدارة مدرسة</option>
                    <option value="other">آخر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={form.applicantName}
                    onChange={e => setForm({ ...form, applicantName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={form.applicantPhone}
                    onChange={e => setForm({ ...form, applicantPhone: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.applicantEmail}
                    onChange={e => setForm({ ...form, applicantEmail: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> بيانات الطالب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الطالب *</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={e => setForm({ ...form, studentName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={form.studentNationalId}
                    onChange={e => setForm({ ...form, studentNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الميلاد *</label>
                  <input
                    type="date"
                    required
                    value={form.studentBirthDate}
                    onChange={e => setForm({ ...form, studentBirthDate: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الصف الدراسي</label>
                  <input
                    type="text"
                    value={form.studentGrade}
                    onChange={e => setForm({ ...form, studentGrade: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المدرسة</label>
                  <input
                    type="text"
                    value={form.studentSchool}
                    onChange={e => setForm({ ...form, studentSchool: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المنطقة</label>
                  <input
                    type="text"
                    value={form.studentDistrict}
                    onChange={e => setForm({ ...form, studentDistrict: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Talent Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> بيانات الموهبة
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">مجال الموهبة *</label>
                  <select
                    required
                    value={form.talentCategoryId}
                    onChange={e => setForm({ ...form, talentCategoryId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  >
                    <option value="">اختر المجال</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">وصف الموهبة والإنجازات *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.talentDescription}
                    onChange={e => setForm({ ...form, talentDescription: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                    placeholder="صف الموهبة والإنجازات التي حققها الطالب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">إنجازات / جوائز (اختياري)</label>
                  <textarea
                    rows={3}
                    value={form.achievements}
                    onChange={e => setForm({ ...form, achievements: e.target.value })}
                    className="w-full border border-border rounded-lg p-2"
                    placeholder="اذكر أي جوائز أو تقديرات حصل عليها الطالب"
                  />
                </div>
              </div>
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
                  onChange={e => setDocuments(Array.from(e.target.files || []))}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  يمكنك رفع إنجازات، شهادات، أعمال، فيديوهات (PDF، صور، مستندات)
                </p>
                {documents.length > 0 && (
                  <ul className="mt-3 text-sm text-left">
                    {documents.map((f, i) => <li key={i}>📄 {f.name}</li>)}
                  </ul>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/gifted"
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>جاري رفع المستندات...</>
                ) : loading ? (
                  <>جاري الإرسال...</>
                ) : (
                  <>إرسال طلب الترشيح</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}