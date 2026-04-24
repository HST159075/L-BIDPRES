import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auctions", "/login", "/register", "/payment"];
const SELLER_ROUTES = ["/seller"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("session");

  const isLoggedIn = !!sessionCookie?.value;

  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  if (!isPublic && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  if (!request.cookies.get("locale")) {
    response.cookies.set("locale", "en", { maxAge: 365 * 24 * 60 * 60 });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
