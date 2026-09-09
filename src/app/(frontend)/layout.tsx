import type { Metadata } from "next";
import { headers } from "next/headers";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CookieConsent } from "@/components/CookieConsent";
import { EventTracking } from "@/components/EventTracking";
import { MarketingTags } from "@/components/MarketingTags";
import { getMarketingSettings } from "@/content/payload";
import "./globals.css";
import "./simf-microsite.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://simf.startime.sa",
  ),
  title: "Saudi International Maritime Forum 2026",
  description:
    "The Fourth Saudi International Maritime Forum, 23–25 November 2026 in Riyadh.",
  robots: {
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  icons: {
    icon: [
      {
        type: "image/png",
        url: "/assets/simf-microsite/organizers/simf-mark-blue.png",
      },
    ],
    shortcut: "/favicon.ico",
  },
};

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-startime-locale") === "ar" ? "ar" : "en";
  const pathname = requestHeaders.get("x-startime-pathname") || "";
  const isComingSoonPage =
    pathname === "/coming-soon" || pathname === "/ar/coming-soon";
  const nonce = requestHeaders.get("x-nonce") || undefined;
  const marketing = await getMarketingSettings(locale);
  return (
    <html
      data-scroll-behavior="smooth"
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      <body>
        <AttributionCapture settings={marketing} />
        <EventTracking />
        <MarketingTags nonce={nonce} settings={marketing} />
        {isComingSoonPage ? null : <CookieConsent settings={marketing} />}
        {children}
      </body>
    </html>
  );
}
