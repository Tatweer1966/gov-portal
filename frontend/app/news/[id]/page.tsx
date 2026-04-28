'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: number;
  title_ar: string;
  content_ar: string;
  summary_ar?: string;
  published_at?: string;
  views: number;
  featured_image?: string;
  category?: string;
}

// Helper function to safely format date
function formatDate(dateString?: string): string {
  if (!dateString) return 'تاريخ غير محدد';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'تاريخ غير محدد' : date.toLocaleDateString('ar-EG');
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticle(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">الخبر غير موجود</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" /> العودة إلى الأخبار
            </Link>

            <Badge className="bg-primary/10 text-primary border-0 mb-3">{article.category || 'أخبار'}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{article.title_ar}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views || 0} مشاهدة</span>
              </div>
            </div>

            {article.featured_image && (
              <img
                src={article.featured_image}
                alt={article.title_ar}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content_ar }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}