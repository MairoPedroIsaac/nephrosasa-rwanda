// src/middleware.ts
// Handles language detection and redirection for multi-language support

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define supported languages
const locales = ["en", "rw", "fr"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale (e.g., /en/about or /fr/login)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in URL, redirect to default locale
  if (!pathnameHasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    // Skip all internal Next.js paths (_next, api, static files)
    "/((?!_next|api|favicon.ico|.*\\.).*)",
  ],
};
