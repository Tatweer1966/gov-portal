'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  IdCard,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FamilyMember {
  name: string;
  nationalId: string;
  relation: string;
  birthDate: string;
  gender: string;
}

export default function ComprehensiveInsurancePage() {
  const [form, setForm] = useState({
    headOfFamilyName: '',
    headOfFamilyNationalId: '',
    headOfFamilyPhone: '',
    headOfFamilyEmail: '',
    governorate: 'الجيزة',
    district: '',
    address: '',
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { name: '', nationalId: '', relation: 'رب الأسرة', birthDate: '', gender: 'ذكر' },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [inquiryNationalId, setInquiryNationalId] = useState('');
  const [inquiryResult, setInquiryResult] = useState<any>(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const addMember = () => {
    setFamilyMembers([...familyMembers, { name: '', nationalId: '', relation: '', birthDate: '', gender: 'ذكر' }]);
  };

  const removeMember = (index: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/health/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          familyMembers,
          userId: localStorage.getItem('userId') || '1',
        }),
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

  const handleInquiry = async () => {
    if (!inquiryNationalId) return;
    setInquiryLoading(true);
    try {
      const res = await fetch(`/api/health/insurance?nationalId=${inquiryNationalId}`);
      const data = await res.json();
      if (data.success) setInquiryResult(data.data);
      else alert('لا توجد بيانات لهذا الرقم القومي');
    } catch (err) {
      alert('حدث خطأ في الاستعلام');
    } finally {
      setInquiryLoading(false);
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
          <h2 className="text-2xl font-bold mb-2">تم استلام طلب التسجيل</h2>
          <p className="text-gray-600 mb-4">رقم الطلب: <strong className="text-primary">{requestNumber}</strong></p>
          <p className="text-sm text-gray-500 mb-6">سيتم التواصل معك لتأكيد التسجيل وإصدار بطاقات التأمين.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            تسجيل طلب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            الصحة
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">التأمين الصحي الشامل</h1>
          <p className="text-muted-foreground">سجل أسرتك في منظومة التأمين الصحي الشامل</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Head of Family */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> بيانات رب الأسرة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={form.headOfFamilyName}
                    onChange={e => setForm({ ...form, headOfFamilyName: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم القومي *</label>
                  <input
                    type="text"
                    required
                    value={form.headOfFamilyNationalId}
                    onChange={e => setForm({ ...form, headOfFamilyNationalId: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={form.headOfFamilyPhone}
                    onChange={e => setForm({ ...form, headOfFamilyPhone: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.headOfFamilyEmail}
                    onChange={e => setForm({ ...form, headOfFamilyEmail: e.target.value })}
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
                  <label className="block text-sm font-medium mb-1">المنطقة / الحي *</label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">العنوان بالتفصيل *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-border rounded-lg p-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Family Members */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> أفراد الأسرة
                </h2>
                <button
                  type="button"
                  onClick={addMember}
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> إضافة فرد
                </button>
              </div>
              {familyMembers.map((member, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 mb-4 relative">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="absolute top-2 left-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={e => updateMember(idx, 'name', e.target.value)}
                        className="w-full border border-border rounded-lg p-2 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">الرقم القومي</label>
                      <input
                        type="text"
                        value={member.nationalId}
                        onChange={e => updateMember(idx, 'nationalId', e.target.value)}
                        className="w-full border border-border rounded-lg p-2 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">صلة القرابة</label>
                      <select
                        value={member.relation}
                        onChange={e => updateMember(idx, 'relation', e.target.value)}
                        className="w-full border border-border rounded-lg p-2 bg-background"
                      >
                        <option>رب الأسرة</option>
                        <option>زوجة</option>
                        <option>ابن</option>
                        <option>ابنة</option>
                        <option>والد</option>
                        <option>والدة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">تاريخ الميلاد</label>
                      <input
                        type="date"
                        value={member.birthDate}
                        onChange={e => updateMember(idx, 'birthDate', e.target.value)}
                        className="w-full border border-border rounded-lg p-2 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">الجنس</label>
                      <select
                        value={member.gender}
                        onChange={e => updateMember(idx, 'gender', e.target.value)}
                        className="w-full border border-border rounded-lg p-2 bg-background"
                      >
                        <option>ذكر</option>
                        <option>أنثى</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التسجيل'}
            </button>
          </form>
        </motion.div>

        {/* Inquiry Section */}
        <div className="mt-12">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> الاستعلام عن طلب تأمين صحي
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="الرقم القومي"
                value={inquiryNationalId}
                onChange={e => setInquiryNationalId(e.target.value)}
                className="flex-1 border border-border rounded-lg p-2 bg-background"
              />
              <button
                onClick={handleInquiry}
                disabled={inquiryLoading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {inquiryLoading ? 'جاري...' : 'استعلام'}
              </button>
            </div>
            {inquiryResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>رقم الطلب:</strong> {inquiryResult.request_number}</p>
                <p><strong>رب الأسرة:</strong> {inquiryResult.head_of_family_name}</p>
                <p><strong>الحالة:</strong> {inquiryResult.status === 'pending' ? 'قيد المراجعة' : inquiryResult.status}</p>
                {inquiryResult.insurance_number && (
                  <p><strong>رقم التأمين:</strong> {inquiryResult.insurance_number}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}