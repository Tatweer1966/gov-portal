'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantNationalId: '',
    applicantPhone: '',
    applicantEmail: '',
    coverLetter: '',
  });
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setJob(data.data); })
      .catch(() => router.push('/jobs'));
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append('jobId', params.id as string);
    form.append('userId', localStorage.getItem('userId') || '1');
    Object.entries(formData).forEach(([k, v]) => form.append(k, v));
    if (cv) form.append('cv', cv);
    const res = await fetch('/api/jobs/apply', { method: 'POST', body: form });
    const data = await res.json();
    alert(data.success ? 'تم تقديم طلبك بنجاح' : 'حدث خطأ');
    if (data.success) router.push('/dashboard');
    setLoading(false);
  };

  if (!job) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">تقديم طلب لوظيفة: {job.title_ar}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>الاسم الكامل *</label><input type="text" required onChange={e => setFormData({...formData, applicantName: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label>الرقم القومي *</label><input type="text" required onChange={e => setFormData({...formData, applicantNationalId: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label>رقم الهاتف *</label><input type="tel" required onChange={e => setFormData({...formData, applicantPhone: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label>البريد الإلكتروني</label><input type="email" onChange={e => setFormData({...formData, applicantEmail: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label>رسالة التعريف</label><textarea rows={4} onChange={e => setFormData({...formData, coverLetter: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label>رفع السيرة الذاتية (PDF)</label><input type="file" accept=".pdf" onChange={e => setCv(e.target.files?.[0] || null)} className="w-full" /></div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50">
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}