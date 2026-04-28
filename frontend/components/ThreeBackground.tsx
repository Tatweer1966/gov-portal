'use client';

export default function ThreeBackground() {
  // Use CSS custom properties that are set by ThemeProvider
  // Fallback to a default gradient (amber/white) if variables not set
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb, 255, 193, 7), 0.08) 0%, transparent 50%),
                     radial-gradient(circle at 90% 80%, rgba(var(--secondary-rgb, 255, 87, 34), 0.06) 0%, transparent 50%),
                     linear-gradient(135deg, #fffaf0 0%, #fff 50%, #fff5e6 100%)`,
      }}
    />
  );
}