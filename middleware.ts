import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";

/**
 * Route protection.
 *
 * This is the first gate, not the only one: every API route re-checks the
 * session itself, because middleware can be bypassed by anything that does
 * not go through the matcher.
 */

const PUBLIC_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  const isAuthPage = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // Signed in and looking at login/signup → send them to the dashboard.
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Signed out and looking at anything else → send them to login,
  // remembering where they were headed.
  if (!session && !isAuthPage) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Everything except Next.js internals, static files and the auth API
     * (which must stay reachable while signed out).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
