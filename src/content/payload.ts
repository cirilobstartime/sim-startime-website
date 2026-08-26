import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import { getSimfMicrositePage } from "./simfMicrositeDefaults";
import {
  applyEditorialMedia,
  getSimfContentPage,
  type SimfContentPageKey,
} from "./simfContentPagesDefaults";
import {
  getSimfUpdates,
  getSimfUpdatesPage,
} from "./simfUpdatesDefaults";
import type {
  Locale,
  MarketingSettings,
  PageSection,
  PublicPage,
  PublicUpdate,
  SiteSettings,
} from "./types";

function normalizeSections(value: unknown): PageSection[] {
  if (!Array.isArray(value)) return [];
  return [...value]
    .filter((item): item is PageSection =>
      Boolean(
        item &&
          typeof item === "object" &&
          "blockType" in item &&
          (item as { visible?: boolean }).visible !== false,
      ),
    )
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
}

async function fetchPage(
  locale: Locale,
  route: string,
): Promise<PublicPage | null> {
  const contentKey = route.startsWith("simf-microsite/")
    ? (route.replace("simf-microsite/", "") as SimfContentPageKey)
    : undefined;
  const contentKeys: SimfContentPageKey[] = [
    "contact",
    "legacy",
    "programme",
    "speakers",
    "partners",
    "government-b2g",
  ];
  const isContentPage = Boolean(
    contentKey && contentKeys.includes(contentKey),
  );
  const pageType =
    route === "simf-microsite/sponsor"
      ? "simf-microsite-sponsor"
      : route === "simf-microsite/new-homepage"
        ? "simf-microsite-home-review"
      : route === "simf-microsite/about"
        ? "simf-microsite-about"
      : route === "simf-microsite/updates"
        ? "simf-microsite-updates"
        : isContentPage
          ? `simf-microsite-${contentKey}`
          : "simf-microsite-home";
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "pages",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: route } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    const page = result.docs[0];
    if (!page?.title) return null;
    const now = Date.now();
    if (
      (page.publishFrom && new Date(page.publishFrom).getTime() > now) ||
      (page.publishUntil && new Date(page.publishUntil).getTime() <= now)
    ) {
      return null;
    }
    const resolvedPage: PublicPage = {
      pageType: String(page.pageType || pageType),
      sections: normalizeSections(page.sections),
      seo: page.seo as PublicPage["seo"],
      slug: String(page.slug || ""),
      summary: page.summary,
      title: page.title,
    };
    return isContentPage && contentKey
      ? applyEditorialMedia(resolvedPage, contentKey)
      : resolvedPage;
  } catch {
    return pageType === "simf-microsite-updates"
      ? getSimfUpdatesPage(locale)
      : pageType === "simf-microsite-sponsor"
        ? {
            ...getSimfContentPage(locale, "sponsors"),
            pageType: "simf-microsite-sponsor",
            slug: "simf-microsite/sponsor",
          }
      : isContentPage && contentKey
        ? getSimfContentPage(locale, contentKey)
        : pageType === "simf-microsite-home-review"
          ? getSimfMicrositePage(locale, "simf-microsite-home-review")
        : pageType === "simf-microsite-about"
          ? getSimfMicrositePage(locale, "simf-microsite-about")
        : getSimfMicrositePage(
            locale,
            pageType === "simf-microsite-sponsor"
              ? "simf-microsite-sponsor"
              : "simf-microsite-home",
          );
  }
}

function normalizeUpdate(value: unknown): PublicUpdate | null {
  if (!value || typeof value !== "object") return null;
  const update = value as PublicUpdate & { visible?: boolean | null };
  if (
    update.visible === false ||
    !update.title ||
    !update.slug ||
    !update.summary ||
    !update.publishedAt
  ) {
    return null;
  }
  return {
    ...update,
    content: Array.isArray(update.content)
      ? update.content.filter((item) => item.visible !== false)
      : [],
  };
}

async function fetchUpdates(locale: Locale): Promise<PublicUpdate[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "updates",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 50,
      locale,
      overrideAccess: true,
      sort: "-publishedAt",
      where: {
        and: [
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    return result.docs
      .map((item) => normalizeUpdate(item))
      .filter((item): item is PublicUpdate => Boolean(item));
  } catch {
    return getSimfUpdates(locale);
  }
}

async function fetchUpdate(
  locale: Locale,
  slug: string,
): Promise<PublicUpdate | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "updates",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    return normalizeUpdate(result.docs[0]);
  } catch {
    return (
      getSimfUpdates(locale).find((item) => item.slug === slug) || null
    );
  }
}

function marketingFallback(locale: Locale): MarketingSettings {
  const ar = locale === "ar";
  return {
    acceptLabel: ar ? "السماح" : "Allow analytics",
    acceptedCampaignParameters:
      "utm_id,utm_source,utm_medium,utm_campaign,utm_term,utm_content,utm_source_platform,gclid,gbraid,wbraid,fbclid,msclkid,ttclid,li_fat_id,twclid",
    attributionCookieDays: 90,
    attributionCookieDomain: ".startime.sa",
    bingSiteVerification: "",
    cookieNotice: ar
      ? "نستخدم ملفات تعريف الارتباط الضرورية، وبموافقتك نستخدم التحليلات لتحسين تجربتك وقياس أداء الموقع."
      : "We use essential cookies and, with your permission, analytics to improve your experience and measure website performance.",
    defaultConsentDenied: true,
    enableAnalytics: false,
    ga4MeasurementID: "",
    googleSiteVerification: "",
    googleTagManagerID: "",
    metaDomainVerification: "",
    privacyHref: ar ? "/ar/privacy-policy" : "/privacy-policy",
    rejectLabel: ar ? "رفض التحليلات" : "Reject analytics",
    settingsLabel: ar ? "سياسة الخصوصية" : "Privacy policy",
  };
}

async function fetchMarketing(locale: Locale): Promise<MarketingSettings> {
  const fallback = marketingFallback(locale);
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "marketing-settings",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      locale,
      overrideAccess: true,
    });
    if (settings._status !== "published") return fallback;
    return {
      acceptLabel: settings.acceptLabel || fallback.acceptLabel,
      acceptedCampaignParameters:
        settings.acceptedCampaignParameters ||
        fallback.acceptedCampaignParameters,
      attributionCookieDays: Number(
        settings.attributionCookieDays || fallback.attributionCookieDays,
      ),
      attributionCookieDomain:
        settings.attributionCookieDomain || fallback.attributionCookieDomain,
      bingSiteVerification: settings.bingSiteVerification || "",
      cookieNotice: settings.cookieNotice || fallback.cookieNotice,
      defaultConsentDenied: settings.defaultConsentDenied !== false,
      enableAnalytics: Boolean(settings.enableAnalytics),
      ga4MeasurementID: settings.ga4MeasurementID || "",
      googleSiteVerification: settings.googleSiteVerification || "",
      googleTagManagerID: settings.googleTagManagerID || "",
      metaDomainVerification: settings.metaDomainVerification || "",
      privacyHref: settings.privacyHref || fallback.privacyHref,
      rejectLabel: settings.rejectLabel || fallback.rejectLabel,
      settingsLabel: settings.settingsLabel || fallback.settingsLabel,
    };
  } catch {
    return fallback;
  }
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
      overrideAccess: true,
    });
    return {
      enableArabic: settings.enableArabic !== false,
      footerLogo: (settings.footerLogo || settings.headerLogo) as
        | SiteSettings["footerLogo"]
        | undefined,
      headerLogo: settings.headerLogo as
        | SiteSettings["headerLogo"]
        | undefined,
    };
  } catch {
    return { enableArabic: false };
  }
}

export async function getCMSRedirect(
  sourceLocale: Locale,
  fromPath: string,
  targetLocale: Locale = sourceLocale,
): Promise<{ permanent: boolean; slug: string } | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const localeRelativePath =
      sourceLocale === "ar"
        ? fromPath.replace(/^\/ar(?=\/|$)/, "") || "/"
        : fromPath;
    const candidatePaths = Array.from(
      new Set([fromPath, localeRelativePath]),
    );
    const result = await payload.find({
      collection: "redirects",
      depth: 1,
      fallbackLocale: false,
      limit: 500,
      locale: targetLocale,
      overrideAccess: true,
      where: {
        active: { equals: true },
      },
    });
    const redirect = result.docs.find(
      (item) =>
        item.sourceLocale === sourceLocale &&
        candidatePaths.includes(item.fromPath),
    );
    const target =
      redirect?.targetPage && typeof redirect.targetPage === "object"
        ? redirect.targetPage
        : null;
    if (!redirect || !target?.slug || target.visible === false) return null;
    return {
      permanent: redirect.permanent !== false,
      slug:
        target.pageType === "simf-microsite-sponsor"
          ? "sponsor"
          : String(target.pageType || "").replace("simf-microsite-", ""),
    };
  } catch (error) {
    console.error("Unable to resolve CMS redirect.", error);
    return null;
  }
}

export const getPage = unstable_cache(fetchPage, ["simf-pages-v49"], {
  revalidate: 60,
  tags: ["simf-pages"],
});

export const getUpdates = unstable_cache(fetchUpdates, ["simf-updates-v1"], {
  revalidate: 60,
  tags: ["simf-updates"],
});

export const getUpdate = unstable_cache(fetchUpdate, ["simf-update-v1"], {
  revalidate: 60,
  tags: ["simf-updates"],
});

export const getMarketingSettings = unstable_cache(
  fetchMarketing,
  ["simf-marketing-v1"],
  { revalidate: 60, tags: ["simf-marketing"] },
);

export const getSiteSettings = cache(fetchSiteSettings);
