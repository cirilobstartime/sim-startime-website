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
    // Payload API uploads do not render HTML and do not need the page CSP
    // nonce. Keeping them outside this proxy also avoids cloning large video
    // request bodies in Next.js middleware.
    "/((?!api(?:/|$)|_next/static(?:/|$)|_next/image(?:/|$)|favicon[.]ico$).*)",
  ],
};
