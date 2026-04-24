'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RequestItem {
  id: number;
  request_number: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  type: 'service' | 'complaint' | 'social' | 'booking';
  tracking_number?: string;
  fee_amount?: number;
  payment_status?: string;
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchRequests = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId') || '1';
    const url = `/api/requests?userId=${userId}&status=${statusFilter}&page=${page}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      setRequests(data.data);
      setTotalPages(data.pagination.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800' },
      resolved: { label: 'تم الحل', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
      approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-800' },
      completed: { label: 'مكتمل', color: 'bg-gray-100 text-gray-800' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      service: { label: 'خدمة', color: 'bg-blue-100 text-blue-800' },
      complaint: { label: 'شكوى', color: 'bg-red-100 text-red-800' },
      social: { label: 'مساعدة اجتماعية', color: 'bg-purple-100 text-purple-800' },
      booking: { label: 'حجز مركز تكنولوجي', color: 'bg-green-100 text-green-800' },
    };
    const t = typeMap[type] || { label: type, color: 'bg-gray-100' };
    return <span className={`px-2 py-1 rounded-full text-xs ${t.color}`}>{t.label}</span>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG');
  };

  if (loading && requests.length === 0) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <Link
            href="/dashboard/news/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة خبر جديد
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">إجمالي الطلبات</p>
            <p className="text-2xl font-bold">{requests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">قيد المعالجة</p>
            <p className="text-2xl font-bold text-orange-600">
              {requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">تم الحل / مكتمل</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'resolved' || r.status === 'completed' || r.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="resolved">تم الحل</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">لا توجد طلبات</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-right">رقم الطلب</th>
                      <th className="p-3 text-right">النوع</th>
                      <th className="p-3 text-right">العنوان / الخدمة</th>
                      <th className="p-3 text-right">التاريخ</th>
                      <th className="p-3 text-right">الحالة</th>
                      <th className="p-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{req.request_number}</td>
                        <td className="p-3">{getTypeBadge(req.type)}</td>
                        <td className="p-3">{req.title}</td>
                        <td className="p-3 text-sm text-gray-500">{formatDate(req.created_at)}</td>
                        <td className="p-3">{getStatusBadge(req.status)}</td>
                        <td className="p-3">
                          <Link
                            href={`/requests/${req.id}?type=${req.type}`}
                            className="text-primary hover:underline text-sm"
                          >
                            تفاصيل
                          </Link>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <span className="text-sm text-gray-600">
                    صفحة {page} من {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}