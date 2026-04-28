import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsTicker from '@/components/NewsTicker';
import AdvancedChatBot from '@/components/AdvancedChatBot';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ subsets: ['arabic', 'latin'] });

// Helper to get tenant from host header (server-side)
function getTenantFromHost(host: string): { name: string; schema: string } {
  if (host.includes('alexandria') || host.includes('alex')) {
    return { schema: 'gov_alexandria', name: 'alexandria' };
  }
  return { schema: 'public', name: 'giza' };
}

// Map tenant name to display name
const tenantDisplayNames: Record<string, string> = {
  giza: 'الجيزة',
  alexandria: 'الإسكندرية',
  // add other governorates as needed
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const tenant = getTenantFromHost(host);
  const displayName = tenantDisplayNames[tenant.name] || 'المحافظة';

  return {
    title: `البوابة الحكومية - محافظة ${displayName}`,
    description: `البوابة الرسمية لمحافظة ${displayName} - خدمات حكومية إلكترونية`,
  };
}

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