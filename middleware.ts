"use server";

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auctions", "/login", "/register", "/payment", "/about", "/contact", "/blog", "/privacy", "/terms", "/help"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ১. সেশন কুকি চেক (ম্যানুয়াল এবং Better-Auth উভয়ই)
  const sessionCookie =
    request.cookies.get("session")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = !!sessionCookie;

  // ২. লগইন থাকলে লগইন/রেজিস্টার পেজে যেতে বাধা দেয়া
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ৩. রুট টাইপ ডিটেকশন
  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  
  // অ্যাডমিন এবং সেলার রুট চেক
  const isAdminRoute = pathname.startsWith("/admin");
  const isSellerRoute = pathname.startsWith("/seller") || pathname.startsWith("/sdashboard") || pathname.startsWith("/slistings");
  const isSapplyRoute = pathname.startsWith("/sapply");

  // ৪. প্রোটেকশন লজিক
  if (!isPublic && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // ৫. রোল-বেসড অ্যাক্সেস কন্ট্রোল (Security Layer)
  // নোট: টোকেন ডিকোড করা ছাড়া মিডলওয়্যারে রোল চেক করা কঠিন, 
  // তবে কুকিতে 'user-role' সেভ থাকলে নিচের লজিক কাজ করবে।
  const userRole = request.cookies.get("user-role")?.value; // আপনার লগইন অ্যাকশনে এটি সেট করতে হবে

  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isSellerRoute && userRole !== "seller" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // /sapply রুটটি সেলার এবং অ্যাডমিনদের জন্য প্রয়োজন নেই (তারা অলরেডি সেলার/অ্যাডমিন)
  // তবে বায়ারদের জন্য এটি এলাউ করতে হবে।
  if (isSapplyRoute && userRole === "seller") {
    return NextResponse.redirect(new URL("/sdashboard", request.url));
  }

  const response = NextResponse.next();

  // ৬. লোকাল সেটআপ (i18n)
  if (!request.cookies.get("locale")) {
    response.cookies.set("locale", "en", { 
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // API, Static assets, এবং images বাদ দিয়ে সব রুট
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};