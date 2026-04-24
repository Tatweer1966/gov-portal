'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title_ar: string;
  content_ar: string;
  summary_ar?: string;
  published_at?: string;
  featured_image?: { data?: { full_url?: string } };
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/directus/news/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticle(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!article) return <div className="p-8 text-center">الخبر غير موجود</div>;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Link href="/news" className="text-blue-600 hover:underline mb-4 inline-block">← العودة إلى الأخبار</Link>
      <article className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title_ar}</h1>
        {article.published_at && (
          <p className="text-gray-500 text-sm mb-4">{new Date(article.published_at).toLocaleDateString('ar-EG')}</p>
        )}
        {article.featured_image?.data?.full_url && (
          <img src={article.featured_image.data.full_url} alt={article.title_ar} className="w-full h-64 object-cover rounded mb-6" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content_ar }} />
      </article>
    </div>
  );
}