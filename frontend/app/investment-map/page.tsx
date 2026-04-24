'use client';

export const dynamic = 'force-dynamic';



import dynamicImport from 'next/dynamic';

const MapWithNoSSR = dynamicImport(() => import('@/components/InvestmentMap'), { ssr: false });

export default function InvestmentMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø± â€“ Ù…Ø­Ø§ÙØ¸Ø© Ø§Ù„Ø¬ÙŠØ²Ø©</h1>
        <p className="text-gray-600 mb-6">Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„ØµÙ†Ø§Ø¹ÙŠØ© ÙˆØ§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø±ÙŠØ© â€“ Ø­ÙˆØ§ÙØ² ÙˆØªÙØ§ØµÙŠÙ„</p>
        <div className="h-96 rounded-xl overflow-hidden shadow-md">
          <MapWithNoSSR />
        </div>
      </div>
    </div>
  );
}
