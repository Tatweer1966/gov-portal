'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Application {
  id: number;
  application_number: string;
  job_title: string;
  applicant_name: string;
  applicant_phone: string;
  status: string;
  submitted_at: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1'; // placeholder – replace with actual user ID
    fetch(`/api/jobs/my-applications?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusIcon = (status: string) => {
    switch(status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const statusText = (status: string) => {
    switch(status) {
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      default: return 'قيد المراجعة';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">طلبات التوظيف الخاصة بي</h1>
          <Link href="/jobs" className="inline-flex items-center gap-1 text-primary">
            <ArrowLeft className="w-4 h-4" /> العودة إلى الوظائف
          </Link>
        </div>
        {loading ? (
          <p className="text-center">جاري التحميل...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-500">لم تقم بتقديم أي طلب بعد</p>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-primary">{app.job_title}</h2>
                    <p className="text-gray-600 mt-1">الاسم: {app.applicant_name}</p>
                    <p className="text-gray-600">الهاتف: {app.applicant_phone}</p>
                    <p className="text-xs text-gray-400 mt-2">رقم الطلب: {app.application_number}</p>
                    <p className="text-xs text-gray-400">تاريخ التقديم: {new Date(app.submitted_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {statusIcon(app.status)}
                    <span>{statusText(app.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}