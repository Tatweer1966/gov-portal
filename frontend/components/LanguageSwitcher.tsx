'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('ar');

  useEffect(() => {
    // Extract locale from URL (e.g., /ar/services, /en/about)
    const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (match) {
      setCurrentLocale(match[1]);
    } else {
      // Default to Arabic if no locale prefix
      setCurrentLocale('ar');
    }
  }, [pathname]);

  const switchLanguage = (locale: string) => {
    if (locale === currentLocale) return;

    // Remove existing locale prefix (if any)
    let newPath = pathname.replace(/^\/[a-z]{2}/, '');
    // Ensure path starts with a slash
    if (!newPath.startsWith('/')) newPath = '/' + newPath;
    // Add new locale prefix
    newPath = `/${locale}${newPath === '/' ? '' : newPath}`;

    // Push to router and store cookie for future visits
    router.push(newPath);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-100 transition ${
          currentLocale === 'ar' ? 'font-bold text-primary' : ''
        }`}
        aria-label="Switch to Arabic"
      >
        ع
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-100 transition ${
          currentLocale === 'en' ? 'font-bold text-primary' : ''
        }`}
        aria-label="Switch to English"
      >
        E
      </button>
    </div>
  );
}