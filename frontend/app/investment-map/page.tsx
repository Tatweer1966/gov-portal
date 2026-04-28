'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const MapWithNoSSR = dynamicImport(() => import('@/components/InvestmentMap'), { ssr: false });

export default function InvestmentMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">خريطة الاستثمار – محافظة الجيزة</h1>
        <p className="text-gray-600 mb-6">المناطق الصناعية والاستثمارية – حوافز وتفاصيل</p>
        <div className="h-96 rounded-xl overflow-hidden shadow-md">
          <MapWithNoSSR />
        </div>
      </div>
    </div>
  );
}