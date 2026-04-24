'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    profession: '',
    specialization: '',
    bio: '',
    availableDays: '',
    availableHours: '',
    location: '',
    governorate: 'الجيزة',
    district: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/golden-citizen/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.success ? 'تم تسجيل طلب التطوع' : 'حدث خطأ');
    if (data.success) router.push('/golden-citizen');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">التسجيل كمتطوع</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="الاسم الكامل *"
                required
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="nationalId"
                placeholder="الرقم القومي *"
                required
                onChange={e => setFormData({...formData, nationalId: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="رقم الهاتف *"
                required
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="profession"
                placeholder="المسمى الوظيفي *"
                required
                onChange={e => setFormData({...formData, profession: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="specialization"
                placeholder="التخصص الدقيق"
                onChange={e => setFormData({...formData, specialization: e.target.value})}
                className="border rounded-lg p-2"
              />
            </div>
            <textarea
              name="bio"
              rows={3}
              placeholder="نبذة عن خبراتك *"
              required
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full border rounded-lg p-2"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="availableDays"
                placeholder="أيام التفرغ (مثال: السبت، الإثنين)"
                onChange={e => setFormData({...formData, availableDays: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="availableHours"
                placeholder="ساعات التفرغ (مثال: 10ص - 2م)"
                onChange={e => setFormData({...formData, availableHours: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="location"
                placeholder="الموقع"
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="district"
                placeholder="المنطقة"
                onChange={e => setFormData({...formData, district: e.target.value})}
                className="border rounded-lg p-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}