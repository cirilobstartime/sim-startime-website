import type { Metadata } from "next";
import { headers } from "next/headers";
import { SimfNotFound } from "@/components/simf/SimfNotFound";
import { getPage, getSiteSettings } from "@/content/payload";
import type { Locale } from "@/content/types";

export const metadata: Metadata = {
  title: "Page Not Found | Saudi International Maritime Forum 2026",
  robots: { follow: false, index: false },
};

export default async function NotFound() {
  const [requestHeaders, settings] = await Promise.all([
    headers(),
    getSiteSettings(),
  ]);
  const requestedLocale: Locale =
    requestHeaders.get("x-startime-locale") === "ar" ? "ar" : "en";
  const locale: Locale =
    requestedLocale === "ar" && settings.enableArabic ? "ar" : "en";
  const page = await getPage(locale, "simf-microsite");

  return <SimfNotFound locale={locale} page={page} />;
}
