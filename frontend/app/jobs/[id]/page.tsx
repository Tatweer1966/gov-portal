'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building2 } from 'lucide-react';

interface Job {
  id: number;
  job_number: string;
  title_ar: string;
  description_ar: string;
  qualifications_ar: string;
  location: string;
  employment_type: string;
  salary_from: number;
  salary_to: number;
  employer_name: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    applicantNationalId: '',
    experienceYears: '',
    qualifications: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setJob(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const formData = new FormData();
    formData.append('applicantName', form.applicantName);
    formData.append('applicantEmail', form.applicantEmail);
    formData.append('applicantPhone', form.applicantPhone);
    formData.append('applicantNationalId', form.applicantNationalId);
    formData.append('experienceYears', form.experienceYears);
    formData.append('qualifications', form.qualifications);
    if (files) {
      Array.from(files).forEach(file => formData.append('documents', file));
    }
    const res = await fetch(`/api/jobs/${params.id}/apply`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      setMessage('تم تقديم طلبك بنجاح! رقم الطلب: ' + data.applicationNumber);
      setTimeout(() => router.push('/jobs/my-applications'), 3000);
    } else {
      setMessage(data.error || 'حدث خطأ');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!job) return <div className="p-8 text-center">الوظيفة غير موجودة</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/jobs" className="inline-flex items-center gap-1 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة إلى الوظائف
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{job.title_ar}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.employer_name}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.employment_type === 'full-time' ? 'دوام كامل' : job.employment_type === 'part-time' ? 'دوام جزئي' : 'عن بعد'}</span>
            {job.salary_from && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary_from} - {job.salary_to} جنيه</span>}
          </div>
          <div className="mb-4">
            <h2 className="font-bold">وصف الوظيفة</h2>
            <p className="text-gray-700">{job.description_ar}</p>
          </div>
          <div>
            <h2 className="font-bold">المؤهلات والخبرات</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.qualifications_ar}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">تقديم طلب التوظيف</h2>
          {message && <div className="mb-4 p-2 rounded bg-blue-50 text-blue-700">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="الاسم الكامل *" className="w-full border p-2 rounded" value={form.applicantName} onChange={e => setForm({...form, applicantName: e.target.value})} />
            <input type="email" required placeholder="البريد الإلكتروني *" className="w-full border p-2 rounded" value={form.applicantEmail} onChange={e => setForm({...form, applicantEmail: e.target.value})} />
            <input type="tel" required placeholder="رقم الهاتف *" className="w-full border p-2 rounded" value={form.applicantPhone} onChange={e => setForm({...form, applicantPhone: e.target.value})} />
            <input type="text" placeholder="الرقم القومي" className="w-full border p-2 rounded" value={form.applicantNationalId} onChange={e => setForm({...form, applicantNationalId: e.target.value})} />
            <input type="number" placeholder="سنوات الخبرة" className="w-full border p-2 rounded" value={form.experienceYears} onChange={e => setForm({...form, experienceYears: e.target.value})} />
            <textarea placeholder="مؤهلات إضافية" rows={3} className="w-full border p-2 rounded" value={form.qualifications} onChange={e => setForm({...form, qualifications: e.target.value})} />
            <div>
              <label className="block mb-1">المستندات (PDF, صور)</label>
              <input type="file" multiple accept=".pdf,.jpg,.png" onChange={e => setFiles(e.target.files)} className="w-full" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90">{submitting ? 'جاري الإرسال...' : 'تقديم الطلب'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}