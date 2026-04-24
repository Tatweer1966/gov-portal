import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><h3 className="text-white text-lg font-semibold mb-3">عن المحافظة</h3><p className="text-sm">محافظة الجيزة – بوابة حكومية موحدة لتقديم الخدمات الإلكترونية للمواطنين.</p></div>
          <div><h3 className="text-white text-lg font-semibold mb-3">روابط سريعة</h3><ul className="space-y-1 text-sm"><li><Link href="/services">الخدمات</Link></li><li><Link href="/about-governorate">عن المحافظة</Link></li><li><Link href="/events">الفعاليات</Link></li><li><Link href="/news">الأخبار</Link></li></ul></div>
          <div><h3 className="text-white text-lg font-semibold mb-3">خدمات</h3><ul className="space-y-1 text-sm"><li><Link href="/tech-centers">المراكز التكنولوجية</Link></li><li><Link href="/marketplace">سوق المحافظة</Link></li><li><Link href="/jobs">بوابة التوظيف</Link></li><li><Link href="/vault">خزينة المستندات</Link></li></ul></div>
          <div><h3 className="text-white text-lg font-semibold mb-3">تواصل معنا</h3><p className="text-sm">📞 02-12345678</p><p className="text-sm">✉️ info@giza.gov.eg</p><p className="text-sm mt-2">📍 ديوان عام محافظة الجيزة – العاصمة الإدارية</p><div className="flex gap-3 mt-3"><a href="#" className="hover:text-primary">📘</a><a href="#" className="hover:text-primary">🐦</a><a href="#" className="hover:text-primary">📸</a></div></div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs">
          <p>© {currentYear} محافظة الجيزة – جميع الحقوق محفوظة</p>
          <p className="mt-1"><Link href="/sponsorship-policy" className="hover:text-primary mx-2">سياسة الإعلانات</Link><Link href="/sponsors" className="hover:text-primary mx-2">شركاء الرعاية</Link><Link href="/open-source" className="hover:text-primary mx-2">البرمجيات مفتوحة المصدر</Link></p>
        </div>
      </div>
    </footer>
  );
}
