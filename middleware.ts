import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Onderhoudsmodus staat uit tenzij MAINTENANCE_MODE op 'true' staat. Zet hem in
// Netlify onder Site settings -> Environment variables; een redeploy zet hem aan
// of uit, zonder code te wijzigen.
//
// Stond hiervoor hardcoded op true. Dat blokkeerde ook Google: crawlers kregen
// op elke productpagina een redirect naar /onderhoud, waardoor Merchant Center
// de hele feed afkeurt.
const UNLOCK_COOKIE = 'maintenance_unlock';

export function middleware(request: NextRequest) {
  const maintenanceEnabled = process.env.MAINTENANCE_MODE === 'true';

  if (!maintenanceEnabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow onderhoud page
  if (pathname === '/onderhoud') {
    return NextResponse.next();
  }

  // Check unlock cookie — waarde instelbaar via MAINTENANCE_UNLOCK_CODE
  const unlockCode = process.env.MAINTENANCE_UNLOCK_CODE || '123';
  const unlocked = request.cookies.get(UNLOCK_COOKIE)?.value === unlockCode;
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
