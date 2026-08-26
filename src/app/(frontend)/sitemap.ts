import configPromise from "@payload-config";
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/content/payload";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return [];
  const payload = await getPayload({ config: configPromise });
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL || "https://simf.startime.sa"
  ).replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];
  const siteSettings = await getSiteSettings();
  const locales: Locale[] = siteSettings.enableArabic ? ["en", "ar"] : ["en"];

  for (const locale of locales) {
    const pages = await payload.find({
      collection: "pages",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 50,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { visible: { equals: true } },
          { _status: { equals: "published" } },
          { "seo.includeInSitemap": { not_equals: false } },
          { "seo.indexable": { not_equals: false } },
        ],
      },
    });
    for (const page of pages.docs) {
      const suffix =
        page.pageType === "simf-microsite-sponsor"
          ? "/sponsor"
          : page.pageType === "simf-microsite-government-b2g"
            ? "/b2g"
          : page.pageType === "simf-microsite-home"
              ? ""
              : `/${String(page.pageType).replace("simf-microsite-", "")}`;
      const localizedPath = locale === "ar" ? `/ar${suffix}` : suffix || "/";
      entries.push({
        alternates: {
          languages: {
            en: `${origin}${suffix || "/"}`,
            ...(siteSettings.enableArabic
              ? { ar: `${origin}/ar${suffix}` }
              : {}),
          },
        },
        changeFrequency:
          (page.seo?.sitemapChangeFrequency as
            | "always"
            | "hourly"
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly"
            | "never"
            | undefined) || "monthly",
        lastModified: page.updatedAt,
        priority: Number(page.seo?.sitemapPriority ?? 0.7),
        url: `${origin}${localizedPath}`,
      });
    }

  }
  return entries;
}
