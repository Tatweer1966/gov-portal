'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnrollmentFormProps {
  schoolId: string | number;
  onSuccess?: () => void;
}

export default function EnrollmentForm({ schoolId, onSuccess }: EnrollmentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/special-needs/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, schoolId }),
      });
      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        router.push('/special-needs-schools?success=true');
      } else {
        setError(data.message || 'حدث خطأ في إرسال الطلب');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تسجيل طالب في مدرسة التربية الخاصة</CardTitle>
        <Badge variant="outline">رقم المدرسة: {schoolId}</Badge>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="studentName">اسم الطالب</Label>
            <Input id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="parentName">اسم ولي الأمر</Label>
            <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="birthDate">تاريخ الميلاد</Label>
            <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري الإرسال...' : 'تقديم الطلب'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}