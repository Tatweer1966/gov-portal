'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const volunteerId = searchParams.get('volunteerId');
  const [volunteers, setVolunteers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(volunteerId || '');
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    citizenName: '', citizenNationalId: '', citizenPhone: '', citizenEmail: '',
    citizenAddress: '', governorate: 'الجيزة', district: '', notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/golden-citizen/volunteers')
      .then(res => res.json())
      .then(data => { if (data.success) setVolunteers(data.data); });
  }, []);

  useEffect(() => {
    if (selectedVolunteer) {
      fetch(`/api/golden-citizen/volunteers/${selectedVolunteer}/services`)
        .then(res => res.json())
        .then(data => { if (data.success) setServices(data.data); });
    }
  }, [selectedVolunteer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return alert('يرجى اختيار الخدمة');
    setLoading(true);
    const res = await fetch('/api/golden-citizen/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        volunteerId: selectedVolunteer,
        serviceId: selectedService,
        ...formData,
        userId: localStorage.getItem('userId') || '1'
      })
    });
    const data = await res.json();
    alert(data.success ? 'تم تقديم الطلب' : 'حدث خطأ');
    if (data.success) router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">طلب خدمة مجانية</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              required
              value={selectedVolunteer}
              onChange={e => setSelectedVolunteer(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">اختر متطوع</option>
              {volunteers.map((v: any) => (
                <option key={v.id} value={v.id}>{v.full_name} - {v.profession}</option>
              ))}
            </select>
            {selectedVolunteer && (
              <select
                required
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">اختر الخدمة</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.service_name_ar}</option>
                ))}
              </select>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="الاسم الكامل *"
                required
                onChange={e => setFormData({...formData, citizenName: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="الرقم القومي *"
                required
                onChange={e => setFormData({...formData, citizenNationalId: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف *"
                required
                onChange={e => setFormData({...formData, citizenPhone: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                onChange={e => setFormData({...formData, citizenEmail: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="المنطقة"
                onChange={e => setFormData({...formData, district: e.target.value})}
                className="border rounded-lg p-2"
              />
            </div>
            <textarea
              rows={3}
              placeholder="ملاحظات إضافية"
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full border rounded-lg p-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">جاري التحميل...</div>}>
      <RequestForm />
    </Suspense>
  );
}