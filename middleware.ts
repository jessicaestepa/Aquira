import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin auth
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("akira_admin_auth");
    if (authCookie?.value !== "authenticated") {
      // Allow the login POST action through
      if (pathname === "/admin" && request.method === "POST") {
        return NextResponse.next();
      }
      // If not on /admin (the login page), redirect there
      if (pathname !== "/admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Skip for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Detect locale from browser Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());

  const detected = preferred.find((lang) => {
    const short = lang.slice(0, 2);
    return locales.includes(short as (typeof locales)[number]);
  });

  const locale = detected
    ? (detected.slice(0, 2) as (typeof locales)[number])
    : defaultLocale;

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
