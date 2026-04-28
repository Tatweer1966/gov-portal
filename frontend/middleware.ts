// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenant } from './lib/tenant';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const tenant = getTenant(host);

  const response = NextResponse.next();

  // --- Security headers (keep your existing ones) ---
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // --- Multi‑tenant headers (inject for both pages and API routes) ---
  response.cookies.set('tenant', tenant.name);
  response.headers.set('x-tenant-schema', tenant.schema);
  response.headers.set('x-tenant-name', tenant.name);

  return response;
}

// Run middleware on all requests except static assets and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};