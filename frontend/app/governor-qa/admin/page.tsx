'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: number;
  question_number: string;
  user_type: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  question_text: string;
  category?: string;
  status: string;
  created_at: string;
  existing_answer?: string;
}

export default function GovernorQAAdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answeredBy, setAnsweredBy] = useState('إدارة المحافظة');
  const [answeredByTitle, setAnsweredByTitle] = useState('المحافظ');

  useEffect(() => {
    fetch('/api/governor-qa/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuestions(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAnswer = async (questionId: number) => {
    if (!answerText.trim()) {
      alert('يرجى كتابة الإجابة');
      return;
    }
    try {
      const res = await fetch('/api/governor-qa/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answerText,
          answeredBy,
          answeredByTitle,
          publish: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setAnswering(null);
        setAnswerText('');
      } else {
        alert('فشل في حفظ الإجابة');
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">لوحة إدارة الأسئلة</h1>
          <p className="text-gray-600">أسئلة المواطنين التي تنتظر الإجابة</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="text-lg">لا توجد أسئلة معلقة حالياً</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map(q => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-amber-100 text-amber-700 border-0">
                      {q.user_type === 'citizen' ? 'مواطن' : q.user_type === 'investor' ? 'مستثمر' : q.user_type === 'visitor' ? 'زائر' : 'سائح'}
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{q.question_text}</h3>
                  {(q.user_name || q.user_phone || q.user_email) && (
                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                      {q.user_name && <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {q.user_name}</div>}
                      {q.user_phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {q.user_phone}</div>}
                      {q.user_email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {q.user_email}</div>}
                    </div>
                  )}
                  {answering === q.id ? (
                    <div className="mt-4 space-y-3">
                      <textarea
                        rows={4}
                        value={answerText}
                        onChange={e => setAnswerText(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 focus:ring-primary focus:border-primary"
                        placeholder="اكتب الإجابة هنا..."
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAnswer(q.id)}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" /> نشر الإجابة
                        </button>
                        <button
                          onClick={() => { setAnswering(null); setAnswerText(''); }}
                          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAnswering(q.id)}
                      className="mt-3 text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" /> إجابة السؤال
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}