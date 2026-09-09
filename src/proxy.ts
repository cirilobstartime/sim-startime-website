import { type NextRequest, NextResponse } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/contentSecurityPolicy";

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const isCmsAdmin =
    request.nextUrl.pathname === "/content-admin" ||
    request.nextUrl.pathname.startsWith("/content-admin/");
  const contentSecurityPolicy = buildContentSecurityPolicy(
    nonce,
    process.env.NODE_ENV !== "production",
    { allowInlineStyles: isCmsAdmin },
  );
  const requestHeaders = new Headers(request.headers);
  const isArabic =
    request.nextUrl.pathname === "/ar" ||
    request.nextUrl.pathname.startsWith("/ar/");
  requestHeaders.set("x-startime-locale", isArabic ? "ar" : "en");
  requestHeaders.set("x-startime-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static(?:/|$)|_next/image(?:/|$)|favicon[.]ico$).*)",
  ],
};
