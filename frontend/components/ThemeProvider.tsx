// app/components/ThemeProvider.tsx
'use client';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    fetch('/api/tenant/theme')
      .then(res => res.json())
      .then(data => {
        setTheme(data);
        document.documentElement.style.setProperty('--primary', data.primaryColor);
        if (data.secondaryColor) {
          document.documentElement.style.setProperty('--secondary', data.secondaryColor);
        }
      });
  }, []);

  return <>{children}</>;
}