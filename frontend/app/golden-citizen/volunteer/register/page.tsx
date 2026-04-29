'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  profession: string;
  specialization: string;
  bio: string;
  governorate: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    profession: '',
    specialization: '',
    bio: '',
    governorate: 'الجيزة',
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
    if (data.success) router.push('/golden-citizen/volunteer');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">التسجيل كمتطوع</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="الاسم الكامل *"
              required
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
            <input
              type="text"
              placeholder="الرقم القومي *"
              required
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, nationalId: e.target.value})}
            />
            <input
              type="tel"
              placeholder="رقم الهاتف *"
              required
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="text"
              placeholder="المسمى الوظيفي *"
              required
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, profession: e.target.value})}
            />
            <input
              type="text"
              placeholder="التخصص الدقيق"
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, specialization: e.target.value})}
            />
            <textarea
              rows={3}
              placeholder="نبذة عن خبراتك *"
              required
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
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