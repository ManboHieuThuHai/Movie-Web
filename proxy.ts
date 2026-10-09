import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/src/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) {
    const response = NextResponse.next();
    response.cookies.set("locale", firstSegment, {
      path: "/",
      maxAge: 31536000,
    });
    return response;
  }

  const locale = request.cookies.get("locale")?.value;
  const targetLocale = locale && isLocale(locale) ? locale : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${targetLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
