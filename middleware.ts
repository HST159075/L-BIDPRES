import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auctions", "/login", "/register", "/payment"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. All possible session cookies check korchi
  const sessionCookie =
    request.cookies.get("session") ||
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isLoggedIn = !!sessionCookie?.value;

  // 2. User logged in thakle login/register page-e dhukte dibo na
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    // Apnar project-e dashboard-er exact path (e.g., /dashboard, /seller/dashboard etc) check korun
    // Default-e /dashboard-e pathiye dichchi
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Public route check
  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  // 4. Protected route-e jete chaile kintu login na thakle redirect
  if (!isPublic && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  // 5. Locale set kora (Internationalization)
  if (!request.cookies.get("locale")) {
    response.cookies.set("locale", "en", { maxAge: 365 * 24 * 60 * 60 });
  }

  return response;
}

export const config = {
  matcher: [
    // Static assets ebong API chara sob kichu match korbe
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
