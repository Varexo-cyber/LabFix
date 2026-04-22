import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Maintenance configuration
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const UNLOCK_CODE = '123';
const UNLOCK_COOKIE_NAME = 'maintenance_unlock';

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Always allow access to the unlock page and API
  if (pathname === '/onderhoud' || pathname === '/api/unlock') {
    return NextResponse.next();
  }

  // Check if user has unlocked with cookie
  const unlockCookie = request.cookies.get(UNLOCK_COOKIE_NAME);
  if (unlockCookie?.value === UNLOCK_CODE) {
    return NextResponse.next();
  }

  // Redirect to maintenance page
  const maintenanceUrl = new URL('/onderhoud', request.url);
  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)',
  ],
};
