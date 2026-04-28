'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';

interface NavLink {
  href: string;
  label: string;
}

interface Theme {
  logoUrl: string;
  navLinks: NavLink[];
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/tenant/theme')
      .then(res => res.json())
      .then(data => {
        setTheme({
          logoUrl: data.logoUrl || '/logo.png',
          navLinks: data.navLinks || [],
        });
      })
      .catch(() => {
        // Fallback if API fails
        setTheme({
          logoUrl: '/logo.png',
          navLinks: [
            { href: '/', label: 'الرئيسية' },
            { href: '/services', label: 'الخدمات' },
          ],
        });
      });
  }, []);

  // Use empty array while loading to avoid layout shift
  const navLinks = theme?.navLinks || [];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          {/* Use flex-row-reverse to align logo on right, button on left */}
          <div className="flex items-center justify-between flex-row-reverse">
            {/* Logo – now appears on the far right */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {theme?.logoUrl ? (
                <img
                  src={theme.logoUrl}
                  alt="شعار المحافظة"
                  className="h-10 w-auto object-contain"
                />
              ) : (
                // Fallback while loading
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xl font-bold">ج</span>
                </div>
              )}
              {/* Optional text – you can also remove this line if logos already contain text */}
              {!theme?.logoUrl && (
                <span className="text-2xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent hidden md:inline">
                  محافظة الجيزة
                </span>
              )}
            </Link>

            {/* Right section (Search + Language + Mobile button) – stays in the middle */}
            <div className="flex items-center gap-4">
              <SearchBar />
              <LanguageSwitcher />
              <button
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="القائمة"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Dashed button – now appears on the far left (opens drawer) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg border-2 border-dashed border-primary text-primary hover:bg-primary/10 transition-colors"
              aria-label="القائمة الرئيسية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation (dropdown) – uses dynamic navLinks */}
          {mobileMenuOpen && (
            <nav className="xl:hidden py-4 mt-2 border-t border-gray-100 max-h-[70vh] overflow-y-auto">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 text-gray-700 hover:text-primary text-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Drawer (full‑width side drawer from the left) – uses same dynamic navLinks */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary">القائمة الرئيسية</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition text-lg"
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}