'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    // Remove existing locale prefix (e.g., /ar, /en)
    const newPath = `/${locale}${pathname.replace(/^\/[a-z]{2}/, '')}`;
    router.push(newPath);
  };

  return (
    <div className="flex gap-1">
      <button onClick={() => switchLanguage('ar')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        ع
      </button>
      <span className="text-gray-400">|</span>
      <button onClick={() => switchLanguage('en')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        E
      </button>
    </div>
  );
}