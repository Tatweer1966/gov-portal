'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title_ar: string;
  priority: number;
  published_at: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/news/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success) setNews(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (news.length === 0 || isPaused) return;
    const container = scrollRef.current;
    if (!container) return;

    const step = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [news, isPaused]);

  if (loading || news.length === 0) return null;

  const getPriorityColor = (priority: number) => {
    if (priority === 2) return 'bg-red-600';
    if (priority === 1) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <div className="bg-gray-900 text-white py-2 border-b border-gray-700 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            آخر الأخبار
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex gap-6 whitespace-nowrap">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
                  <span>{item.title_ar}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(item.published_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/news" className="flex-shrink-0 text-primary text-sm hover:underline ml-2">
            جميع الأخبار ←
          </Link>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}