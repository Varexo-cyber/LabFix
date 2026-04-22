import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // === MAINTENANCE MODE - HARDOCODED TO TRUE ===
  const MAINTENANCE_ENABLED = true;
  const UNLOCK_COOKIE = 'maintenance_unlock';
  
  if (!MAINTENANCE_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow onderhoud page
  if (pathname === '/onderhoud') {
    return NextResponse.next();
  }

  // Check unlock cookie
  const unlocked = request.cookies.get(UNLOCK_COOKIE)?.value === '123';
  if (unlocked) {
    return NextResponse.next();
  }

  // LOCK EVERYTHING ELSE - Redirect to onderhoud
  return NextResponse.redirect(new URL('/onderhoud', request.url));
}

// Match ALL routes except static files
export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\.).*)', '/'],
};
