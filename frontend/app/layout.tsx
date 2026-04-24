import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsTicker from '@/components/NewsTicker';
import AdvancedChatBot from '@/components/AdvancedChatBot';

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ subsets: ['arabic', 'latin'] });

export const metadata: Metadata = {
  title: 'البوابة الحكومية - محافظة الجيزة',
  description: 'البوابة الرسمية لمحافظة الجيزة - خدمات حكومية إلكترونية',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || 'ar';
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={isRTL ? cairo.className : inter.className}>
        <Header />
        <NewsTicker />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <AdvancedChatBot />
      </body>
    </html>
  );
}