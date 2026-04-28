'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FooterTheme {
  footerText: string;
  footerLinks?: { href: string; label: string }[];
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  tenantName?: string;
}

export default function Footer() {
  const [theme, setTheme] = useState<FooterTheme | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/tenant/theme')
      .then(res => res.json())
      .then(data => {
        setTheme({
          footerText: data.footerText || 'جميع الحقوق محفوظة',
          footerLinks: data.navLinks?.slice(0, 4) || [   // first 4 links as quick links
            { href: '/services', label: 'الخدمات' },
            { href: '/about-governorate', label: 'عن المحافظة' },
            { href: '/events', label: 'الفعاليات' },
            { href: '/news', label: 'الأخبار' },
          ],
          contactPhone: data.contactPhone || '02-12345678',
          contactEmail: data.contactEmail || 'info@giza.gov.eg',
          address: data.address || 'ديوان عام محافظة الجيزة – العاصمة الإدارية',
          tenantName: data.tenantName || 'الجيزة',
        });
      })
      .catch(() => {
        // Fallback if API fails
        setTheme({
          footerText: 'جميع الحقوق محفوظة',
          footerLinks: [
            { href: '/services', label: 'الخدمات' },
            { href: '/about-governorate', label: 'عن المحافظة' },
            { href: '/events', label: 'الفعاليات' },
            { href: '/news', label: 'الأخبار' },
          ],
          contactPhone: '02-12345678',
          contactEmail: 'info@giza.gov.eg',
          address: 'ديوان عام محافظة الجيزة – العاصمة الإدارية',
          tenantName: 'الجيزة',
        });
      });
  }, []);

  // While loading, return a minimal footer (optional)
  if (!theme) {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          جاري التحميل...
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About / general info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">عن المحافظة</h3>
            <p className="text-sm">{theme.footerText}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">روابط سريعة</h3>
            <ul className="space-y-1 text-sm">
              {theme.footerLinks?.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / additional links (you can customise) */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">خدمات</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/tech-centers">المراكز التكنولوجية</Link></li>
              <li><Link href="/marketplace">سوق المحافظة</Link></li>
              <li><Link href="/jobs">بوابة التوظيف</Link></li>
              <li><Link href="/vault">خزينة المستندات</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">تواصل معنا</h3>
            <p className="text-sm">📞 {theme.contactPhone}</p>
            <p className="text-sm">✉️ {theme.contactEmail}</p>
            <p className="text-sm mt-2">📍 {theme.address}</p>
            <div className="flex gap-3 mt-3">
              <a href="#" className="hover:text-primary">📘</a>
              <a href="#" className="hover:text-primary">🐦</a>
              <a href="#" className="hover:text-primary">📸</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs">
          <p>© {currentYear} محافظة {theme.tenantName} – جميع الحقوق محفوظة</p>
          <p className="mt-1">
            <Link href="/sponsorship-policy" className="hover:text-primary mx-2">سياسة الإعلانات</Link>
            <Link href="/sponsors" className="hover:text-primary mx-2">شركاء الرعاية</Link>
            <Link href="/open-source" className="hover:text-primary mx-2">البرمجيات مفتوحة المصدر</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}