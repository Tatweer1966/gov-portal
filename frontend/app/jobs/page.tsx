'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: number;
  title_ar: string;
  description_ar: string;
  company_name_ar: string;
  location: string;
  salary_from: number;
  salary_to: number;
  employment_type: string;
  application_deadline: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">بوابة التوظيف</h1>
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد وظائف حالياً</div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-md p-5">
                <h2 className="text-xl font-semibold text-primary">{job.title_ar}</h2>
                <p className="text-gray-600">{job.company_name_ar} - {job.location}</p>
                <p className="text-gray-700 mt-2 line-clamp-2">{job.description_ar}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>💰 {job.salary_from} - {job.salary_to} ج.م</span>
                  <span>📅 آخر موعد: {new Date(job.application_deadline).toLocaleDateString('ar-EG')}</span>
                </div>
                <Link href={`/jobs/apply/${job.id}`} className="inline-block mt-3 bg-primary text-white px-4 py-1 rounded-lg text-sm hover:bg-primary/90">
                  تقديم طلب
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}