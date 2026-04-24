'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/services', label: 'الخدمات' },
    { href: '/about-governorate', label: 'عن المحافظة' },
    { href: '/schools-directory', label: 'المدارس' },
    { href: '/special-needs-schools', label: 'التربية الخاصة' },
    { href: '/kindergarten-application', label: 'رياض الأطفال' },
    { href: '/tech-centers', label: 'المراكز التكنولوجية' },
    { href: '/social-services', label: 'الخدمات الاجتماعية' },
    { href: '/golden-citizen', label: 'المواطن الذهبي' },
    { href: '/governor-qa', label: 'انت تسأل والمحافظ يجيب' },
    { href: '/events', label: 'الفعاليات' },
    { href: '/marketplace', label: 'سوق المحافظة' },
    { href: '/jobs', label: 'وظائف' },
    { href: '/vault', label: 'خزينة المستندات' },
    { href: '/dashboard', label: 'لوحة التحكم' },
  ];

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
          <div className="flex items-center justify-between">
            {/* Dashed button (top‑left corner) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg border-2 border-dashed border-primary text-primary hover:bg-primary/10 transition-colors"
              aria-label="القائمة الرئيسية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo (start from right corner) */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <span className="text-white text-xl font-bold">ج</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent hidden md:inline">
                محافظة الجيزة
              </span>
            </Link>

            {/* Desktop Navigation (center) */}
            <nav className="hidden xl:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg font-medium transition-colors whitespace-nowrap ${
                    pathname === item.href
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section (Search + Language + Mobile button) */}
            <div className="flex items-center gap-4">
              <SearchBar />
              <LanguageSwitcher />
              <button
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation (dropdown) */}
          {mobileMenuOpen && (
            <nav className="xl:hidden py-4 mt-2 border-t border-gray-100 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
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

      {/* Drawer (full‑width side drawer from the left) */}
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
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
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